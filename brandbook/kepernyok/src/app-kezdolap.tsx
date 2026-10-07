// MOBIL APP – Főoldal (landing). Forrás: mobile-app/lib/presentation/features/landing/landing_screen.dart, landing_header.dart,
// a nyereményjáték-csempe és a lábnyom-csempe; szövegek: assets/translations/hu.json (landing_*, 2026-10-07). Minden név és szám MINTA.
import { Bee, Button, IconButton, ProgressBar, StatTile, Tag } from '../../../react/src';
import { telefon, Fejlec, ik, P } from './_telefon';

const AKTUALIS: Array<[string, string, string]> = [
  ['Válts be egy kupont', 'Keress elérhető kuponokat, válts be egyet és gyűjts nektárt!', P.kupon],
  ['Számold ki a lábnyomodat!', 'Tudd meg hogyan tudsz még ökosabban élni! A kérdések megválaszolásáért még nektárt is kaphatsz.', P.lab],
  ['Oldj fel a térképen ökos pontokat!', 'Nézz szét a térképen és keresd a szürke lelakatolt pontokat! Segítsd a munkánkat és gyűjtsd a nektárokat!', P.terkep],
];

function Kezdolap() {
  return (
    <>
      <section className="bc-card kpm-udv bc-honeycomb" data-ds="2">
        <div className="kpm-udv-fej"><Bee szerep="hazigazda" size="s" /><div><h2 className="kpm-h2">Helló, Minta!</h2><p className="kpm-kicsi">Egy méh nem csinál csodát, de egy raj felvirágoztatja környezetét!</p></div></div>
        <div className="kpm-csempek" data-ds="3">
          <StatTile label="Nektárod" value={1250} help="Az összegyűjtött nektár egyenlege (mintaadat)." />
          <StatTile label="Rajok" value={2} unit="db" help="Hány rajnak vagy tagja (mintaadat)." />
        </div>
      </section>

      <a href="#" className="bc-card is-interactive kpm-csempe-link" data-ds="4">
        <Bee szerep="bajnok" size="s" />
        <span><span className="kpm-h2">Nyereményjáték</span><span className="kpm-kicsi kpm-blokk">Légy aktív és nyerj velünk a havi nyereményjátékainkkal!</span></span>
        {ik(P.jobbra)}
      </a>

      <section className="bc-card is-accent kpm-labnyom" aria-labelledby="kpm-lab" data-ds="5">
        <h2 id="kpm-lab" className="kpm-h2">Pontosítsd a lábnyomod!</h2>
        <p className="kpm-kicsi">Remek, kitöltötted a bevezető kérdéseket! Folytasd a kitöltést, hogy még pontosabb képet kapj!</p>
        <ProgressBar value={0.4} label="4/10 megválaszolt kérdés (40%)" />
        <p className="kpm-kicsi"><strong>4/10 megválaszolt kérdés (40%)</strong> · Gyűjtsd be a maradék 300 nektárt!</p>
        <div className="kpm-gombsor"><Button data-ds="6">Kitöltés folytatása</Button><Button variant="secondary">Lábnyom részletek</Button></div>
      </section>

      <section aria-labelledby="kpm-akt" className="kpm-szakasz-blokk" data-ds="7">
        <div className="kpm-szakasz"><h2 id="kpm-akt">Aktualitások nektárért</h2></div>
        <ul className="kpm-lista">
          {AKTUALIS.map(([cim, le, d]) => (
            <li key={cim}><a href="#" className="bc-card is-interactive kpm-akcio"><span className="kpm-akcio-ic">{ik(d)}</span><span><strong>{cim}</strong><span className="kpm-kicsi kpm-blokk">{le}</span></span><Tag>nektár</Tag></a></li>
          ))}
        </ul>
      </section>
      <p className="kpm-minta">Minta: a név és a számok nem valós adatok.</p>
    </>
  );
}

telefon({
  cim: 'Főoldal', aktiv: 'Főoldal', navDs: 8, tartalom: <Kezdolap />,
  fej: <Fejlec ds={1} cim="beezz a rajban!" bal={<IconButton aria-label="Keresés">{ik(P.kereses)}</IconButton>} jobb={<IconButton aria-label="Üzenetek">{ik(P.level)}</IconButton>} />,
});
