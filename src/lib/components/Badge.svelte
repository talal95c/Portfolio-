<script>
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import { badgeConfig } from '$lib/config/badge.js';

  const noFilter = $derived(!(browser && page.url.searchParams.has('filter')));
  const artwork = $derived(noFilter ? '/assets/badge_nofilter.png' : '/assets/badge2.png');
  const still = $derived(noFilter ? '/assets/badge-still.webp' : '/assets/badge-still-filter.webp');
  const config = $derived(
    noFilter
      ? {
          ...badgeConfig,
          material: { ...badgeConfig.material, unlitArtwork: true, wear: 0.2 },
          lighting: { ...badgeConfig.lighting, reflections: 0.9 },
          filters: { ...badgeConfig.filters, enabled: false },
          plotter: { ...badgeConfig.plotter, enabled: false }
        }
      : badgeConfig
  );

  let canvas;
  let sceneState = $state('loading');
  let ready = $state(false);

  $effect(() => {
    const artworkUrl = artwork;
    let disposed = false;
    let scene;
    let idle;
    let frame;
    ready = false;

    const start = () => {
      idle = (window.requestIdleCallback ?? ((cb) => setTimeout(cb, 1)))(
        () => {
          import('$lib/three/badge-scene.js')
            .then(({ createBadgeScene }) =>
              disposed
                ? null
                : createBadgeScene(
                    canvas,
                    () => config,
                    (s) => {
                      if (!disposed) sceneState = s;
                    },
                    artworkUrl
                  )
            )
            .then((created) => {
              if (disposed) return created?.dispose();
              scene = created;
              frame = requestAnimationFrame(() => (frame = requestAnimationFrame(() => (ready = true))));
            })
            .catch((error) => {
              if (!disposed) {
                sceneState = 'error';
                console.error('Badge could not start:', error);
              }
            });
        },
        { timeout: 1500 }
      );
    };

    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });

    return () => {
      disposed = true;
      window.removeEventListener('load', start);
      if (idle !== undefined) (window.cancelIdleCallback ?? clearTimeout)(idle);
      cancelAnimationFrame(frame);
      scene?.dispose();
    };
  });
</script>

<div class="badge svelte-dtbgkf"><img class="still svelte-dtbgkf" class:hidden={ready} src={still} alt={ready ? '' : 'Talal Aamir badge'} width="704" height="1768" fetchpriority="high" decoding="async" /> <canvas bind:this={canvas} class="svelte-dtbgkf" class:hidden={!ready} data-state={sceneState} aria-label="Talal Aamir’s interactive badge. Drag to move it."></canvas></div>
