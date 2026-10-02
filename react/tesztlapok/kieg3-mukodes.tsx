// Tesztlap – Javaslat 13: működést javító elemek (StageDialog, StatusBadge, useListState + listStatus, ScheduleField, MapPanel, notify.undo, piszkozat)
import { useMemo, useState } from 'react';
import {
  Button, DataTable, EditPage, MapPanel, ScheduleField, StageDialog, StatusBadge, TextField, Toaster, listStatus, notify, scheduleIssues, useListState, type ScheduleValue,
} from '../src';
import { Case, Grid, mount } from './_keret';

const holnap = () => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10); };
const tegnap = () => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10); };

function Szinpad() {
  const [open, setOpen] = useState(false);
  const [fut, setFut] = useState(false);
  const [eredmeny, setEredmeny] = useState('');
  const indit = () => { setFut(true); setEredmeny(''); window.setTimeout(() => { setFut(false); setEredmeny('1. nyertes: Minta Méhész'); }, 1200); };
  return (
    <>
      <Button onClick={() => setOpen(true)}>Színpad megnyitása</Button>
      <StageDialog open={open} onOpenChange={setOpen} title="Őszi locsolójáték – sorsolás" closable={!fut} announce={fut ? 'Sorsolás folyamatban…' : eredmeny} closeLabel="Színpad bezárása">
        <p data-out="szinpad">{fut ? 'Pörög…' : eredmeny || 'Még nincs kisorsolva'}</p>
        {!fut && <Button onClick={indit}>Kisorsolom</Button>}
      </StageDialog>
    </>
  );
}

function Lista() {
  const [params, setP] = useState(() => new URLSearchParams('lap=3'));
  const l = useListState({ params, setParams: setP }, { filters: ['tipus'] });
  const [allapot, setAllapot] = useState<'tolt' | 'kesz' | 'hiba'>('kesz');
  const ADAT = useMemo(() => ['bolt', 'bolt', 'javító', 'kávézó'], []);
  const talalat = ADAT.filter((t) => (!l.filter('tipus') || t === l.filter('tipus')) && t.includes(l.search));
  const st = listStatus({ isPending: allapot === 'tolt', isError: allapot === 'hiba', hasData: allapot === 'kesz', count: allapot === 'kesz' ? talalat.length : 0, filtered: l.hasFilters || l.hasSearch });
  return (
    <div className="bc-stack">
      <div className="bc-row">
        <Button size="sm" variant="secondary" onClick={() => l.setFilter('tipus', 'bolt')}>Típus: bolt</Button>
        <Button size="sm" variant="secondary" onClick={() => l.setFilter('tipus', 'virág')}>Típus: virág (0)</Button>
        <Button size="sm" variant="secondary" onClick={() => l.clear()}>Szűrők törlése</Button>
        <Button size="sm" variant="secondary" onClick={() => setAllapot('tolt')}>Töltés</Button>
        <Button size="sm" variant="secondary" onClick={() => setAllapot('hiba')}>Hiba</Button>
        <Button size="sm" variant="secondary" onClick={() => setAllapot('kesz')}>Kész</Button>
      </div>
      <p className="tl-out" data-out="lista">url: {params.toString() || '(üres)'} · lap: {l.page} · státusz: {st} · találat: {talalat.length}</p>
    </div>
  );
}

function Idozites() {
  const [v, setV] = useState<ScheduleValue>({ date: null, time: null, endDate: null, endTime: null });
  return (
    <div className="bc-stack">
      <ScheduleField label="Megjelenés" withEnd endLabel="Lejárat" value={v} onChange={setV} />
      <div className="bc-row">
        <Button size="sm" variant="secondary" onClick={() => setV({ date: tegnap(), time: '10:00', endDate: null, endTime: null })}>Múltbeli kezdés</Button>
        <Button size="sm" variant="secondary" onClick={() => setV({ date: holnap(), time: '10:00', endDate: holnap(), endTime: '09:00' })}>Vége a kezdés előtt</Button>
      </div>
      <p className="tl-out" data-out="idozites">{JSON.stringify(scheduleIssues(v))}</p>
    </div>
  );
}

function Piszkozat() {
  const [nev, setNev] = useState('');
  const [mentett, setMentett] = useState('');
  return (
    <EditPage title="Piszkozatos űrlap" dirty={nev !== mentett} onSubmit={() => { setMentett(nev); }}
      draft={{ key: 'tesztlap:piszkozat', values: { nev }, onRestore: (v: { nev: string }) => setNev(v.nev) }} successMessage="Mentve (mintaadat).">
      <TextField label="Név" help="Gépelj, várj 1 mp-et, töltsd újra a lapot: felajánlja a visszaállítást." maxLength={40} value={nev} onChange={(e) => setNev(e.target.value)} />
    </EditPage>
  );
}

