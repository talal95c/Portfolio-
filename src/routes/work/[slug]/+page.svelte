<script>
  import { onMount, tick } from 'svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Metatags from '$lib/components/Metatags.svelte';
  import ProjectCard from '$lib/components/ProjectCard.svelte';
  import { projects } from '$lib/data/projects.js';
  import { plainText, richSegments } from '$lib/rich.js';
  import { workMedia } from '$lib/workMedia.js';
  import { technical } from '$lib/data/technical.js';
  import ArchitectureDiagram from '$lib/components/ArchitectureDiagram.svelte';
  import '$lib/components/work.css';

  let { data } = $props();
  let project = $derived(data.project);
  let caseStudy = $derived(project.caseStudy);
  let technicalContent = $derived(technical[project.slug]);
  let projectIndex = $derived(projects.findIndex((item) => item.slug === project.slug));
  let projectNumber = $derived(String(projectIndex + 1).padStart(2, '0'));
  let projectCount = $derived(String(projects.length).padStart(2, '0'));
  let titleWords = $derived(project.name.split(/\s+/));
  let longestTitleWord = $derived(Math.max(...titleWords.map((word) => word.length)));
  let projectMedia = $derived(workMedia(project));
  let heroImage = $derived(projectMedia[0]);
  let gallery = $derived(
    technicalContent || caseStudy.gallery === false
      ? []
      : projectMedia.slice(1).map((image, index) => ({ ...image, index }))
  );
  let moreProjects = $derived.by(() => {
    const index = Math.max(
      0,
      projects.findIndex((item) => item.slug === project.slug)
    );
    return [1, 2].map((offset) => projects[(index + offset) % projects.length]);
  });

  let pageRoot;
  let navIsland;
  let nav;
  let navInert = $state(false);
  let lightboxIndex = $state(-1);
  let lightboxCloseButton = $state();
  let lightboxTrigger;
  let savedBodyOverflow = null;

  $effect(() => {
    if (!caseStudy.selection) return;

    document.documentElement.style.setProperty('--selection', caseStudy.selection);
    return () => document.documentElement.style.removeProperty('--selection');
  });

  async function openLightbox(index, event) {
    lightboxTrigger = event.currentTarget;
    savedBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    lightboxIndex = index;
    await tick();
    lightboxCloseButton?.focus();
  }

  async function closeLightbox() {
    if (lightboxIndex < 0) return;
    lightboxIndex = -1;
    if (savedBodyOverflow !== null) {
      document.body.style.overflow = savedBodyOverflow;
      savedBodyOverflow = null;
    }
    await tick();
    lightboxTrigger?.focus();
    lightboxTrigger = null;
  }

  function handleLightboxKeydown(event) {
    if (lightboxIndex < 0) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      void closeLightbox();
    } else if (event.key === 'ArrowLeft' && gallery.length > 0) {
      event.preventDefault();
      lightboxIndex = (lightboxIndex - 1 + gallery.length) % gallery.length;
    } else if (event.key === 'ArrowRight' && gallery.length > 0) {
      event.preventDefault();
      lightboxIndex = (lightboxIndex + 1) % gallery.length;
    } else if (event.key === 'Tab') {
      event.preventDefault();
      lightboxCloseButton?.focus();
    }
  }

  onMount(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
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
    };
    const scheduleUpdate = () => {
      if (animationFrame === undefined) animationFrame = requestAnimationFrame(update);
    };
    const onMotionChange = () => scheduleUpdate();

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('keydown', handleLightboxKeydown);
    reducedMotion.addEventListener('change', onMotionChange);
    nav.addEventListener('focusout', scheduleUpdate);
    update();

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('keydown', handleLightboxKeydown);
      reducedMotion.removeEventListener('change', onMotionChange);
      nav.removeEventListener('focusout', scheduleUpdate);
      if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
      if (savedBodyOverflow !== null) document.body.style.overflow = savedBodyOverflow;
    };
  });

  $effect(() => {
    const slug = project.slug;
    let disposed = false;
    let revealObserver;
    const mountedAt = performance.now();

    const setup = async () => {
      await tick();
      if (disposed) return;

      pageRoot.classList.add('ready');
      const heading = pageRoot.querySelector('.project-heading');
      requestAnimationFrame(() => heading?.classList.add('in'));

      revealObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const target = entry.target;
            const early = performance.now() - mountedAt <= 120;
            target.classList.add('in');
            if (early) target.classList.add('early');
            revealObserver.unobserve(target);
          }
        },
        { rootMargin: '25% 0px' }
      );
      pageRoot.querySelectorAll('.reveal').forEach((target) => revealObserver.observe(target));
    };

    setup();

    return () => {
      disposed = true;
      revealObserver?.disconnect();
      if (savedBodyOverflow !== null) {
        document.body.style.overflow = savedBodyOverflow;
        savedBodyOverflow = null;
      }
      lightboxIndex = -1;
      void slug;
    };
  });
