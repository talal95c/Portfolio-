<script>
  let { open = $bindable(false) } = $props();

  const experience = [
    { years: '2026 – Now', company: 'Safran Aircraft Engines', role: 'AI Engineer' },
    { years: '2024 – Now', company: 'CY Tech, Paris', role: 'Computer Science' },
    { years: '2026', company: 'Hackathons', role: 'Mistral × Stanford winner' },
    { years: 'Now', company: 'Intellectuel Athlète', role: 'Content creator' }
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

<dialog bind:this={dialog} aria-labelledby="about-title" class="svelte-7hpc9t" class:shown oncancel={cancel} onclick={(event) => event.target === dialog && (open = false)}><div class="panel svelte-7hpc9t"><div class="intro"><header class="svelte-7hpc9t"><h2 id="about-title" class="svelte-7hpc9t">About</h2> <button type="button" class="close svelte-7hpc9t" aria-label="Close" onclick={() => (open = false)}><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"></path></svg></button></header> <div class="bio svelte-7hpc9t"><p class="svelte-7hpc9t">I’m an AI engineer at Safran Aircraft Engines and a computer science student at CY Tech in Paris. I like building things end to end, from agentic workflows wired into real business tools to products people use every day.</p> <p class="svelte-7hpc9t">Lately I’ve been doing a lot of hackathons: Legible won the Mistral × Stanford Law School hackathon and its Legora track, and I’ve placed at IBM × Airbus, the French National Assembly and Anthropic × Hugging Face.</p></div></div> <div class="headshot svelte-7hpc9t"><img src="/assets/talal-hackathon.webp" alt="Talal at a hackathon, working on a laptop with a teammate." width="1200" height="800" loading="lazy" decoding="async" class="svelte-7hpc9t" /> <img class="subject svelte-7hpc9t" src="/assets/talal-hackathon-subject.webp" alt="" width="1200" height="800" loading="lazy" decoding="async" /></div> <section aria-labelledby="experience-title"><h3 id="experience-title" class="svelte-7hpc9t">Experience</h3> <ol class="experience svelte-7hpc9t">{#each experience as item}<li class="svelte-7hpc9t"><span class="years svelte-7hpc9t">{item.years}</span> <span class="company svelte-7hpc9t">{item.company}</span> <span class="role svelte-7hpc9t">{item.role}</span></li>{/each}</ol></section></div></dialog>
