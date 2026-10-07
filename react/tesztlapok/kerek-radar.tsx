// Tesztlap – KerekRadar (06e, jóváhagyva 2026-10-07): 3–12 tengely, 1–2 sorozat (most vs. előző), kijelölés egérrel és
// billentyűzettel, lista és táblázat, hiányzó érték (null), hosszú címkék, üres, töltés, 2 és 14 tengely (csak táblázat),
// színtévesztő-mód, angol feliratok. Forgatókönyv: kerek-radar.test.mjs
import { useState } from 'react';
import { Button, IcNew, KerekRadar, type KerekJelzes, type KerekSorozat, type KerekTengely } from '../src';
import { Case, Grid, mount } from './_keret';

const T8: KerekTengely[] = [
  { kulcs: 'cel', nev: 'Közös cél' }, { kulcs: 'csapat', nev: 'Csapatmunka' }, { kulcs: 'kommunikacio', nev: 'Kommunikáció' },
  { kulcs: 'tanulas', nev: 'Tanulás' }, { kulcs: 'jokedv', nev: 'Jókedv' }, { kulcs: 'tamogatas', nev: 'Támogatás' },
  { kulcs: 'penz', nev: 'Pénzügyi fenntarthatóság' }, { kulcs: 'hatas', nev: 'Hatás' },
];
const MOST: KerekSorozat = { kulcs: 'okt', nev: '2026. október', ertekek: { cel: 8.5, csapat: 7.5, kommunikacio: 5, tanulas: 6.2, jokedv: 10, tamogatas: 3.4, penz: 1, hatas: 7 } };
const ELOZO: KerekSorozat = { kulcs: 'szept', nev: '2026. szeptember', ertekek: { cel: 7, csapat: 7.5, kommunikacio: 6.5, tanulas: null, jokedv: 8, tamogatas: 5, penz: 2.5, hatas: 4 } };
const HIANYOS: KerekSorozat = { kulcs: 'okt', nev: '2026. október', ertekek: { cel: 8, csapat: null, kommunikacio: 6, tanulas: 4, jokedv: null, tamogatas: 9 } };
const HOSSZU: KerekTengely[] = [
  { kulcs: 'a', nev: 'Pszichológiai biztonság a csapaton belül és a rajok között' },
  { kulcs: 'b', nev: 'Megszentségteleníthetetlenségeskedéseitekért' },
  { kulcs: 'c', nev: 'Önkéntesek bevonása és megtartása hosszú távon' },
  { kulcs: 'd', nev: 'Fenntarthatósági hatás mérése' },
  { kulcs: 'e', nev: 'Partnerkapcsolatok' },
];
const HOSSZU_S: KerekSorozat = { kulcs: 'm', nev: 'Most', ertekek: { a: 6, b: 8, c: 3, d: 9.5, e: 5 } };
const tengelyek = (n: number): KerekTengely[] => Array.from({ length: n }, (_, i) => ({ kulcs: `t${i + 1}`, nev: `${i + 1}. terület` }));
const sorozat = (n: number, nev = 'Most', eltol = 0): KerekSorozat => ({ kulcs: nev, nev, ertekek: Object.fromEntries(Array.from({ length: n }, (_, i) => [`t${i + 1}`, ((i * 3 + eltol) % 10) + 0.5])) });
const lampa = (v: number | null): KerekJelzes => (v === null ? null : v >= 7.5 ? { tone: 'success', szoveg: 'Zöld' } : v >= 3.5 ? { tone: 'warning', szoveg: 'Sárga' } : { tone: 'danger', szoveg: 'Piros' });

function Valaszthato() {
  const [k, setK] = useState<string | null>('kommunikacio');
  return (
    <>
      <KerekRadar cim="Csapat-kerék, 2026. október" tengelyek={T8} sorozatok={[MOST, ELOZO]} kijelolt={k} onValaszt={setK} jelzes={lampa} />
      <p className="bc-muted" data-out="kijelolt">kijelölt: {k ?? '–'}</p>
    </>
  );
}

