<script>
  import CaseStudyFigure from '$lib/components/CaseStudyFigure.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Metatags from '$lib/components/Metatags.svelte';
  import { onMount } from 'svelte';
  import '$lib/components/work.css';

  let { data } = $props();
  let project = $derived(data.project);
  let caseStudy = $derived(project.caseStudy);
  let websiteHost = $derived(
    project.website && new URL(project.website).hostname.replace(/^www\./, '')
  );
  let navIsland;
  let nav;
  let leftArt;
  let rightArt;
  let navInert = $state(false);

  $effect(() => {
    if (!caseStudy.selection) return;

    document.documentElement.style.setProperty('--selection', caseStudy.selection);
    return () => document.documentElement.style.removeProperty('--selection');
  });

  onMount(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 600px)');
    let animationFrame;
    const navHeight = nav.offsetHeight + 22;

    const update = () => {
      animationFrame = undefined;
      const scrollPosition = Math.max(0, window.scrollY);
      const navOffset = nav.contains(document.activeElement)
        ? 0
        : Math.min(scrollPosition * (reducedMotion.matches ? 1 : 0.65), navHeight + 8);

      navIsland.style.transform = `translate3d(-50%, ${-navOffset}px, 0)`;
      navInert = navOffset >= navHeight;
      const artOffset =
        (reducedMotion.matches || mobile.matches ? 0 : Math.min(scrollPosition, 600)) * 0.22;
      const transform = `translate3d(0, ${artOffset}px, 0)`;
      leftArt.style.transform = transform;
      rightArt.style.transform = transform;
    };
    const scheduleUpdate = () => {
      if (animationFrame === undefined) animationFrame = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    reducedMotion.addEventListener('change', scheduleUpdate);
    mobile.addEventListener('change', scheduleUpdate);
    nav.addEventListener('focusout', scheduleUpdate);
    update();

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      reducedMotion.removeEventListener('change', scheduleUpdate);
      mobile.removeEventListener('change', scheduleUpdate);
      nav.removeEventListener('focusout', scheduleUpdate);
      if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
    };
  });
</script>

<Metatags title={`${project.name} — Talal Aamir`} description={project.description} />

<main class="svelte-9hm5jc" style={`--project-color:${caseStudy.color}`}>
  <div class="nav-island svelte-9hm5jc" bind:this={navIsland}>
    <nav aria-label="Case study navigation" class="svelte-9hm5jc" bind:this={nav} inert={navInert}>
      <a class="back svelte-9hm5jc" href="/#work">
        Back
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="svelte-9hm5jc"
        ><path d="m9 10-5 4 5 4M4 14h11a4 4 0 0 0 0-8"></path></svg>
      </a>
      <div class="socials svelte-9hm5jc">
        <a href="https://linkedin.com/in/talalaamir" target="_blank" rel="noopener noreferrer" class="svelte-9hm5jc">LinkedIn</a>
        <a href="https://github.com/talal95c" target="_blank" rel="noopener noreferrer" class="svelte-9hm5jc">GitHub</a>
        <a href="mailto:talalaamir958@gmail.com" class="svelte-9hm5jc">Email</a>
      </div>
    </nav>
  </div>

  <header class="hero svelte-9hm5jc">
    <div class="hero-art svelte-9hm5jc" aria-hidden="true">
      <img class="left svelte-9hm5jc" src={caseStudy.heroImages[0]} alt="" bind:this={leftArt} />
      <img class="right svelte-9hm5jc" src={caseStudy.heroImages[1]} alt="" bind:this={rightArt} />
    </div>
    <div class="hero-title svelte-9hm5jc">
      <h1 class="svelte-9hm5jc">{project.name}</h1>
      <div class="hero-details svelte-9hm5jc">
        <p class="date svelte-9hm5jc">{project.date}</p>
        {#if project.website}
          <a
            class="visit svelte-9hm5jc"
            href={project.website}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${project.name} website (opens in a new tab)`}
          >
            <span class="visit-label svelte-9hm5jc">{websiteHost}</span>
            <svg
              class="visit-arrow svelte-9hm5jc"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            ><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
          </a>
        {/if}
      </div>
    </div>
  </header>

  <div class="study svelte-9hm5jc">
    <section
      class="context reading-column svelte-9hm5jc"
      id="context"
      aria-labelledby="context-title"
    >
      <h2 id="context-title" class="svelte-9hm5jc">
        <span class="section-number svelte-9hm5jc" aria-hidden="true">00<span class="rule svelte-9hm5jc"></span></span>Context
      </h2>
      <dl class="metadata svelte-9hm5jc">
        <div><dt class="svelte-9hm5jc">Role</dt><dd class="svelte-9hm5jc">{caseStudy.role}</dd></div>
        <div><dt class="svelte-9hm5jc">Team</dt><dd class="svelte-9hm5jc">{caseStudy.team}</dd></div>
        <div><dt class="svelte-9hm5jc">Skills</dt><dd class="svelte-9hm5jc">{caseStudy.skills}</dd></div>
      </dl>
      <div class="copy svelte-9hm5jc">
        <h3 class="svelte-9hm5jc">What is {project.name}?</h3>
        <p class="svelte-9hm5jc">{caseStudy.context}</p>
        <h3 class="svelte-9hm5jc">Goal</h3>
        <p class="svelte-9hm5jc">{caseStudy.goal}</p>
      </div>
    </section>

    <div class="context-visual svelte-9hm5jc">
      <CaseStudyFigure
        src={caseStudy.contextImage ?? project.images[0]}
        alt={caseStudy.alt}
        background={caseStudy.color}
        eager
      />
    </div>

    <section class="upcoming svelte-9hm5jc" aria-label="Full case study coming soon">
      <div class="reading-column blurred-preview svelte-9hm5jc" aria-hidden="true" inert>
        <h2 class="svelte-9hm5jc">
          <span class="section-number svelte-9hm5jc">01<span class="rule svelte-9hm5jc"></span></span>The problem
        </h2>
        <p class="svelte-9hm5jc">{caseStudy.goal}</p>
        <p class="svelte-9hm5jc">{caseStudy.context}</p>
        <p class="svelte-9hm5jc">{project.description}</p>
      </div>
      <div class="progressive-blur svelte-9hm5jc" aria-hidden="true">
        <span class="svelte-9hm5jc"></span>
        <span class="svelte-9hm5jc"></span>
        <span class="svelte-9hm5jc"></span>
        <span class="svelte-9hm5jc"></span>
      </div>
      <div class="coming-soon svelte-9hm5jc">
        <div class="pill-track svelte-9hm5jc" aria-hidden="true">
          {#each [0, 1] as copy}
            <div class="pill-group svelte-9hm5jc">
              {#each Array(16) as _, index}
                <span class="svelte-9hm5jc" class:dark={index % 2 === 1}>Coming Soon</span>
              {/each}
            </div>
          {/each}
        </div>
      </div>
    </section>
  </div>
</main>

<Footer />

<style>
  nav.svelte-9hm5jc {
    background: rgba(250, 250, 250, 0.72);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    backdrop-filter: blur(24px) saturate(180%);
  }

  @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
    nav.svelte-9hm5jc {
      background: rgba(250, 250, 250, 0.92);
    }
  }
</style>
