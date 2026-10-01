import { useState } from 'react';
import { BarChart, Button, ChartCard, GroupedBarChart, LineChart, StackedBarChart } from '../src';
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

function Oldal() {
  return (
    <>
      <Grid title="Grafikonkártya (ChartCard) – minden kötelező rész (3/B) · mintaadat">
        <Case id="graf-teljes" title="Vonal, 2 sorozat, rejtett hetek, közvetlen címke, színtévesztő-barát kapcsoló" wide><Teljes /></Case>
        <Case id="graf-oszlop" title="Oszlop – időbeli darabszám"><K title="Beváltások hetente" data={egySorozat(kuponHetente.series[1].values)}><BarChart data={egySorozat(kuponHetente.series[1].values)} /></K></Case>
        <Case id="graf-sav" title="Vízszintes sáv – hosszú kategórianév"><K title="POI-k kategóriánként" data={kategoriak}><BarChart data={kategoriak} orientation="horizontal" /></K></Case>
        <Case id="graf-csoport" title="Csoportosított oszlop – 0 és hiányzó érték"><K title="Létrejött és megoldott hibajegyek" data={hibajegyek}><GroupedBarChart data={hibajegyek} /></K></Case>
        <Case id="graf-halmoz" title="Halmozott oszlop – 3 rész"><K title="Új tartalmak havonta" data={tartalmak} period="2026. 04–09."><StackedBarChart data={tartalmak} /></K></Case>
      </Grid>
    </>
  );
}
mount('Grafikonok', 'ChartCard és saját SVG-grafikonok: oszlop, sáv, vonal, csoportosított, halmozott. Szélső esetek: adat-grafikon-szelso. Minden szám mintaadat.', <Oldal />);
