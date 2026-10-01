import { useState } from 'react';
import { cx } from '../cx';
import { defaultLink, type RenderLink } from './NavTabs';

/** Egy szint. href nélkül nem link (pl. nincs jogosultság a szülőhöz). Az utolsó a mostani oldal. */
export type Crumb = { label: string; href?: string };

export type BreadcrumbsProps = {
  items: Crumb[];
  renderLink?: RenderLink;
  /** Ennyi szint fölött a középsők „…” mögé kerülnek (alap: 4) */
  maxVisible?: number;
  label?: string;
};

/**
 * Breadcrumbs / morzsamenü (molekula, Javaslat 03 – 7A): a cím fölött, nav + rendezett lista, a mostani oldal aria-current="page".
 * 4+ szintnél a középsők egy „…” gomb mögé kerülnek; telefonon csak a szülő marad: „‹ Sablonok”.
 * Hosszú név: egy sorban levágva, a teljes név title-ben.
 */
export function Breadcrumbs({ items, renderLink = defaultLink, maxVisible = 4, label = 'Hol vagy' }: BreadcrumbsProps) {
  const [expanded, setExpanded] = useState(false);
  const n = items.length;
  const collapse = !expanded && n > maxVisible;
  const shown = collapse ? [0, -1, n - 2, n - 1] : items.map((_, i) => i);
  return (
    <nav className="bc-crumbs" aria-label={label}>
      <ol>
        {shown.map((i) => {
          if (i === -1) {
            return (
              <li key="more" className="bc-crumb">
                <button type="button" className="bc-crumb-more" aria-label={`További ${n - 3} szint mutatása`} onClick={() => setExpanded(true)}>…</button>
              </li>
            );
          }
          const c = items[i];
          const last = i === n - 1;
          return (
            <li key={i} className={cx('bc-crumb', i === n - 2 && 'is-parent', last && 'is-current')}>
              {last ? <span aria-current="page" title={c.label}>{c.label}</span>
                : c.href ? renderLink({ href: c.href, children: <span title={c.label}>{c.label}</span> })
                : <span title={c.label}>{c.label}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
