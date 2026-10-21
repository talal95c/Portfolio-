<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import Metatags from '$lib/components/Metatags.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import WorkList from '$lib/components/WorkList.svelte';
  import Bonus from '$lib/components/Bonus.svelte';
  import GitHubActivity from '$lib/components/GitHubActivity.svelte';
  import AboutDialog from '$lib/components/AboutDialog.svelte';
  import CvPocket from '$lib/components/CvPocket.svelte';
  import '$lib/styles/home.css';

  let { data } = $props();
  let mobile = $state(true);
  let mobileBadge = $state(null);
  const mobileBadgeSrc = $derived(
    browser && page.url.searchParams.has('filter') ? '/assets/badge-mobile-filter.webp' : '/assets/badge-mobile.webp'
  );
  let aboutOpen = $state(false);

  onMount(() => {
    const narrow = matchMedia('(max-width: 700px)');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let frame;
    const update = () => {
      frame = undefined;
      if (mobileBadge) {
        const progress = Math.min(Math.max(scrollY, 0) / innerHeight, 1);
        mobileBadge.style.transform = `rotate(${reducedMotion.matches ? 7 : 7 - progress * 12}deg)`;
      }
    };
    const schedule = () => {
      if (frame === undefined) frame = requestAnimationFrame(update);
    };
    const onBreakpoint = () => {
      mobile = narrow.matches;
      schedule();
    };
    onBreakpoint();
    narrow.addEventListener('change', onBreakpoint);
    reducedMotion.addEventListener('change', schedule);
    window.addEventListener('scroll', schedule, { passive: true });
    return () => {
      narrow.removeEventListener('change', onBreakpoint);
      reducedMotion.removeEventListener('change', schedule);
      window.removeEventListener('scroll', schedule);
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
  });
</script>

<Metatags description="I build and learn. AI Engineer at Safran Aircraft Engines and Computer Science student at CY Tech." />
<a class="skip svelte-1uha8ag" href="#work">Skip to work</a>
<main>
  <section class="hero svelte-1uha8ag" aria-label="Introduction">
    <p class="intro svelte-1uha8ag">
      I build and learn. <button type="button" class="more svelte-1uha8ag" aria-haspopup="dialog" onclick={() => (aboutOpen = true)}>[more]</button>
      <button type="button" class="cv-note" tabindex="-1" aria-hidden="true" onclick={() => (aboutOpen = true)}>
        <svg class="arrow-svg" viewBox="0 0 120 84" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path class="draw arrow" pathLength="1" d="M74 52c-14-4-30-14-44-34" />
          <path class="draw head" pathLength="1" d="M27 29l2-12 11 4" />
        </svg>
        <span class="label">
          click there!
          <svg class="ring" viewBox="0 0 100 40" preserveAspectRatio="none" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
            <path class="draw" pathLength="1" vector-effect="non-scaling-stroke" d="M62 4C30 2 4 10 4 21c0 10 20 16 46 16 27 0 46-7 46-17C96 10 78 3 52 4c-6 0-11 1-15 3" />
          </svg>
          <img class="emoji" src="/stickers/point.svg" alt="" />
        </span>
      </button>
    </p>
    <p class="education svelte-1uha8ag">
      <span class="org"><img class="org-logo safran" src="/assets/logos/safran.svg" alt="" width="1000" height="210" />AI Engineer @ Safran Aircraft Engines</span><br />
      <span class="org"><img class="org-logo cy" src="/assets/logos/cy-tech.png" alt="" width="96" height="94" />Computer Science @ CY Tech, Paris</span>
    </p>
    <h1 class="svelte-1uha8ag"><span class="svelte-1uha8ag">Talal</span> <span class="svelte-1uha8ag">Aamir</span></h1>
    {#if mobile}
      <div class="mobile-badge svelte-1uha8ag">
        <img bind:this={mobileBadge} src={mobileBadgeSrc} alt="Talal Aamir badge in a clear sleeve" width="995" height="1666" fetchpriority="high" class="svelte-1uha8ag" />
      </div>
    {:else}
      <Badge />
    {/if}
  </section>
  <WorkList />
  <Bonus />
  <GitHubActivity activity={data.githubActivity} />
</main>
<Footer />
<AboutDialog bind:open={aboutOpen} />
<CvPocket />

<style>
  @font-face {
    font-family: 'Gochi Hand';
    src: url('/fonts/gochi-hand.woff2') format('woff2');
    font-display: swap;
  }

  .cv-note {
    pointer-events: none;
    color: #2142b8;
    cursor: pointer;
    font: inherit;
    background: none;
    border: 0;
    padding: 0;
    width: 120px;
    height: 84px;
    position: absolute;
    top: 4px;
    left: calc(100% - 46px);
    transform: scale(0.72);
    transform-origin: 0 0;
  }

  .arrow-svg {
    width: 100%;
    height: 100%;
    overflow: visible;
    transition: transform 0.4s cubic-bezier(0.34, 1.7, 0.5, 1);
  }

  .label {
    pointer-events: auto;
    white-space: nowrap;
    font-family: 'Gochi Hand', 'Comic Sans MS', cursive;
    font-size: 19px;
    line-height: 1;
    padding: 9px 14px;
    position: absolute;
    top: 46px;
    left: 62px;
    transform: rotate(-4deg);
    transition: transform 0.45s cubic-bezier(0.34, 1.7, 0.5, 1);
    animation: cv-in 0.4s 0.2s var(--ease-out) both;
  }

  .ring {
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    overflow: visible;
  }

  .draw {
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: cv-draw 0.55s 0.5s var(--ease-out) forwards;
  }

  .arrow {
    animation-delay: 1s;
  }

  .head {
    animation-delay: 1.4s;
    animation-duration: 0.25s;
  }

  .emoji {
    pointer-events: none;
    opacity: 0;
    width: 26px;
    height: 26px;
    filter: drop-shadow(1.5px 0 0 #fff) drop-shadow(-1.5px 0 0 #fff) drop-shadow(0 1.5px 0 #fff) drop-shadow(0 -1.5px 0 #fff)
      drop-shadow(1px 1px 0 #fff) drop-shadow(-1px -1px 0 #fff) drop-shadow(0 3px 5px #0000002e);
    position: absolute;
    bottom: calc(100% - 8px);
    right: -14px;
    transform-origin: 50% 100%;
    transform: translateY(8px) scale(0.3) rotate(-30deg);
    transition:
      transform 0.18s ease-in,
      opacity 0.12s ease-in;
  }

  @media (hover: hover) and (pointer: fine) {
    .label:hover,
    :global(.more:hover) ~ .cv-note .label {
      transform: rotate(3deg) scale(1.1);
    }

    .label:hover ~ .arrow-svg,
    :global(.more:hover) ~ .cv-note .arrow-svg {
      transform: translate(-3px, -3px);
    }

    .label:hover .emoji,
    :global(.more:hover) ~ .cv-note .emoji {
      opacity: 1;
      transform: translateY(0) scale(1) rotate(14deg);
      transition:
        transform 0.5s cubic-bezier(0.34, 1.7, 0.5, 1),
        opacity 0.15s ease-out;
    }
  }

  @keyframes cv-draw {
    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes cv-in {
    from {
      opacity: 0;
      transform: rotate(-4deg) scale(0.6);
    }
  }

  .org {
    align-items: center;
    justify-content: flex-end;
    gap: 7px;
    display: inline-flex;
  }

  .org-logo {
    filter: grayscale(1);
    opacity: 0.55;
    object-fit: contain;
    width: auto;
    display: block;
  }

  .org-logo.safran {
    height: 9px;
  }

  .org-logo.cy {
    height: 15px;
  }

  @media (width <= 700px) {
    .cv-note {
      transform: scale(0.55);
      top: 10px;
      left: calc(100% - 30px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .draw,
    .label {
      animation: none;
      stroke-dashoffset: 0;
    }
  }
</style>
