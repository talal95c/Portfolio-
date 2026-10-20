<script>
  import { onMount } from 'svelte';

  const colors = ['#0000000d', '#00000026', '#0000004d', '#00000080', '#080808'];
  const day = 24 * 60 * 60 * 1000;

  let { activity } = $props();
  let section;
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
    for (
      let date = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1));
      date < last;
      date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1))
    ) {
      const firstSunday = new Date(date);
      firstSunday.setUTCDate(firstSunday.getUTCDate() + ((7 - firstSunday.getUTCDay()) % 7));
      while (firstSunday < start) firstSunday.setUTCDate(firstSunday.getUTCDate() + 7);
      const week = Math.floor((firstSunday.getTime() - start.getTime()) / (7 * day));
      if (week < 53) months.push({ week, label: monthLabel(date) });
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
      <div class="calendar" role="presentation">
        <div class="months" aria-hidden="true">
          {#each calendar.months as month (month.week)}
            <span class="month" style={`grid-column: ${month.week + 1}`}>{month.label}</span>
          {/each}
        </div>
        <div class="weeks" role="rowgroup">
          {#each calendar.weeks as week, weekIndex (weekIndex)}
            <div class="week" role="row">
              {#each week as cell, dayIndex (dayIndex)}
                {#if cell}
                  <span
                    class="cell"
                    role="gridcell"
                    style={`--cell-color:${colors[cell.level] ?? colors[0]}`}
                    title={cell.count === null
                      ? cell.date
                      : `${cell.count} contribution${cell.count === 1 ? '' : 's'} on ${cell.date}`}
                    aria-label={cell.count === null
                      ? cell.date
                      : `${cell.count} contribution${cell.count === 1 ? '' : 's'} on ${cell.date}`}
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
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scrollbar-color: #00000026 transparent;
    scrollbar-width: thin;
  }

  .calendar {
    width: max-content;
  }

  .months,
  .weeks {
    column-gap: 3px;
    grid-template-columns: repeat(53, 11px);
    display: grid;
  }

  .months {
    min-height: 16px;
    align-items: end;
    color: #5b5864;
    font-size: 12px;
    line-height: 1;
  }

  .month {
    white-space: nowrap;
    transform: translateX(5px);
  }

  .weeks {
    margin-top: 7px;
  }

  .week {
    grid-template-rows: repeat(7, 11px);
    row-gap: 3px;
    display: grid;
  }

  .cell,
  .legend-cell {
    width: 11px;
    height: 11px;
    background: var(--cell-color);
    border-radius: 3px;
    display: block;
  }

  .activity-meta {
    margin-top: 24px;
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
