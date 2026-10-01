import { useState } from 'react';
import { BarChart, Button, LineChart, type ChartData } from '../src';
import { csakNull, egySorozat, kategoriak, napi90, negativ, negativVonal, ures } from './_adat-minta';
import { K } from './_adat-kartya';
import { Case, Grid, mount } from './_keret';

function Hibas() {
  const [st, setSt] = useState<'error' | 'loading' | 'ready'>('error');
  return <K title="Új felhasználók hetente" data={egySorozat([5, 8, 6, 9])} status={st} onRetry={() => { setSt('loading'); setTimeout(() => setSt('ready'), 300); }}><BarChart data={egySorozat([5, 8, 6, 9])} /></K>;
}

const egy = egySorozat([42], ['09. 21.']);
const nullak = egySorozat([0, 0, 0, 0, 0]);
const kiugro = egySorozat([12, 15, 11, 240, 14, 13, 16]);
const egyenlo = egySorozat([7, 7, 7, 7]);
const sokKat: ChartData = { ...kategoriak, categories: Array.from({ length: 24 }, (_, i) => `Kategória ${i + 1}`), series: [{ key: 'p', label: 'POI-k', values: Array.from({ length: 24 }, (_, i) => 40 - i) }] };

function Oldal() {
  const [ujra, setUjra] = useState(0);
  return (
    <>
      <Grid title="Szélső esetek (3.4)">
        <Case id="graf-ures" title="Nincs adat – teendővel">
          <K title="Beváltások hetente" data={ures} emptyAction={<Button variant="secondary" onClick={() => setUjra((x) => x + 1)}>Válassz hosszabb időszakot</Button>}><BarChart data={ures} /></K>
          <p className="tl-out" data-out="ures">teendő: {ujra}</p>
        </Case>
        <Case id="graf-csaknull" title="Csak hiányzó érték – üres, nem nulla"><K title="Beváltások hetente" data={csakNull}><LineChart data={csakNull} /></K></Case>
        <Case id="graf-egy" title="Egyetlen pont"><K title="Beváltások" data={egy}><LineChart data={egy} /></K></Case>
        <Case id="graf-nulla" title="Minden érték 0"><K title="Beváltások hetente" data={nullak}><BarChart data={nullak} /></K></Case>
        <Case id="graf-negativ" title="Negatív érték – 0-vonal kiemelve"><K title="Taglétszám változása havonta" data={negativ} period="2026. 04–09."><BarChart data={negativ} /></K></Case>
        <Case id="graf-negvonal" title="Negatív érték vonalon, célérték"><K title="Taglétszám változása és a cél" data={negativVonal} period="2026. 04–09."><LineChart data={negativVonal} /></K></Case>
        <Case id="graf-kiugro" title="Óriási kiugró érték – levágva, jelezve"><K title="Beváltások hetente" data={kiugro}><BarChart data={kiugro} /></K></Case>
        <Case id="graf-kiugro-sav" title="Kiugró érték vízszintes sávon"><K title="Beváltások hetente" data={kiugro}><BarChart data={kiugro} orientation="horizontal" /></K></Case>
        <Case id="graf-egyenlo" title="Egyenlő értékek"><K title="Beváltások hetente" data={egyenlo}><BarChart data={egyenlo} /></K></Case>
        <Case id="graf-90" title="90 nap – feliratok ritkítva, 1 hiányzó nap" wide><K title="Aktív felhasználók naponta" data={napi90}><LineChart data={napi90} /></K></Case>
        <Case id="graf-90-oszlop" title="90 nap oszlopként – telefonon oldalra görgethető" wide><K title="Aktív felhasználók naponta" data={napi90}><BarChart data={napi90} /></K></Case>
        <Case id="graf-sokkat" title="24 kategória vízszintes sávon"><K title="POI-k kategóriánként" data={sokKat}><BarChart data={sokKat} orientation="horizontal" /></K></Case>
        <Case id="graf-tolt" title="Töltés – a cím és a súgó már látszik"><K title="Beváltások hetente" data={ures} status="loading"><BarChart data={ures} /></K></Case>
        <Case id="graf-hiba" title="Hiba – Újrapróbálás"><Hibas /></Case>
      </Grid>
    </>
  );
}
mount('Grafikonok – szélső esetek', 'Nincs adat, egy pont, minden 0, negatív, kiugró, hiányzó, 90 nap, sok kategória, töltés, hiba (3.4). Minden szám mintaadat.', <Oldal />);
