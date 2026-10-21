<script>
  import katex from 'katex';
  import { onMount } from 'svelte';
  import 'katex/dist/katex.min.css';

  const renderEquation = (tex) =>
    katex.renderToString(tex, { displayMode: true, throwOnError: false, output: 'html' });

  const equations = {
    leastSquares: renderEquation(String.raw`\begin{aligned}
      \nabla_\theta \lVert X\theta - y \rVert^2 &= 2X^\top(X\theta - y) = 0 \\
      &\;\Rightarrow\; \theta^\ast = (X^\top X)^{-1}X^\top y
    \end{aligned}`),
    minibatches: renderEquation(String.raw`\operatorname{Var}\big[\hat g_B\big] = \frac{\sigma^2}{B}`),
    backpropagation: renderEquation(String.raw`\begin{aligned}
      \delta^{(2)} &= A^{(2)} - Y, \\
      \frac{\partial L}{\partial W^{(2)}} &= \frac{1}{m}\,\delta^{(2)} A^{(1)\top}
    \end{aligned}`)
  };

  let { deepMl = { items: {} } } = $props();
  let section;
  let visible = $state(false);
  let entries = $derived(Object.values(deepMl?.items ?? {}));
  let solved = $derived(entries.length);
  let mathCount = $derived(entries.filter((item) => item.kind === 'math').length);
  let problemCount = $derived(entries.filter((item) => item.kind === 'problem').length);
  let categories = $derived(new Set(entries.map((item) => item.category).filter(Boolean)).size);
  let since = $derived.by(() => {
    const earliest = entries
      .map((item) => item.first_solved_at)
      .filter(Boolean)
      .sort()[0];
    return earliest
      ? new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
          new Date(earliest)
        )
      : '—';
  });
  let recent = $derived(
    [...entries]
      .sort((a, b) => b.first_solved_at.localeCompare(a.first_solved_at))
      .slice(0, 5)
  );

  const stats = $derived([
    { value: solved, label: 'problems solved' },
    { value: mathCount, label: 'math derivations' },
    { value: categories, label: 'topics' },
    { value: since, label: 'daily since' }
  ]);

  const formatDate = (value) =>
    new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(
      new Date(value)
    );

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible = true;
          observer.unobserve(section);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  });
</script>

