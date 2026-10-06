// ADMIN – Partnerek (/partners): ListPage + FilterBar + DataTable. Fejlécek: beeco-admin/src/pages/Partners (2026-10-06). Minden adat MINTA.
import { useMemo, useState } from 'react';
import { DataTable, FilterBar, ListPage, RowActions, StatusBadge, Button, IcNew, createColumnHelper, matchText, type FilterDef, type FilterValues } from '../../../react/src';
import { mount, ic, I } from './_keret';

type P = { id: string; nev: string; kitoltott: number; frisseseg: 'Friss' | 'Frissítésre vár' | 'Elavult'; siker: number; bevaltas: number; kategoria: string; kupon: boolean };
const NEVEK = ['Példa Kávézó', 'Kert utcai Bolt', 'Minta Javítóműhely', 'Zöld Sarok Bisztró', 'Csere-Bere Pont', 'Példa Kölcsönző', 'Mintakert Közösség', 'Szelektív Udvar'];
const KAT = ['Étkezés', 'Üzlet', 'Javítás', 'Étkezés', 'Hulladék', 'Kölcsönzés', 'Közösség', 'Hulladék'];
const ADAT: P[] = NEVEK.map((nev, i) => ({ id: `p${i}`, nev, kitoltott: [92, 78, 64, 88, 55, 71, 96, 60][i], frisseseg: (['Friss', 'Frissítésre vár', 'Elavult'] as const)[i % 3], siker: [81, 64, 42, 77, 38, 59, 90, 47][i], bevaltas: [128, 64, 12, 96, 0, 23, 41, 7][i], kategoria: KAT[i], kupon: i % 4 !== 2 }));
const TONE = { Friss: 'success', 'Frissítésre vár': 'info', Elavult: 'warning' } as const;
const h = createColumnHelper<P>();
const SZUROK: FilterDef[] = [
  { id: 'kupon', label: 'Kupon', options: [{ value: 'van', label: 'Van aktív kupon-időzítés' }, { value: 'nincs', label: 'Nincs aktív kupon-időzítés' }] },
  { id: 'esemeny', label: 'Esemény', options: [{ value: 'van', label: 'Van aktuális vagy jövőbeli esemény' }, { value: 'nincs', label: 'Nincs' }] },
];

function Oldal() {
  const [q, setQ] = useState(''); const [v, setV] = useState<FilterValues>({});
  const rows = useMemo(() => ADAT.filter((p) => matchText(p.nev, q) && (!v.kupon || (v.kupon === 'van') === p.kupon)), [q, v]);
  const cols = useMemo(() => [
    h.accessor('nev', { header: 'Cégnév', size: 220 }),
    h.accessor('kitoltott', { header: 'Kitöltöttség', size: 110, cell: (c) => `${c.getValue()}%`, meta: { num: true } }),
    h.accessor('frisseseg', { header: 'Frissesség', size: 150, cell: (c) => <StatusBadge tone={TONE[c.getValue()]}>{c.getValue()}</StatusBadge> }),
    h.accessor('siker', { header: 'Sikeresség', size: 110, cell: (c) => `${c.getValue()} pont`, meta: { num: true } }),
    h.accessor('bevaltas', { header: 'Beváltás', size: 100, meta: { num: true } }),
    h.accessor('kategoria', { header: 'Kategória', size: 120, cell: (c) => <span className="bc-tag">{c.getValue()}</span> }),
    h.display({ id: 'muv', header: 'Műveletek', size: 110, enableSorting: false, cell: (c) => <RowActions rowLabel={c.row.original.nev} actions={[
      { label: 'Megnyitás', icon: ic('M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 100 6 3 3 0 000-6z'), onSelect: () => {} },
      { label: 'Szerkesztés', icon: ic('M4 20h4L19 9l-4-4L4 16v4z'), onSelect: () => {} }]} /> }),
  ], []);
  return (
    <ListPage title="Partnerek" description="A beeco partnerei: boltok, kávézók, javítók, önkormányzatok – profil, tartalom, sikeresség."
      actions={<Button variant="secondary">{ic(I.info)} Figyelmet igényel</Button>}
      primaryAction={<a className="bc-btn" href="#"><IcNew /> Új partner</a>}
      filters={<div data-ds="2"><FilterBar search={{ label: 'Partner keresése', value: q, onChange: setQ, placeholder: 'Cégnév' }} filters={SZUROK} values={v} onChange={setV} resultCount={rows.length} itemLabel="partner" /></div>}
      status={rows.length ? 'ready' : 'no-results'} what="a partnereket" onClearFilters={() => { setQ(''); setV({}); }}>
      <div data-ds="3"><DataTable data={rows} columns={cols} caption="Partnerek" getRowId={(p) => p.id} rowLabel={(p) => p.nev} itemLabel="partner" density="dense" densityToggle={false} /></div>
    </ListPage>
  );
}
mount('admin', 'Partnerek', <Oldal />, [['.bc-sidebar', 1], ['.bc-row-actions', 4], ['.bc-btn:not(.is-secondary)', 5]]);
