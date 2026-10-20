<script>
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import { projects } from '$lib/data/projects.js';

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

<section bind:this={section} id="work" aria-label="Selected work" class="svelte-17ndl8v" class:has-active={active !== null} class:plotter-ready={plotterReady} class:no-filter={noFilter}>{#each projects as project, index}<a class="project svelte-17ndl8v" class:active={active === index} class:muted={active !== null && active !== index} href="/work/{project.slug}" onpointerenter={() => hover(index)} onpointerleave={() => (hovered = null)} onfocus={() => (focused = index)} onblur={() => (focused = null)}><div class="label svelte-17ndl8v"><div class="copy svelte-17ndl8v"><h2 data-line="" class="svelte-17ndl8v">{project.name}</h2> <p data-line="" class="svelte-17ndl8v">{project.description}</p> <p class="date svelte-17ndl8v" data-line="">{project.date}</p></div> <canvas aria-hidden="true" class="svelte-17ndl8v"></canvas></div> <div class="previews svelte-17ndl8v" aria-hidden="true">{#each project.images as src, n}<img class="preview preview-{n} svelte-17ndl8v" {src} alt="" width="890" height="676" />{/each}</div></a>{/each}</section>
