import { useId } from 'react';
import type { Table } from '@tanstack/react-table';
import { headerText } from './dataTableColumns';

/**
 * Rendezés-választó a kártyanézethez (mobile="cards"): ott nincs fejléc, ezért a rendezés egy natív választóból jön.
 * Nézetvezérlő, nem adatbevitel – ezért nincs súgója (mint a SegmentedControl-nak). Csak keskeny tárolóban látszik (CSS).
 */
export function SortSelect<T>({ table }: { table: Table<T> }) {
  const id = useId();
  const cols = table.getAllLeafColumns().filter((c) => c.getCanSort());
  const s = table.getState().sorting[0];
  const value = s ? `${s.id}:${s.desc ? 'desc' : 'asc'}` : '';
  return (
    <div className="bc-dt-sortsel">
      <label className="bc-label" htmlFor={id}>Rendezés</label>
      <select id={id} className="bc-select" value={value}
        onChange={(e) => { const [cid, dir] = e.target.value.split(':'); table.setSorting(cid ? [{ id: cid, desc: dir === 'desc' }] : []); }}>
        <option value="">Nincs rendezés</option>
        {cols.flatMap((c) => [
          <option key={`${c.id}a`} value={`${c.id}:asc`}>{headerText(c)} – növekvő</option>,
          <option key={`${c.id}d`} value={`${c.id}:desc`}>{headerText(c)} – csökkenő</option>,
        ])}
      </select>
    </div>
  );
}
