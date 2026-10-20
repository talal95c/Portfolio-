<script>
  import { onMount } from 'svelte';
  import { projects } from '$lib/data/projects.js';

  let section;

  onMount(() => {
    const cards = [...section.querySelectorAll('.card')];
    const mountedAt = performance.now();
    let distortion = null;
    let destroyed = false;
    let loading = false;

    section.classList.add('ready');

    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const card = entry.target;
          if (card.classList.contains('in')) continue;
          const early = performance.now() - mountedAt <= 120;
          const delay = early ? 650 : 150;
          card.classList.toggle('early', early);
          card.dataset.appearAt = String(performance.now() + delay);
          card.classList.add('in');
          revealObserver.unobserve(card);
        }
      },
      { rootMargin: '25% 0px' }
    );

    let revealFrame = requestAnimationFrame(() => {
      revealFrame = requestAnimationFrame(() => {
        revealFrame = 0;
        if (!destroyed) cards.forEach((card) => revealObserver.observe(card));
      });
    });

    const coarsePointer = matchMedia('(pointer: coarse)');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

    function eligible() {
      return !coarsePointer.matches && !reducedMotion.matches && innerWidth > 700;
    }

    async function updateDistortion() {
      if (!eligible()) {
        distortion?.dispose();
        distortion = null;
        section.classList.remove('gl');
        return;
      }
      if (distortion || loading) return;
      loading = true;
      try {
        const { createViewportDistortion } = await import('$lib/three/viewport-distortion.js');
        if (destroyed || !eligible()) return;
        distortion = createViewportDistortion({
          items: cards.map((card) => ({
            card,
            media: card.querySelector('.media'),
            img: card.querySelector('img'),
          })),
        });
      } catch {
        section.classList.remove('gl');
      } finally {
        loading = false;
      }
    }

    const onEnvironmentChange = () => updateDistortion();
    window.addEventListener('resize', onEnvironmentChange);
    coarsePointer.addEventListener('change', onEnvironmentChange);
    reducedMotion.addEventListener('change', onEnvironmentChange);
    updateDistortion();

    return () => {
      destroyed = true;
      if (revealFrame) cancelAnimationFrame(revealFrame);
      revealObserver.disconnect();
      window.removeEventListener('resize', onEnvironmentChange);
      coarsePointer.removeEventListener('change', onEnvironmentChange);
      reducedMotion.removeEventListener('change', onEnvironmentChange);
      distortion?.dispose();
      section.classList.remove('ready', 'gl');
    };
  });
</script>

