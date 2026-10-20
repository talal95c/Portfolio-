<script>
  import { media } from '$lib/data/media.js';

  let { project } = $props();
  let cover = $derived(
    media[project.images[0]] ?? {
      src: project.images[0],
      width: 890,
      height: 676,
      tone: 'light',
    }
  );
  let tags = $derived([project.date, ...(project.tags ?? [])]);
</script>

<a class="card project-card" class:dark={cover.tone === 'dark'} href="/work/{project.slug}">
  <div class="media appearance-media">
    <img
      src={cover.src}
      alt=""
      width={cover.width}
      height={cover.height}
      loading="lazy"
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
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M7 17 17 7M7 7h10v10" />
        </svg>
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M7 17 17 7M7 7h10v10" />
        </svg>
      </span>
    </div>
    <ul class="tags">
      {#each tags as tag}
        <li>{tag}</li>
      {/each}
    </ul>
  </div>
  <p class="visually-hidden">{project.description}</p>
</a>

<style>
  .card {
    position: relative;
    display: block;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    border-radius: 7px;
    background: #eee;
  }

  .media {
    position: absolute;
    inset: 0;
    overflow: hidden;
    background: #eee;
  }

  .media img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.65s cubic-bezier(0.121, 1.054, 0.525, 1);
  }

  :global(#project-page.gl) .card,
  :global(#project-page.gl) .card .media {
    background: transparent;
  }

  :global(#project-page.gl) .card .media:global(.gl-ready) img {
    opacity: 0;
    translate: none;
    transition: none;
  }

  :global(#project-page.ready) .card {
    --image-delay: 150ms;
    --overlay-delay: 450ms;
  }

  :global(#project-page.ready) .card:global(.early) {
    --image-delay: 650ms;
    --overlay-delay: 1200ms;
  }

  :global(#project-page.ready) .card .media img {
    opacity: 0;
    translate: 0 25px;
  }

  :global(#project-page.ready) .card:global(.in) .media img {
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

  .overlay::before {
    content: '';
    position: absolute;
    z-index: 0;
    top: 0;
    right: 0;
    left: 0;
    height: 120px;
    pointer-events: none;
    background: linear-gradient(rgba(250, 250, 250, 0.85), rgba(250, 250, 250, 0));
  }

  .header,
  .tags {
    position: relative;
    z-index: 1;
  }

  :global(#project-page.ready) .card .overlay {
    opacity: 0;
    transform: translateY(5px);
  }

  :global(#project-page.ready) .card:global(.in) .overlay {
    opacity: 1;
    transform: translateY(0);
    transition:
      opacity 0.5s cubic-bezier(0.12, 0.23, 0.5, 1) var(--overlay-delay),
      transform 0.5s cubic-bezier(0.12, 0.23, 0.5, 1) var(--overlay-delay);
  }

  .title {
    margin: 0;
    color: #080808;
    font-size: 24px;
    font-weight: 500;
    letter-spacing: -0.01em;
    line-height: 1.2;
  }

  .card.dark .title {
    color: #fff;
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
    box-shadow: inset 0 0 0 1px rgba(8, 8, 8, 0.06);
  }

  .card.dark .arrow {
    background: rgba(0, 0, 0, 0.25);
    color: #fff;
    box-shadow: none;
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
    box-shadow: inset 0 0 0 1px rgba(8, 8, 8, 0.06);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.06em;
    line-height: 1;
    text-transform: uppercase;
  }

  .card.dark .tags li {
    background: rgba(0, 0, 0, 0.25);
    color: #fff;
    box-shadow: none;
  }

  .card.dark .overlay::before {
    background: linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0));
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
    :global(#project-page.ready) .card {
      --image-delay: 0ms;
      --overlay-delay: 0ms;
    }

    :global(#project-page.ready) .card .media img {
      translate: none;
    }

    :global(#project-page.ready) .card:global(.in) .media img {
      transition: opacity 0.5s ease;
    }

    :global(#project-page.ready) .card .overlay {
      transform: none;
    }

    :global(#project-page.ready) .card:global(.in) .overlay {
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
    .overlay {
      padding: 20px;
    }

    .tags {
      flex-wrap: nowrap;
    }

    .tags li:nth-child(n + 3) {
      display: none;
    }
  }
</style>
