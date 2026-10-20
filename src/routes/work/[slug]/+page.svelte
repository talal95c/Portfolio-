<script>
  import { onMount, tick } from 'svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Metatags from '$lib/components/Metatags.svelte';
  import ProjectCard from '$lib/components/ProjectCard.svelte';
  import { media } from '$lib/data/media.js';
  import { projects } from '$lib/data/projects.js';
  import '$lib/components/work.css';

  let { data } = $props();
  let project = $derived(data.project);
  let caseStudy = $derived(project.caseStudy);
  let projectIndex = $derived(projects.findIndex((item) => item.slug === project.slug));
  let projectNumber = $derived(String(projectIndex + 1).padStart(2, '0'));
  let projectCount = $derived(String(projects.length).padStart(2, '0'));
  let titleWords = $derived(project.name.split(/\s+/));
  let heroImage = $derived(
    media[caseStudy.heroImages[0]] ?? {
      src: caseStudy.heroImages[0],
      width: 890,
      height: 676,
      tone: 'light',
    }
  );
  let gallery = $derived.by(() => {
    const heroSrc = caseStudy.heroImages[0];
    const sourceHash = (source) => media[source]?.hash ?? source;
    const seen = new Set([sourceHash(heroSrc)]);
    const sources = [
      ...project.images,
      ...caseStudy.heroImages,
      ...(caseStudy.contextImage ? [caseStudy.contextImage] : []),
    ].filter((source) => {
      const hash = sourceHash(source);
      if (seen.has(hash)) return false;
      seen.add(hash);
      return true;
    });

    return sources.map((source, index) => ({
      original: source,
      index,
      ...(media[source] ?? {
        src: source,
        width: 890,
        height: 676,
        tone: 'light',
      }),
    }));
  });
  let galleryColumns = $derived.by(() => {
    const columns = [[], []];
    const heights = [0, 0];

    for (const image of gallery) {
      const column = heights[0] <= heights[1] ? 0 : 1;
      columns[column].push(image);
      heights[column] += image.height / image.width;
    }

    return columns;
  });
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

<Metatags title={`${project.name} — Talal Aamir`} description={project.description} />

