// MOBIL APP – NekTÁR (profil → nektár). Forrás: mobile-app/lib/presentation/features/profile/nectar_screen.dart, nectar_tab_type.dart,
// widgets/nectar_chip.dart; szövegek: assets/translations/hu.json (profile_nectar_*, 2026-10-07). Minden szám MINTA.
import { Bee, Button, IconButton, StatTile, StatusBadge, Tabs } from '../../../react/src';
import { telefon, Fejlec, ik, P } from './_telefon';

// a történet sorai: a feliratok az app nektár-eseményeinek nevei (profile_nectar_*Description); az összegek MINTA
const TORTENET: Array<[string, string, number]> = [
  ['Faöntözés', 'okt. 5.', 50], ['Kuponbeváltás', 'okt. 3.', -200], ['Lábnyom kalkulátor', 'okt. 1.', 100], ['Pont feloldása a térképen', 'szept. 28.', 30],
];

const Tortenet = () => (
  <div className="kpm-fulbelso">
    <div className="bc-card is-accent kpm-egyenleg" data-ds="3">
      <Bee szerep="bajnok" size="s" />
      <p className="kpm-egyenleg-szoveg">Minta most <strong className="kpm-nagyszam">1 250</strong> nektárod van!</p>
    </div>
    <div className="kpm-csempek" data-ds="4">
      <StatTile label="Gyűjtött" value={1450} help="Az eddig gyűjtött összes nektár (mintaadat)." />
      <StatTile label="Elköltött" value={200} help="Kuponokra elköltött nektár (mintaadat)." />
    </div>
    <h2 className="kpm-h2">Nektár történeted időrendben</h2>
    <ul className="kpm-lista bc-card kpm-tortenet bc-divided" data-ds="5">
      {TORTENET.map(([cim, nap, n]) => (
        <li key={cim + nap}><span><strong>{cim}</strong><span className="kpm-kicsi kpm-blokk">{nap}</span></span>
          <StatusBadge tone={n > 0 ? 'success' : 'warning'} icon={null}>{n > 0 ? `+${n} nektár` : `${n} nektár`}</StatusBadge></li>
      ))}
    </ul>
  </div>
);

const Gyujtes = () => (
  <div className="kpm-fulbelso">
    <div className="bc-card kpm-info"><h2 className="kpm-h2">A szorgalmad megháláljuk!</h2><p className="kpm-kicsi">Ha elegendő nektárt gyűjtesz, akkor azokat értékes extra kedvezményt nyújtó kuponokra költheted el!</p></div>
    {[['Faöntözés', 'Irány a térkép!'], ['Kupon beváltása', 'Irány a kuponfüzet!'], ['Lábnyom kalkulátor', 'Irány a kalkulátor!']].map(([cim, gomb]) => (
      <div key={cim} className="bc-card kpm-gyujt"><strong>{cim}</strong><Button variant="secondary" size="sm">{gomb}</Button></div>
    ))}
  </div>
);

const Elkoltes = () => (
  <div className="kpm-fulbelso">
    <div className="bc-card kpm-info"><h2 className="kpm-h2">Költsd el!</h2><p className="kpm-kicsi">Váltsd be nektárjaidat extra kedvezményt nyújtó kuponokra!</p><Button>Irány a kuponfüzet!</Button></div>
  </div>
);

function Nektar() {
  return (
    <>
      <Tabs label="Nektár" defaultValue="tortenet" items={[
        { value: 'tortenet', label: 'Történet', content: <Tortenet /> },
        { value: 'gyujtes', label: 'Gyűjtés', content: <Gyujtes /> },
        { value: 'elkoltes', label: 'Elköltés', content: <Elkoltes /> },
      ]} />
      <p className="kpm-minta">Minta: a név és a számok nem valós adatok.</p>
    </>
  );
}

telefon({
  cim: 'NekTÁR', aktiv: 'Profil', navDs: 6, tartalom: <Nektar />, jelek: [['[role="tablist"]', 2]],
  fej: <Fejlec ds={1} cim="NekTÁR" bal={<IconButton aria-label="Vissza">{ik(P.vissza)}</IconButton>} jobb={<IconButton aria-label="Nektár történet – mi ez?">{ik(P.info)}</IconButton>} />,
});
