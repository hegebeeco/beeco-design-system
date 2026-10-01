// Tesztlap – ListPage (06c): Partnerek lista mintaadattal; állapotok: ?allapot=toltes|ures|nincs-talalat|hiba|tiltott|hosszu
import { useMemo, useState } from 'react';
import {
  Button, DataTable, DropdownMenu, FilterBar, IconButton, MoreIcon, ListPage, RowActions, createColumnHelper, formatHuDate, matchText, notify, useDetailParam,
  type FilterDef, type FilterValues, type ListStatus,
} from '../src';
import { allapot, mountSablon, wait } from './_sablon-keret';
import { partnerek, TIPUSOK, type Partner } from './_sablon-minta';

const ADAT = partnerek(42);
const h = createColumnHelper<Partner>();
const ic = (d: string) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d={d} /></svg>;
const SZUROK: FilterDef[] = [
  { id: 'tipus', label: 'Típus', options: TIPUSOK.map((t) => ({ value: t, label: t })) },
  { id: 'aktiv', label: 'Állapot', options: [{ value: 'igen', label: 'aktív' }, { value: 'nem', label: 'inaktív' }] },
];
const ALLAPOTOK: Array<[string, string]> = [['toltes', 'Töltés'], ['ures', 'Üres lista'], ['nincs-talalat', 'Nincs találat'], ['hiba', 'Hiba'], ['tiltott', 'Nincs jogosultság'], ['hosszu', 'Hosszú cím, sok gomb']];

function Oldal() {
  const a = allapot();
  const [q, setQ] = useState(a === 'nincs-talalat' ? 'zzzz' : '');
  const [v, setV] = useState<FilterValues>({});
  const [hiba, setHiba] = useState(a === 'hiba');
  const [retrying, setRetrying] = useState(false);
  const detail = useDetailParam();
  const rows = useMemo(() => (a === 'ures' ? [] : ADAT).filter((p) => matchText(p.nev, q)
    && (!v.tipus || p.tipus === v.tipus) && (!v.aktiv || p.aktiv === (v.aktiv === 'igen'))), [a, q, v]);
  const open = ADAT.find((p) => p.id === detail.id);

  // Az oszlopok memoizálva: új cella-függvény minden rajzolásnál újracsatolná a sor gombjait, és a panel bezárásakor a fókusz nem találna vissza
  const oszlopok = useMemo(() => [
    h.accessor('nev', { header: 'Név', size: 260, meta: { label: 'Név' } }),
    h.accessor('varos', { header: 'Város', size: 120 }),
    h.accessor('tipus', { header: 'Típus', size: 140 }),
    h.accessor('aktiv', { header: 'Állapot', size: 110, cell: (c) => (c.getValue() ? <span className="bc-badge is-success">aktív</span> : <span className="bc-badge is-muted">inaktív</span>) }),
    h.accessor('kuponok', { header: 'Kuponok', size: 100, meta: { num: true, label: 'Kuponok (db)' } }),
    h.accessor('modositva', { header: 'Módosítva', size: 130, cell: (c) => formatHuDate(c.getValue()) }),
    h.display({ id: 'muv', header: 'Műveletek', size: 120, enableSorting: false, cell: (c) => (
      <RowActions rowLabel={c.row.original.nev} actions={[
        { label: 'Részletek', icon: ic('M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 100 6 3 3 0 000-6z'), onSelect: () => detail.open(c.row.original.id) },
        { label: 'Szerkesztés', icon: ic('M4 20h4L19 9l-4-4L4 16v4z'), onSelect: () => { location.href = 'sablon-szerkeszto.html'; } },
      ]} />
    ) }),
  ], [detail.open]);

  const status: ListStatus = a === 'toltes' ? 'loading' : a === 'tiltott' ? 'forbidden' : hiba ? 'error' : a === 'ures' ? 'empty' : rows.length ? 'ready' : 'no-results';
  const hosszu = a === 'hosszu';
  const clear = () => { setQ(''); setV({}); };
  const retry = async () => { setRetrying(true); await wait(500); setRetrying(false); setHiba(false); };

  return (
    <ListPage
      title={hosszu ? 'Partnerek – a Méhesdi Önkormányzat Fenntarthatósági és Környezetvédelmi Irodájának együttműködő partnerei (2026. ősz)' : 'Partnerek'}
      description="Az appban megjelenő helyi partnerek. Mintaadat – nem valódi beeco-adat."
      breadcrumbs={hosszu
        ? [{ label: 'Admin', href: 'sablon-lista.html' }, { label: 'Tartalom', href: '#' }, { label: 'Méhesd', href: '#' }, { label: 'Önkormányzati partnerek és együttműködések', href: '#' }, { label: 'Partnerek' }]
        : [{ label: 'Admin', href: 'sablon-lista.html' }, { label: 'Partnerek' }]}
      actions={<>
        <Button variant="secondary" onClick={() => notify.info('Mintaadat: az export itt nem készül el.')}>Exportálás</Button>
        {hosszu && (
          <DropdownMenu label="További műveletek: Partnerek" trigger={<IconButton aria-label="További műveletek: Partnerek"><MoreIcon /></IconButton>}
            items={[{ label: 'Importálás táblázatból', onSelect: () => notify.info('Mintaadat: importálás itt nincs.') }, { label: 'Oszlopok beállítása', onSelect: () => notify.info('Mintaadat.') }]} />
        )}
      </>}
      primaryAction={<a className="bc-btn" href="sablon-szerkeszto.html">Új partner</a>}
      filters={<FilterBar search={{ label: 'Partner keresése', value: q, onChange: setQ, placeholder: 'Partner keresése' }} filters={SZUROK} values={v} onChange={setV} resultCount={rows.length} itemLabel="partner" />}
      status={status} what="a partnereket" onRetry={() => void retry()} retrying={retrying}
      skeleton={<DataTable data={[] as Partner[]} columns={oszlopok} caption="Partnerek" getRowId={(p) => p.id} rowLabel={(p) => p.nev} status="loading" densityToggle={false} />}
      emptyAction={<Button variant="secondary" onClick={() => notify.info('Mintaadat: importálás itt nincs.')}>Partnerek importálása</Button>}
      onClearFilters={clear}
      detail={{
        open: Boolean(open), onClose: detail.close, title: open?.nev ?? '', description: open ? `${open.tipus} · ${open.varos}` : undefined,
        footer: <><a className="bc-btn is-secondary" href="sablon-reszletek.html">Teljes oldal</a><a className="bc-btn" href="sablon-szerkeszto.html">Szerkesztés</a></>,
        children: open && (
          <dl className="bc-stack" data-out="reszlet">
            <div><dt className="bc-muted">Azonosító</dt><dd>{open.id}</dd></div>
            <div><dt className="bc-muted">Állapot</dt><dd>{open.aktiv ? 'aktív' : 'inaktív'}</dd></div>
            <div><dt className="bc-muted">Kuponok</dt><dd>{open.kuponok} db</dd></div>
            <div><dt className="bc-muted">Módosítva</dt><dd>{formatHuDate(open.modositva)}</dd></div>
          </dl>
        ),
      }}>
      <DataTable data={rows} columns={oszlopok} caption="Partnerek" getRowId={(p) => p.id} rowLabel={(p) => p.nev} itemLabel="partner" densityToggle={false} />
    </ListPage>
  );
}

mountSablon('sablon-lista', 'Lista-oldal (ListPage)', ALLAPOTOK, <Oldal />);
