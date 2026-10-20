<script>
  import { onMount } from 'svelte';

  const colors = ['#0000000d', '#00000026', '#0000004d', '#00000080', '#080808'];
  const day = 24 * 60 * 60 * 1000;

  let { activity: initial } = $props();
  let live = $state(null);
  let activity = $derived(live ?? initial);
  let tip = $state(null);
  let section;
  let calendarEl;

  const formatDate = (date) =>
    new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(
      new Date(`${date}T00:00:00Z`)
    );

  const describe = (cell) =>
    cell.count === null
      ? formatDate(cell.date)
      : `${cell.count === 0 ? 'No' : cell.count} contribution${cell.count === 1 ? '' : 's'} on ${formatDate(cell.date)}`;

  function showTip(event) {
    const cell = event.target.closest?.('.cell[data-tip]');
    if (!cell) return;
    const box = calendarEl.getBoundingClientRect();
    const rect = cell.getBoundingClientRect();
    const x = rect.left - box.left + rect.width / 2;
    const shift = x < 110 ? '-12px' : x > box.width - 110 ? 'calc(-100% + 12px)' : '-50%';
    tip = { text: cell.dataset.tip, x, y: rect.top - box.top, shift };
  }

  async function refresh() {
    try {
      const response = await fetch('https://github-contributions-api.jogruber.de/v4/talal95c?y=last', { cache: 'no-store' });
      if (!response.ok) return;
      const data = await response.json();
      if (!Array.isArray(data.contributions) || !data.contributions.length) return;
      live = {
        total: data.total?.lastYear ?? data.contributions.reduce((sum, entry) => sum + entry.count, 0),
        contributions: data.contributions.map(({ date, level, count }) => ({ date, level, count }))
      };
    } catch {
      // keep the build-time snapshot
    }
  }
  let scrollWindow;
  let visible = $state(false);

  let calendar = $derived.by(() => {
    const entries = activity.contributions ?? [];
    if (!entries.length) return { weeks: [], months: [] };

    const first = entries.reduce(
      (earliest, entry) => (entry.date < earliest ? entry.date : earliest),
      entries[0].date
    );
    const start = new Date(`${first}T00:00:00Z`);
    start.setUTCDate(start.getUTCDate() - start.getUTCDay());

    const byDate = new Map(entries.map((entry) => [entry.date, entry]));
    const weeks = Array.from({ length: 53 }, (_, weekIndex) =>
      Array.from({ length: 7 }, (_, dayIndex) => {
        const date = new Date(start.getTime() + (weekIndex * 7 + dayIndex) * day);
        return byDate.get(date.toISOString().slice(0, 10)) ?? null;
      })
    );

    const monthLabel = (date) =>
      new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' }).format(date);
    const last = new Date(start.getTime() + 53 * 7 * day);
    const months = [];
    let previousWeek = -3;
    for (
      let date = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1));
      date < last;
      date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1))
    ) {
      const firstSunday = new Date(date);
      firstSunday.setUTCDate(firstSunday.getUTCDate() + ((7 - firstSunday.getUTCDay()) % 7));
      while (firstSunday < start) firstSunday.setUTCDate(firstSunday.getUTCDate() + 7);
      const week = Math.floor((firstSunday.getTime() - start.getTime()) / (7 * day));
      if (week < 53 && week - previousWeek >= 3) {
        months.push({ week, label: monthLabel(date) });
        previousWeek = week;
      }
    }

    return { weeks, months };
  });

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible = true;
          observer.unobserve(section);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(section);
    refresh();

    if (matchMedia('(max-width: 700px)').matches && scrollWindow) {
      scrollWindow.scrollLeft = scrollWindow.scrollWidth;
    }

    return () => observer.disconnect();
  });
</script>

