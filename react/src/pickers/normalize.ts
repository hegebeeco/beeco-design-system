import { createElement, Fragment, type ReactNode } from 'react';

/** Keresési alak: kisbetű, ékezet nélkül („Kávé” → „kave”). Az előre összetett magyar betűknél a hossz nem változik. */
export const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** A találat kiemelése <mark>-kal (ékezet-függetlenül) */
export function highlight(label: string, query: string): ReactNode {
  const q = norm(query.trim());
  if (!q) return label;
  const i = norm(label).indexOf(q);
  if (i < 0) return label;
  return createElement(Fragment, null, label.slice(0, i), createElement('mark', null, label.slice(i, i + q.length)), label.slice(i + q.length));
}