function Oldal() {
  return (
    <>
      <Grid title="Két sorozat, kijelölés">
        <Case id="alap" title="8 terület, október vs. szeptember, kijelölhető (egér, Tab + nyilak, Enter)" wide>
          <Valaszthato />
        </Case>
        <Case id="egy" title="Egy sorozat, csak megjelenít (nincs onValaszt), lista nélkül">
          <KerekRadar cim="Partner-értékelés" tengelyek={T8.slice(0, 6)} sorozatok={[MOST]} lista={false} />
        </Case>
        <Case id="hianyos" title="Hiányzó értékek (null ≠ 0) – a rajzon kimaradnak, „nincs adat”">
          <KerekRadar cim="Hiányos kerék" tengelyek={T8.slice(0, 6)} sorozatok={[HIANYOS]} onValaszt={() => {}} />
        </Case>
        <Case id="tabla" title="Táblázat nézetben indul, jelzés-oszloppal" wide>
          <KerekRadar cim="Csapat-kerék táblázatban" tengelyek={T8} sorozatok={[MOST, ELOZO]} nezet="tablazat" jelzes={lampa} onValaszt={() => {}} />
        </Case>
      </Grid>
      <Grid title="Szélső esetek">
        <Case id="harom" title="3 tengely (a legkevesebb)">
          <KerekRadar cim="Három terület" tengelyek={tengelyek(3)} sorozatok={[sorozat(3), sorozat(3, 'Előző', 4)]} onValaszt={() => {}} />
        </Case>
        <Case id="tizenketto" title="12 tengely (a legtöbb)">
          <KerekRadar cim="Tizenkét terület" tengelyek={tengelyek(12)} sorozatok={[sorozat(12)]} onValaszt={() => {}} />
        </Case>
        <Case id="hosszu" title="Nagyon hosszú címkék: tördelve, legfeljebb 3 sor, utána …">
          <KerekRadar cim="Hosszú nevű területek" tengelyek={HOSSZU} sorozatok={[HOSSZU_S]} onValaszt={() => {}} />
        </Case>
        <Case id="szelso-ertek" title="0 és 10, a skálán kívüli érték a határra igazítva (−3 → 0, 14 → 10)">
          <KerekRadar cim="Szélső értékek" tengelyek={tengelyek(5)} sorozatok={[{ kulcs: 's', nev: 'Most', ertekek: { t1: 0, t2: 10, t3: -3, t4: 14, t5: 5 } }]} />
        </Case>
        <Case id="ket" title="2 tengely – a kerék nem értelmes, csak táblázat">
          <KerekRadar cim="Két terület" tengelyek={tengelyek(2)} sorozatok={[sorozat(2)]} />
        </Case>
        <Case id="tizennegy" title="14 tengely – túl sok a kerékhez, csak táblázat">
          <KerekRadar cim="Tizennégy terület" tengelyek={tengelyek(14)} sorozatok={[sorozat(14)]} onValaszt={() => {}} />
        </Case>
        <Case id="cb" title="Színtévesztő-barát mód (data-cb)">
          <div data-cb="">
            <KerekRadar cim="Kerék színtévesztő-módban" tengelyek={T8.slice(0, 6)} sorozatok={[MOST, ELOZO]} />
          </div>
        </Case>
        <Case id="angol" title="Angol feliratok (labels)">
          <KerekRadar cim="Team wheel" tengelyek={T8.slice(0, 5)} sorozatok={[MOST, ELOZO]} onValaszt={() => {}}
            labels={{ nezet: 'View', kerek: 'Wheel', tablazat: 'Table', jelmagyarazat: 'Legend', nincsAdat: 'no data', uj: 'new', lista: 'Areas', skala: (m) => `Scale 0–${m}` }} />
        </Case>
      </Grid>
      <Grid title="Állapotok">
        <Case id="ures" title="Üres: nincs érték – teendővel">
          <KerekRadar cim="Üres kerék" tengelyek={T8} sorozatok={[{ kulcs: 'x', nev: 'Most', ertekek: {} }]} uresTeendo={<Button icon={<IcNew />}>Kitöltöm</Button>} />
        </Case>
        <Case id="ures-tengely" title="Üres: nincs tengely">
          <KerekRadar cim="Tengely nélküli kerék" tengelyek={[]} sorozatok={[]} />
        </Case>
        <Case id="tolt" title="Töltés">
          <KerekRadar cim="Töltődő kerék" tengelyek={T8} sorozatok={[MOST]} tolt />
        </Case>
      </Grid>
    </>
  );
}

mount('Kerék (KerekRadar)', 'Interaktív radar 3–12 területtel, két hónap egymásra vetítve, kijelölhető tengelyekkel, listával és táblázattal – minden állapottal és szélső esettel.', <Oldal />);
