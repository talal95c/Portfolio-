<script>
  let { open = $bindable(false) } = $props();

  const timeline = [
    {
      title: 'Experience',
      items: [
        { years: '2026 – 2029', company: 'Safran Aircraft Engines', role: 'AI Engineer', note: 'Apprenticeship. I design and ship agentic AI that automates sales administration, wiring generative models into real business tools and data.' },
        { years: 'Now', company: 'Intellectuel Athlète', role: 'Content creator', note: 'Personal development and tech content: 14.8K followers and 2.8M views on TikTok.' }
      ]
    },
    {
      title: 'Education',
      items: [
        { years: '2026 – 2029', company: 'CY Tech, Paris', role: 'Engineering cycle', note: 'Master of Engineering in Computer Science.' },
        { years: '2024 – 2026', company: 'CY Tech, Paris', role: 'Integrated prépa', note: 'Two-year preparatory cycle in maths and physics, top 20% in mathematics.' }
      ]
    },
    {
      title: 'Awards',
      items: [
        { years: '2026', company: 'Mistral × Stanford Law School', role: 'Winner', note: 'Legible, plus the Legora track.' },
        { years: '2026', company: 'IBM × Airbus', role: 'Top Score' },
        { years: '2026', company: 'French National Assembly', role: 'Top Project' },
        { years: '2026', company: 'Anthropic × Hugging Face', role: 'Top 20 / 300' }
      ]
    },
    {
      title: 'Certifications',
      items: [
        { years: 'Harvard', company: 'CS50', role: 'Computer Science' },
        { years: 'Anthropic', company: 'Model Context Protocol', role: 'MCP' }
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

<dialog bind:this={dialog} aria-labelledby="about-title" class="svelte-7hpc9t" class:shown oncancel={cancel} onclick={(event) => event.target === dialog && (open = false)}><div class="panel svelte-7hpc9t"><div class="intro"><header class="svelte-7hpc9t"><h2 id="about-title" class="svelte-7hpc9t">About</h2> <button type="button" class="close svelte-7hpc9t" aria-label="Close" onclick={() => (open = false)}><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"></path></svg></button></header> <div class="bio svelte-7hpc9t"><p class="svelte-7hpc9t">I’m an AI engineer at <strong>Safran Aircraft Engines</strong>, where I design and ship agentic AI that automates sales administration end to end, from the model to the business tools teams already use. In parallel, I’m an engineering student in computer science at <strong>CY Tech, Paris</strong>, after a preparatory cycle where I ranked in the top 20% in mathematics.</p> <p class="svelte-7hpc9t">I learn by shipping. <strong>Legible</strong>, my legal AI harness, won the Mistral × Stanford Law School hackathon and its Legora track. I also took Top Score at IBM × Airbus, Top Project at the French National Assembly and a Top 20 / 300 finish at Anthropic × Hugging Face.</p> <p class="svelte-7hpc9t">Off the keyboard, I create content as <strong>Intellectuel Athlète</strong>, compete in jiu-jitsu and grappling, and have done 50+ weekly outreach rounds with Au cœur de la précarité.</p></div></div> <div class="headshot svelte-7hpc9t"><img src="/assets/talal-hackathon.webp" alt="Talal, in white, at a hackathon, working on a laptop with a teammate." width="1200" height="800" loading="lazy" decoding="async" class="svelte-7hpc9t" /> <img class="subject svelte-7hpc9t" src="/assets/talal-hackathon-subject.webp" alt="" width="1200" height="800" loading="lazy" decoding="async" /></div> {#each timeline as group (group.title)}<section aria-labelledby={`about-${group.title.toLowerCase()}`}><h3 id={`about-${group.title.toLowerCase()}`} class="svelte-7hpc9t">{group.title}</h3> <ol class="experience svelte-7hpc9t">{#each group.items as item (item.company + item.role)}<li class="svelte-7hpc9t"><span class="years svelte-7hpc9t">{item.years}</span> <span class="company svelte-7hpc9t">{item.company}</span> <span class="role svelte-7hpc9t">{item.role}</span>{#if item.note}<span class="note">{item.note}</span>{/if}</li>{/each}</ol></section>{/each}</div></dialog>

<style>
  .bio strong {
    color: #080808;
    font-weight: 400;
  }

  .note {
    color: #77747f;
    font-size: 14px;
    line-height: 1.45;
    margin-top: -10px;
    grid-column: 2 / -1;
    display: block;
  }
</style>
