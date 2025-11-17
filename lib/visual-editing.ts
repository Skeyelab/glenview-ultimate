'use client';

import { apply, setAttr } from '@directus/visual-editing';

export { setAttr };

export function isVisualEditingEnabled(searchParams: URLSearchParams): boolean {
  return searchParams.get('visual-editing') === 'true';
}

export async function applyVisualEditing(directusUrl: string, opts?: { elements?: HTMLElement | HTMLElement[]; onSaved?: (d: unknown) => void }) {
  if (!directusUrl) {
    return { remove: () => {}, disable: () => {}, enable: () => {} };
  }
  return await apply({ directusUrl, ...opts });
}
