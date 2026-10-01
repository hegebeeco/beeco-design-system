import { useEffect, useState } from 'react';
import { AudienceBuilder, audienceProblems, Button, type Audience, type AudienceEstimate, type AudienceField, IcSave } from '../src';
import { Case, Grid, mount } from './_keret';

// 06a – célcsoport-építő; a létszám-becslés mintaadat (a valóságban a szerver előnézeti hívása adja)
const FIELDS: AudienceField[] = [
  { key: 'varos', label: 'Város', type: 'select', help: 'A felhasználó által megadott lakóhely. Aki nem adta meg, egyik városra sem illik.',
    options: [{ value: 'bp', label: 'Budapest' }, { value: 'szeged', label: 'Szeged' }, { value: 'pecs', label: 'Pécs' }, { value: 'debrecen', label: 'Debrecen' }] },
  { key: 'kor', label: 'Életkor', type: 'number', help: 'Teljes évben, a születési év alapján (14–99).', min: 14, max: 99, unit: 'év' },
  { key: 'aktiv', label: 'Utolsó aktivitás', type: 'number', help: 'Hány napja nyitotta meg utoljára az appot.', min: 0, max: 365, unit: 'nap' },
  { key: 'platform', label: 'Platform', type: 'select', help: 'Melyik telefonon használja az appot.', options: [{ value: 'android', label: 'Android' }, { value: 'ios', label: 'iOS' }] },
  { key: 'kedvenc', label: 'Kedvenc kategória neve', type: 'text', help: 'A felhasználó kedvenc POI-kategóriájának neve (részlet is jó).', maxLength: 40 },
];

/** Mintaadat-becslő: minden érvényes feltétel szűkít (ÉS) / bővít (VAGY) – csak a felület kipróbálásához */
function useBecsles(a: Audience): AudienceEstimate {
  const [e, setE] = useState<AudienceEstimate>({ count: null, loading: true });
  useEffect(() => {
    setE((x) => ({ ...x, loading: true }));
    const jo = a.rules.length - Object.keys(audienceProblems(a, FIELDS)).length;
    const t = setTimeout(() => setE({ count: jo === 0 ? 12480 : a.join === 'and' ? Math.round(12480 / (jo * 3)) : Math.min(12480, 2100 * jo), loading: false }), 300);
    return () => clearTimeout(t);
  }, [a]);
  return e;
}

function Epito({ init, showErrors, max }: { init: Audience; showErrors?: boolean; max?: number }) {
  const [a, setA] = useState(init);
  return <AudienceBuilder fields={FIELDS} value={a} onChange={setA} estimate={useBecsles(a)} showErrors={showErrors} maxRules={max} />;
}
function Mentes() {
  const [a, setA] = useState<Audience>({ join: 'and', rules: [{ id: 'm1', field: 'varos', op: 'eq', value: null }] });
  const [proba, setProba] = useState(false);
  const bad = Object.keys(audienceProblems(a, FIELDS)).length;
  return <><AudienceBuilder fields={FIELDS} value={a} onChange={setA} estimate={{ count: 12480 }} showErrors={proba} />
    <Button icon={<IcSave />} onClick={() => setProba(true)}>Mentés</Button><p className="tl-out" data-out="mentes">{proba ? (bad ? `nem menthető: ${bad} hibás feltétel` : 'mentve') : 'még nem próbáltad'}</p></>;
}

const ket: Audience = { join: 'and', rules: [{ id: 'k1', field: 'varos', op: 'eq', value: 'bp' }, { id: 'k2', field: 'kor', op: 'gte', value: 18 }] };
const torolt: Audience = { join: 'or', rules: [{ id: 't1', field: 'regi', op: 'eq', value: 'x' }, { id: 't2', field: 'varos', op: 'eq', value: 'gyor' }] };
const tele: Audience = { join: 'and', rules: Array.from({ length: 3 }, (_, i) => ({ id: `f${i}`, field: 'kor', op: 'gte' as const, value: 18 + i })) };

function Oldal() {
  return (
    <>
      <Grid title="Célcsoport (AudienceBuilder)">
        <Case id="aud-ures" title="Nincs feltétel – mindenki" wide><Epito init={{ join: 'and', rules: [] }} /></Case>
        <Case id="aud-ket" title="Két feltétel, ÉS / VAGY" wide><Epito init={ket} /></Case>
        <Case id="aud-hibas" title="Már nem létező mező és érték" wide><Epito init={torolt} showErrors /></Case>
        <Case id="aud-tele" title="Határon (3/3 feltétel)" wide><Epito init={tele} max={3} /></Case>
        <Case id="aud-mentes" title="Mentési kísérlet üres értékkel" wide><Mentes /></Case>
        <Case id="aud-becsles" title="Becslés: töltés és hiba">
          <AudienceBuilder fields={FIELDS} value={ket} onChange={() => undefined} estimate={{ count: null, loading: true }} label="Célcsoport (töltés)" />
          <AudienceBuilder fields={FIELDS} value={ket} onChange={() => undefined} estimate={{ count: null, error: 'Nem sikerült megbecsülni a létszámot – próbáld újra pár másodperc múlva.' }} label="Célcsoport (hiba)" />
        </Case>
        <Case id="aud-tiltott" title="Tiltott (küldés után)"><AudienceBuilder fields={FIELDS} value={ket} onChange={() => undefined} estimate={{ count: 1387 }} disabled label="Célcsoport (elküldve)" /></Case>
      </Grid>
    </>
  );
}

mount('Kiegészítők – célcsoport', '„Ha … és/vagy …” feltételsorok, élő létszám-becsléssel; az üres és hibás feltétel jelölve. A létszámok mintaadatok.', <Oldal />);
