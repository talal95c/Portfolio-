<script>
  import { media } from '$lib/data/media.js';
  import { plainText } from '$lib/rich.js';

  let { project } = $props();
  let cover = $derived(
    media[project.images[0]] ?? {
      src: project.images[0],
      width: 890,
      height: 676,
      tone: 'light',
    }
  );
</script>

<a class="project-card" href="/work/{project.slug}">
  <div class="card-media reveal">
    <img
      src={cover.src}
      alt=""
      width={cover.width}
      height={cover.height}
      loading="lazy"
      decoding="async"
    />
  </div>
  <div class="card-scrim"></div>
  <div class="card-content reveal">
    <h3>{project.name}</h3>
    <p>{project.tags?.[0]} · {project.date}</p>
  </div>
  <p class="visually-hidden">{plainText(project.description)}</p>
</a>

<style>
  .project-card {
    position: relative;
    display: block;
    aspect-ratio: 570 / 480;
    overflow: hidden;
    background: #eee;
    color: #fff;
  }

  .card-media {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .card-media img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.8s var(--ease-out);
  }

  .card-scrim {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.55), transparent 55%);
    pointer-events: none;
  }

  .card-content {
    position: absolute;
    z-index: 1;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 20px;
  }

  .card-content h3 {
    color: #fff;
    font-size: 36px;
    font-weight: 500;
    letter-spacing: -0.04em;
    line-height: 1.05;
  }

  .card-content p {
    margin-top: 8px;
    color: rgba(255, 255, 255, 0.75);
    font-size: 14px;
    font-weight: 400;
    line-height: 1.3;
  }

  :global(#project-page.ready) .card-media {
    opacity: 0;
    transform: translateY(24px);
    --reveal-delay: 150ms;
  }

  :global(#project-page.ready) .card-media:global(.early) {
    --reveal-delay: 650ms;
  }

  :global(#project-page.ready) .card-media:global(.in) {
    opacity: 1;
    transform: translateY(0);
    transition:
      opacity 0.7s ease-out var(--reveal-delay),
      transform 0.7s ease-out var(--reveal-delay);
  }

  :global(#project-page.ready) .card-content {
    opacity: 0;
    transform: translateY(24px);
    --reveal-delay: 450ms;
  }

  :global(#project-page.ready) .card-content:global(.early) {
    --reveal-delay: 1200ms;
  }

  :global(#project-page.ready) .card-content:global(.in) {
    opacity: 1;
    transform: translateY(0);
    transition:
      opacity 0.7s ease-out var(--reveal-delay),
      transform 0.7s ease-out var(--reveal-delay);
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
    .project-card:hover .card-media img,
    .project-card:focus-visible .card-media img {
      transform: scale(1.04);
    }
  }

  @media (max-width: 809px) {
    .card-content h3 {
      font-size: 28px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(#project-page.ready) .card-media,
    :global(#project-page.ready) .card-media:global(.in),
    :global(#project-page.ready) .card-content,
    :global(#project-page.ready) .card-content:global(.in) {
      transform: none;
      --reveal-delay: 0ms;
    }

    :global(#project-page.ready) .card-media:global(.in),
    :global(#project-page.ready) .card-content:global(.in) {
      transition: opacity 0.7s ease-out;
    }

    .project-card:hover .card-media img,
    .project-card:focus-visible .card-media img {
      transform: none;
      transition: none;
    }
  }
</style>