</script>

<Metatags title={`${project.name} — Talal Aamir`} description={plainText(project.description)} />

<main id="project-page" class="project-page" bind:this={pageRoot}>
  <div class="nav-island" bind:this={navIsland}>
    <nav aria-label="Case study navigation" bind:this={nav} inert={navInert}>
      <a class="back" href="/#work">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ><path d="M15 18l-6-6 6-6"></path></svg>
        <span>Back</span>
      </a>
      <div class="socials">
        <a href="https://linkedin.com/in/talalaamir" target="_blank" rel="noopener noreferrer">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"></path></svg>
          <span>LinkedIn</span>
        </a>
        <a href="https://github.com/talal95c" target="_blank" rel="noopener noreferrer">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3"></path></svg>
          <span>GitHub</span>
        </a>
        <a href="mailto:talalaamir958@gmail.com">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"></rect><path d="m3.5 6.5 8.5 6.5 8.5-6.5"></path></svg>
          <span>Email</span>
        </a>
      </div>
    </nav>
  </div>

  {#key project.slug}
    <div class="page-content">
      <div class="project-layout">
        <aside class="project-sidebar" aria-label={`${project.name} project details`}>
          <header class="project-heading">
            <p class="project-index">{projectNumber} / {projectCount}</p>
            <h1 aria-label={project.name} class:long-title={longestTitleWord > 10}>
              {#each titleWords as word, index (index)}
                <span class="title-mask" aria-hidden="true">
                  <span class="title-word" style={`--word-index:${index}`}>{word}</span>
                </span>
                {#if index < titleWords.length - 1}{' '}{/if}
              {/each}
            </h1>
            <p class="project-lead">
              {#each richSegments(project.description) as segment}
                {#if segment.bold}
                  <strong>{segment.text}</strong>
                {:else if segment.underline}
                  <span class="u">{segment.text}</span>
                {:else}
                  {segment.text}
                {/if}
              {/each}
            </p>
          </header>

          <dl class="meta-list">
            <div class="meta-row">
              <dt>Role</dt>
              <dd>{caseStudy.role}</dd>
            </div>
            <div class="meta-row">
              <dt>Team</dt>
              <dd>{caseStudy.team}</dd>
            </div>
            <div class="meta-row">
              <dt>Year</dt>
              <dd>{project.date}</dd>
            </div>
            <div class="meta-row">
              <dt>Skills</dt>
              <dd>{caseStudy.skills}</dd>
            </div>
            {#if project.website}
              <div class="meta-row">
                <dt>Live project</dt>
                <dd>
                  <a href={project.website} target="_blank" rel="noopener noreferrer">
                    View online <span aria-hidden="true">↗</span>
                  </a>
                </dd>
              </div>
            {/if}
          </dl>
        </aside>

        <div class="project-body">
          <div
            class="hero-media media-frame reveal"
            class:media-alpha={heroImage.alpha}
          >
            <img
              src={heroImage.src}
              alt={caseStudy.alt}
              width={heroImage.width}
              height={heroImage.height}
              fetchpriority="high"
              loading="eager"
              decoding="async"
            />
          </div>

          <div class="story-block">
            <section class="story-item reveal" aria-labelledby="context-title">
              <p class="section-label">Context</p>
              <h2 id="context-title" class="story-context">{caseStudy.context}</h2>
            </section>
            <section class="story-item reveal" aria-labelledby="goal-title">
              <p class="section-label">Goal</p>
              <p id="goal-title" class="story-goal">{caseStudy.goal}</p>
            </section>
          </div>

          {#if technicalContent}
            <section class="technical-section" aria-labelledby="technical-title">
              <div>
                <p id="technical-title" class="section-label">{technicalContent.title}</p>
                <div class="technical-copy">
                  {#each technicalContent.paragraphs as paragraph}
                    <p>
                      {#each richSegments(paragraph) as segment}
                        {#if segment.bold}
                          <strong>{segment.text}</strong>
                        {:else if segment.underline}
                          <span class="u">{segment.text}</span>
                        {:else}
                          {segment.text}
                        {/if}
                      {/each}
                    </p>
                  {/each}
                </div>
              </div>
              <ArchitectureDiagram stages={technicalContent.stages} accent={caseStudy.color} />
            </section>
          {/if}

          {#if gallery.length}
            <section class="gallery" aria-label="Project gallery">
              {#each gallery as image (image.original)}
                <button
                  class="gallery-item media-frame reveal"
                  class:media-alpha={image.alpha}
                  type="button"
                  aria-label={`Open image ${image.index + 1} of ${gallery.length}`}
                  onclick={(event) => openLightbox(image.index, event)}
                >
                  <img
                    src={image.src}
                    alt={image.index === 0 ? caseStudy.alt : ''}
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              {/each}
            </section>
          {/if}

          {#if caseStudy.results?.length}
            <section class="results reveal" aria-labelledby="results-title">
              <h2 id="results-title" class="section-label">Results</h2>
              <div class="results-grid">
                {#each caseStudy.results as result}
                  <div class="result">
                    <p class="result-value">{result.value}</p>
                    <p class="result-label">{result.label}</p>
                  </div>
                {/each}
              </div>
            </section>
          {/if}
        </div>
      </div>

      <section class="more-projects" aria-labelledby="more-title">
        <div class="more-header reveal">
          <h2 id="more-title">More projects.</h2>
          <a href="/#work" class="all-works">All works</a>
        </div>
        <div class="more-grid">
          {#each moreProjects as moreProject (moreProject.slug)}
            <ProjectCard project={moreProject} />
          {/each}
        </div>
      </section>
    </div>

    {#if lightboxIndex >= 0 && gallery[lightboxIndex]}
      <div class="lightbox">
        <button
          class="lightbox-backdrop"
          type="button"
          aria-label="Close image viewer"
          tabindex="-1"
          onclick={closeLightbox}
        ></button>
        <div
          class="lightbox-dialog"
          role="dialog"
          aria-modal="true"
          aria-label={`${project.name} image viewer`}
        >
          <button
            class="lightbox-close"
            type="button"
            aria-label="Close image viewer"
            bind:this={lightboxCloseButton}
            onclick={closeLightbox}
          >×</button>
          <img
            class="lightbox-image"
            class:media-alpha={gallery[lightboxIndex].alpha}
            src={gallery[lightboxIndex].src}
            alt={lightboxIndex === 0 ? caseStudy.alt : ''}
            width={gallery[lightboxIndex].width}
            height={gallery[lightboxIndex].height}
          />
          <div class="lightbox-caption">
            <span>{project.name}</span>
            <span aria-live="polite">· {lightboxIndex + 1} / {gallery.length}</span>
          </div>
        </div>
      </div>
    {/if}
  {/key}
</main>

<Footer />

<style>
  .project-page {
    position: relative;
    z-index: 0;
    min-height: 100vh;
    background: #fafafa;
    color: #080808;
  }

  .nav-island {
    position: fixed;
    z-index: 20;
    top: 22px;
    left: 50%;
    width: 550px;
    max-width: calc(100% - 40px);
    transform: translateX(-50%);
    will-change: transform;
  }

  nav {
    position: relative;
    display: flex;
    width: 100%;
    min-height: 44px;
    align-items: center;
    justify-content: space-between;
    padding: 0 6px;
    border-radius: 999px;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.015em;
  }

  nav a {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 12px;
    border-radius: 999px;
    line-height: 1.2;
    transition:
      background-color 0.2s,
      opacity 0.2s;
  }

  nav a svg {
    display: block;
    flex: none;
    width: 15px;
    height: 15px;
    transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .back {
    gap: 4px;
  }

  .back svg {
    width: 16px;
    height: 16px;
  }

  .socials a {
    padding: 9px 11px;
  }

  .socials a span {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .socials a svg {
    width: 17px;
    height: 17px;
  }

  .socials {
    display: flex;
    gap: 2px;
  }

  .page-content {
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    padding: 120px 32px 136px;
  }

  .project-layout {
    display: grid;
    grid-template-columns: minmax(0, 452fr) minmax(0, 837fr);
    align-items: start;
    column-gap: 72px;
  }

  .project-sidebar {
    position: sticky;
    top: 120px;
    align-self: start;
    min-width: 0;
    container-type: inline-size;
  }

  .project-index {
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
    line-height: 1.2;
  }

  .project-heading h1 {
    margin-top: 16px;
    font-size: clamp(44px, 5vw, 72px);
    font-weight: 500;
    letter-spacing: -0.03em;
    line-height: 1;
    text-transform: uppercase;
  }

  .project-heading h1.long-title {
    font-size: min(72px, 12.2cqi);
  }

  .title-mask {
    display: inline-block;
    overflow: hidden;
    vertical-align: bottom;
  }

  .title-word {
    display: inline-block;
    padding-bottom: 0.06em;
  }

  :global(#project-page.ready) .title-word {
    transform: translateY(100%);
  }

  :global(#project-page.ready) .project-heading:global(.in) .title-word {
    transform: translateY(0);
    transition: transform 0.8s var(--ease-out);
    transition-delay: calc(var(--word-index) * 60ms);
  }

  .project-lead {
    max-width: 410px;
    margin-top: 32px;
    color: rgba(0, 0, 0, 0.6);
    font-size: 17.6px;
    font-weight: 400;
    line-height: 1.5;
  }

  .project-lead strong {
    color: #111;
    font-weight: 500;
    -webkit-text-stroke: 0.4px currentColor;
  }

  .project-lead .u {
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
    text-decoration-color: rgb(0 0 0 / 0.3);
  }

  .meta-list {
    margin: 40px 0 0;
    padding: 0;
  }

  .meta-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .meta-row:last-child {
    border-bottom: 0;
  }

  .meta-row dt {
    flex: none;
    color: rgba(0, 0, 0, 0.5);
    font-size: 12px;
    line-height: 1.4;
  }

  .meta-row dd {
    max-width: 65%;
    margin: 0;
    color: #111;
    font-size: 14px;
    line-height: 1.4;
    overflow-wrap: anywhere;
    text-align: right;
  }

  .meta-row a {
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
  }

  .meta-row a span {
    margin-left: 2px;
    text-decoration: none;
  }

  .project-body {
    min-width: 0;
  }

  .media-frame {
    display: grid;
    width: 100%;
    aspect-ratio: 837 / 620;
    place-items: center;
    overflow: hidden;
    border-radius: 12px;
    background: #f0f0f0;
  }

  .media-frame.media-alpha {
    background: transparent;
  }

  .media-frame.media-alpha img {
    width: 88%;
    max-height: 92%;
    border-radius: 0;
    box-shadow: none;
    filter: drop-shadow(0 10px 24px rgba(0, 0, 0, 0.07));
  }

  .media-frame img {
    display: block;
    width: 76%;
    height: auto;
    max-height: 80%;
    object-fit: contain;
    border-radius: 6px;
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.04),
      0 12px 32px rgba(0, 0, 0, 0.07);
  }

  .story-block {
    display: grid;
    gap: 36px;
    padding: 56px 0;
  }

  .section-label {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
    font-weight: 400;
    line-height: 1.3;
  }

  .story-context {
    max-width: 550px;
    color: #111;
    font-size: 24px;
    font-weight: 500;
    letter-spacing: -0.01em;
    line-height: 1.2;
  }

  .story-goal {
    max-width: 550px;
    color: rgba(0, 0, 0, 0.6);
    font-size: 17.6px;
    font-weight: 400;
    line-height: 1.5;
  }

  .technical-section {
    display: grid;
    gap: 16px;
    padding-bottom: 56px;
  }

  .technical-copy {
    display: grid;
    gap: 16px;
    max-width: 550px;
    color: rgba(0, 0, 0, 0.6);
    font-size: 17.6px;
    font-weight: 400;
    line-height: 1.5;
  }

  .technical-copy strong {
    color: #111;
    font-weight: 500;
    -webkit-text-stroke: 0.4px currentColor;
  }

  .technical-copy .u {
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
    text-decoration-color: rgb(0 0 0 / 0.3);
  }

  .gallery {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .gallery-item {
    padding: 0;
    border: 0;
    color: inherit;
    cursor: zoom-in;
  }

  .gallery-item:focus-visible {
    outline: 2px solid #080808;
    outline-offset: 4px;
  }

  .gallery-item img {
    transition: transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
  }

  .gallery-item.media-alpha img {
    object-fit: contain;
  }

  .results {
    padding: 56px 0;
  }

  .results > .section-label {
    margin-bottom: 24px;
  }

  .results-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
  }

  .result {
    min-width: 0;
    padding-top: 24px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  .result-value {
    color: #111;
    font-size: 48px;
    font-weight: 500;
    letter-spacing: -0.02em;
    line-height: 1;
    overflow-wrap: anywhere;
  }

  .result-label {
    margin-top: 12px;
    color: rgba(0, 0, 0, 0.6);
    font-size: 14px;
    font-weight: 400;
    line-height: 1.4;
  }

  .more-projects {
    margin-top: 160px;
  }

  .more-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  .more-header h2 {
    font-size: clamp(36px, 4vw, 60px);
    font-weight: 500;
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .all-works {
    flex: none;
    font-size: 14px;
    line-height: 1.3;
    text-decoration: none;
    text-underline-offset: 4px;
    transition: opacity 0.2s;
  }

  .more-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    margin-top: 40px;
  }

  :global(#project-page.ready) .reveal {
    opacity: 0;
    transform: translateY(24px);
    --reveal-delay: 150ms;
  }

  :global(#project-page.ready) .reveal:global(.early) {
    --reveal-delay: 650ms;
  }

  :global(#project-page.ready) .reveal:global(.in) {
    opacity: 1;
    transform: translateY(0);
    transition:
      opacity 0.7s ease-out var(--reveal-delay),
      transform 0.7s ease-out var(--reveal-delay);
  }

  @media (hover: hover) and (pointer: fine) {
    nav a:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    nav a:hover svg {
      transform: scale(1.08);
    }

    .back:hover svg {
      transform: translateX(-2px);
    }

    .meta-row a:hover {
      opacity: 0.65;
    }

    .gallery-item:hover img,
    .gallery-item:focus-visible img {
      transform: scale(1.03);
    }

    .gallery-item.media-alpha:hover img,
    .gallery-item.media-alpha:focus-visible img {
      transform: none;
    }

    .all-works:hover {
      text-decoration: underline;
    }
  }

  .lightbox {
    position: fixed;
    z-index: 100;
    inset: 0;
    display: grid;
    place-items: center;
    padding: 24px;
    background: rgba(250, 250, 250, 0.92);
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
  }

  .lightbox-backdrop {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: default;
  }

  .lightbox-dialog {
    position: relative;
    z-index: 1;
    width: fit-content;
    max-width: 90vw;
    background: transparent;
    animation: lightbox-in 0.35s var(--ease-out) both;
  }

  .lightbox-image {
    display: block;
    width: auto;
    height: auto;
    max-width: 90vw;
    max-height: 72vh;
    border-radius: 12px;
    object-fit: contain;
  }

  .lightbox-image.media-alpha {
    background: transparent;
  }

  .lightbox-caption {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin-top: 12px;
    color: rgba(0, 0, 0, 0.55);
    font-size: 12px;
    line-height: 1.3;
    text-transform: uppercase;
  }

  .lightbox-close {
    position: absolute;
    z-index: 2;
    top: 0;
    right: -50px;
    display: grid;
    width: 40px;
    height: 40px;
    place-items: center;
    padding: 0;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 50%;
    background: #fafafa;
    color: #080808;
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
  }

  @keyframes lightbox-in {
    from {
      opacity: 0;
      transform: scale(0.96);
    }

    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @media (max-width: 809px) {
    .page-content {
      padding: 120px 20px 136px;
    }

    .project-layout {
      grid-template-columns: minmax(0, 1fr);
      row-gap: 48px;
    }

    .project-sidebar {
      position: static;
    }

    .project-heading h1 {
      font-size: clamp(40px, 10vw, 64px);
    }

    .results-grid {
      grid-template-columns: minmax(0, 1fr);
    }

    .media-frame img {
      width: 84%;
    }

    .more-grid {
      grid-template-columns: minmax(0, 1fr);
    }

    .lightbox-close {
      top: 10px;
      right: 10px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(#project-page.ready) .title-word,
    :global(#project-page.ready) .project-heading:global(.in) .title-word {
      transform: none;
      transition: none;
      transition-delay: 0ms;
    }

    :global(#project-page.ready) .reveal,
    :global(#project-page.ready) .reveal:global(.in) {
      opacity: 1;
      transform: none;
      transition: none;
      --reveal-delay: 0ms;
    }

    .gallery-item img {
      transition: none;
    }

    .lightbox-dialog {
      animation: none;
    }
  }
</style>
