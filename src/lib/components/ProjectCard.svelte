<script>
  import { media } from '$lib/data/media.js';
  import { plainText } from '$lib/rich.js';

  let { project } = $props();
  let coverSource = $derived(project.caseStudy?.poster ?? project.images[0]);
  let cover = $derived.by(() => {
    const image = media[coverSource];
    return image?.card ?? image ?? { src: coverSource, width: 890, height: 676 };
  });
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
  <div class="card-caption">
    <h3>{project.name}</h3>
    <span class="card-date">_{project.date}</span>
  </div>
  <p class="visually-hidden">{plainText(project.description)}</p>
</a>

<style>
  .project-card {
    display: block;
    min-width: 0;
    color: #111;
  }

  .card-media {
    width: 100%;
    aspect-ratio: 673 / 550;
    overflow: hidden;
    border-radius: 12px;
    background: #efefef;
  }

  .card-media img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.8s var(--ease-out);
  }

  .card-caption {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;
    margin-top: 12px;
    padding: 0 12px;
  }

  .card-caption h3 {
    min-width: 0;
    color: #111;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.02em;
    line-height: 1.3;
    text-transform: uppercase;
  }

  .card-date {
    flex: none;
    color: rgba(0, 0, 0, 0.5);
    font-size: 12px;
    line-height: 1.3;
    text-align: right;
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
      transform: scale(1.03);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(#project-page.ready) .card-media,
    :global(#project-page.ready) .card-media:global(.in) {
      opacity: 1;
      transform: none;
      transition: none;
      --reveal-delay: 0ms;
    }

    .project-card:hover .card-media img,
    .project-card:focus-visible .card-media img {
      transform: none;
      transition: none;
    }
  }
</style>
