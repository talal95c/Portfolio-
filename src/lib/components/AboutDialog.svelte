<script>
  let { open = $bindable(false) } = $props();

  const experience = [
    { years: '2026 – Now', company: 'Kleiner Perkins', role: 'Design Fellow' },
    { years: '2026', company: 'Multiply', role: 'Product Design' },
    { years: '2023 – 2025', company: 'Independent', role: 'Freelance Designer' },
    { years: '2023 – 2024', company: 'Oracle Education Foundation', role: 'Intern' }
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

<dialog bind:this={dialog} aria-labelledby="about-title" class="svelte-7hpc9t" class:shown oncancel={cancel} onclick={(event) => event.target === dialog && (open = false)}><div class="panel svelte-7hpc9t"><div class="intro"><header class="svelte-7hpc9t"><h2 id="about-title" class="svelte-7hpc9t">About</h2> <button type="button" class="close svelte-7hpc9t" aria-label="Close" onclick={() => (open = false)}><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"></path></svg></button></header> <div class="bio svelte-7hpc9t"><p class="svelte-7hpc9t">I’m a designer studying Arts, Technology, &amp; Business at USC. I like working on a product end to end: talking with the people who use it, sweating the details, and building products people care about.</p> <p class="svelte-7hpc9t">This past summer, I was the youngest Kleiner Perkins fellow and Multiply’s first design intern, redesigning the tools their loan officers use every day.</p></div></div> <div class="headshot svelte-7hpc9t"><img src="/assets/headshot-casual.webp" alt="Sam at night in front of the Bay Bridge in San Francisco." width="1200" height="800" loading="lazy" decoding="async" class="svelte-7hpc9t" /> <img class="subject svelte-7hpc9t" src="/assets/headshot-casual-subject.webp" alt="" width="1200" height="800" loading="lazy" decoding="async" /></div> <section aria-labelledby="experience-title"><h3 id="experience-title" class="svelte-7hpc9t">Experience</h3> <ol class="experience svelte-7hpc9t">{#each experience as item}<li class="svelte-7hpc9t"><span class="years svelte-7hpc9t">{item.years}</span> <span class="company svelte-7hpc9t">{item.company}</span> <span class="role svelte-7hpc9t">{item.role}</span></li>{/each}</ol></section></div></dialog>
