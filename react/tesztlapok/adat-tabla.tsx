import { useMemo, useState } from 'react';
import { Button, DataNote, DataState, DataTable, EmptyState, Pagination, SkeletonRows, type PaginationState, type SortingState, IcNew } from '../src';
import { pois, type Poi } from './_adat-minta';
import { PoiReszletek, poiOszlopok } from './_adat-oszlopok';
import { Case, Grid, mount } from './_keret';

const SOK = pois(1200);
const KEVES = pois(6);
const ID = (p: Poi) => p.id;
const NEV = (p: Poi) => p.nev;

function Teljes() {
  const [sel, setSel] = useState<Record<string, boolean>>({});
  const [uzenet, setUzenet] = useState('');
  return (
    <>
      <DataTable data={SOK} columns={poiOszlopok} caption="POI-k (mintaadat)" getRowId={ID} rowLabel={NEV} itemLabel="POI"
        selectable maxSelection={200} selection={sel} onSelectionChange={setSel} renderExpanded={(p) => <PoiReszletek p={p} />} resizable
        bulkActions={(ids) => (<>
          <Button variant="secondary" size="sm" onClick={() => setUzenet(`módosítás: ${ids.length}`)}>Tömeges módosítás</Button>
          <Button variant="danger" size="sm" onClick={() => setUzenet(`törlés kérve: ${ids.length}`)}>Végleges törlés</Button>
        </>)} />
      <p className="tl-out" data-out="teljes">kijelölt: {Object.keys(sel).filter((k) => sel[k]).length} {uzenet && `· ${uzenet}`}</p>
    </>
  );
}

function Hibas() {
  const [st, setSt] = useState<'error' | 'loading' | 'ready'>('error');
  const retry = () => { setSt('loading'); setTimeout(() => setSt('ready'), 300); };
  return <DataTable data={st === 'ready' ? KEVES : []} columns={poiOszlopok} caption="POI-k – hiba" getRowId={ID} rowLabel={NEV} itemLabel="POI" status={st} onRetry={retry} densityToggle={false} />;
}

function Szerver() {
  // Szerveroldali lapozás és rendezés szimulálva: a „szerver” csak az aktuális lapot adja vissza
  const [pg, setPg] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sort, setSort] = useState<SortingState>([]);
  const lap = useMemo(() => {
    const all = pois(312);
    const s = sort[0];
    if (s) all.sort((a, b) => String(a[s.id as keyof Poi] ?? '').localeCompare(String(b[s.id as keyof Poi] ?? ''), 'hu') * (s.desc ? -1 : 1));
    return all.slice(pg.pageIndex * pg.pageSize, (pg.pageIndex + 1) * pg.pageSize);
  }, [pg, sort]);
  return <DataTable data={lap} columns={poiOszlopok} caption="Partnerek – szerveroldali lapozás" getRowId={ID} rowLabel={NEV} itemLabel="partner"
    serverRowCount={312} pagination={pg} onPaginationChange={setPg} sorting={sort} onSortingChange={setSort} densityToggle={false} />;
}

function Ures({ szurt }: { szurt?: boolean }) {
  const [n, setN] = useState(0);
  return (
    <>
      <DataTable data={[]} columns={poiOszlopok} caption={szurt ? 'POI-k – szűrésre üres' : 'POI-k – üres'} getRowId={ID} rowLabel={NEV} itemLabel="POI" densityToggle={false}
        empty={szurt
          ? <EmptyState compact title="Nincs találat" action={<Button variant="secondary" onClick={() => setN((x) => x + 1)}>Szűrők törlése</Button>}>A szűrőkkel egy POI sem egyezik.</EmptyState>
          : <EmptyState compact title="Még nincs POI" action={<Button icon={<IcNew />} onClick={() => setN((x) => x + 1)}>Új POI felvétele</Button>}>Az első helyszínt itt veheted fel.</EmptyState>} />
      <p className="tl-out" data-out={szurt ? 'szurt' : 'ures'}>teendő: {n}</p>
    </>
  );
}

function LapozoEgyedul() {
  const [p, setP] = useState(0);
  const [s, setS] = useState(25);
  return <><Pagination page={p} pageSize={s} total={312} itemLabel="partner" onPageChange={setP} onPageSizeChange={(x) => { setS(x); setP(0); }} /><p className="tl-out" data-out="lapozo">lap: {p + 1} · {s}/oldal</p></>;
}

