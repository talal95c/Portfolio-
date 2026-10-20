<script>
  let { open = $bindable(false) } = $props();

  const stats = [
    { value: '4', label: 'hackathon podiums', tint: '#e8f1fb' },
    { value: '14.8K', label: 'followers on TikTok', tint: '#fdeee6' },
    { value: 'Top 20%', label: 'in maths, prépa', tint: '#eeebfa' },
    { value: '50+', label: 'outreach rounds', tint: '#e9f6ee' }
  ];

  const timeline = [
    {
      title: 'Experience',
      items: [
        { years: '2026 – 2029', company: 'Safran Aircraft Engines', role: 'AI Engineer', emoji: 'plane', note: 'Apprenticeship. Designing and shipping agentic AI that automates sales administration, wired into real business tools and data.' },
        { years: 'Now', company: 'Intellectuel Athlète', role: 'Content creator', emoji: 'brain', note: 'Personal development and tech content, 2.8M views on TikTok.' }
      ]
    },
    {
      title: 'Education',
      items: [
        { years: '2026 – 2029', company: 'CY Tech, Paris', role: 'Engineering cycle', emoji: 'laptop', note: 'Master of Engineering in Computer Science.' },
        { years: '2024 – 2026', company: 'CY Tech, Paris', role: 'Integrated prépa', emoji: 'ruler', note: 'Two-year preparatory cycle in maths and physics, top 20% in mathematics.' }
      ]
    },
    {
      title: 'Awards',
      items: [
        { years: '2026', company: 'Mistral × Stanford Law', role: 'Winner', emoji: 'trophy', note: 'Legible, plus the Legora track.' },
        { years: '2026', company: 'IBM × Airbus', role: 'Top Score', emoji: 'gold' },
        { years: '2026', company: 'French National Assembly', role: 'Top Project', emoji: 'medal' },
        { years: '2026', company: 'Anthropic × Hugging Face', role: 'Top 20 / 300', emoji: 'medal' }
      ]
    },
    {
      title: 'Certifications',
      items: [
        { years: 'Harvard', company: 'CS50', role: 'Computer Science', emoji: 'cap' },
        { years: 'Anthropic', company: 'Model Context Protocol', role: 'MCP', emoji: 'plug' }
      ]
    }
  ];

  let dialog;
  let shown = $state(false);

  $effect(() => {
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = 'hidden';
      requestAnimationFrame(() => (shown = true));
    } else if (!open && dialog.open) {
      shown = false;
      let done = false;
      const finish = () => {
        if (done || open) return;
        done = true;
        dialog.close();
        document.documentElement.style.overflow = '';
      };
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return finish();
      dialog.querySelector('.panel').addEventListener('transitionend', finish, { once: true });
      setTimeout(finish, 600);
    }
  });

  function cancel(event) {
    event.preventDefault();
    open = false;
  }
</script>

