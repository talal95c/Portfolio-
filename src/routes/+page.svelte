<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import Metatags from '$lib/components/Metatags.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import WorkList from '$lib/components/WorkList.svelte';
  import AboutDialog from '$lib/components/AboutDialog.svelte';
  import '$lib/styles/home.css';

  let mobile = $state(true);
  let mobileBadge;
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

<Metatags description="I design products and the stories behind them. Currently studying Arts, Technology, & Business at USC." /> <a class="skip svelte-1uha8ag" href="#work">Skip to work</a> <main><section class="hero svelte-1uha8ag" aria-label="Introduction"><p class="intro svelte-1uha8ag">I design products and the<br />stories behind them. <button type="button" class="more svelte-1uha8ag" aria-haspopup="dialog" onclick={() => (aboutOpen = true)}>[more]</button></p> <p class="education svelte-1uha8ag">Currently studying Arts,<br />Technology, &amp; Business @ USC</p> <h1 class="svelte-1uha8ag"><span class="svelte-1uha8ag">Sam</span> <span class="svelte-1uha8ag">Cheng</span></h1> {#if mobile}<div class="mobile-badge svelte-1uha8ag"><img bind:this={mobileBadge} src={mobileBadgeSrc} alt="Sam Cheng badge in a clear sleeve" width="995" height="1666" fetchpriority="high" class="svelte-1uha8ag" /></div>{:else}<Badge />{/if}</section> <WorkList /></main> <Footer /> <AboutDialog bind:open={aboutOpen} />
