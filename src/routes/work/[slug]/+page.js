import { error } from '@sveltejs/kit';
import { projects } from '$lib/data/projects.js';

export function entries() {
  return projects.map(({ slug }) => ({ slug }));
}

export function load({ params }) {
  const project = projects.find(({ slug }) => slug === params.slug);

  if (!project) error(404, 'Project not found');

  return { project };
}
