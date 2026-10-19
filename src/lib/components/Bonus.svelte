<script>
  import { onMount } from 'svelte';

  let section;
  let visible = $state(false);

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
    return () => observer.disconnect();
  });
</script>

<section bind:this={section} class:visible aria-labelledby="bonus-title">
  <h2 id="bonus-title">Bonus</h2>
  <div class="grid">
    <article>
      <h3>Intellectuel Athlète</h3>
      <p>I create personal development and tech content: 14,000+ followers and 2–3M monthly views.</p>
    </article>
    <article>
      <h3>Jiu-jitsu &amp; grappling</h3>
      <p>I compete in Brazilian jiu-jitsu and grappling, and I run.</p>
    </article>
    <article>
      <h3>Volunteering</h3>
      <p>50+ weekly humanitarian outreach rounds (maraudes) with Au cœur de la précarité.</p>
    </article>
  </div>
</section>

<style>
  section {
    border-top: 1px solid #0000001a;
    padding: 64px var(--page-gutter) 88px;
  }

  h2 {
    margin-bottom: 36px;
    font-size: 48px;
    font-weight: 400;
    line-height: 1.1;
  }

  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 48px;
    display: grid;
  }

  article {
    opacity: 0;
    transform: translateY(12px);
    transition:
      opacity 0.55s var(--ease-out),
      transform 0.55s var(--ease-out);
  }

  article:nth-child(2) {
    transition-delay: 70ms;
  }

  article:nth-child(3) {
    transition-delay: 140ms;
  }

  .visible article {
    opacity: 1;
    transform: none;
  }

  h3 {
    margin-bottom: 10px;
    font-size: 24px;
    font-weight: 400;
    line-height: 1.2;
  }

  p {
    color: #5b5864;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.45;
  }

  @media (width <= 700px) {
    section {
      padding: 56px 24px 64px;
    }

    h2 {
      margin-bottom: 28px;
      font-size: 42px;
    }

    .grid {
      grid-template-columns: 1fr;
      gap: 28px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    article {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
</style>
