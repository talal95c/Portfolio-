// Technical section of each /work page: a short explanation of my part and a flow diagram.
// stages run top to bottom; nodes inside a `flow` stage run left to right.
export const technical = {
  'turbofan-rul': {
    title: `Method and findings`,
    paragraphs: [
      `Targets follow the standard convention: RUL capped at 125 cycles, since degradation is invisible early in life. On the multi-condition subsets, the six flight regimes are recovered with k-means on the operating settings and every sensor is z-scored within its regime. That single step removes most of the difficulty of FD002 and FD004.`,
      `Each of the five CNN members predicts a mean μ and a variance σ², trained on the Gaussian negative log-likelihood ½ log σ² + (y − μ)² / 2σ². Across the ensemble, the variance splits into an __aleatoric__ part (the mean of σ²: what the sensors cannot resolve) and an __epistemic__ part (the spread of μ across members: what the model does not know).`,
      `Finding: **gradient boosting on four statistics per sensor beats the CNN on all four subsets** (12.4–14.1 vs. 13.6–16.5 RMSE), even without the elapsed-cycle feature. What the deep ensemble adds is calibration: its 90 % intervals hold at 88–93 %, and its uncertainty rises with the actual error (Spearman ρ up to 0.56 on FD004).`,
    ],
    stages: [
      { flow: true, nodes: [
        { label: `Sensor streams`, note: `14 sensors × cycles, per engine`, tag: `data` },
        { label: `Regime normalisation`, note: `k-means on settings, z-score per regime`, tag: `code` },
        { label: `Windows`, note: `last 30 cycles, RUL ≤ 125`, tag: `code` },
      ] },
      { flow: true, nodes: [
        { label: `Ridge`, note: `flattened window`, tag: `baseline` },
        { label: `Gradient boosting`, note: `last, mean, std, slope per sensor`, tag: `baseline` },
        { label: `CNN ensemble`, note: `5 seeds, outputs μ and σ²`, tag: `model`, accent: true },
      ] },
      { nodes: [{ label: `Evaluation`, note: `RMSE · NASA score · 90 % coverage, test set used once`, tag: `metrics` }] },
    ],
  },
  legible: {
    title: `How the harness works`,
    paragraphs: [
      `The rule of the harness: **anything code or rules can decide is not given to a model**. Deterministic zoning reads the structure of the ruling (facts, the appellant’s grounds, the Court’s answer, the operative part). A calibrated classifier, Jev, only settles the ambiguous sentences, about 4 %, and returns a probability for each possible speaker.`,
      `The output is a __registry__: one record per sentence with its speaker, paragraph and confidence. Mistral writes the answer from that registry only, citing segments as [S-xx], and a verifier checks every sentence of the answer against its source and speaker before deciding to answer or abstain.`,
      `On a held-out set of 102 questions the gap narrows (19 % vs. 23 % hallucination, not significant), mostly because the verifier abstains too often: that is the next thing to fix.`,
    ],
    stages: [
      { flow: true, nodes: [
        { label: `Court ruling`, note: `PDF → numbered §, sentence IDs`, tag: `code` },
        { label: `Zoning`, note: `sections of the ruling`, tag: `rules` },
        { label: `Attribution`, note: `ambiguous sentences only (≈ 4 %)`, tag: `classifier` },
      ] },
      { nodes: [{ label: `Registry`, note: `speaker · § · confidence, for every sentence`, tag: `data`, accent: true }] },
      { flow: true, nodes: [
        { label: `Question`, note: `routed to the speaker it is about`, tag: `classifier` },
        { label: `Retrieval`, note: `BM25, then re-ranking`, tag: `code` },
        { label: `Answer`, note: `Mistral, cites [S-xx]`, tag: `LLM` },
      ] },
      { flow: true, nodes: [
        { label: `Verification`, note: `each claim vs. its source and speaker`, tag: `classifier` },
        { label: `Answer or abstain`, note: `confidence decides`, tag: `code`, accent: true },
      ] },
    ],
  },
  adib: {
    title: `The learning model`,
    paragraphs: [
      `New words come from the Quranic Arabic Corpus, lemmatised and ranked by frequency, so a learner always meets the word that unlocks the most text next.`,
      `Reviews follow a simplified SM-2 model. Each word keeps an interval I and an ease factor EF (2.5 at first). A correct answer multiplies the interval, I ← round(I × EF), then EF ← EF + 0.1; a miss resets I to one day and lowers EF by 0.2, never below 1.3. A word counts as mastered once its interval reaches 21 days.`,
    ],
    stages: [
      { flow: true, nodes: [
        { label: `Quranic Arabic Corpus`, note: `morphology, lemmas`, tag: `data` },
        { label: `Frequency ranking`, note: `most frequent words first`, tag: `code` },
        { label: `Deck`, note: `word, root, example verse`, tag: `data` },
      ] },
      { flow: true, nodes: [
        { label: `Session`, note: `flashcards, then a quiz`, tag: `app` },
        { label: `SM-2 scheduler`, note: `I ← round(I × EF)`, tag: `model`, accent: true },
        { label: `Progress`, note: `Supabase, row-level security`, tag: `data` },
      ] },
      { nodes: [{ label: `Next review`, note: `due date + reminder on web and iOS`, tag: `app` }] },
    ],
  },
  'intellectuel-athlete': {
    title: `The method`,
    paragraphs: [
      `Each video tests one hypothesis about what makes an idea stick: the hook, the length, the format, the topic. Retention curves, shares and follows per video decide what the next one keeps or drops, so the channel improves like a model trained on feedback, one iteration a day.`,
    ],
    stages: [
      { flow: true, nodes: [
        { label: `Idea`, note: `one thing I learned`, tag: `research` },
        { label: `Script`, note: `one claim, one hook`, tag: `writing` },
        { label: `Video`, note: `shoot and edit`, tag: `craft` },
      ] },
      { flow: true, nodes: [
        { label: `Analytics`, note: `retention, shares, follows`, tag: `data`, accent: true },
        { label: `Next iteration`, note: `keep what works`, tag: `decision` },
      ] },
    ],
  },
  miropolis: {
    title: `Architecture`,
    paragraphs: [
      `The real chamber is turned into a knowledge graph (deputies, groups, programmes, votes), and one agent profile is generated per deputy. The OASIS engine then runs rounds of debate, amendments and votes, and the votes are aggregated by group to show where consensus forms and which articles split the chamber.`,
    ],
    stages: [
      { flow: true, nodes: [
        { label: `Chamber data`, note: `deputies, groups, programmes`, tag: `data` },
        { label: `Knowledge graph`, note: `Zep memory`, tag: `data` },
        { label: `Deputy agents`, note: `one persona per deputy`, tag: `LLM`, accent: true },
      ] },
      { nodes: [{ label: `Simulation loop`, note: `debate → amendments → vote (OASIS)`, tag: `agents` }] },
      { flow: true, nodes: [
        { label: `Vote aggregation`, note: `by group and by article`, tag: `code` },
        { label: `Report`, note: `consensus and blind spots`, tag: `LLM` },
      ] },
    ],
  },
  sylo: {
    title: `The risk model`,
    paragraphs: [
      `The decision order never changes: norms, then risk, then cost. Fraud risk never enters the route score, and **the model can only make a decision stricter**, never looser.`,
      `For the risk step I generated synthetic payment populations with known fraud types, trained a gradient-boosted model on seed A, calibrated it, and evaluated it once on seeds B and C that it never saw. A logistic regression on the same signals reaches 98.3 % recall: the value is in the signals (payee name vs. supplier, account age, lookalike domains, mule clusters), not in model complexity.`,
    ],
    stages: [
      { flow: true, nodes: [
        { label: `Payment order`, note: `invoice, payee, amount`, tag: `input` },
        { label: `Norms`, note: `legal routes only`, tag: `rules` },
        { label: `Risk`, note: `rules + calibrated GBM`, tag: `model`, accent: true },
        { label: `Cost`, note: `cheapest safe route`, tag: `code` },
      ] },
      { flow: true, nodes: [
        { label: `Commit`, note: `signed intent on Avalanche`, tag: `chain` },
        { label: `Action`, note: `send · hold in escrow · analyst · block`, tag: `code` },
      ] },
    ],
  },
  'dino-race': {
    title: `Architecture`,
    paragraphs: [
      `The game logic lives in a kernel that knows nothing about Three.js or the DOM: input becomes intents, the kernel runs a fixed-step simulation and emits events, and the 3D view, the audio and the HUD only listen. Visuals, music and gameplay can therefore evolve separately, and multiplayer only has to sync intents and events over MQTT.`,
    ],
    stages: [
      { flow: true, nodes: [
        { label: `Input`, note: `keyboard → intents`, tag: `code` },
        { label: `Kernel`, note: `fixed-step game loop, track, director`, tag: `logic`, accent: true },
        { label: `MQTT`, note: `rooms on public brokers`, tag: `network` },
      ] },
      { flow: true, nodes: [
        { label: `3D view`, note: `Three.js`, tag: `render` },
        { label: `Audio`, note: `Lyria RealTime`, tag: `AI` },
        { label: `HUD`, note: `menus, shop`, tag: `DOM` },
      ] },
    ],
  },
  wildwater: {
    title: `Algorithm`,
    paragraphs: [
      `Plants are indexed in an AVL tree, so each lookup or insertion stays O(log n) over 2M+ lines. The network is then rebuilt as a distribution tree, and a depth-first pass pushes each volume downstream, subtracting each pipe’s leak percentage, to compute the total loss below any plant.`,
    ],
    stages: [
      { flow: true, nodes: [
        { label: `Shell entry point`, note: `filters the CSV, compiles C`, tag: `shell` },
        { label: `AVL index`, note: `O(log n) per plant`, tag: `C`, accent: true },
        { label: `Distribution tree`, note: `plant → storage → users`, tag: `C` },
      ] },
      { flow: true, nodes: [
        { label: `Leak pass`, note: `depth-first, volume × (1 − leak %)`, tag: `C` },
        { label: `Histograms`, note: `Gnuplot`, tag: `plot` },
      ] },
    ],
  },
};
