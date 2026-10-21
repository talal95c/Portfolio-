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
  let sheet;
  let viewing = $state(false);
  let shown = $state(false);

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
    return `translate(${dx}px, ${dy}px) scale(${card.offsetWidth / sheet.offsetWidth}) rotate(3deg)`;
  }

  async function view() {
    if (viewing) return;
    viewing = true;
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
    await tick();
    if (!reduced()) {
      sheet.animate([{ transform: cardTransform() }, { transform: 'none' }], { duration: 620, easing: ease });
    }
    requestAnimationFrame(() => (shown = true));
  }

  function close() {
    if (!viewing || !shown) return;
    shown = false;
    const finish = () => {
      dialog.close();
      document.documentElement.style.overflow = '';
      viewing = false;
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
  <p class="hint" aria-hidden="true">
    <span class="hint-text">click here for the CV!</span>
    <svg class="hint-arrow" viewBox="0 0 70 60" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path class="draw" pathLength="1" d="M8 10c22-2 42 10 50 34" />
      <path class="draw head" pathLength="1" d="M49 38l9 8 4-12" />
    </svg>
  </p>

  <button type="button" class="pocket" aria-expanded={step === 1} aria-label={step === 1 ? 'Put the CV back' : 'Take out my CV'} onclick={togglePocket}>
    <span class="back"></span>
    <span class="front"><span class="sheen"></span></span>
  </button>

  <span class="sheet ghost g1" aria-hidden="true"></span>
  <span class="sheet ghost g2" aria-hidden="true"></span>
  <button type="button" class="sheet cv" bind:this={card} tabindex={step === 1 ? 0 : -1} aria-label="View my CV" onclick={view}>
    <img src={thumb} alt="" width="480" height="621" decoding="async" />
    <span class="view-pill">View</span>
  </button>
</div>

<dialog bind:this={dialog} class="viewer" class:shown aria-label="Talal Aamir CV" oncancel={(event) => (event.preventDefault(), close())} onclick={(event) => event.target === event.currentTarget && close()}>
  <div class="stage" onclick={(event) => event.target === event.currentTarget && close()} role="presentation">
    <div class="paper" bind:this={sheet}>
      {#if armed}<img src={page} alt="Talal Aamir, one-page CV" width="1600" height="2071" decoding="async" />{/if}
    </div>
  </div>
  <div class="bar">
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
    height: 217px;
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

  /* Handwritten hint, same voice as the « click there! » note. */
  .hint {
    pointer-events: none;
    color: #2142b8;
    white-space: nowrap;
    font-family: 'Gochi Hand', 'Comic Sans MS', cursive;
    font-size: 19px;
    line-height: 1;
    z-index: 3;
    position: absolute;
    bottom: 74px;
    right: calc(100% + 26px);
    transition:
      opacity 0.3s,
      transform 0.45s var(--spring);
  }

  .hint-text {
    display: inline-block;
    transform: rotate(-5deg);
    animation: hint-in 0.45s 0.6s var(--glide) both;
  }

  .hint-arrow {
    width: 46px;
    height: 40px;
    position: absolute;
    top: 14px;
    right: -30px;
    overflow: visible;
  }

  .draw {
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: hint-draw 0.55s 1s var(--glide) forwards;
  }

  .draw.head {
    animation-delay: 1.45s;
    animation-duration: 0.25s;
  }

  .open .hint,
  .viewing .hint {
    opacity: 0;
    transform: translateX(-8px);
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

    .dock:not(.open):has(.pocket:hover) .hint {
      transform: rotate(3deg) scale(1.06);
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
    place-items: center;
    width: 100%;
    height: 100%;
    padding: 72px 24px 32px;
    display: grid;
  }

  .paper {
    aspect-ratio: 1600 / 2071;
    background: #fff;
    border-radius: 12px;
    width: min(92vw, calc((100dvh - 104px) * 1600 / 2071), 820px);
    overflow: hidden;
    box-shadow:
      0 0 0 1px #0000000d,
      0 40px 80px -30px #0000006b,
      0 12px 28px -14px #0000003d;
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

  @keyframes hint-draw {
    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes hint-in {
    from {
      opacity: 0;
      transform: rotate(-5deg) scale(0.6);
    }
  }

  @media (width <= 700px) {
    .dock {
      right: 14px;
      bottom: 14px;
      transform: scale(0.8);
      transform-origin: 100% 100%;
    }

    .hint {
      font-size: 17px;
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
    .hint,
    .bar,
    .viewer::backdrop {
      transition: none;
    }

    .draw,
    .hint-text {
      animation: none;
      stroke-dashoffset: 0;
    }
  }
</style>
