// Tesztlap – Utvonal (06d, jóváhagyva 2026-10-07): tömör térkép és teljes idővonal; üres, végigért, késő határidő, hiányzó segítő,
// nagyon hosszú címek, 14 szakasz (a mostani középre gördül a saját dobozában). Forgatókönyv: utvonal.test.mjs
import { useState } from 'react';
import { Progress, Utvonal, type UtvonalSzakasz } from '../src';
import { Case, Grid, mount } from './_keret';

const ALAP: UtvonalSzakasz[] = [
  { kulcs: 'jelentkezes', cim: 'Jelentkezés', allapot: 'kesz', datum: '2026-09-12', leiras: 'Elküldted a jelentkezésed.' },
  { kulcs: 'ismerkedes', cim: 'Ismerkedés', allapot: 'kesz', datum: '2026-09-20T10:30:00Z', leiras: 'Beszélgettél a koordinátorral.' },
  { kulcs: 'beilleszkedes', cim: 'Rajba sorolás', allapot: 'most', leiras: 'Csatlakozol egy rajhoz, és megismered a tagjait.' },
  { kulcs: 'elso', cim: 'Első feladat', allapot: 'jon', leiras: 'Kiválasztasz egy feladatot, és elvégzed.' },
  { kulcs: 'rendszeres', cim: 'Rendszeres önkéntes', allapot: 'jon', leiras: 'Havonta legalább egy feladat.' },
  { kulcs: 'mentor', cim: 'Mentor', allapot: 'jon', leiras: 'Te segíted az újakat.' },
];
const KIHAGYOTT: UtvonalSzakasz[] = ALAP.map((s) => (s.kulcs === 'ismerkedes' ? { ...s, allapot: 'kihagyva', datum: undefined, leiras: 'Ezt a lépést most kihagytuk.' } : s));
const MIND: UtvonalSzakasz[] = ALAP.map((s, i) => ({ ...s, allapot: 'kesz', datum: `2026-09-${String(10 + i).padStart(2, '0')}` }));
const HOSSZU: UtvonalSzakasz[] = [
  { kulcs: 'a', cim: 'Jelentkezés a beeco önkéntes programjába a teljes adatlap kitöltésével', allapot: 'kesz', datum: '2026-09-01' },
  { kulcs: 'b', cim: 'Megszentségteleníthetetlenségeskedéseitekért-felelős-koordinátorral-való-találkozó', allapot: 'most', leiras: 'Nagyon hosszú, szóköz nélküli szó is tördelődik, nem lóg ki.' },
  { kulcs: 'c', cim: 'Az első közösségi feladat kiválasztása és elvégzése a rajoddal együtt, a hónap végéig', allapot: 'jon' },
];
const SOK: UtvonalSzakasz[] = Array.from({ length: 14 }, (_, i) => ({
  kulcs: `s${i + 1}`, cim: `${i + 1}. szakasz`, allapot: i < 9 ? 'kesz' : i === 9 ? 'most' : 'jon', datum: i < 9 ? `2026-0${(i % 9) + 1}-15` : undefined,
}));

function Kattintos() {
  const [n, setN] = useState(0);
  return (
    <>
      <Utvonal tomor cimke="Partner-bevezetés szakaszai" szakaszok={ALAP.slice(0, 4)}
        kovetkezo={{ szoveg: 'Töltsd fel a logód, hogy az appban felismerjenek.', cta: 'Logó feltöltése', onClick: () => setN((x) => x + 1) }} />
      <p className="bc-muted" data-out="kattint">kattintás: {n}</p>
    </>
  );
}

