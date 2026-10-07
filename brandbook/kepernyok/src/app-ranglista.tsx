// MOBIL APP – Kaptár: ranglista. Forrás: mobile-app/lib/presentation/features/hive/hive_global_leaderboard_screen.dart (szűrők, összesítő,
// rangsor-sor l. 1369–1520); szövegek: assets/translations/hu.json (hive_leaderboard*, 2026-10-07). Minden név és szám MINTA.
import { useState } from 'react';
import { Avatar, Button, IconButton, SegmentedControl, SelectField } from '../../../react/src';
import { telefon, Fejlec, ik, P } from './_telefon';

const SOROK: Array<[number, string, number]> = [[1, 'Minta Rajtárs A', 182], [2, 'Minta Rajtárs B', 164], [3, 'Minta Rajtárs C', 151], [4, 'Minta Rajtárs D', 120], [5, 'Minta Rajtárs E', 96]];

function Ranglista() {
  const [idoszak, setIdoszak] = useState<'mind' | 'ho'>('ho');
  return (
    <>
      <div className="kpm-intro"><h2 className="kpm-h2">A kaptár legaktívabbjai!</h2></div>
      <div className="bc-card kpm-szurok" data-ds="2">
        <SegmentedControl label="Időszak" value={idoszak} onChange={setIdoszak} items={[{ value: 'mind', label: 'Minden idők' }, { value: 'ho', label: 'Ez a hónap' }]} />
        <div className="kpm-ket-mezo">
          <SelectField label="Aktivitás" defaultValue="liter" options={[{ value: 'fa', label: 'Öntözött fa' }, { value: 'ontozes', label: 'Öntözések' }, { value: 'liter', label: 'Öntözött víz' }, { value: 'nektar', label: 'Nektár' }]} />
          <SelectField label="Típus" defaultValue="egyeni" options={[{ value: 'egyeni', label: 'Egyéni' }, { value: 'osszes', label: 'Rajok összes' }, { value: 'ceges', label: 'Rajok céges' }, { value: 'civil', label: 'Rajok civil' }]} />
        </div>
      </div>
      <section aria-labelledby="kpm-rangsor" className="kpm-szakasz-blokk">
        <h2 id="kpm-rangsor" className="kpm-h2">Rangsor</h2>
        <ol className="kpm-rangsor" data-ds="3">
          {SOROK.map(([h, nev, l]) => (
            <li key={h} className={h <= 3 ? `kpm-hely is-dobogo is-${h}` : 'kpm-hely'}>
              <span className="kpm-helyezes" aria-label={`${h}. hely`}>{h}.</span>
              {h <= 3 && <Avatar name={nev} size={40} decorative />}
              <span className="kpm-hely-nev">{nev}</span>
              <span className="kpm-pontszam"><strong>{l}</strong> <span className="kpm-kicsi">liter</span></span>
            </li>
          ))}
          <li className="kpm-hely is-sajat" data-ds="4"><span className="kpm-helyezes" aria-label="12. hely">12.</span><Avatar name="Minta Méhecske" size={32} decorative /><span className="kpm-hely-nev">Te (Minta Méhecske)</span><span className="kpm-pontszam"><strong>45</strong> <span className="kpm-kicsi">liter</span></span></li>
        </ol>
      </section>
      <div className="kpm-gombsor" data-ds="5"><Button>Locsolok!</Button><Button variant="secondary">Aktuális nyereményjáték</Button></div>
      <p className="kpm-minta">Minta: a nevek és a számok nem valós adatok.</p>
    </>
  );
}

telefon({
  cim: 'Ranglista', aktiv: 'Profil', navDs: 6, tartalom: <Ranglista />,
  fej: <Fejlec ds={1} cim="Ranglista" bal={<IconButton aria-label="Vissza">{ik(P.vissza)}</IconButton>} jobb={<IconButton aria-label="Megosztás">{ik(P.megoszt)}</IconButton>} />,
});
