<script>
  import katex from 'katex';
  import { onMount } from 'svelte';
  import 'katex/dist/katex.min.css';

  const renderEquation = (tex) =>
    katex.renderToString(tex, { displayMode: true, throwOnError: false, output: 'html' });

  const equations = {
    gradientCheck: renderEquation(String.raw`\begin{gathered}
      \hat g_i = \frac{f(\theta + \varepsilon e_i) - f(\theta - \varepsilon e_i)}{2\varepsilon} \\
      r = \frac{\lVert \hat g - g \rVert_2}{\lVert \hat g \rVert_2 + \lVert g \rVert_2}
    \end{gathered}`),
    decompositions: renderEquation(String.raw`\begin{gathered}
      PA = LU, \qquad A = QR,\; Q^\top Q = I \\
      Rx = Q^\top b
    \end{gathered}`),
    backpropagation: renderEquation(String.raw`\begin{aligned}
      \delta^{(2)} &= A^{(2)} - Y, \\
      \frac{\partial L}{\partial W^{(2)}} &= \frac{1}{m}\,\delta^{(2)} A^{(1)\top}
    \end{aligned}`)
  };

  const progressUrl = 'https://raw.githubusercontent.com/talal95c/deep-ml/main/progress.json';

  let { deepMl = { items: {} } } = $props();
  let live = $state(null);
  let section;
  let visible = $state(false);
  let entries = $derived(
    Object.values((live ?? deepMl)?.items ?? {}).sort((a, b) =>
      (b.last_pushed_at ?? b.first_solved_at).localeCompare(a.last_pushed_at ?? a.first_solved_at)
    )
  );
  let latest = $derived(entries[0]);
  let recent = $derived(entries.slice(1, 4));

  const solutionUrl = (item) => `https://github.com/talal95c/deep-ml/tree/main/${item.path}`;

  const formatDate = (value) =>
    new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(
      new Date(value)
    );

  onMount(() => {
    fetch(progressUrl, { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.items && Object.keys(data.items).length) live = data;
      })
      .catch(() => {});

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
  <div class="intro">
    <p>
      <a href="https://www.deep-ml.com" target="_blank" rel="noopener noreferrer">Deep-ML</a> is a platform of machine-learning
      problems built on pure logic: no framework to lean on, every model has to be rebuilt from its equations. I use it as a
      personal research practice. <mark class="daily">Every day</mark>, I take one problem, derive it on paper, implement it in
      NumPy and publish the solution.
    </p>
    <p>
      Nobody asks me to. I do it because understanding why a method works, down to the last gradient, is the part of this
      field I enjoy most, and it is what lets me design new methods rather than only apply existing ones.
    </p>
  </div>

  {#if latest}
    <a class="latest" href={solutionUrl(latest)} target="_blank" rel="noopener noreferrer">
      <span class="latest-label"><span class="pulse" aria-hidden="true"></span>Last subject I worked on</span>
      <span class="latest-title">{latest.title}</span>
      <span class="latest-meta">
        {latest.kind === 'math' ? 'Derivation' : 'Implementation'} · {latest.category} · {formatDate(
          latest.last_pushed_at ?? latest.first_solved_at
        )}
      </span>
      <span class="latest-link">View solution ↗</span>
    </a>
  {/if}

  <div class="derivations">
    <article class="derivation">
      <h3>Checking gradients numerically</h3>
      <div
        class="equation"
        role="img"
        aria-label="Central-difference gradient estimate and its relative error against the analytical gradient"
      >
        {@html equations.gradientCheck}
      </div>
      <p>A central difference is accurate to O(ε²). I compare it with the analytical gradient through the relative error before trusting any backward pass.</p>
    </article>

    <article class="derivation">
      <h3>Linear systems: LU and QR</h3>
      <div
        class="equation"
        role="img"
        aria-label="LU factorisation with pivoting, QR factorisation, and the triangular system it yields"
      >
        {@html equations.decompositions}
      </div>
      <p>Gaussian elimination is LU in disguise: factor once, then solve with two triangular substitutions. QR avoids forming XᵀX, which squares the condition number in least squares.</p>
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
      <h3>Before that</h3>
      <ul>
        {#each recent as item (`${item.kind}-${item.id}`)}
          <li>
            <a
              href={solutionUrl(item)}
              target="_blank"
              rel="noopener noreferrer"
            >{item.title}</a>
            <span class="item-meta">{item.category} · {item.difficulty} · {formatDate(item.last_pushed_at ?? item.first_solved_at)}</span>
          </li>
        {/each}
      </ul>
    </div>

    <div class="projects">
      <h3>Research projects</h3>
      <div class="project-grid">
        <a class="project-card" href="/work/turbofan-rul">
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

  .intro p + p {
    margin-top: 12px;
  }

  .intro a {
    color: #080808;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
  }

  .daily {
    padding: 0 3px;
    margin: 0 -3px;
    border-radius: 3px;
    color: #080808;
    background: linear-gradient(#cfeedd, #cfeedd) no-repeat left / 0 100%;
    transition: background-size 0.9s var(--ease-out) 0.35s;
  }

  section.visible .daily {
    background-size: 100% 100%;
  }

  .latest {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 6px 24px;
    margin: 32px 0 44px;
    padding: 20px 22px;
    border: 1px solid #00000012;
    border-radius: 12px;
    background: #fff;
    transition: transform 0.2s var(--ease-out), border-color 0.2s;
  }

  .latest-label {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #77747f;
    font-size: 13px;
    line-height: 1.4;
  }

  .pulse {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #5cc489;
    box-shadow: 0 0 0 0 #5cc48966;
    animation: pulse 2.4s ease-out infinite;
  }

  @keyframes pulse {
    70% {
      box-shadow: 0 0 0 6px #5cc48900;
    }
    100% {
      box-shadow: 0 0 0 0 #5cc48900;
    }
  }

  .latest-title {
    color: #080808;
    font-size: 24px;
    line-height: 1.2;
    letter-spacing: -0.01em;
  }

  .latest-meta {
    grid-column: 1;
    color: #77747f;
    font-size: 13px;
    line-height: 1.4;
  }

  .latest-link {
    grid-column: 2;
    grid-row: 2 / 4;
    align-self: center;
    color: #080808;
    font-size: 14px;
    white-space: nowrap;
  }

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
    overflow-x: auto;
    overflow-y: hidden;
  }

  .equation :global(.katex) {
    font-size: 1.08em;
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

    .latest:hover {
      transform: translateY(-2px);
      border-color: #00000024;
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

    .latest {
      grid-template-columns: minmax(0, 1fr);
      margin: 24px 0 36px;
      padding: 16px 18px;
    }

    .latest-title {
      font-size: 21px;
    }

    .latest-link {
      grid-column: 1;
      grid-row: auto;
      margin-top: 6px;
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

    .project-card,
    .latest,
    .daily {
      transition: none;
    }

    .pulse {
      animation: none;
    }
  }
</style>