<main id="project-page" class="project-page" bind:this={pageRoot}>
  <div class="nav-island" bind:this={navIsland}>
    <nav aria-label="Case study navigation" bind:this={nav} inert={navInert}>
      <a class="back" href="/#work">
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
        ><path d="m9 10-5 4 5 4M4 14h11a4 4 0 0 0 0-8"></path></svg>
      </a>
      <div class="socials">
        <a href="https://linkedin.com/in/talalaamir" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://github.com/talal95c" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="mailto:talalaamir958@gmail.com">Email</a>
      </div>
    </nav>
  </div>

  {#key project.slug}
    <div class="page-content">
      <header class="project-heading">
        <div class="eyebrow">
          <span>PROJECT {projectNumber} / {projectCount}</span>
          <span>{project.date}</span>
        </div>
        <h1 aria-label={project.name}>
          {#each titleWords as word, index (index)}
            <span class="title-mask" aria-hidden="true">
              <span class="title-word" style={`--word-index:${index}`}>{word}</span>
            </span>
            {#if index < titleWords.length - 1}{' '}{/if}
          {/each}
        </h1>

        <div class="project-intro">
          <p class="lead">{project.description}</p>
          <div class="intro-details">
            <div class="meta-grid">
              <div class="meta-cell">
                <span class="meta-label">Role</span>
                <span class="meta-value">{caseStudy.role}</span>
              </div>
              <div class="meta-cell">
                <span class="meta-label">Team</span>
                <span class="meta-value">{caseStudy.team}</span>
              </div>
              <div class="meta-cell">
                <span class="meta-label">Year</span>
                <span class="meta-value">{project.date}</span>
              </div>
              <div class="meta-cell">
                <span class="meta-label">Skills</span>
                <span class="meta-value">{caseStudy.skills}</span>
              </div>
            </div>
            {#if project.website}
              <a
                class="website-link"
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
              >View online ↗</a>
            {/if}
          </div>
        </div>
      </header>

      <div
        class="hero-media reveal"
        style={`--media-aspect:${heroImage.width} / ${heroImage.height}`}
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

      <div class="story-rows">
        <section class="story-row reveal" aria-labelledby="context-title">
          <h2 id="context-title" class="story-label">
            <span class="story-number">01</span><span>Context</span>
          </h2>
          <p class="story-copy">{caseStudy.context}</p>
        </section>
        <section class="story-row reveal" aria-labelledby="goal-title">
          <h2 id="goal-title" class="story-label">
            <span class="story-number">02</span><span>Goal</span>
          </h2>
          <p class="story-copy">{caseStudy.goal}</p>
        </section>
      </div>

      {#if gallery.length}
        <section class="gallery" aria-label="Project gallery">
          {#if gallery.length === 1}
            {#each gallery as image (image.original)}
              <button
                class="gallery-item reveal gallery-single"
                type="button"
                aria-label={`Open image ${image.index + 1} of ${gallery.length}`}
                onclick={(event) => openLightbox(image.index, event)}
              >
                <span class="gallery-media" style={`--media-aspect:${image.width} / ${image.height}`}>
                  <img
                    src={image.src}
                    alt={caseStudy.alt}
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span class="gallery-plus" aria-hidden="true">+</span>
              </button>
            {/each}
          {:else}
            <div class="gallery-columns">
              {#each galleryColumns as column, columnIndex (columnIndex)}
                <div class="gallery-column" role="group" aria-label={`Gallery column ${columnIndex + 1}`}>
                  {#each column as image (image.original)}
                    <button
                      class="gallery-item reveal"
                      type="button"
                      aria-label={`Open image ${image.index + 1} of ${gallery.length}`}
                      onclick={(event) => openLightbox(image.index, event)}
                    >
                      <span class="gallery-media" style={`--media-aspect:${image.width} / ${image.height}`}>
                        <img
                          src={image.src}
                          alt={image.index === 0 ? caseStudy.alt : ''}
                          width={image.width}
                          height={image.height}
                          loading="lazy"
                          decoding="async"
                        />
                      </span>
                      <span class="gallery-plus" aria-hidden="true">+</span>
                    </button>
                  {/each}
                </div>
              {/each}
            </div>
            <div class="gallery-mobile-list">
              {#each gallery as image (image.original)}
                <button
                  class="gallery-item reveal"
                  type="button"
                  aria-label={`Open image ${image.index + 1} of ${gallery.length}`}
                  onclick={(event) => openLightbox(image.index, event)}
                >
                  <span class="gallery-media" style={`--media-aspect:${image.width} / ${image.height}`}>
                    <img
                      src={image.src}
                      alt={image.index === 0 ? caseStudy.alt : ''}
                      width={image.width}
                      height={image.height}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span class="gallery-plus" aria-hidden="true">+</span>
                </button>
              {/each}
            </div>
          {/if}
        </section>
      {/if}

      {#if caseStudy.results?.length}
        <section class="story-row results-row reveal" aria-labelledby="results-title">
          <h2 id="results-title" class="story-label">
            <span class="story-number">03</span><span>Results</span>
          </h2>
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

      <section class="more-projects" aria-labelledby="more-title">
        <div class="more-header reveal">
          <h2 id="more-title">More projects</h2>
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
        <div class="lightbox-dialog" role="dialog" aria-modal="true" aria-label={`${project.name} image viewer`}>
          <button
            class="lightbox-close"
            type="button"
            aria-label="Close image viewer"
            bind:this={lightboxCloseButton}
            onclick={closeLightbox}
          >×</button>
          <img
            class="lightbox-image"
            src={gallery[lightboxIndex].src}
            alt={lightboxIndex === 0 ? caseStudy.alt : ''}
            width={gallery[lightboxIndex].width}
            height={gallery[lightboxIndex].height}
          />
          <div class="lightbox-caption">
            <span>{project.name}</span>
            <span aria-live="polite">{lightboxIndex + 1} / {gallery.length}</span>
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
    font-size: 15px;
    letter-spacing: -0.01em;
  }

  nav a {
    display: inline-block;
    padding: 8px 12px;
    border-radius: 999px;
    line-height: 1.2;
    transition:
      background-color 0.2s,
      opacity 0.2s;
  }

  .back {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .back svg {
    display: block;
    flex: none;
    width: 1em;
    height: 1em;
  }

  .socials {
    display: flex;
    gap: 2px;
  }

  .page-content {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 160px 20px 136px;
  }

  .eyebrow {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    opacity: 0.6;
    font-size: 12px;
    letter-spacing: 0.04em;
    line-height: 1.2;
    text-transform: uppercase;
  }

  .project-heading h1 {
    margin-top: 16px;
    font-size: clamp(56px, 9vw, 128px);
    font-weight: 500;
    letter-spacing: -0.03em;
    line-height: 0.9;
    text-align: left;
    text-transform: uppercase;
  }

  .title-mask {
    display: inline-block;
    overflow: hidden;
    vertical-align: bottom;
  }

  .title-word {
    display: inline-block;
    padding-bottom: 0.08em;
  }

  :global(#project-page.ready) .title-word {
    transform: translateY(100%);
  }

  :global(#project-page.ready) .project-heading:global(.in) .title-word {
    transform: translateY(0);
    transition: transform 0.8s var(--ease-out);
    transition-delay: calc(var(--word-index) * 60ms);
  }

  .project-intro {
    display: grid;
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
    gap: 40px;
    margin-top: 48px;
  }

  .lead {
    font-size: 24px;
    font-weight: 500;
    letter-spacing: -0.02em;
    line-height: 1.3;
  }

  .meta-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: 20px;
    column-gap: 24px;
  }

  .meta-cell {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 5px;
  }

  .meta-label {
    opacity: 0.55;
    font-size: 12px;
    letter-spacing: 0.04em;
    line-height: 1.2;
    text-transform: uppercase;
  }

  .meta-value {
    font-size: 18px;
    font-weight: 400;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }

  .website-link {
    display: inline-block;
    margin-top: 24px;
    font-size: 14px;
    letter-spacing: 0.04em;
    line-height: 1.2;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 4px;
    text-transform: uppercase;
    transition: opacity 0.2s;
  }

  .hero-media {
    width: 100%;
    margin-top: 64px;
    aspect-ratio: var(--media-aspect);
    overflow: hidden;
    background: #eee;
  }

  .hero-media img,
  .gallery-media img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .story-rows {
    margin-top: 80px;
  }

  .story-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 40px;
    padding: 48px 0;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  .story-label {
    display: flex;
    align-items: baseline;
    gap: 12px;
    color: rgba(8, 8, 8, 0.6);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.04em;
    line-height: 1.3;
    text-transform: uppercase;
  }

  .story-number {
    opacity: 0.35;
  }

  .story-copy {
    max-width: 560px;
    font-size: 20px;
    font-weight: 400;
    letter-spacing: -0.01em;
    line-height: 1.45;
  }

  .gallery {
    margin-top: 16px;
  }

  .gallery-columns {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
    gap: 10px;
  }

  .gallery-column {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 10px;
  }

  .gallery-mobile-list {
    display: none;
  }

  .gallery-item {
    position: relative;
    display: block;
    width: 100%;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    cursor: zoom-in;
    text-align: left;
  }

  .gallery-media {
    display: block;
    width: 100%;
    aspect-ratio: var(--media-aspect);
    overflow: hidden;
    background: #eee;
  }

  .gallery-media img {
    transition: transform 0.6s var(--ease-out);
  }

  .gallery-plus {
    position: absolute;
    z-index: 1;
    top: 12px;
    left: 50%;
    display: grid;
    width: 40px;
    height: 40px;
    place-items: center;
    border-radius: 50%;
    background: #fff;
    color: #080808;
    font-size: 22px;
    line-height: 1;
    opacity: 0;
    transform: translateX(-50%) scale(0.85);
    transition:
      opacity 0.2s ease,
      transform 0.2s var(--ease-out);
    pointer-events: none;
  }

  .gallery-item:focus-visible {
    outline: 2px solid #080808;
    outline-offset: 4px;
  }

  .results-row {
    margin-top: 80px;
  }

  .story-rows + .results-row {
    margin-top: 0;
  }

  .results-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
  }

  .result-value {
    font-size: 40px;
    font-weight: 500;
    letter-spacing: -0.03em;
    line-height: 1;
    overflow-wrap: anywhere;
  }

  .result-label {
    margin-top: 10px;
    opacity: 0.6;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.35;
  }

  .more-projects {
    margin-top: 144px;
  }

  .more-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  .more-header h2 {
    font-size: clamp(36px, 4vw, 56px);
    font-weight: 500;
    letter-spacing: -0.04em;
    line-height: 1;
  }

  .all-works {
    display: inline-flex;
    min-height: 44px;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    border-radius: 999px;
    background: #050505;
    color: #f5f5f5;
    font-size: 16px;
    line-height: 1;
    transition: opacity 0.2s;
    white-space: nowrap;
  }

  .more-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
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

    .website-link:hover {
      opacity: 0.6;
    }

    .gallery-item:hover .gallery-media img,
    .gallery-item:focus-visible .gallery-media img {
      transform: scale(1.02);
    }

    .gallery-item:hover .gallery-plus,
    .gallery-item:focus-visible .gallery-plus {
      opacity: 1;
      transform: translateX(-50%) scale(1);
    }

    .all-works:hover {
      opacity: 0.85;
    }
  }

  .lightbox {
    position: fixed;
    z-index: 100;
    inset: 0;
    display: grid;
    place-items: center;
    padding: 20px;
    background: rgba(250, 250, 250, 0.4);
    -webkit-backdrop-filter: blur(20px);
    backdrop-filter: blur(20px);
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
    padding: 10px;
    background: #fff;
    animation: lightbox-in 0.35s var(--ease-out) both;
  }

  .lightbox-image {
    display: block;
    width: auto;
    height: auto;
    max-width: calc(90vw - 20px);
    max-height: 72vh;
    object-fit: contain;
  }

  .lightbox-caption {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    padding-top: 10px;
    font-size: 13px;
    letter-spacing: 0.04em;
    line-height: 1.2;
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
    border: 0;
    border-radius: 50%;
    background: #fff;
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
      padding-top: 120px;
    }

    .lightbox-close {
      top: 10px;
      right: 10px;
    }

    .project-intro {
      grid-template-columns: 1fr;
      gap: 32px;
    }

    .story-row {
      grid-template-columns: 1fr;
      gap: 24px;
      padding: 32px 0;
    }

    .gallery-columns {
      display: none;
    }

    .gallery-mobile-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .more-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 560px) {
    .lead {
      font-size: 22px;
    }

    .meta-grid {
      column-gap: 16px;
    }

    .story-copy {
      font-size: 19px;
    }

    .result-value {
      font-size: 32px;
    }

    .lightbox {
      padding: 10px;
    }

    .lightbox-dialog {
      max-width: 90vw;
    }

    .lightbox-image {
      max-width: calc(90vw - 20px);
      max-height: 72vh;
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
      transform: none;
      --reveal-delay: 0ms;
    }

    :global(#project-page.ready) .reveal:global(.in) {
      transition:
        opacity 0.7s ease-out 0ms,
        transform 0.7s ease-out 0ms;
    }

    .gallery-media img {
      transition: none;
    }

    .lightbox-dialog {
      animation-name: lightbox-fade;
    }
  }

  @keyframes lightbox-fade {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
</style>
