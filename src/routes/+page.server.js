import snapshot from '$lib/data/github-contributions.json';
import deepMlSnapshot from '$lib/data/deep-ml-progress.json';

const contributionsUrl = 'https://github.com/users/talal95c/contributions';
const deepMlUrl = 'https://raw.githubusercontent.com/talal95c/deep-ml/main/progress.json';

function parseContributions(content) {
  const totalMatch = content.match(/([\d,]+)\s+contributions\s+in the last year/i);
  if (!totalMatch) throw new Error('GitHub contribution total was not found');

  const tooltips = new Map();
  for (const match of content.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/gi)) {
    const cellId = match[1].match(/\bfor="([^"]+)"/i)?.[1];
    if (cellId) {
      const text = match[2].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      tooltips.set(cellId, text);
    }
  }

  const contributions = [];
  for (const match of content.matchAll(/<td\b([^>]*)>/gi)) {
    const attributes = match[1];
    const date = attributes.match(/\bdata-date="([^"]+)"/i)?.[1];
    const level = attributes.match(/\bdata-level="([0-4])"/i)?.[1];
    const cellId = attributes.match(/\bid="([^"]+)"/i)?.[1];
    if (!date || level === undefined || !cellId) continue;

    const tooltip = tooltips.get(cellId) ?? '';
    const countMatch = tooltip.match(/([\d,]+)\s+contributions?/i);
    const count = countMatch
      ? Number(countMatch[1].replace(/,/g, ''))
      : /\bno contributions\b/i.test(tooltip)
        ? 0
        : null;

    contributions.push({ date, level: Number(level), count });
  }

  if (contributions.length === 0) throw new Error('GitHub contribution cells were not found');
  contributions.sort((a, b) => a.date.localeCompare(b.date));

  return {
    total: Number(totalMatch[1].replace(/,/g, '')),
    contributions
  };
}

async function loadContributions() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(contributionsUrl, { signal: controller.signal });
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
    return parseContributions(await response.text());
  } catch {
    return snapshot;
  } finally {
    clearTimeout(timeout);
  }
}

async function loadDeepMl() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(deepMlUrl, { signal: controller.signal });
    if (!response.ok) throw new Error(`Deep-ML returned ${response.status}`);
    const progress = await response.json();
    if (!progress?.items || typeof progress.items !== 'object') {
      throw new Error('Deep-ML progress items were not found');
    }
    return progress;
  } catch {
    return deepMlSnapshot;
  } finally {
    clearTimeout(timeout);
  }
}

export async function load() {
  const [githubActivity, deepMl] = await Promise.all([loadContributions(), loadDeepMl()]);
  return { githubActivity, deepMl };
}
