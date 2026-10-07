// MOBIL APP – Lábnyom: a gyors teszt eredménye. Forrás: mobile-app/lib/presentation/features/footprint/ (fast test results);
// szövegek: assets/translations/hu.json (footprint_fastTest_results_*, 2026-10-07). A lábnyom értéke és az egyenértékek MINTA.
import { BeeMoment, Button, IconButton } from '../../../react/src';
import { telefon, Fejlec, ik, P } from './_telefon';

// az egyenérték-feliratok az appból; a számok MINTA
const EGYENERTEK: Array<[string, string]> = [['2 000 km', 'vezetés benzines autóval'], ['900 óra', 'online filmezés'], ['180 db', 'tölgyfa köti meg 20 év alatt']];

function Eredmeny() {
  return (
    <>
      <div className="bc-card kpm-gratula" data-ds="2"><BeeMoment inline szerep="szurkolo" poen="Gratulálunk!" sima="Megtetted az első lépést!" /></div>
      <section className="bc-card is-accent kpm-eredmeny" aria-labelledby="kpm-ered" data-ds="3">
        <h2 id="kpm-ered" className="kpm-h2">A te becsült karbonlábnyomod</h2>
        <p className="kpm-kicsi">a gyors teszt alapján</p>
        <p className="kpm-ertek"><span className="kpm-ertek-szam">4,2</span> <span className="kpm-ertek-egyseg">tonna CO₂/év</span></p>
      </section>
      <section aria-labelledby="kpm-egy" className="kpm-szakasz-blokk" data-ds="4">
        <h2 id="kpm-egy" className="kpm-h2">Ez ennyivel egyenlő:</h2>
        <ul className="kpm-egyenertek">
          {EGYENERTEK.map(([sz, le], i) => <li key={le}>{i > 0 && <span className="kpm-vagy" aria-hidden="true">vagy</span>}<span className="bc-card kpm-egy-kartya"><strong className="kpm-egy-szam">{sz}</strong><span className="kpm-kicsi">{le}</span></span></li>)}
        </ul>
      </section>
      <div className="bc-card kpm-megoszt" data-ds="5"><div><h2 className="kpm-h2">Oszd meg a hírt!</h2><p className="kpm-kicsi">Mutasd meg eredményeidet a barátaidnak!</p></div><IconButton aria-label="Megosztás">{ik(P.megoszt)}</IconButton></div>
      <div className="kpm-gombsor is-oszlop" data-ds="6"><Button>Frissítem a válaszokat!</Button><Button variant="secondary">Kitöltöm a részletes tesztet!</Button></div>
      <p className="kpm-minta">Minta: a lábnyom értéke és az egyenértékek nem valós adatok.</p>
    </>
  );
}

telefon({
  cim: 'Lábnyom – eredmény', aktiv: 'Főoldal', navDs: 7, tartalom: <Eredmeny />,
  fej: <Fejlec ds={1} cim="Rövid lábnyomkalkulátor" bal={<IconButton aria-label="Vissza">{ik(P.vissza)}</IconButton>} />,
});