<section bind:this={section} id="work" aria-label="Selected work">
  {#each projects as project}
    <a class="card" href="/work/{project.slug}">
      <div class="media">
        <img
          src={project.images[0]}
          alt=""
          width="890"
          height="676"
          decoding="async"
        />
      </div>
      <div class="overlay">
        <div class="header">
          <h2 class="title">
            <span class="roll">
              <span>{project.name}</span>
              <span aria-hidden="true">{project.name}</span>
            </span>
          </h2>
          <span class="arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7 17 17 7M7 7h10v10" />
            </svg>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7 17 17 7M7 7h10v10" />
            </svg>
          </span>
        </div>
        <ul class="tags">
          {#each [project.date, ...project.tags] as tag}
            <li>{tag}</li>
          {/each}
        </ul>
      </div>
      <p class="visually-hidden">{project.description}</p>
    </a>
  {/each}
</section>

<style>
  section {
    position: relative;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    padding: 104px var(--page-gutter) 136px;
    scroll-margin-top: 48px;
  }

  .card {
    position: relative;
    aspect-ratio: 890 / 676;
    overflow: hidden;
    border-radius: 7px;
    background: #eee;
  }

  .media {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .media img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.65s cubic-bezier(0.121, 1.054, 0.525, 1);
  }

  :global(#work.ready) .card {
    --image-delay: 150ms;
    --overlay-delay: 450ms;
  }

  :global(#work.ready) .card:global(.early) {
    --image-delay: 650ms;
    --overlay-delay: 1200ms;
  }

  :global(#work.ready) .card .media img {
    opacity: 0;
    translate: 0 25px;
  }

  :global(#work.ready) .card:global(.in) .media img {
    opacity: 1;
    translate: 0 0;
    transition:
      opacity 0.5s cubic-bezier(0.33, 1, 0.68, 1) var(--image-delay),
      translate 0.5s cubic-bezier(0.33, 1, 0.68, 1) var(--image-delay),
      transform 0.65s cubic-bezier(0.121, 1.054, 0.525, 1);
  }

  .overlay {
    position: absolute;
    z-index: 2;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 30px;
    color: #080808;
  }

  :global(#work.ready) .card .overlay {
    opacity: 0;
    transform: translateY(5px);
  }

  :global(#work.ready) .card:global(.in) .overlay {
    opacity: 1;
    transform: translateY(0);
    transition:
      opacity 0.5s cubic-bezier(0.12, 0.23, 0.5, 1) var(--overlay-delay),
      transform 0.5s cubic-bezier(0.12, 0.23, 0.5, 1) var(--overlay-delay);
  }

  :global(#work.gl .card.gl-ready .media img) {
    opacity: 0 !important;
    translate: none;
    transition: none;
  }

  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .title {
    margin: 0;
    color: #080808;
    font-size: 24px;
    font-weight: 500;
    letter-spacing: -0.01em;
    line-height: 1.2;
  }

  .roll {
    display: block;
    height: 1.2em;
    overflow: clip;
  }

  .roll > span {
    display: block;
    transform: translateY(0);
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .roll > span + span {
    transform: translateY(0);
  }

  .arrow {
    position: relative;
    flex: 0 0 34px;
    width: 34px;
    height: 34px;
    overflow: hidden;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.55);
    -webkit-backdrop-filter: blur(15px) saturate(1.25);
    backdrop-filter: blur(15px) saturate(1.25);
    color: #080808;
  }

  .arrow svg {
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    margin: -12px 0 0 -12px;
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .arrow svg + svg {
    transform: translate(-34px, 34px);
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .tags li {
    padding: 6px 10px;
    border-radius: 100px;
    background: rgba(255, 255, 255, 0.55);
    -webkit-backdrop-filter: blur(15px) saturate(1.25);
    backdrop-filter: blur(15px) saturate(1.25);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.06em;
    line-height: 1;
    text-transform: uppercase;
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  @media (hover: hover) and (pointer: fine) {
    .card:hover .media img {
      transform: scale(1.06);
    }

    .card:hover .roll > span,
    .card:focus-visible .roll > span {
      transform: translateY(-100%);
      transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .card:hover .arrow svg:first-child,
    .card:focus-visible .arrow svg:first-child {
      transform: translate(34px, -34px);
    }

    .card:hover .arrow svg + svg,
    .card:focus-visible .arrow svg + svg {
      transform: translate(0, 0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(#work.ready) .card {
      --image-delay: 0ms;
      --overlay-delay: 0ms;
    }

    :global(#work.ready) .card .media img {
      translate: none;
    }

    :global(#work.ready) .card:global(.in) .media img {
      transition: opacity 0.5s ease;
    }

    :global(#work.ready) .card .overlay {
      transform: none;
    }

    :global(#work.ready) .card:global(.in) .overlay {
      transition: opacity 0.5s ease;
    }

    .card:hover .media img,
    .card:focus-visible .media img,
    .card:hover .roll > span,
    .card:focus-visible .roll > span,
    .card:hover .arrow svg,
    .card:focus-visible .arrow svg {
      transform: none;
      transition: none;
    }
  }

  @media (max-width: 700px) {
    section {
      grid-template-columns: minmax(0, 1fr);
    }

    .overlay {
      padding: 20px;
    }
  }
</style>
