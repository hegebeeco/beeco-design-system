// Tesztlap – Dashboard (06c): analitika mintaadattal; állapotok: ?allapot=toltes|ures|hiba|tiltott
// MINTAADAT: minden szám kitalált, csak a sablon kipróbálására.
import { useState } from 'react';
import {
  BarChart, Button, ChartCard, Dashboard, DateRangePicker, GroupedBarChart, LineChart, SegmentedControl, notify,
  type ChartData, type DashboardStat, type DateRange,
} from '../src';
import { allapot, mountSablon, wait } from './_sablon-keret';
import { hibajegyek, kategoriak, kuponHetente, ures } from './_adat-minta';

const ALLAPOTOK: Array<[string, string]> = [['toltes', 'Töltés'], ['ures', 'Nincs adat'], ['hiba', 'Hiba'], ['tiltott', 'Nincs jogosultság']];
const IDOSZAK: Record<'30' | '90', DateRange> = { '30': { start: '2026-09-01', end: '2026-09-30' }, '90': { start: '2026-07-01', end: '2026-09-30' } };
// Időszakonként más mintaszámok – így látszik, hogy váltáskor a szám már NEM pörög fel újra
const SZAMOK: Record<'30' | '90', number[]> = { '30': [128, 342, 17, 9], '90': [131, 1046, 52, 31] };

const K = { help: 'Mintaadat – a valódi oldalon a forrás és a számítás módja áll itt.', source: 'beeco admin – mintaadat · lekérdezve: 2026. 10. 01. 09:12' };

function Oldal() {
  const a = allapot();
  const [gyors, setGyors] = useState<'30' | '90'>('90');
  const [range, setRange] = useState<DateRange>(IDOSZAK['90']);
  const [tolt, setTolt] = useState(a === 'toltes');
  const [hiba, setHiba] = useState(a === 'hiba');
  const nincs = a === 'ures';
  const valt = async (g: '30' | '90') => { setGyors(g); setRange(IDOSZAK[g]); setTolt(true); await wait(400); setTolt(false); };
  const n = SZAMOK[gyors];
  const v = (i: number) => (nincs ? null : n[i]);
  const period = `${range.start?.replace(/-/g, '. ')}. – ${range.end?.replace(/-/g, '. ') ?? '…'}.`;

  const stats: DashboardStat[] = [
    { id: 'partner', label: 'Aktív partnerek', value: v(0), unit: 'db', period, delta: { value: 4, compare: 'az előző időszakhoz' }, ...K },
    { id: 'bevaltas', label: 'Beváltott kuponok', value: v(1), unit: 'db', period, delta: { value: 12.5, unit: '%', decimals: 1, compare: 'az előző időszakhoz' }, trend: nincs ? undefined : [12, 14, 13, 17, 16, 19, null, 22, 24, 23, 27, 29], ...K },
    { id: 'poi', label: 'Új POI-k', value: v(2), unit: 'db', period, delta: 'new', ...K },
    { id: 'hibajegy', label: 'Nyitott adathibák', value: v(3), unit: 'db', period, good: 'down', delta: { value: -3, unit: 'db', compare: 'az előző időszakhoz' }, ...K },
  ].map((s) => ({ ...s, loading: tolt })) as DashboardStat[];
  const d = (x: ChartData) => (nincs ? ures : x);
  const cs = tolt ? 'loading' : 'ready';
  const how = <p>Mintaadat. A magasabb érték több eseményt jelent az adott időszakban; nem következik belőle, mi okozta.</p>;

  return (
    <Dashboard title="Analitika" description="Mi történt a kiválasztott időszakban. Mintaadat – nem valódi beeco-adat."
      breadcrumbs={[{ label: 'Admin', href: 'sablon-lista.html' }, { label: 'Analitika' }]}
      status={a === 'tiltott' ? 'forbidden' : hiba ? 'error' : 'ready'} onRetry={() => setHiba(false)}
      actions={<Button variant="secondary" onClick={() => notify.info('Mintaadat: az export itt nem készül el.')}>Exportálás</Button>}
      period={<DateRangePicker label="Időszak" help="A számok és a grafikonok erre az időszakra vonatkoznak (helyi idő szerint, a végnap is benne van)." value={range}
        onChange={setRange} max="2026-09-30" />}
      toolbar={<SegmentedControl label="Gyors időszak" value={gyors} onChange={(g) => void valt(g)} items={[{ value: '30', label: 'Utolsó 30 nap' }, { value: '90', label: 'Utolsó 90 nap' }]} />}
      moment={nincs ? undefined : { pillanat: 'merfoldko', valtozat: 0, sima: 'Elértétek a negyedéves beváltási célt (mintaadat).' }}
      stats={stats}
      charts={<>
        <ChartCard className="is-wide" title="Aktivált és beváltott kuponok hetente" unit="db / hét" period={period} howToRead={how} data={d(kuponHetente)} status={cs} sample {...K}>
          <LineChart data={d(kuponHetente)} />
        </ChartCard>
        <ChartCard title="POI-k kategóriánként" unit="db" period={period} howToRead={how} data={d(kategoriak)} status={cs} sample {...K}>
          <BarChart data={d(kategoriak)} orientation="horizontal" />
        </ChartCard>
        <ChartCard title="Létrejött és megoldott adathibák" unit="db / hét" period={period} howToRead={how} data={d(hibajegyek)} status={cs} sample {...K}>
          <GroupedBarChart data={d(hibajegyek)} />
        </ChartCard>
      </>}>
      <p className="tl-out" data-out="idoszak">időszak: {gyors} nap</p>
    </Dashboard>
  );
}

mountSablon('sablon-iranyitopult', 'Irányítópult (Dashboard)', ALLAPOTOK, <Oldal />);