<section bind:this={section} class:visible aria-labelledby="github-title">
  <a
    class="activity-link"
    href="https://github.com/talal95c"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="View Talal Aamir's GitHub profile and contribution activity"
  >
    <h2 id="github-title">GitHub</h2>
    <div
      class="chart-scroll"
      bind:this={scrollWindow}
      tabindex="0"
      role="grid"
      aria-readonly="true"
      aria-label="Contribution heatmap"
    >
      <div class="calendar" role="presentation" bind:this={calendarEl}>
        <div class="months" aria-hidden="true">
          {#each calendar.months as month (month.week)}
            <span class="month" style={`grid-column: ${month.week + 1}`}>{month.label}</span>
          {/each}
        </div>
        <div class="weeks" role="rowgroup" onpointerover={showTip} onpointerleave={() => (tip = null)}>
          {#each calendar.weeks as week, weekIndex (weekIndex)}
            <div class="week" role="row">
              {#each week as cell, dayIndex (dayIndex)}
                {#if cell}
                  <span
                    class="cell"
                    role="gridcell"
                    style={`--cell-color:${colors[cell.level] ?? colors[0]}`}
                    data-tip={describe(cell)}
                    aria-label={describe(cell)}
                  ></span>
                {:else}
                  <span
                    class="cell empty"
                    role="gridcell"
                    aria-label="No contribution data"
                    style={`--cell-color:${colors[0]}`}
                  ></span>
                {/if}
              {/each}
            </div>
          {/each}
        </div>
        {#if tip}
          <span class="tip" style={`left:${tip.x}px;top:${tip.y}px;--shift:${tip.shift}`} aria-hidden="true">{tip.text}</span>
        {/if}
      </div>
    </div>
    <div class="activity-meta">
      <p>{activity.total.toLocaleString('en-US')} contributions in the last year</p>
      <div class="legend" aria-label="Contribution levels from less to more">
        <span>Less</span>
        {#each colors as color, index (index)}
          <span class="legend-cell" style={`--cell-color:${color}`}></span>
        {/each}
        <span>More</span>
      </div>
    </div>
  </a>
</section>

<style>
  section {
    border-top: 1px solid #0000001a;
    padding: 64px var(--page-gutter) 88px;
    opacity: 0;
    transform: translateY(12px);
    transition:
      opacity 0.55s var(--ease-out),
      transform 0.55s var(--ease-out);
  }

  section.visible {
    opacity: 1;
    transform: none;
  }

  .activity-link {
    color: inherit;
    text-decoration: none;
    display: block;
  }

  .activity-link:focus-visible {
    outline: 2px solid #080808;
    outline-offset: 4px;
  }

  h2 {
    margin-bottom: 36px;
    font-size: 48px;
    font-weight: 400;
    line-height: 1.1;
  }

  .chart-scroll {
    padding-top: 36px;
    margin-top: -36px;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scrollbar-color: #00000026 transparent;
    scrollbar-width: thin;
  }

  .calendar {
    position: relative;
    width: 100%;
    min-width: 738px;
  }

  .months,
  .weeks {
    gap: 4px;
    grid-template-columns: repeat(53, minmax(10px, 1fr));
    display: grid;
  }

  .months {
    min-height: 16px;
    grid-auto-flow: column;
    align-items: end;
    color: #5b5864;
    font-size: 12px;
    line-height: 1;
  }

  .month {
    white-space: nowrap;
  }

  .weeks {
    margin-top: 7px;
    grid-template-rows: repeat(7, minmax(10px, 1fr));
    grid-auto-flow: column;
  }

  .week {
    display: contents;
  }

  .cell {
    width: 100%;
    aspect-ratio: 1;
    background: var(--cell-color);
    border-radius: 3px;
    display: block;
    transition:
      transform 0.25s cubic-bezier(0.34, 1.7, 0.5, 1),
      box-shadow 0.15s;
  }

  @media (hover: hover) and (pointer: fine) {
    .cell[data-tip]:hover {
      transform: scale(1.35);
      box-shadow:
        0 0 0 1.5px #fff,
        0 2px 6px #00000033;
      position: relative;
      z-index: 1;
    }
  }

  .tip {
    pointer-events: none;
    white-space: nowrap;
    color: #fff;
    background: #080808;
    border-radius: 6px;
    padding: 6px 9px;
    font-size: 12px;
    line-height: 1;
    position: absolute;
    z-index: 2;
    transform: translate(var(--shift), calc(-100% - 8px));
    animation: tip-in 0.18s var(--ease-out);
  }

  @keyframes tip-in {
    from {
      opacity: 0;
      transform: translate(var(--shift), calc(-100% - 4px));
    }
  }

  .legend-cell {
    width: 11px;
    height: 11px;
    background: var(--cell-color);
    border-radius: 3px;
    display: block;
  }

  .activity-meta {
    margin-top: 24px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 16px 24px;
  }

  .activity-meta p,
  .legend {
    color: #5b5864;
    font-size: 14px;
    line-height: 1.4;
  }

  .legend {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  @media (width <= 700px) {
    section {
      padding: 56px 24px 64px;
    }

    h2 {
      margin-bottom: 28px;
      font-size: 42px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    section {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
</style>
