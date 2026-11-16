// Technical section of each /work page: a short explanation of my part and a flow diagram.
// stages run top to bottom; nodes inside a `flow` stage run left to right.
export const technical = {
  'vitaldb-alarm': {
    title: `From arterial pressure to an alarm`,
    paragraphs: [
      `Each case's invasive MAP track (Solar8000/ART_MBP) is cleaned and resampled per minute. For every eligible minute, the features are the last MAP, 5- and 10-minute means, the 5-minute slope and age; the label is the onset of MAP < 65 mmHg within the next five minutes.`,
      `Patients, not minutes, are split 60 / 20 / 20 with seed 42: a shuffled minute split puts all 283 patients in both train and validation. A standardised logistic regression is compared with the baseline −MAP. The threshold is the validation quantile that rings about once per hour, then frozen for test.`,
      `On 58 test patients the model ranks as well as the last MAP (AUROC 0.833 vs 0.834) but catches only 40 % of episodes at 1.14 alarms/h with 57 % precision. A patient bootstrap (1,000 draws) gives wide intervals, the women − men sensitivity gap (+6.6 points) has a CI of [−5.3, +22.0], and calibration is good on average (7.4 % predicted vs 7.9 % observed, Brier 0.062) but underestimates the top-risk decile (0.27 vs 0.36).`,
    ],
    stages: [
      { flow: true, nodes: [
        { label: `VitalDB cases`, note: `300 adults · arterial line`, tag: `data` },
        { label: `MAP cleaning`, note: `per-minute track`, tag: `code` },
        { label: `Features & labels`, note: `MAP 1/5/10 min, slope · onset < 65 in 5 min`, tag: `data` },
      ] },
      { flow: true, nodes: [
        { label: `Patient split`, note: `169 / 56 / 58`, tag: `code` },
        { label: `Baseline −MAP`, note: `last pressure only`, tag: `model` },
        { label: `Logistic regression`, tag: `model`, accent: true },
      ] },
      { flow: true, nodes: [
        { label: `Frozen threshold`, note: `≈1 alarm/h on validation`, tag: `model`, accent: true },
        { label: `Episode sensitivity`, note: `alarms/h · precision`, tag: `eval` },
        { label: `Bootstrap & calibration`, note: `CI · women/men · Brier`, tag: `eval` },
      ] },
      { nodes: [{ label: `Verdict`, note: `Good AUROC, but 60 % of episodes missed`, tag: `eval`, accent: true }] },
    ],
  },
  rio: {
    title: `From tutorial to verified milestones`,
    paragraphs: [
      `We built Rio together across product, AI and the desktop app. React provides the floating bar, cursor and notch; Tauri / Rust handles the native tutor, screen capture and autopilot. Holo by H Company analyzes screenshots and plans milestones that can be checked on screen rather than relying on fixed coordinates.`,
      `YouTube links use Gladia transcription before Holo prepares the lesson. Web pages supply their text, with H Company's web-surfer agent when needed. Questions search the team's knowledge base, then Linkup if configured; Phonon synthesizes speech locally. A Cloudflare Worker connects the website, team console, API and D1.`,
      `After a successful lesson, the learner can explicitly accept or decline autopilot and stop it at any time. Rio reuses milestones and checks outcomes on fresh screenshots before reporting success. The app targets macOS; autopilot also works on Linux X11, not Wayland. Pointing accuracy and vague requests remain limitations, so not every task is guaranteed to succeed.`,
    ],
    stages: [
      { flow: true, nodes: [
        { label: `Tutorial or goal`, note: `YouTube · web page · library`, tag: `data` },
        { label: `Prepare milestones`, note: `Gladia transcription + Holo planning`, tag: `AI`, accent: true },
      ] },
      { flow: true, nodes: [
        { label: `Desktop guidance`, note: `React overlay · Tauri / Rust`, tag: `app` },
        { label: `Screen checks`, note: `Holo verifies each milestone`, tag: `AI`, accent: true },
        { label: `Questions`, note: `Voice / text · knowledge + Linkup`, tag: `search` },
      ] },
      { flow: true, nodes: [
        { label: `Successful run`, note: `Reusable milestones`, tag: `data` },
        { label: `Explicit consent`, note: `Accept, decline or stop`, tag: `app`, accent: true },
        { label: `Autopilot`, note: `Fresh screenshots verify outcomes`, tag: `AI` },
      ] },
      { nodes: [{ label: `Team console and API`, note: `Cloudflare Worker · D1 · knowledge service`, tag: `cloud` }] },
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
