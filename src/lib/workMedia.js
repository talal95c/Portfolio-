import { media } from '$lib/data/media.js';

export function workImage(entry) {
  const { src: original, frame = false } = typeof entry === 'string' ? { src: entry } : entry;
  const image = media[original];
  const variant = frame ? image : (image?.card ?? image);
  return { original, ...(variant ?? { src: original, width: 890, height: 676 }), alpha: image?.alpha === true };
}

export function workMedia(project) {
  const caseStudy = project.caseStudy ?? {};
  const entries = caseStudy.media ?? [caseStudy.poster ?? caseStudy.heroImages?.[0] ?? project.images[0]];
  return entries.map(workImage);
}