<section id="research" bind:this={section} class:visible aria-labelledby="research-title">
  <h2 id="research-title">Deep-ML / Research</h2>
  <p class="intro">
    I study machine learning from the mathematics up. Every day I solve a problem on Deep-ML by hand: the derivation
    first, then a NumPy implementation, committed to GitHub.
  </p>

  <ul class="stats" aria-label="Deep-ML progress">
    {#each stats as stat (stat.label)}
      <li>
        <span class="value">{stat.value}</span>
        <span class="label">{stat.label}</span>
      </li>
    {/each}
  </ul>

  <div class="derivations">
    <article class="derivation">
      <h3>Least squares, in closed form</h3>
      <div
        class="equation"
        role="img"
        aria-label="Gradient of squared error gives the least-squares solution"
      >
        {@html equations.leastSquares}
      </div>
      <p>Setting the gradient to zero gives the normal equations. I solve the same regression with gradient descent and compare the two.</p>
    </article>

    <article class="derivation">
      <h3>Why minibatches work</h3>
      <div
        class="equation"
        role="img"
        aria-label="Gradient variance is sigma squared divided by batch size"
      >
        {@html equations.minibatches}
      </div>
      <p>Averaging B independent per-sample gradients divides the variance by B: the noise in SGD shrinks as 1/√B while the cost grows as B.</p>
    </article>

    <article class="derivation">
      <h3>Backpropagation, by hand</h3>
      <div
        class="equation"
        role="img"
        aria-label="Output error is activation minus labels, and the weight gradient is its product with the previous activation"
      >
        {@html equations.backpropagation}
      </div>
      <p>
        With softmax and cross-entropy, the output error is simply A − Y. My MNIST network is trained this way in pure NumPy.
        <a href="https://github.com/talal95c/Mnist-NN" target="_blank" rel="noopener noreferrer">MNIST from scratch ↗</a>
      </p>
    </article>
  </div>

  <div class="research-detail">
    <div class="recent">
      <h3>Recently solved</h3>
      <ul>
        {#each recent as item (`${item.kind}-${item.id}`)}
          <li>
            <a
              href={`https://github.com/talal95c/deep-ml/tree/main/${item.path}`}
              target="_blank"
              rel="noopener noreferrer"
            >{item.title}</a>
            <span class="item-meta">{item.category} · {item.difficulty} · {formatDate(item.first_solved_at)}</span>
          </li>
        {/each}
      </ul>
    </div>

    <div class="projects">
      <h3>Research projects</h3>
      <div class="project-grid">
        <a class="project-card" href="/work/turbofan-rul" rel="external">
          <span class="project-title">Turbofan RUL</span>
          <span class="project-description">Uncertainty-aware remaining useful life on NASA C-MAPSS</span>
        </a>
        <a class="project-card" href="/work/legible">
          <span class="project-title">Legible</span>
          <span class="project-description">Does speaker attribution make legal LLMs more faithful?</span>
        </a>
        <a class="project-card" href="/work/sylo">
          <span class="project-title">Sylo.ai</span>
          <span class="project-description">A calibrated fraud model, evaluated on unseen seeds</span>
        </a>
      </div>
    </div>
  </div>

  <p class="interests">
    Interests: optimisation, uncertainty estimation, and evaluating AI systems honestly.
    <span>
      <a href="https://talal95c.github.io/deep-ml/" target="_blank" rel="noopener noreferrer">Deep-ML portfolio ↗</a>
      <a href="https://github.com/talal95c/deep-ml" target="_blank" rel="noopener noreferrer">Repository ↗</a>
    </span>
  </p>
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

  h2 {
    margin-bottom: 20px;
    font-size: 48px;
    font-weight: 400;
    line-height: 1.1;
  }

  .intro {
    max-width: 720px;
    color: #5b5864;
    font-size: 17px;
    font-weight: 400;
    line-height: 1.5;
    text-wrap: pretty;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
    margin: 30px 0 52px;
    padding: 0;
    list-style: none;
  }

  .stats li {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 16px 18px;
    border-radius: 12px;
    background: #f7f6f9;
  }

  .value {
    color: #080808;
    font-size: 24px;
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .label,
  .item-meta,
  .project-description {
    color: #77747f;
    font-size: 13px;
    line-height: 1.4;
  }

  .derivations {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }

  .derivation {
    min-width: 0;
    padding: 22px;
    border: 1px solid #00000012;
    border-radius: 12px;
    background: #fff;
  }

  h3 {
    margin: 0 0 14px;
    color: #111;
    font-size: 20px;
    font-weight: 400;
    line-height: 1.2;
  }

  .equation {
    margin: 8px 0 20px;
    color: #111;
    font-size: 1.05em;
    line-height: 1.35;
  }

  .equation :global(.katex-display) {
    margin: 0;
  }

  .derivation p {
    color: #5b5864;
    font-size: 15px;
    font-weight: 400;
    line-height: 1.5;
    text-wrap: pretty;
  }

  .derivation a,
  .interests a {
    color: #080808;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
  }

  .research-detail {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 36px;
    margin-top: 56px;
  }

  .recent ul {
    display: grid;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .recent li {
    display: grid;
    gap: 6px;
    padding: 14px 0;
    border-top: 1px solid #0000001a;
  }

  .recent li a {
    font-size: 16px;
    line-height: 1.3;
  }

  .item-meta {
    font-variant-numeric: tabular-nums;
  }

  .project-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }

  .project-card {
    display: grid;
    gap: 6px;
    padding: 16px 18px;
    border-radius: 12px;
    background: #f7f6f9;
    transition: transform 0.2s var(--ease-out), background 0.2s;
  }

  .project-title {
    color: #080808;
    font-size: 16px;
    line-height: 1.2;
  }

  .project-description {
    max-width: 380px;
  }

  .interests {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 14px 24px;
    margin-top: 44px;
    padding-top: 20px;
    border-top: 1px solid #0000001a;
    color: #5b5864;
    font-size: 14px;
    line-height: 1.5;
  }

  .interests span {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 18px;
  }

  @media (hover: hover) and (pointer: fine) {
    .recent li a:hover,
    .derivation a:hover,
    .interests a:hover {
      opacity: 0.65;
    }

    .project-card:hover {
      transform: translateY(-2px);
      background: #f2f1f4;
    }
  }

  @media (max-width: 900px) {
    .derivations {
      grid-template-columns: 1fr;
    }

    .research-detail {
      gap: 36px;
    }

    .project-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 700px) {
    section {
      padding: 56px 24px 64px;
    }

    h2 {
      margin-bottom: 18px;
      font-size: 42px;
    }

    .intro {
      font-size: 16px;
    }

    .stats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      margin: 24px 0 40px;
    }

    .stats li {
      padding: 14px 16px;
    }

    .derivation {
      margin-inline: -19px;
      padding: 14px;
    }

    .research-detail {
      margin-top: 40px;
    }

    .interests {
      margin-top: 36px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    section {
      opacity: 1;
      transform: none;
      transition: none;
    }

    .project-card {
      transition: none;
    }
  }
</style>