function Oldal() {
  return (
    <>
      <Grid title="Adattáblázat (DataTable) – 1a A, 1b A · mintaadat">
        <Case id="tabla-teljes" title="1200 sor: rendezés, kijelölés (max. 200) + tömeges sáv, lenyitás, oszlophúzás, lapozás, sűrűség" wide><Teljes /></Case>
        <Case id="tabla-hianyzo" title="Hiányzó érték (–) a rendezés végén · egyenlő értékek stabilan · hosszú cella" wide>
          <DataTable data={KEVES} columns={poiOszlopok} caption="POI-k – hiányzó értékek" getRowId={ID} rowLabel={NEV} itemLabel="POI" renderExpanded={(p) => <PoiReszletek p={p} />} />
        </Case>
        <Case id="tabla-egy" title="1 sor" wide><DataTable data={pois(1)} columns={poiOszlopok} caption="POI-k – egy sor" getRowId={ID} rowLabel={NEV} itemLabel="POI" densityToggle={false} /></Case>
        <Case id="tabla-suru" title="Sűrű nézet, kijelöléssel" wide>
          <DataTable data={KEVES} columns={poiOszlopok} caption="POI-k – sűrű" getRowId={ID} rowLabel={NEV} itemLabel="POI" density="dense" selectable densityToggle={false} />
        </Case>
        <Case id="tabla-szerver" title="Szerveroldali lapozás és rendezés (312 partner, 10/oldal)" wide><Szerver /></Case>
        <Case id="tabla-rovid-link" title="Rövid nevű link a cellában (érintéssel is 44 × 44 px)">
          <DataTable data={[{ id: '1', nev: 'X' }, { id: '2', nev: 'vds' }]} getRowId={(r) => r.id} rowLabel={(r) => r.nev} caption="Rövid nevek" densityToggle={false}
            columns={[{ accessorKey: 'nev', header: 'Név', cell: ({ row }) => <a href="#rovid">{row.original.nev}</a> }]} />
        </Case>
        <Case id="tabla-ures" title="0 sor – üres állapot teendővel"><Ures /></Case>
        <Case id="tabla-szurt" title="Szűrésre üres – Szűrők törlése"><Ures szurt /></Case>
        <Case id="tabla-tolt" title="Töltés: a fejléc marad, csontváz-sorok">
          <DataTable data={[]} columns={poiOszlopok} caption="POI-k – töltés" getRowId={ID} rowLabel={NEV} status="loading" densityToggle={false} />
        </Case>
        <Case id="tabla-frissit" title="Frissítés: a régi adat látszik, felül töltésjel">
          <DataTable data={pois(3)} columns={poiOszlopok} caption="POI-k – frissítés" getRowId={ID} rowLabel={NEV} refreshing densityToggle={false} />
        </Case>
        <Case id="tabla-hiba" title="Hiba – Újrapróbálás"><Hibas /></Case>
        <Case id="tabla-jog" title="Nincs jogosultság">
          <DataTable data={[]} columns={poiOszlopok} caption="POI-k – jogosultság" getRowId={ID} rowLabel={NEV} status="forbidden" densityToggle={false} />
        </Case>
        <Case id="tabla-kartya" title={'Telefonon soronként kártya (mobile="cards", keskeny tároló)'}>
          <div style={{ maxWidth: 360 }}>
            <DataTable data={pois(4)} columns={poiOszlopok} caption="Partnerek – kártyanézet" getRowId={ID} rowLabel={NEV} itemLabel="partner" mobile="cards" selectable densityToggle={false} />
          </div>
        </Case>
      </Grid>
      <Grid title="Részek: lapozó, üres állapot, töltés, hiba, megjegyzés">
        <Case id="lapozo" title="Lapozó – 312 partner, 10 / 25 / 100" wide><LapozoEgyedul /></Case>
        <Case id="ures-allapot" title="Üres állapot (kép helye üres: a méhecske későbbi csomag)">
          <EmptyState title="Nincs találat" action={<Button variant="secondary">Szűrők törlése</Button>}>A szűrőkkel egy partner sem egyezik.</EmptyState>
        </Case>
        <Case id="allapot-tolt" title="DataState – töltés"><DataState status="loading" what="a partnereket" /></Case>
        <Case id="allapot-hiba" title="DataState – időtúllépés, újrapróbálás">
          <DataState status="error" error="A szerver nem válaszolt időben." onRetry={() => undefined} />
        </Case>
        <Case id="allapot-jog" title="DataState – nincs jogosultság"><DataState status="forbidden" /></Case>
        <Case id="csontvaz" title="Csontváz-sorok önállóan">
          <div className="bc-table-wrap"><table className="bc-table"><caption className="bc-sr">Csontváz</caption><thead><tr><th scope="col">Név</th><th scope="col">Kategória</th></tr></thead><tbody><SkeletonRows rows={3} cols={2} /></tbody></table></div>
        </Case>
        <Case id="megjegyzes" title="Adat-megjegyzés (DataNote)">
          <DataNote title="Mit számol ez az oldal?">Egy felhasználó naponta egyszer számít. A kevesebb mint 5 érintettből álló értékeket rejtjük.</DataNote>
        </Case>
      </Grid>
    </>
  );
}
mount('Adattáblázat', 'DataTable, lapozó, üres / töltés / hiba állapotok. Minden szám és név mintaadat.', <Oldal />);