function Oldal() {
  const kov = { szoveg: 'Válassz rajt – a koordinátor ma még jóváhagyja.', cta: 'Rajok megnézése', href: '#rajok' };
  const seg = { nev: 'Kovács Anna', szerep: 'Segítőd', href: '#profil-anna' };
  return (
    <>
      <Grid title="Tömör térkép (irányítópult)">
        <Case id="tomor" title="Alap: 6 szakasz, most a 3., határidő, segítő">
          <Utvonal tomor cimke="Az út szakaszai" szakaszok={ALAP} kovetkezo={kov} segito={seg} hatarido={{ ora: 30, cimke: 'Rajba sorolás' }} />
        </Case>
        <Case id="kesik" title="Késő határidő (2 napja lejárt), segítővel">
          <Utvonal tomor cimke="Késő út szakaszai" szakaszok={ALAP} kovetkezo={kov} segito={{ nev: 'Kovács Anna', szerep: 'Segítőd' }} hatarido={{ ora: -50, cimke: 'Rajba sorolás' }} />
        </Case>
        <Case id="nincs-segito" title="Nincs még segítő, 5 órája lejárt">
          <Utvonal tomor cimke="Segítő nélküli út szakaszai" szakaszok={ALAP} kovetkezo={kov} segito={null} hatarido={{ ora: -5 }} />
        </Case>
        <Case id="extra" title="Kiegészítéssel (haladás) és gombos lépéssel">
          <Utvonal tomor cimke="Haladós út szakaszai" szakaszok={ALAP} kovetkezo={{ szoveg: 'Még 2 feladat a következő szintig.', cta: 'Feladatot választok', href: '#feladat' }} hatarido={{ ora: 0.5 }}>
            <Progress value={3} max={5} label="Haladás a következő szintig" valueText="3 / 5 feladat" />
            <span className="bc-muted">3 / 5 feladat</span>
          </Utvonal>
        </Case>
        <Case id="kattint" title="onClick lépés (gomb, nem link)">
          <Kattintos />
        </Case>
        <Case id="sok" title="14 szakasz – a mostani (10.) középre gördül a dobozában" wide>
          <Utvonal tomor cimke="Hosszú út szakaszai" szakaszok={SOK} kovetkezo={{ szoveg: 'Folytasd a 10. szakaszt.', cta: 'Tovább', href: '#tovabb' }} />
        </Case>
        <Case id="hosszu-tomor" title="Nagyon hosszú címek (tömör)">
          <Utvonal tomor cimke="Hosszú című út szakaszai (tömör)" szakaszok={HOSSZU} kovetkezo={{ szoveg: 'Egy nagyon hosszú következő lépés, ami több sorba tördelődik keskeny képernyőn is, és nem tolja ki a gombot.', cta: 'Időpontot foglalok a koordinátorral', href: '#foglal' }} />
        </Case>
        <Case id="kesz-tomor" title="Mind kész (tömör)">
          <Utvonal tomor cimke="Végigjárt út szakaszai (tömör)" szakaszok={MIND} />
        </Case>
        <Case id="ures-tomor" title="Üres: nincs szakasz, de van teendő">
          <Utvonal tomor cimke="Üres út (tömör)" szakaszok={[]} kovetkezo={{ szoveg: 'Jelentkezz, és indul az utad.', cta: 'Jelentkezem', href: '#jelentkezes' }} />
        </Case>
      </Grid>
      <Grid title="Teljes idővonal (saját oldal)">
        <Case id="teljes" title="Mögötted dátummal, most, ami jön; egy kihagyott szakasz" wide>
          <Utvonal cimke="Az út szakaszai" cimSzint={3} szakaszok={KIHAGYOTT} kovetkezo={kov} segito={seg} hatarido={{ ora: 72, cimke: 'Rajba sorolás' }} />
        </Case>
        <Case id="hosszu" title="Nagyon hosszú címek (teljes)">
          <Utvonal cimke="Hosszú című út szakaszai" szakaszok={HOSSZU} kovetkezo={kov} />
        </Case>
        <Case id="kesz" title="Mind kész (teljes), záró teendővel">
          <Utvonal cimke="Végigjárt út szakaszai" szakaszok={MIND} kovetkezo={{ szoveg: 'Segíts te is egy újnak.', cta: 'Mentor leszek', href: '#mentor' }} />
        </Case>
        <Case id="ures" title="Üres (teljes), teendő nélkül">
          <Utvonal cimke="Üres út" szakaszok={[]} />
        </Case>
        <Case id="sok-teljes" title="14 szakasz (teljes), angol feliratokkal (labels)" wide>
          <Utvonal cimke="Journey stages" szakaszok={SOK.slice(7, 12)} labels={{ jelveny: { kesz: 'Done', most: 'You are here', jon: 'Up next', kihagyva: 'Skipped' } }}
            kovetkezo={{ szoveg: 'Finish stage 10.', cta: 'Continue', href: '#tovabb' }} />
        </Case>
      </Grid>
    </>
  );
}

mount('Út (Utvonal)', 'Szakasztérkép + egyetlen következő lépés: tömör (irányítópult) és teljes (saját oldal) nézet, minden állapottal és szélső esettel.', <Oldal />);
