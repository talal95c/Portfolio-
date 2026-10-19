<script>
  import { onMount } from 'svelte';

  let { sections, variant = 'rail' } = $props();
  let currentPosition = $state(-1);
  let direction = $state(1);
  let sectionProgress = $state(0);
  let atEnd = $state(false);
  let isOpen = $state(false);
  let maxLabelWidth = $state();
  let root = $state();
  let label = $state();
  let labels = [];
  let previousLabelWidth = 0;
  let animationFrame;
  const current = $derived(Math.floor(currentPosition));
  const progress = $derived(Math.max(0, currentPosition) / (sections.length - 1));
  const visible = $derived(currentPosition >= 0 && !atEnd);

  function measureLabel() {
    if (label) maxLabelWidth = Math.max(label.offsetWidth, previousLabelWidth);
  }

  function labelTransition(node, { from }) {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    return {
      duration: reduced ? 150 : 380,
      easing: (value) => (value - 1) ** 3 + 1,
      css: (value) =>
        `opacity:${value};transform:translateY(${reduced ? 0 : (1 - value) * 100 * from}%)`
    };
  }

  function navigateTo(event, id) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    isOpen = false;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(id).scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    history.replaceState(history.state, '', `#${id}`);
  }

  function handleDismiss(event) {
    if (
      isOpen &&
      (event.key === 'Escape' || (event.type === 'pointerdown' && !root.contains(event.target)))
    ) {
      isOpen = false;
    }
  }

  onMount(() => {
    document.fonts.ready.then(() => {
      previousLabelWidth = labels
        .filter(Boolean)
        .map((element) => element.offsetWidth)
        .sort((first, second) => second - first)[1] ?? labels[0]?.offsetWidth ?? 0;
      measureLabel();
    });

    const update = () => {
      animationFrame = undefined;
      const threshold = scrollY + innerHeight / 3;
      const positions = sections.map(
        ({ id }) => document.getElementById(id).getBoundingClientRect().top + scrollY
      );
      let nextPosition = -1;

      positions.forEach((position, index) => {
        if (threshold < position) return;
        const next = positions[index + 1];
        nextPosition =
          next === undefined
            ? index
            : index + Math.min(1, (threshold - position) / (next - position));
      });

      if (Math.floor(nextPosition) !== Math.floor(currentPosition)) {
        direction = nextPosition > currentPosition ? 1 : -1;
      }
      currentPosition = nextPosition;

      const lastSection = document
        .getElementById(sections.at(-1).id)
        .getBoundingClientRect();
      sectionProgress =
        nextPosition < 0
          ? 0
          : nextPosition < sections.length - 1
            ? nextPosition % 1
            : Math.min(
                1,
                Math.max(0, (innerHeight / 3 - lastSection.top) / lastSection.height)
              );
      atEnd = lastSection.bottom < innerHeight * 0.6;
      if (!visible) isOpen = false;
    };
    const scheduleUpdate = () => {
      if (animationFrame === undefined) animationFrame = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('keydown', handleDismiss);
    window.addEventListener('pointerdown', handleDismiss);
    update();

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('keydown', handleDismiss);
      window.removeEventListener('pointerdown', handleDismiss);
      if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
    };
  });
</script>

{#if variant === 'rail'}
  <nav
    class="timeline svelte-1yxzt12"
    aria-label="In this case study"
    style={`--row:32px;--span:${sections.length - 1};--progress:${progress}`}
  >
    <span class="track svelte-1yxzt12" aria-hidden="true"><span class="fill svelte-1yxzt12"></span></span>
    <ol class="svelte-1yxzt12">
      {#each sections as section, index}
        <li class="svelte-1yxzt12" class:reached={index <= current} class:current={index === current}>
          <a
            class="svelte-1yxzt12"
            href={`#${section.id}`}
            aria-current={index === current ? 'location' : undefined}
            onclick={(event) => navigateTo(event, section.id)}
          >
            <span class="dot svelte-1yxzt12" aria-hidden="true"></span>
            <span class="number svelte-1yxzt12">{section.number}</span>
            {section.label}
          </a>
        </li>
      {/each}
    </ol>
  </nav>
{:else}
  <div
    class="pill svelte-1yxzt12"
    class:visible
    class:open={isOpen}
    bind:this={root}
    inert={!visible}
  >
    <div class="panel svelte-1yxzt12" id="timeline-panel" inert={!isOpen}>
      <nav
        class="timeline svelte-1yxzt12"
        aria-label="In this case study"
        style={`--row:32px;--span:${sections.length - 1};--progress:${progress}`}
      >
        <span class="track svelte-1yxzt12" aria-hidden="true"><span class="fill svelte-1yxzt12"></span></span>
        <ol class="svelte-1yxzt12">
          {#each sections as section, index}
            <li class="svelte-1yxzt12" class:reached={index <= current} class:current={index === current}>
              <a
                class="svelte-1yxzt12"
                href={`#${section.id}`}
                aria-current={index === current ? 'location' : undefined}
                onclick={(event) => navigateTo(event, section.id)}
              >
                <span class="dot svelte-1yxzt12" aria-hidden="true"></span>
                <span class="number svelte-1yxzt12">{section.number}</span>
                {section.label}
              </a>
            </li>
          {/each}
        </ol>
      </nav>
    </div>
    <button
      type="button"
      aria-controls="timeline-panel"
      aria-expanded={isOpen}
      class="svelte-1yxzt12"
      onclick={() => (isOpen = !isOpen)}
    >
      <span class="label svelte-1yxzt12" style:width={maxLabelWidth === undefined ? null : `${maxLabelWidth}px`}>
        {#key current}
          <span class="slot svelte-1yxzt12" in:labelTransition={{ from: direction }} out:labelTransition={{ from: -direction }}>
            <span class="number svelte-1yxzt12">{sections[Math.max(0, current)].number}</span>
            {sections[Math.max(0, current)].label}
          </span>
        {/key}
      </span>
      <span class="bar svelte-1yxzt12" aria-hidden="true">
        <span class="svelte-1yxzt12" style:transform={`scaleX(${sectionProgress})`}></span>
      </span>
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        class="svelte-1yxzt12"
      ><path d="m6 15 6-6 6 6"></path></svg>
      <span class="visually-hidden svelte-1yxzt12">— show all sections</span>
      <span class="sizers svelte-1yxzt12" aria-hidden="true">
        {#each sections as section, index}
          <span class="svelte-1yxzt12" bind:this={labels[index]}>
            <span class="number svelte-1yxzt12">{section.number}</span>{section.label}
          </span>
        {/each}
      </span>
    </button>
  </div>
{/if}
