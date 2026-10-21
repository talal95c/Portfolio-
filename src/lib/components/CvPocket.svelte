<script>
  import { onMount, tick } from 'svelte';

  const pdf = '/cv/Talal_Aamir_CV.pdf';
  const page = '/cv/cv-page.webp';
  const thumb = '/cv/cv-thumb.webp';

  let step = $state(0);
  let armed = $state(false);
  let dock;
  let card;
  let dialog;
  let stage;
  let sheet;
  let viewing = $state(false);
  let shown = $state(false);
  let zoomed = $state(false);
  let zooming = false;
  let closing = false;
  let zoomTask = Promise.resolve();

  const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  function togglePocket() {
    step = step === 0 ? 1 : 0;
    armed = true;
  }

  function cardTransform() {
    const from = card.getBoundingClientRect();
    const to = sheet.getBoundingClientRect();
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    const s = parseFloat(getComputedStyle(card).getPropertyValue('--s')) || 0.44;
    return `translate(${dx}px, ${dy}px) scale(${(card.offsetWidth * s) / sheet.offsetWidth}) rotate(3deg)`;
  }

  async function view() {
    if (viewing) return;
    zoomed = false;
    stage.scrollTo({ left: 0, top: 0, behavior: 'instant' });
    viewing = true;
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
    await tick();
    if (!reduced()) {
      sheet.animate([{ transform: cardTransform() }, { transform: 'none' }], { duration: 620, easing: ease });
    }
    requestAnimationFrame(() => (shown = true));
  }

  function waitForPaperWidth() {
    if (reduced()) return Promise.resolve();
    return new Promise((resolve) => {
      const timer = setTimeout(finish, 450);
      function finish(event) {
        if (event && (event.target !== sheet || event.propertyName !== 'width')) return;
        clearTimeout(timer);
        sheet.removeEventListener('transitionend', finish);
        resolve();
      }
      sheet.addEventListener('transitionend', finish);
    });
  }

  function preserveZoomPoint(point, ratio) {
    const paperRect = sheet.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    stage.scrollLeft += paperRect.left - stageRect.left + ratio.x * paperRect.width - (point.x - stageRect.left);
    stage.scrollTop += paperRect.top - stageRect.top + ratio.y * paperRect.height - (point.y - stageRect.top);
  }

  async function setZoom(next, x, y) {
    if (zooming || next === zoomed) return;
    zooming = true;
    const paperRect = sheet.getBoundingClientRect();
    const point = { x, y };
    const ratio = {
      x: Math.min(1, Math.max(0, (x - paperRect.left) / paperRect.width)),
      y: Math.min(1, Math.max(0, (y - paperRect.top) / paperRect.height)),
    };
    const transition = waitForPaperWidth();
    zoomed = next;
    await tick();

    if (reduced()) {
      preserveZoomPoint(point, ratio);
    } else {
      let complete = false;
      transition.then(() => (complete = true));
      await new Promise((resolve) => {
        const frame = () => {
          preserveZoomPoint(point, ratio);
          if (complete) resolve();
          else requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
      });
    }
    zooming = false;
  }

  function toggleZoom(event) {
    if (zooming || closing) return;
    const stageRect = stage.getBoundingClientRect();
    const x = event?.clientX ?? stageRect.left + stage.clientWidth / 2;
    const y = event?.clientY ?? stageRect.top + stage.clientHeight / 2;
    zoomTask = setZoom(!zoomed, x, y);
  }

  async function close() {
    if (!viewing || !shown || closing) return;
    closing = true;
    if (zooming) await zoomTask;
    if (zoomed) {
      const stageRect = stage.getBoundingClientRect();
      zoomTask = setZoom(false, stageRect.left + stage.clientWidth / 2, stageRect.top + stage.clientHeight / 2);
      await zoomTask;
    }
    stage.scrollTo({ left: 0, top: 0, behavior: 'instant' });
    shown = false;
    const finish = () => {
      dialog.close();
      document.documentElement.style.overflow = '';
      viewing = false;
      zoomed = false;
      zooming = false;
      closing = false;
      card?.focus({ preventScroll: true });
    };
    if (reduced()) return finish();
    sheet.animate([{ transform: 'none' }, { transform: cardTransform() }], { duration: 480, easing: ease, fill: 'forwards' }).finished.then(() => {
      finish();
      sheet.getAnimations().forEach((animation) => animation.cancel());
    });
  }

  onMount(() => {
    const onPointer = (event) => {
      if (step === 1 && !viewing && !dock.contains(event.target)) step = 0;
    };
    const onKey = (event) => {
      if (event.key === 'Escape' && step === 1 && !viewing) step = 0;
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  });
</script>

<div class="dock" class:open={step === 1} class:viewing bind:this={dock}>
  <button type="button" class="pocket" aria-expanded={step === 1} aria-label={step === 1 ? 'Put the CV back' : 'Take out my CV'} onclick={togglePocket}>
    <span class="back"></span>
    <span class="front">
      <span class="sheen"></span>
      <span class="label" aria-hidden="true">CV</span>
    </span>
  </button>

  <span class="sheet ghost g1" aria-hidden="true"></span>
  <span class="sheet ghost g2" aria-hidden="true"></span>
  <button type="button" class="sheet cv" bind:this={card} tabindex={step === 1 ? 0 : -1} aria-label="View my CV" onclick={view}>
    <img src={thumb} alt="" width="480" height="679" draggable="false" decoding="async" />
    <span class="view-pill">View</span>
  </button>
</div>

<dialog bind:this={dialog} class="viewer" class:shown class:zoomed aria-label="Talal Aamir CV" oncancel={(event) => (event.preventDefault(), close())} onclick={(event) => event.target === event.currentTarget && !zoomed && close()}>
  <div class="stage" bind:this={stage} onclick={(event) => event.target === event.currentTarget && !zoomed && close()} role="presentation">
    <button type="button" class="paper" bind:this={sheet} aria-label={zoomed ? 'Zoom out of the CV' : 'Zoom in on the CV'} onclick={toggleZoom}>
      {#if armed}<img src={page} alt="Talal Aamir, one-page CV" width="1600" height="2263" draggable="false" decoding="async" />{/if}
    </button>
  </div>
  <div class="bar">
    <button type="button" class="pill round" aria-label={zoomed ? 'Zoom out' : 'Zoom in'} onclick={() => toggleZoom()}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">
        <circle cx="10.5" cy="10.5" r="6.25" />
        <path d="m15.2 15.2 4.3 4.3M8 10.5h5" />
        {#if !zoomed}<path d="M10.5 8v5" />{/if}
      </svg>
    </button>
    <a class="pill" href={pdf} download="Talal_Aamir_CV.pdf">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11m0 0 4.5-4.5M12 15l-4.5-4.5M5 19.5h14" /></svg>
      Download PDF
    </a>
    <button type="button" class="pill round" aria-label="Close" onclick={close}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M17 7 7 17M7 7l10 10" /></svg>
    </button>
  </div>
</dialog>

<style>
  .dock {
    --spring: cubic-bezier(0.34, 1.45, 0.5, 1);
    --glide: cubic-bezier(0.22, 1, 0.36, 1);
    user-select: none;
    -webkit-user-select: none;
    z-index: 30;
    width: 128px;
    height: 108px;
    position: fixed;
    right: 28px;
    bottom: 28px;
  }

  .dock::before {
    content: '';
    pointer-events: none;
    background: radial-gradient(closest-side, #0000002e, #0000);
    width: 120%;
    height: 22px;
    position: absolute;
    bottom: -14px;
    left: -10%;
    transition: transform 0.5s var(--glide), opacity 0.5s var(--glide);
  }

  .pocket {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    background: none;
    border: 0;
    padding: 0;
    position: absolute;
    inset: 0;
  }

  .pocket:focus-visible {
    outline: none;
  }

  .pocket:focus-visible .front {
    outline-offset: 4px;
    outline: 2px solid #7950ef;
  }

  .back,
  .front {
    pointer-events: none;
    position: absolute;
  }

  .back {
    z-index: 0;
    background: linear-gradient(#2c2c31, #0d0d0f 60%);
    border-radius: 14px 14px 10px 10px;
    inset: 0 7px 6px;
    box-shadow: inset 0 1px 0 #ffffff1f;
  }

  .front {
    z-index: 2;
    background:
      linear-gradient(162deg, #ffffff38, #ffffff0a 38%, #fff0 60%),
      linear-gradient(#26262bc2, #0a0a0ce6);
    -webkit-backdrop-filter: blur(10px) saturate(170%);
    backdrop-filter: blur(10px) saturate(170%);
    border-radius: 10px 10px 20px 20px;
    height: 80px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    transform-origin: 50% 100%;
    transform: perspective(420px);
    transition: transform 0.55s var(--spring);
    box-shadow:
      inset 0 1px 0 #ffffff45,
      inset 0 0 0 1px #ffffff14,
      inset 0 -10px 18px -10px #0009,
      0 18px 30px -16px #000a,
      0 4px 10px -4px #0005;
  }

  /* Engraved « CV » on the pouch. */
  .label {
    color: #ffffff30;
    letter-spacing: 0.18em;
    text-shadow:
      0 -1px 0 #000000a6,
      0 1px 0 #ffffff1a;
    font-size: 19px;
    line-height: 1;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(calc(-50% + 0.09em), -50%);
  }

  .dock img,
  .viewer img {
    -webkit-user-drag: none;
  }

  .sheen {
    background: linear-gradient(105deg, #fff0 35%, #ffffff26 50%, #fff0 65%);
    position: absolute;
    inset: 0;
    transform: translateX(-110%);
    transition: transform 0.9s var(--glide);
  }

  .sheet {
    z-index: 1;
    pointer-events: none;
    background: #fff;
    border: 0;
    border-radius: 10px;
    width: 168px;
    height: 238px;
    margin: 0 0 0 -84px;
    padding: 0;
    position: absolute;
    bottom: 10px;
    left: 50%;
    overflow: hidden;
    transform-origin: 50% 100%;
    transform: translate(var(--x, 0), var(--y, 0)) rotate(var(--r, 0deg)) scale(var(--s, 0.44));
    transition:
      transform 0.6s var(--spring),
      box-shadow 0.4s var(--glide);
    box-shadow:
      0 0 0 1px #0000000d,
      0 2px 6px -2px #0000001f;
  }

  .ghost::before {
    content: '';
    background:
      linear-gradient(#ecebf0 0 0) 0 0 / 30% 22px no-repeat,
      linear-gradient(#efeef2 0 0) 38% 3px / 50% 7px no-repeat,
      linear-gradient(#f4f3f6 0 0) 38% 15px / 34% 5px no-repeat,
      linear-gradient(#f4f3f6 0 0) 0 40px / 100% 5px no-repeat,
      linear-gradient(#f4f3f6 0 0) 0 52px / 88% 5px no-repeat,
      linear-gradient(#f4f3f6 0 0) 0 64px / 94% 5px no-repeat,
      linear-gradient(#efeef2 0 0) 0 86px / 40% 7px no-repeat,
      linear-gradient(#f4f3f6 0 0) 0 100px / 100% 5px no-repeat,
      linear-gradient(#f4f3f6 0 0) 0 112px / 76% 5px no-repeat,
      linear-gradient(#f7f6f9 0 0) 0 132px / 100% 36px no-repeat;
    position: absolute;
    inset: 18px 16px;
  }

  .g1 {
    --x: -5px;
    --r: -4deg;
  }

  .g2 {
    --x: 4px;
    --r: 3deg;
  }

  .cv {
    --y: 2px;
    cursor: zoom-in;
  }

  .cv img {
    object-fit: cover;
    object-position: top;
    width: 100%;
    height: 100%;
    display: block;
  }

  .view-pill {
    color: #fff;
    letter-spacing: 0.01em;
    opacity: 0;
    -webkit-backdrop-filter: blur(10px) saturate(160%);
    backdrop-filter: blur(10px) saturate(160%);
    background: #14141799;
    border-radius: 999px;
    padding: 6px 12px;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
    font-size: 12px;
    font-weight: 600;
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translate(-50%, 6px);
    transition:
      opacity 0.25s,
      transform 0.35s var(--glide);
    box-shadow: inset 0 0 0 1px #ffffff1f;
  }

  /* Open: the sheets fan out above the pocket. */
  .open .sheet {
    --s: 0.8;
    box-shadow:
      0 0 0 1px #0000000a,
      0 22px 40px -18px #00000047,
      0 6px 14px -8px #0000002e;
  }

  .open .g1 {
    --x: -98px;
    --y: -70px;
    --r: -11deg;
    transition-delay: 0.04s;
  }

  .open .g2 {
    --x: -56px;
    --y: -84px;
    --r: -5deg;
    transition-delay: 0.02s;
  }

  .open .cv {
    --x: -14px;
    --y: -92px;
    --r: 3deg;
    pointer-events: auto;
  }

  .open .front {
    transform: perspective(420px) rotateX(22deg) translateY(3px);
  }

  .open::before {
    opacity: 0.7;
    transform: scaleX(0.92);
  }

  .viewing .cv {
    visibility: hidden;
  }

  .cv:focus-visible {
    outline-offset: 4px;
    outline: 2px solid #7950ef;
  }

  @media (hover: hover) and (pointer: fine) {
    .dock:not(.open) .pocket:hover ~ .g1 {
      --y: -10px;
      --r: -7deg;
      --x: -8px;
    }

    .dock:not(.open) .pocket:hover ~ .g2 {
      --y: -13px;
      --r: 5deg;
      --x: 6px;
    }

    .dock:not(.open) .pocket:hover ~ .cv {
      --y: -16px;
    }

    .dock:not(.open) .pocket:hover .front {
      transform: perspective(420px) rotateX(10deg);
    }

    .pocket:hover .sheen {
      transform: translateX(110%);
    }

    .open .cv:hover {
      --y: -100px;
      --s: 0.84;
      --r: 1deg;
    }

    .open .cv:hover .view-pill {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }

  /* Full view. */
  .viewer {
    background: none;
    border: 0;
    user-select: none;
    -webkit-user-select: none;
    width: 100vw;
    max-width: none;
    height: 100dvh;
    max-height: none;
    margin: 0;
    padding: 0;
    position: fixed;
    inset: 0;
    overflow: hidden;
  }

  .viewer::backdrop {
    background: #0b0b0d00;
    -webkit-backdrop-filter: blur(0);
    backdrop-filter: blur(0);
    transition:
      background 0.45s,
      backdrop-filter 0.45s,
      -webkit-backdrop-filter 0.45s;
  }

  .viewer.shown::backdrop {
    background: #0b0b0d38;
    -webkit-backdrop-filter: blur(14px) saturate(140%);
    backdrop-filter: blur(14px) saturate(140%);
  }

  .stage {
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    overflow: auto;
    width: 100%;
    height: 100%;
    padding: 72px 24px 32px;
    display: flex;
  }

  .paper {
    aspect-ratio: 210 / 297;
    appearance: none;
    -webkit-appearance: none;
    background: #fff;
    border: 0;
    border-radius: 12px;
    padding: 0;
    display: block;
    width: min(92vw, calc((100dvh - 104px) * 210 / 297), 820px);
    flex: 0 0 auto;
    margin: auto;
    overflow: hidden;
    cursor: zoom-in;
    transition: width 0.35s var(--glide, cubic-bezier(0.22, 1, 0.36, 1));
    box-shadow:
      0 0 0 1px #0000000d,
      0 40px 80px -30px #0000006b,
      0 12px 28px -14px #0000003d;
  }

  .paper:focus-visible {
    outline: 2px solid #7950ef;
    outline-offset: 4px;
  }

  .viewer.zoomed .stage {
    justify-content: flex-start;
    align-items: flex-start;
  }

  .viewer.zoomed .paper {
    width: 1600px;
    margin: 0;
    cursor: zoom-out;
  }

  .paper img {
    width: 100%;
    height: 100%;
    display: block;
  }

  .bar {
    opacity: 0;
    gap: 8px;
    display: flex;
    position: fixed;
    top: 20px;
    right: 20px;
    transform: translateY(-6px);
    transition:
      opacity 0.3s,
      transform 0.45s var(--glide, cubic-bezier(0.22, 1, 0.36, 1));
  }

  .shown .bar {
    opacity: 1;
    transform: none;
    transition-delay: 0.25s;
  }

  .pill {
    color: #fff;
    cursor: pointer;
    -webkit-backdrop-filter: blur(14px) saturate(170%);
    backdrop-filter: blur(14px) saturate(170%);
    background: #16161a8c;
    border: 0;
    border-radius: 999px;
    align-items: center;
    gap: 8px;
    height: 40px;
    padding: 0 16px 0 14px;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
    font-size: 14px;
    font-weight: 600;
    display: inline-flex;
    transition:
      background 0.2s,
      transform 0.35s cubic-bezier(0.34, 1.45, 0.5, 1);
    box-shadow:
      inset 0 1px 0 #ffffff2e,
      inset 0 0 0 1px #ffffff14,
      0 8px 20px -10px #0006;
  }

  .pill.round {
    justify-content: center;
    width: 40px;
    padding: 0;
  }

  .pill:hover {
    background: #16161ab8;
    transform: translateY(-1px);
  }

  .pill:focus-visible {
    outline-offset: 2px;
    outline: 2px solid #7950ef;
  }

  @media (width <= 700px) {
    .dock {
      right: 14px;
      bottom: 14px;
      transform: scale(0.8);
      transform-origin: 100% 100%;
    }

    .stage {
      padding: 76px 12px 20px;
    }

    .bar {
      top: 16px;
      right: 12px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .sheet,
    .front,
    .sheen,
    .bar,
    .paper,
    .viewer::backdrop {
      transition: none;
    }
  }
</style>
