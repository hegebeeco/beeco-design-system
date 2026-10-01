import { useMemo, useState } from 'react';
import { DataTable, EmptyState, Button, FilterBar, matchText, type FilterDef, type FilterValues } from '../src';
import { pois } from './_adat-minta';
import { poiOszlopok } from './_adat-oszlopok';
import { Case, Grid, mount } from './_keret';

const ADAT = pois(312);
const o = (...l: string[]) => l.map((x) => ({ value: x, label: x }));
const KAT: FilterDef = { id: 'kat', label: 'Kategória', options: o('Vendéglátás', 'Szolgáltatás', 'Természet', 'Kereskedelem') };
const AKT: FilterDef = { id: 'akt', label: 'Aktív állapot', options: [{ value: 'igen', label: 'aktív' }, { value: 'nem', label: 'inaktív' }],
  help: 'Az inaktív POI nem látszik az appban, de a beállításai megmaradnak.' };
const CIMKE: FilterDef = { id: 'cimke', label: 'Címke', multiple: true, options: o('bio', 'javító', 'tanösvény', 'helyi termék', 'vegán', 'bérlés') };
const ALKAT: FilterDef = { id: 'alkat', label: 'Alkategória', parent: 'kat', options: o('Kávézó', 'Pékség', 'Étterem') };

/** Élő szűrés a mintaadaton – a találatszám és a táblázat ebből jön */
function Elo({ id, filters = [KAT, AKT, CIMKE], start = {}, narrow, table }: { id: string; filters?: FilterDef[]; start?: FilterValues; narrow?: boolean; table?: boolean }) {
  const [v, setV] = useState<FilterValues>(start);
  const [q, setQ] = useState('');
  const rows = useMemo(() => ADAT.filter((p) => matchText(p.nev, q)
    && (!v.kat || p.kategoria === v.kat) && (!v.akt || p.aktiv === (v.akt === 'igen'))
    && (!Array.isArray(v.cimke) || v.cimke.every((c) => p.cimkek.includes(c)))), [v, q]);
  const clear = () => { setV({}); setQ(''); };
  return (
    <div style={narrow ? { maxWidth: 360 } : undefined} className="bc-stack">
      <FilterBar search={{ label: id === 'elo' ? 'POI keresése' : `POI keresése (${id})`, value: q, onChange: setQ, placeholder: 'POI keresése (ékezet nélkül is)' }} filters={filters} values={v} onChange={setV}
        resultCount={rows.length} itemLabel="találat" />
      <p className="tl-out" data-out={id}>szűrők: {JSON.stringify(v)} · keresés: „{q}” · {rows.length} találat</p>
      {table && (
        <DataTable data={rows} columns={poiOszlopok} caption={`POI-k – szűrve (${id})`} getRowId={(p) => p.id} rowLabel={(p) => p.nev} itemLabel="POI" densityToggle={false}
          empty={<EmptyState compact title="Nincs találat" action={<Button variant="secondary" onClick={clear}>Szűrők törlése</Button>}>A szűrőkkel egy POI sem egyezik.</EmptyState>} />
      )}
    </div>
  );
}

function Fix({ id, ...p }: { id: string; filters: FilterDef[]; start: FilterValues; count?: number | null }) {
  const [v, setV] = useState<FilterValues>(p.start);
  return <><FilterBar filters={p.filters} values={v} onChange={setV} resultCount={p.count} /><p className="tl-out" data-out={id}>szűrők: {JSON.stringify(v)}</p></>;
}

const HET: FilterDef[] = [KAT, AKT, CIMKE,
  { id: 'kupon', label: 'Kupon', options: o('van', 'nincs') }, { id: 'esem', label: 'Esemény', options: o('van', 'nincs') },
  { id: 'edu', label: 'Edukatív anyag', options: o('van', 'nincs') }, { id: 'hiba', label: 'Nyitott adathiba', options: o('van', 'nincs') }];

function Oldal() {
  return (
    <>
      <Grid title="Szűrősáv (FilterBar) – 2B · mintaadat">
        <Case id="szuro-elo" title="Kereső + 3 szűrő, élő találatszám, táblázattal (0 találatnál üres állapot)" wide><Elo id="elo" table /></Case>
        <Case id="szuro-aktiv" title="Aktív szűrők: címkék, többes „+3”" wide>
          <Elo id="aktiv" start={{ kat: 'Vendéglátás', cimke: ['bio', 'vegán', 'javító', 'bérlés'] }} />
        </Case>
        <Case id="szuro-het" title="7 szűrő – széles képernyőn tördel" wide><Elo id="het" filters={HET} /></Case>
        <Case id="szuro-keskeny" title="Keskeny hely: „Szűrők (N)” gomb + panel, alján a találatszám"><Elo id="keskeny" narrow start={{ akt: 'igen' }} /></Case>
        <Case id="szuro-ervenytelen" title="Régi link: érvénytelen érték – kihagyja és szól">
          <Fix id="ervenytelen" filters={[KAT, CIMKE]} start={{ kat: 'Régi kategória', cimke: ['bio', 'torolt-cimke'] }} count={12} />
        </Case>
        <Case id="szuro-fuggo" title="Függő szűrő: a kategória törlése az alkategóriát is törli">
          <Fix id="fuggo" filters={[KAT, ALKAT]} start={{ kat: 'Vendéglátás', alkat: 'Kávézó' }} count={7} />
        </Case>
        <Case id="szuro-szamol" title="Találatszám számolás közben"><Fix id="szamol" filters={[KAT]} start={{ kat: 'Természet' }} count={null} /></Case>
        <Case id="szuro-hiba" title="A szűrő opciói nem töltöttek be / töltenek">
          <Fix id="hiba" filters={[{ ...KAT, options: [], loadError: 'Nem sikerült betölteni a kategóriákat.', onRetry: () => undefined }, { ...AKT, options: [], loading: true }]} start={{}} count={312} />
        </Case>
      </Grid>
    </>
  );
}
mount('Szűrősáv', 'FilterBar: kereső, szűrők, aktív-szűrő címkék, Szűrők törlése, találatszám; keskenyen gomb + panel. Minden adat mintaadat.', <Oldal />);
