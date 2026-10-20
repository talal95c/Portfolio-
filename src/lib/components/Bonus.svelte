<script>
  import { onMount } from 'svelte';

  const cards = [
    {
      title: 'Certifications',
      text: 'CS50 from Harvard and Model Context Protocol from Anthropic.',
      stickers: [
        { src: 'cap', x: 0, y: 0, tilt: -10 },
        { src: 'scroll', x: 30, y: 16, tilt: 12, size: 26 },
        { src: 'medal', x: 52, y: -4, tilt: -4, size: 24 }
      ]
    },
    {
      title: 'Jiu-jitsu & grappling',
      text: 'I compete in Brazilian jiu-jitsu and grappling, and I run.',
      stickers: [
        { src: 'gi', x: 0, y: 0, tilt: 10 },
        { src: 'gold', x: 30, y: 16, tilt: -12, size: 26 },
        { src: 'runner', x: 52, y: -4, tilt: 8, size: 24 }
      ]
    },
    {
      title: 'Volunteering',
      text: '50+ weekly humanitarian outreach rounds (maraudes) with Au cœur de la précarité.',
      stickers: [
        { src: 'handshake', x: 0, y: 0, tilt: -8 },
        { src: 'heart', x: 30, y: 16, tilt: 14, size: 24 },
        { src: 'baguette', x: 50, y: -4, tilt: -18, size: 26 }
      ]
    }
  ];

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
    {#each cards as card (card.title)}
      <article>
        <h3>
          {card.title}
          {#each card.stickers as sticker, index (sticker.src)}
            <img
              class="sticker"
              src={`/stickers/${sticker.src}.svg`}
              alt=""
              aria-hidden="true"
              style={`--x:${sticker.x}px;--y:${sticker.y}px;--tilt:${sticker.tilt}deg;--size:${sticker.size ?? 32}px;--delay:${index * 70}ms`}
            />
          {/each}
        </h3>
        <p>{card.text}</p>
      </article>
    {/each}
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
    position: relative;
    display: inline-block;
    margin-bottom: 10px;
    font-size: 24px;
    font-weight: 400;
    line-height: 1.2;
  }

  .sticker {
    pointer-events: none;
    opacity: 0;
    transform-origin: 50% 100%;
    width: var(--size);
    height: var(--size);
    transition:
      transform 0.18s ease-in,
      opacity 0.12s ease-in;
    filter: drop-shadow(1.5px 0 0 #fff) drop-shadow(-1.5px 0 0 #fff) drop-shadow(0 1.5px 0 #fff) drop-shadow(0 -1.5px 0 #fff)
      drop-shadow(1px 1px 0 #fff) drop-shadow(-1px -1px 0 #fff) drop-shadow(0 3px 5px #0000002e);
    position: absolute;
    bottom: calc(100% - 10px + var(--y));
    left: calc(100% + 2px + var(--x));
    transform: translateY(10px) scale(0.3) rotate(calc(var(--tilt) * -2.5));
  }

  @media (hover: hover) and (pointer: fine) {
    article:hover .sticker {
      opacity: 1;
      transition:
        transform 0.5s var(--delay) cubic-bezier(0.34, 1.7, 0.5, 1),
        opacity 0.15s var(--delay) ease-out;
      transform: translateY(0) scale(1) rotate(var(--tilt));
    }
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

    .sticker,
    article:hover .sticker {
      transform: rotate(var(--tilt));
      transition: opacity 0.18s;
    }
  }
</style>
