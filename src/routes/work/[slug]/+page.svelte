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
  let websiteHost = $derived(
    project.website && new URL(project.website).hostname.replace(/^www\./, '')
  );
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
    const seen = new Set();
    const sources = [
      ...project.images,
      ...caseStudy.heroImages,
      ...(caseStudy.contextImage ? [caseStudy.contextImage] : []),
    ].filter((source) => {
      if (source === heroSrc || seen.has(source)) return false;
      seen.add(source);
      return true;
    });

    return sources.map((source) => ({
      original: source,
      ...(media[source] ?? {
        src: source,
        width: 890,
        height: 676,
        tone: 'light',
      }),
    }));
  });
  let galleryPairAspect = $derived(
    gallery.length > 1
      ? (gallery[0].width / gallery[0].height + gallery[1].width / gallery[1].height) / 2
      : 1
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

  $effect(() => {
    if (!caseStudy.selection) return;

    document.documentElement.style.setProperty('--selection', caseStudy.selection);
    return () => document.documentElement.style.removeProperty('--selection');
  });

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

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    reducedMotion.addEventListener('change', scheduleUpdate);
    nav.addEventListener('focusout', scheduleUpdate);
    update();

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      reducedMotion.removeEventListener('change', scheduleUpdate);
      nav.removeEventListener('focusout', scheduleUpdate);
      if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
    };
  });

  $effect(() => {
    const slug = project.slug;
    let disposed = false;
    let revealObserver;
    let distortion = null;
    let distortionPending = false;
    const mountedAt = performance.now();
    const finePointer = window.matchMedia('(pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const canDistort = () =>
      finePointer.matches &&
      !reducedMotion.matches &&
      document.documentElement.clientWidth > 700;

    const removeGlState = () => {
      pageRoot?.classList.remove('gl');
      pageRoot?.querySelectorAll('.gl-ready').forEach((element) => {
        element.classList.remove('gl-ready');
      });
    };

    const buildDistortion = async () => {
      if (disposed || distortion || distortionPending || !canDistort()) return;
      distortionPending = true;
      try {
        const { createViewportDistortion } = await import('$lib/three/viewport-distortion.js');
        if (disposed || !canDistort()) return;

        const items = [...pageRoot.querySelectorAll('.appearance-media')]
          .map((mediaElement) => {
            const img = mediaElement.querySelector('img');
            const hoverTarget = mediaElement.closest('.project-card');
            return {
              media: mediaElement,
              img,
              ...(hoverTarget ? { hoverTarget } : {}),
            };
          })
          .filter((item) => item.img);
        distortion = createViewportDistortion({ root: pageRoot, items });
        if (!distortion) removeGlState();
      } catch {
        removeGlState();
      } finally {
        distortionPending = false;
      }
    };

    const updateDistortion = () => {
      if (canDistort()) {
        buildDistortion();
      } else {
        distortion?.dispose();
        distortion = null;
        removeGlState();
      }
    };

    const setup = async () => {
      await tick();
      if (disposed) return;
      pageRoot.classList.add('ready');
      pageRoot.querySelector('.project-heading')?.classList.add('in');

      const targets = [...pageRoot.querySelectorAll('.appearance-media')];
      revealObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const target = entry.target;
            const early = performance.now() - mountedAt <= 120;
            const delay = reducedMotion.matches ? 0 : early ? 650 : 150;
            target.classList.add('in');
            if (early) target.classList.add('early');
            target.dataset.appearAt = String(performance.now() + delay);

            const card = target.closest('.project-card');
            if (card) {
              card.classList.add('in');
              if (early) card.classList.add('early');
            }
            revealObserver.unobserve(target);
          }
        },
        { rootMargin: '25% 0px' }
      );
      targets.forEach((target) => revealObserver.observe(target));
      buildDistortion();
    };

    const setupPointer = () => updateDistortion();
    const setupMotion = () => updateDistortion();
    window.addEventListener('resize', updateDistortion);
    finePointer.addEventListener('change', setupPointer);
    reducedMotion.addEventListener('change', setupMotion);
    setup();

    return () => {
      disposed = true;
      revealObserver?.disconnect();
      window.removeEventListener('resize', updateDistortion);
      finePointer.removeEventListener('change', setupPointer);
      reducedMotion.removeEventListener('change', setupMotion);
      distortion?.dispose();
      removeGlState();
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
        <h1>{project.name}</h1>
      </header>

      <div
        class="hero-media appearance-media"
        style={`--media-aspect:${heroImage.width} / ${heroImage.height}`}
      >
        <img
          src={heroImage.src}
          alt=""
          width={heroImage.width}
          height={heroImage.height}
          fetchpriority="high"
          loading="eager"
          decoding="async"
        />
      </div>

      <section class="overview-card" aria-labelledby="overview-title">
        <h2 id="overview-title" class="section-label">Overview</h2>
        <div class="overview-copy">
          <div class="paragraphs">
            <p>{caseStudy.context}</p>
            <p>{caseStudy.goal}</p>
          </div>
          <dl class="details">
            <div class="detail-row">
              <dt>Role</dt>
              <dd>{caseStudy.role}</dd>
            </div>
            <div class="detail-row">
              <dt>Team</dt>
              <dd>{caseStudy.team}</dd>
            </div>
            <div class="detail-row">
              <dt>Skills</dt>
              <dd>{caseStudy.skills}</dd>
            </div>
            <div class="detail-row">
              <dt>Year</dt>
              <dd>{project.date}</dd>
            </div>
          </dl>
          {#if project.website}
            <a class="online-link" href={project.website} target="_blank" rel="noopener noreferrer">
              View online
            </a>
          {/if}
        </div>
      </section>

      {#if gallery.length}
        <section class="gallery" aria-label="Project gallery">
          {#if gallery.length > 1}
            <div class="gallery-pair" style={`--pair-aspect:${galleryPairAspect}`}>
              {#each gallery.slice(0, 2) as image, index (image.original)}
                <div
                  class="gallery-media appearance-media"
                  style={`--media-aspect:${image.width} / ${image.height}`}
                >
                  <img
                    src={image.src}
                    alt={index === 0 ? caseStudy.alt : ''}
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              {/each}
            </div>
            {#each gallery.slice(2) as image (image.original)}
              <div
                class="gallery-media appearance-media"
                style={`--media-aspect:${image.width} / ${image.height}`}
              >
                <img
                  src={image.src}
                  alt=""
                  width={image.width}
                  height={image.height}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            {/each}
          {:else}
            {#each gallery as image (image.original)}
              <div
                class="gallery-media appearance-media"
                style={`--media-aspect:${image.width} / ${image.height}`}
              >
                <img
                  src={image.src}
                  alt={caseStudy.alt}
                  width={image.width}
                  height={image.height}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            {/each}
          {/if}
        </section>
      {/if}

      <section class="more-projects" aria-labelledby="more-title">
        <h2 id="more-title" class="section-label">More projects</h2>
        <div class="more-grid">
          {#each moreProjects as moreProject (moreProject.slug)}
            <ProjectCard project={moreProject} />
          {/each}
        </div>
      </section>
    </div>
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
    padding: 0 var(--page-gutter) 136px;
  }

  .project-heading {
    margin-top: 123px;
    margin-bottom: 40px;
    text-align: center;
  }

  .project-heading h1 {
    font-size: clamp(64px, 12vw, 171px);
    font-weight: 500;
    letter-spacing: -0.04em;
    line-height: 0.9;
  }

  :global(#project-page.ready) .project-heading {
    opacity: 0;
    transform: translateY(20px);
  }

  :global(#project-page.ready) .project-heading:global(.in) {
    opacity: 1;
    transform: translateY(0);
    transition:
      opacity 0.6s var(--ease-out) 0.1s,
      transform 0.6s var(--ease-out) 0.1s;
  }

  .hero-media,
  .gallery-media {
    position: relative;
    overflow: hidden;
    border-radius: 7px;
    background: #eee;
  }

  .hero-media {
    width: 100%;
    aspect-ratio: var(--media-aspect);
  }

  .hero-media img,
  .gallery-media img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  :global(#project-page.ready) .hero-media img,
  :global(#project-page.ready) .gallery-media img {
    opacity: 0;
    translate: 0 25px;
  }

  :global(#project-page.ready) .hero-media:global(.in) img,
  :global(#project-page.ready) .gallery-media:global(.in) img {
    opacity: 1;
    translate: 0 0;
    transition:
      opacity 0.5s cubic-bezier(0.33, 1, 0.68, 1) var(--image-delay, 150ms),
      translate 0.5s cubic-bezier(0.33, 1, 0.68, 1) var(--image-delay, 150ms);
  }

  :global(#project-page.ready) .hero-media,
  :global(#project-page.ready) .gallery-media {
    --image-delay: 150ms;
  }

  :global(#project-page.ready) .hero-media:global(.early),
  :global(#project-page.ready) .gallery-media:global(.early) {
    --image-delay: 650ms;
  }

  .overview-card {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin-top: 10px;
    padding: 40px;
    border-radius: 7px;
    background: #111;
    color: rgba(255, 255, 255, 0.88);
  }

  .section-label {
    color: #8a8a8a;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.08em;
    line-height: 1.2;
    text-transform: uppercase;
  }

  .overview-card .section-label {
    color: rgba(255, 255, 255, 0.5);
  }

  .paragraphs {
    font-size: 21px;
    font-weight: 400;
    letter-spacing: -0.01em;
    line-height: 1.4;
  }

  .paragraphs p + p {
    margin-top: 24px;
  }

  .details {
    margin: 40px 0 0;
    padding: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
  }

  .detail-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 10px;
    padding: 6px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }

  .detail-row dt {
    font-size: 21px;
    font-weight: 400;
    letter-spacing: -0.01em;
    line-height: 1.4;
  }

  .detail-row dd {
    margin: 0;
    color: rgba(255, 255, 255, 0.88);
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.08em;
    line-height: 1.4;
    text-align: right;
    text-transform: uppercase;
    overflow-wrap: anywhere;
  }

  .online-link {
    display: inline-block;
    margin-top: 40px;
    padding: 12px 20px;
    border-radius: 100px;
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.08em;
    line-height: 1.2;
    transition: background-color 0.2s;
  }

  .gallery {
    display: grid;
    gap: 10px;
    margin-top: 10px;
  }

  .gallery-pair {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .gallery-pair .gallery-media {
    aspect-ratio: var(--pair-aspect);
  }

  .gallery-media {
    width: 100%;
    aspect-ratio: var(--media-aspect);
  }

  .more-projects {
    margin-top: 144px;
  }

  .more-projects > .section-label {
    margin-bottom: 32px;
  }

  .more-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  :global(#project-page.gl) .hero-media,
  :global(#project-page.gl) .gallery-media {
    background: transparent;
  }

  :global(#project-page.gl) .hero-media:global(.gl-ready) img,
  :global(#project-page.gl) .gallery-media:global(.gl-ready) img {
    opacity: 0;
    translate: none;
    transition: none;
  }

  @media (hover: hover) and (pointer: fine) {
    nav a:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    .online-link:hover {
      background: rgba(255, 255, 255, 0.18);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(#project-page.ready) .project-heading {
      transform: none;
    }

    :global(#project-page.ready) .project-heading:global(.in) {
      transition: opacity 0.6s ease;
    }

    :global(#project-page.ready) .hero-media img,
    :global(#project-page.ready) .gallery-media img {
      translate: none;
    }

    :global(#project-page.ready) .hero-media:global(.in) img,
    :global(#project-page.ready) .gallery-media:global(.in) img {
      transition: opacity 0.5s ease;
    }
  }

  @media (max-width: 700px) {
    .project-heading {
      margin-top: 123px;
    }

    .overview-card {
      grid-template-columns: 1fr;
      padding: 24px;
    }

    .paragraphs,
    .detail-row dt {
      font-size: 18px;
    }

    .gallery-pair,
    .more-grid {
      grid-template-columns: 1fr;
    }

    .gallery-pair .gallery-media {
      aspect-ratio: var(--media-aspect);
    }
  }
</style>
