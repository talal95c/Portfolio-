<script>
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import { projects } from '$lib/data/projects.js';

  const featuredProjects = projects.filter((project) => project.featured);
  const afterMoreProjects = projects.filter((project) => project.afterMore);
  const moreImages = [
    `/work/miropolis/miropolis_cover.webp`,
    `/work/sylo/sylo_cover.webp`,
    `/work/dino-race/dino-race_cover.webp`,
  ];
  const noFilter = $derived(!(browser && page.url.searchParams.has('filter')));
  let hovered = $state(null);
  let focused = $state(null);
  const active = $derived(hovered ?? focused);
  let plotter = $state.raw(null);
  let plotterReady = $state(false);
  let section;

  $effect(() => {
    plotter?.setActive(active);
  });

  $effect(() => {
    if (noFilter) {
      plotter?.dispose();
      plotter = null;
      plotterReady = false;
      return;
    }
    let disposed = false;
    let timer;

    async function render() {
      if (matchMedia('(max-width: 700px)').matches) {
        plotter?.dispose();
        plotter = null;
        plotterReady = false;
        return;
      }
      await document.fonts.ready;
      const { renderPlotterLabels } = await import('$lib/three/plotter-labels.js');
      if (disposed) return;
      try {
        plotter?.dispose();
        plotter = renderPlotterLabels(
          [...section.querySelectorAll('.project')].map((el) => ({
            source: el.querySelector('.copy'),
            target: el.querySelector('canvas')
          }))
        );
        plotterReady = true;
      } catch (error) {
        console.warn('Plotter text unavailable:', error);
      }
    }

    const observer = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(render, 150);
    });
    observer.observe(section);
    return () => {
      disposed = true;
      clearTimeout(timer);
      observer.disconnect();
      plotter?.dispose();
    };
  });

  function hover(index) {
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) hovered = index;
  }
</script>

<section
  bind:this={section}
  id="work"
  aria-label="Selected work"
  class="svelte-17ndl8v"
  class:has-active={active !== null}
  class:plotter-ready={plotterReady}
  class:no-filter={noFilter}
>
  {#each featuredProjects as project, index}
    <a
      class="project svelte-17ndl8v"
      class:active={active === index}
      class:muted={active !== null && active !== index}
      href="/work/{project.slug}"
      onpointerenter={() => hover(index)}
      onpointerleave={() => (hovered = null)}
      onfocus={() => (focused = index)}
      onblur={() => (focused = null)}
    >
      <div class="label svelte-17ndl8v">
        <div class="copy svelte-17ndl8v">
          <h2 data-line="" class="svelte-17ndl8v">{project.name}</h2>
          <p data-line="" class="svelte-17ndl8v">{project.description}</p>
          <p class="date svelte-17ndl8v" data-line="">{project.date}</p>
        </div>
        <canvas aria-hidden="true" class="svelte-17ndl8v"></canvas>
      </div>
      <div class="previews svelte-17ndl8v" aria-hidden="true">
        {#each project.images as src, n}
          <img class="preview preview-{n} svelte-17ndl8v" {src} alt="" width="890" height="676" />
        {/each}
      </div>
    </a>
  {/each}

  <a
    class="more svelte-17ndl8v"
    href="https://github.com/talal95c?tab=repositories"
    target="_blank"
    rel="noopener noreferrer"
  >
    <div class="label svelte-17ndl8v">
      <div class="copy svelte-17ndl8v">
        <h2 data-line="" class="svelte-17ndl8v">More projects</h2>
        <p data-line="" class="svelte-17ndl8v">MiroPolis, Sylo.ai, Dino Race, Wildwater and more on GitHub.</p>
        <p class="date svelte-17ndl8v" data-line="">github.com/talal95c ↗</p>
      </div>
    </div>
    <div class="more-visual svelte-17ndl8v" aria-hidden="true">
      {#each moreImages as src, n}
        <img class="more-image more-image-{n} svelte-17ndl8v" {src} alt="" width="890" height="676" />
      {/each}
      <span class="more-pill svelte-17ndl8v">
        <svg class="github-mark svelte-17ndl8v" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#181717"
            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
          />
        </svg>
        <span>View on GitHub</span>
      </span>
    </div>
  </a>

  {#each afterMoreProjects as project, index}
    <a
      class="project svelte-17ndl8v"
      class:active={active === featuredProjects.length + index}
      class:muted={active !== null && active !== featuredProjects.length + index}
      href="/work/{project.slug}"
      onpointerenter={() => hover(featuredProjects.length + index)}
      onpointerleave={() => (hovered = null)}
      onfocus={() => (focused = featuredProjects.length + index)}
      onblur={() => (focused = null)}
    >
      <div class="label svelte-17ndl8v">
        <div class="copy svelte-17ndl8v">
          <h2 data-line="" class="svelte-17ndl8v">{project.name}</h2>
          <p data-line="" class="svelte-17ndl8v">{project.description}</p>
          <p class="date svelte-17ndl8v" data-line="">{project.date}</p>
        </div>
        <canvas aria-hidden="true" class="svelte-17ndl8v"></canvas>
      </div>
      <div class="previews svelte-17ndl8v" aria-hidden="true">
        {#each project.images as src, n}
          <img class="preview preview-{n} svelte-17ndl8v" {src} alt="" width="890" height="676" />
        {/each}
      </div>
    </a>
  {/each}
</section>
