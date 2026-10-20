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
        <svg viewBox="0 0 120 84" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path class="draw arrow" pathLength="1" d="M74 52c-14-4-30-14-44-34" />
          <path class="draw head" pathLength="1" d="M27 29l2-12 11 4" />
          <path class="draw ring" pathLength="1" d="M86 46c-12 1-21 9-20 17 1 9 13 14 26 12 13-2 21-10 19-18-2-8-13-12-25-10-4 1-7 2-9 4" />
        </svg>
        <span>CV</span>
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

<style>
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
    top: 6px;
    left: calc(100% - 52px);
  }

  .cv-note svg {
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .cv-note span {
    pointer-events: auto;
    padding: 4px 8px;
    margin: -4px -8px;
    font-style: italic;
    font-size: 15px;
    letter-spacing: 0.02em;
    position: absolute;
    top: 51px;
    left: 79px;
    transition: transform 0.4s cubic-bezier(0.34, 1.7, 0.5, 1);
    animation: cv-in 0.4s 1.35s var(--ease-out) both;
  }

  .draw {
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: cv-draw 0.55s var(--ease-out) forwards;
  }

  .ring {
    animation-delay: 0.6s;
  }

  .arrow {
    animation-delay: 1s;
  }

  .head {
    animation-delay: 1.4s;
    animation-duration: 0.25s;
  }

  .cv-note svg {
    transition: transform 0.4s cubic-bezier(0.34, 1.7, 0.5, 1);
  }

  @media (hover: hover) and (pointer: fine) {
    .cv-note:hover svg,
    :global(.more:hover) ~ .cv-note svg {
      transform: translate(-3px, -3px);
    }

    .cv-note:hover span,
    :global(.more:hover) ~ .cv-note span {
      transform: rotate(-8deg) scale(1.1);
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
      transform: scale(0.6);
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
      transform: scale(0.62);
      transform-origin: 0 0;
      top: 2px;
      left: calc(100% - 38px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .draw,
    .cv-note span {
      animation: none;
      stroke-dashoffset: 0;
    }
  }
</style>