function Szukulo() {
  const [n, setN] = useState(60);
  const sorok = useMemo(() => Array.from({ length: n }, (_, i) => ({ id: String(i + 1), nev: `Sor ${i + 1}` })), [n]);
  return (
    <div className="bc-stack">
      <div className="bc-row"><Button size="sm" variant="secondary" onClick={() => setN(60)}>60 sor</Button><Button size="sm" variant="secondary" onClick={() => setN(5)}>5 sor</Button></div>
      <DataTable data={sorok} columns={[{ accessorKey: 'nev', header: 'Név' }]} caption="Szűkülő adat" getRowId={(r) => r.id} rowLabel={(r) => r.nev} pageSizes={[10, 25]} densityToggle={false} />
    </div>
  );
}

function Oldal() {
  const [rejtett, setRejtett] = useState(false);
  const [terkep, setTerkep] = useState<'kesz' | 'tolt' | 'hiba' | 'ures'>('kesz');
  return (
    <>
      <Toaster />
      <Grid title="Javaslat 13 – működést javító elemek">
        <Case id="szinpad" title="StageDialog: fókusz a ✕-re, folyamat közben nem zárható, élő bejelentés, fókusz vissza"><Szinpad /></Case>
        <Case id="statusz" title="StatusBadge: minden hangnem piktogrammal + szöveggel (szín nélkül is olvasható)">
          <div className="bc-row">
            <StatusBadge tone="success">Aktív</StatusBadge><StatusBadge tone="warning">Időzített</StatusBadge><StatusBadge tone="danger">Hibás</StatusBadge>
            <StatusBadge tone="info">Friss</StatusBadge><StatusBadge tone="muted">Lejárt</StatusBadge><StatusBadge tone="accent">Kiemelt</StatusBadge>
            <StatusBadge tone="success" title="Hosszú felirat sem törik">Megoldva – 2026. október 2.</StatusBadge>
          </div>
        </Case>
        <Case id="lista" title="useListState + listStatus: szűrésre a lap 0-ra áll; töltés / hiba / üres / nincs találat"><Lista /></Case>
        <Case id="idozites" title="ScheduleField: Azonnal / Időzítve, lejárat; múltbeli kezdés és a kezdés előtti vég jelzése"><Idozites /></Case>
        <Case id="terkep" title="MapPanel: Térkép | Lista, jelmagyarázat-hely, töltés / hiba / üres" wide>
          <div className="bc-row">
            {(['kesz', 'tolt', 'hiba', 'ures'] as const).map((s) => <Button key={s} size="sm" variant="secondary" onClick={() => setTerkep(s)}>{s}</Button>)}
          </div>
          <MapPanel label="Minta POI-k" status={terkep === 'tolt' ? 'loading' : terkep === 'hiba' ? 'error' : 'ready'} onRetry={() => setTerkep('kesz')}
            empty={terkep === 'ures' ? { title: 'Nincs térképen megjeleníthető hely', text: 'A szűrésnek egy hely sem felel meg.' } : null}
            legend={<p className="bc-muted">Jelmagyarázat helye</p>} note="1 hely hibás koordináta miatt nem látszik." height="200px"
            list={[{ id: '1', title: 'Zöld Sarok Bolt', detail: 'Pécs, Király u. 1.', href: '#bolt' }, { id: '2', title: 'Biciklis javító', detail: 'Pécs, Rákóczi út 5.', href: '#javito' }]}>
            <div className="tl-terkep-hely" style={{ display: 'grid', placeItems: 'center' }}>(itt rajzol a projekt Leaflet-térképe)</div>
          </MapPanel>
        </Case>
        <Case id="visszavonas" title="notify.undo: visszafordítható művelet megerősítés helyett">
          <Button variant="secondary" disabled={rejtett} onClick={() => { setRejtett(true); notify.undo('A hibajegy megoldottnak jelölve.', () => setRejtett(false)); }}>Megoldottnak jelölöm</Button>
          <p className="tl-out" data-out="visszavonas">hibajegy: {rejtett ? 'megoldva' : 'nyitott'}</p>
        </Case>
        <Case id="szukul" title="DataTable: a 3. lapon állva az adat 5 sorra szűkül → az 1. lapra lép (nem marad üres lap)"><Szukulo /></Case>
        <Case id="piszkozat" title="Piszkozat (EditPage draft): újratöltés után visszaállítható, mentés után törlődik" wide><Piszkozat /></Case>
      </Grid>
    </>
  );
}

mount('Javaslat 13 – működést javító elemek', 'Színpad, állapotjelvény, lista-állapot, időzítés, térkép-panel, visszavonás, piszkozat – minden állapot és szélső eset.', <Oldal />);
