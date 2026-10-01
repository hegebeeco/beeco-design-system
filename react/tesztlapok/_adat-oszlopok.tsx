// A tesztlapok közös POI-oszlopai (mintaadat) – a DataTable oszlop-definíciójának példája
import { createColumnHelper, formatHuDate } from '../src';
import type { Poi } from './_adat-minta';

const h = createColumnHelper<Poi>();

export const poiOszlopok = [
  h.accessor('nev', { header: 'Név', size: 240, meta: { label: 'Név' } }),
  h.accessor('kategoria', { header: 'Kategória', size: 150 }),
  h.accessor((r) => r.cimkek.join(', '), {
    id: 'cimkek', header: 'Címkék', enableSorting: false, size: 170,
    cell: (c) => (c.row.original.cimkek.length
      ? <span className="bc-row" style={{ gap: 'var(--bc-sp-1)', flexWrap: 'nowrap' }}>{c.row.original.cimkek.slice(0, 2).map((t) => <span key={t} className="bc-badge">{t}</span>)}{c.row.original.cimkek.length > 2 && <span className="bc-badge is-muted">+{c.row.original.cimkek.length - 2}</span>}</span>
      : <span className="bc-muted">nincs címke</span>),
  }),
  h.accessor('aktiv', {
    header: 'Aktív', size: 110,
    cell: (c) => (c.getValue() ? <span className="bc-badge is-success">aktív</span> : <span className="bc-badge is-muted">inaktív</span>),
  }),
  h.accessor('kepek', { header: 'Képek', size: 90, meta: { num: true, label: 'Képek (db)' } }),
  h.accessor('modositva', { header: 'Módosítva', size: 140, cell: (c) => formatHuDate(c.getValue()) }),
];

/** A lenyitott sor tartalma: a teljes név és a részletek */
export function PoiReszletek({ p }: { p: Poi }) {
  return (
    <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
      <li><strong>Teljes név:</strong> {p.nev}</li>
      <li><strong>Cím:</strong> {p.cim}</li>
      <li><strong>Képek:</strong> {p.kepek ?? '–'} db · <strong>Címkék:</strong> {p.cimkek.join(', ') || 'nincs'}</li>
    </ul>
  );
}
