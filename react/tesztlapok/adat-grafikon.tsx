import { useState } from 'react';
import { BarChart, Button, ChartCard, GroupedBarChart, LineChart, StackedBarChart, type ChartData } from '../src';
import { K } from './_adat-kartya';
import { egySorozat, hibajegyek, kategoriak, kuponHetente, tartalmak } from './_adat-minta';
import { Case, Grid, mount } from './_keret';

function Teljes() {
  const [cb, setCb] = useState(false);
  return (
    <div data-cb={cb ? 'true' : undefined} className="bc-stack" data-out="cb">
      <div className="bc-row"><Button variant="secondary" size="sm" aria-pressed={cb} onClick={() => setCb(!cb)}>Színtévesztő-barát színek: {cb ? 'be' : 'ki'}</Button></div>
      <ChartCard title="Aktivált és beváltott kuponok hetente" unit="db / hét" period="2026. 07. 06. – 09. 27." sample rememberKey="tesztlap-kupon"
        help="Egy kupon egyszer számít aktiváltnak, amikor a felhasználó elmenti; beváltásnak, amikor a partner lezárja. Mintaadat."
        howToRead={<><p>Minden pont egy hét összesítése. Ha a két vonal közelít, az aktivált kuponok nagyobb részét váltják be.</p><p>A csíkos sáv rejtett hét: kevesebb mint 5 felhasználó volt benne, ezért nem mutatjuk. Ez nem nulla.</p><p>Nem következik belőle, hogy a kupon miatt jöttek többen: a nyári szezon is számít.</p></>}
        source="beeco admin, kuponbeváltási események – mintaadat · lekérdezve: 2026. 10. 01. 09:12 · UTC szerinti hetek" data={kuponHetente}>
        <LineChart data={kuponHetente} />
      </ChartCard>
    </div>
  );
}

// Állapot-paletta + sorozat-kapcsoló (Javaslat 14) – kitalált MINTAadat: 30 nap, 5 állapot-sáv (1 = jó … 5 = rossz)
const NAPOK = Array.from({ length: 30 }, (_, i) => `09. ${String(i + 1).padStart(2, '0')}.`);
const allapotNapok: ChartData = {
  categories: NAPOK,
  series: ['Rendben', 'Enyhén szomjas', 'Szomjas', 'Nagyon szomjas', 'Kritikus'].map((label, k) => ({
    key: `s${k + 1}`, label, values: NAPOK.map((_, i) => Math.max(0, Math.round(8 - k * 1.5 + ((i * (k + 3)) % 7) - 3))),
  })),
  unit: 'fa', xLabel: 'nap', palette: 'allapot',
};

function Allapot() {
  const [cb, setCb] = useState(false);
  return (
    <div data-cb={cb ? 'true' : undefined} className="bc-stack" style={{ maxWidth: 560 }}>
      <div className="bc-row"><Button variant="secondary" size="sm" aria-pressed={cb} onClick={() => setCb(!cb)}>Színtévesztő-barát színek: {cb ? 'be' : 'ki'}</Button></div>
      <ChartCard title="Fák állapota naponta" unit="fa / nap" period="2026. 09. 01. – 09. 30." sample seriesToggle rememberKey="tesztlap-allapot"
        help="Hány öntözött fa tartozott naponta az egyes szomjúság-sávokba. Mintaadat."
        howToRead={<p>Minden vonal egy állapot-sáv; a színek sorrendje jelentés: zöld = rendben, piros = kritikus. A jelmagyarázat gombjaival a sávok ki-be kapcsolhatók.</p>}
        source="mintaadat – tesztlap" data={allapotNapok}>
        <LineChart data={allapotNapok} />
      </ChartCard>
    </div>
  );
}

function Oldal() {
  return (
    <>
      <Grid title="Grafikonkártya (ChartCard) – minden kötelező rész (3/B) · mintaadat">
        <Case id="graf-teljes" title="Vonal, 2 sorozat, rejtett hetek, közvetlen címke, színtévesztő-barát kapcsoló" wide><Teljes /></Case>
        <Case id="graf-oszlop" title="Oszlop – időbeli darabszám"><K title="Beváltások hetente" data={egySorozat(kuponHetente.series[1].values)}><BarChart data={egySorozat(kuponHetente.series[1].values)} /></K></Case>
        <Case id="graf-sav" title="Vízszintes sáv – hosszú kategórianév"><K title="POI-k kategóriánként" data={kategoriak}><BarChart data={kategoriak} orientation="horizontal" /></K></Case>
        <Case id="graf-csoport" title="Csoportosított oszlop – 0 és hiányzó érték"><K title="Létrejött és megoldott hibajegyek" data={hibajegyek}><GroupedBarChart data={hibajegyek} /></K></Case>
        <Case id="graf-allapot" title="Állapot-paletta, 5 sorozat, sorozat-kapcsoló; keskeny kártya – a végcímke helyett jelmagyarázat (nincs görgetés)" wide><Allapot /></Case>
        <Case id="graf-halmoz" title="Halmozott oszlop – 3 rész"><K title="Új tartalmak havonta" data={tartalmak} period="2026. 04–09."><StackedBarChart data={tartalmak} /></K></Case>
      </Grid>
    </>
  );
}
mount('Grafikonok', 'ChartCard és saját SVG-grafikonok: oszlop, sáv, vonal, csoportosított, halmozott. Szélső esetek: adat-grafikon-szelso. Minden szám mintaadat.', <Oldal />);
