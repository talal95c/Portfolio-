<script>
  import { onMount } from 'svelte';

  const values = [
    8.3, 18.5, 31.6, 85.1, 73.9, 93.3, 96.4, 100, 85.4, 82, 90.3, 80.1, 87.5,
    87.5, 94.1, 90.5
  ];
  const firstWeek = new Date(2026, 3, 27);
  const weeks = values.map((value, index) => {
    const from = new Date(
      firstWeek.getFullYear(),
      firstWeek.getMonth(),
      firstWeek.getDate() + index * 7
    );

    return {
      value,
      from,
      to: new Date(from.getFullYear(), from.getMonth(), from.getDate() + 6)
    };
  });
  const dateLabel = (date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const weekLabel = ({ from, to }) =>
    `${dateLabel(from)}–${from.getMonth() === to.getMonth() ? to.getDate() : dateLabel(to)}`;
  const xTicks = [0, 5, 10, 15];

  let chart;
  let width = $state(496);
  let selected = $state(null);
  const x = (index) => 40 + (index / (values.length - 1)) * (width - 40 - 12);
  const y = (value) => 16 + (1 - value / 100) * 176;
  const line = $derived(
    weeks.map((week, index) => `${index ? 'L' : 'M'}${x(index)},${y(week.value)}`).join('')
  );

  function selectPoint(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const index = Math.round(
      ((event.clientX - rect.left - 40) / (width - 40 - 12)) * (values.length - 1)
    );
    selected = Math.max(0, Math.min(values.length - 1, index));
  }

  onMount(() => {
    const observer = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
    });
    observer.observe(chart);
    return () => observer.disconnect();
  });
</script>

<div class="chart svelte-1u9eqru" bind:this={chart}>
  <svg
    class="svelte-1u9eqru"
    role="img"
    aria-label="Line chart: leads contacted within 24 hours rose from 8% in late April to between 80% and 100% every week from June on."
    height="220"
    width="100%"
    viewBox={`0 0 ${width} 220`}
    onpointermove={selectPoint}
    onpointerleave={() => (selected = null)}
  >
    {#each [0, 50, 100] as tick}
      <line class="grid svelte-1u9eqru" x1="40" x2={width - 12} y1={y(tick)} y2={y(tick)}></line>
      <text class="axis svelte-1u9eqru" x="32" y={y(tick)} text-anchor="end" dominant-baseline="middle">
        {tick}%
      </text>
    {/each}
    {#each xTicks as index}
      <text
        class="axis svelte-1u9eqru"
        x={x(index)}
        y="214"
        text-anchor={index === 0 ? 'start' : index === values.length - 1 ? 'end' : 'middle'}
      >{dateLabel(weeks[index].from)}</text>
    {/each}
    <path class="line svelte-1u9eqru" d={line}></path>
    {#each [0, values.length - 1] as index}
      <circle class="end svelte-1u9eqru" cx={x(index)} cy={y(values[index])} r="4"></circle>
      <text
        class="value svelte-1u9eqru"
        x={x(index) + (index ? -8 : 8)}
        y={y(values[index]) + (index ? -10 : 4)}
        text-anchor={index ? 'end' : 'start'}
      >{Math.round(values[index])}%</text>
    {/each}
    {#if selected !== null}
      <line class="crosshair svelte-1u9eqru" x1={x(selected)} x2={x(selected)} y1="16" y2="192"></line>
      <circle class="end svelte-1u9eqru" cx={x(selected)} cy={y(values[selected])} r="5"></circle>
    {/if}
  </svg>

  {#if selected !== null}
    <div
      class:flip={x(selected) > width - 120}
      class="tooltip svelte-1u9eqru"
      aria-hidden="true"
      style:left={`${x(selected)}px`}
      style:top={`${y(values[selected])}px`}
    >
      <span>Week of {weekLabel(weeks[selected])}</span>
      <strong>{Math.round(values[selected])}%</strong>
    </div>
  {/if}

  <table class="visually-hidden svelte-1u9eqru">
    <caption>Leads contacted within 24 hours, by week</caption>
    <thead>
      <tr><th scope="col">Week</th><th scope="col">Contacted within 24 hours</th></tr>
    </thead>
    <tbody>
      {#each weeks as week}
        <tr><td>{weekLabel(week)}</td><td>{Math.round(week.value)}%</td></tr>
      {/each}
    </tbody>
  </table>
</div>