<dialog bind:this={dialog} aria-labelledby="about-title" class="svelte-7hpc9t" class:shown oncancel={cancel} onclick={(event) => event.target === dialog && (open = false)}>
  <div class="panel svelte-7hpc9t">
    <header class="svelte-7hpc9t">
      <h2 id="about-title" class="svelte-7hpc9t">About</h2>
      <button type="button" class="close svelte-7hpc9t" aria-label="Close" onclick={() => (open = false)}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"></path></svg>
      </button>
    </header>

    <div class="block" style="--i: 0">
      <p class="lead">AI engineer at <strong>Safran Aircraft Engines</strong> and engineering student at <strong>CY Tech, Paris</strong>. I learn by shipping.</p>
      <div class="bio">
        <p>At Safran, I design and ship agentic AI that automates sales administration end to end, from the model to the tools teams already use.</p>
        <p><strong>Legible</strong>, my legal AI harness, won the Mistral × Stanford Law School hackathon and its Legora track. Off the keyboard, I create content as <strong>Intellectuel Athlète</strong>, compete in jiu-jitsu and grappling, and volunteer with Au cœur de la précarité.</p>
      </div>
    </div>

    <ul class="stats block" style="--i: 1">
      {#each stats as stat (stat.label)}
        <li style={`--tint:${stat.tint}`}><span class="value">{stat.value}</span><span class="label">{stat.label}</span></li>
      {/each}
    </ul>

    <div class="headshot svelte-7hpc9t block" style="--i: 2">
      <img src="/assets/talal-hackathon.webp" alt="Talal, in white, at a hackathon, working on a laptop with a teammate." width="1200" height="800" loading="lazy" decoding="async" class="svelte-7hpc9t" />
      <img class="subject svelte-7hpc9t" src="/assets/talal-hackathon-subject.webp" alt="" width="1200" height="800" loading="lazy" decoding="async" />
    </div>

    {#each timeline as group, groupIndex (group.title)}
      <section class="block" style={`--i: ${groupIndex + 3}`} aria-labelledby={`about-${group.title.toLowerCase()}`}>
        <h3 id={`about-${group.title.toLowerCase()}`}>{group.title}</h3>
        <ol>
          {#each group.items as item (item.company + item.role)}
            <li>
              <span class="years">{item.years}</span>
              <span class="main">
                <span class="row">
                  <span class="company">{item.company}<img class="sticker" src={`/stickers/${item.emoji}.svg`} alt="" aria-hidden="true" /></span>
                  <span class="role">{item.role}</span>
                </span>
                {#if item.note}<span class="note">{item.note}</span>{/if}
              </span>
            </li>
          {/each}
        </ol>
      </section>
    {/each}
  </div>
</dialog>

<style>
  .panel {
    justify-content: flex-start !important;
    gap: 44px !important;
    width: min(600px, 100vw) !important;
    padding: 48px 64px 72px !important;
  }

  .block {
    opacity: 0;
    transform: translateY(10px);
    transition:
      opacity 0.5s var(--ease-out),
      transform 0.5s var(--ease-out);
  }

  .shown .block {
    opacity: 1;
    transform: none;
    transition-delay: calc(120ms + var(--i) * 60ms);
  }

  .lead {
    color: #080808;
    text-wrap: balance;
    font-size: 22px;
    line-height: 1.35;
    letter-spacing: -0.01em;
  }

  .lead strong,
  .bio strong {
    color: #080808;
    font-weight: 400;
  }

  .bio {
    margin-top: 20px;
  }

  .bio p {
    color: #5b5864;
    text-wrap: pretty;
    font-size: 15px;
    line-height: 1.65;
  }

  .bio p + p {
    margin-top: 12px;
  }

  .stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
  }

  .stats li {
    background: #f7f6f9;
    border-radius: 12px;
    flex-direction: column;
    gap: 4px;
    padding: 16px 18px;
    display: flex;
    transition:
      background 0.25s,
      transform 0.4s cubic-bezier(0.34, 1.7, 0.5, 1);
  }

  .value {
    color: #080808;
    font-size: 24px;
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .label {
    color: #77747f;
    font-size: 13px;
  }

  h3 {
    color: #a3a0ab;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 0 0 6px;
    font-size: 12px;
    font-weight: 400;
  }

  ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  ol li {
    grid-template-columns: 96px 1fr;
    gap: 16px;
    padding: 14px 0;
    font-size: 15px;
    line-height: 1.4;
    display: grid;
    position: relative;
    isolation: isolate;
  }

  ol li + li {
    border-top: 1px solid #f0eef3;
  }

  ol li::before {
    content: '';
    z-index: -1;
    opacity: 0;
    background: #f7f6f9;
    border-radius: 10px;
    position: absolute;
    inset: 2px -14px;
    transform: scale(0.97);
    transition:
      opacity 0.2s,
      transform 0.35s var(--ease-out);
  }

  .years {
    color: #a3a0ab;
    font-variant-numeric: tabular-nums;
    transition: color 0.2s;
  }

  .row {
    justify-content: space-between;
    gap: 12px;
    display: flex;
  }

  .company {
    color: #080808;
    position: relative;
    transition: transform 0.35s var(--ease-out);
  }

  .role {
    color: #77747f;
    text-align: right;
    white-space: nowrap;
  }

  .note {
    color: #77747f;
    text-wrap: pretty;
    margin-top: 4px;
    font-size: 14px;
    line-height: 1.5;
    display: block;
  }

  .sticker {
    pointer-events: none;
    opacity: 0;
    width: 22px;
    height: 22px;
    filter: drop-shadow(1.5px 0 0 #fff) drop-shadow(-1.5px 0 0 #fff) drop-shadow(0 1.5px 0 #fff) drop-shadow(0 -1.5px 0 #fff)
      drop-shadow(0 2px 4px #0000002e);
    position: absolute;
    bottom: calc(100% - 8px);
    left: calc(100% + 2px);
    transform-origin: 50% 100%;
    transform: translateY(6px) scale(0.3) rotate(-30deg);
    transition:
      transform 0.18s ease-in,
      opacity 0.12s ease-in;
  }

  @media (hover: hover) and (pointer: fine) {
    .stats li:hover {
      background: var(--tint);
      transform: translateY(-2px) rotate(-1deg);
    }

    ol li:hover::before {
      opacity: 1;
      transform: none;
    }

    ol li:hover .years {
      color: #080808;
    }

    ol li:hover .company {
      transform: translateX(4px);
    }

    ol li:hover .sticker {
      opacity: 1;
      transform: translateY(0) scale(1) rotate(12deg);
      transition:
        transform 0.5s cubic-bezier(0.34, 1.7, 0.5, 1),
        opacity 0.15s ease-out;
    }
  }

  @media (width <= 600px) {
    .panel {
      gap: 36px !important;
      padding: 28px 24px 48px !important;
    }

    .lead {
      font-size: 19px;
    }

    ol li {
      grid-template-columns: 80px 1fr;
      gap: 12px;
      font-size: 14px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .block,
    .shown .block {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
</style>
