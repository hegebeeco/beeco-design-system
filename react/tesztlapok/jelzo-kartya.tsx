// Tesztlap – JelzoKartya (06e, jóváhagyva 2026-10-07): vezérelt szavazókártya – üres, kitöltött, hiba, tiltott, irány nélkül,
// szövegek nélkül, saját mezők, hosszú cím, angol feliratok. Forgatókönyv: jelzo-kartya.test.mjs
import { useState } from 'react';
import { JelzoKartya, type JelzoErtek } from '../src';
import { Case, Grid, mount } from './_keret';

function Vezerelt({ id, kezdo = {}, ...rest }: { id: string; kezdo?: JelzoErtek } & Omit<Parameters<typeof JelzoKartya>[0], 'ertek' | 'onValtozas' | 'cim'> & { cim?: string }) {
  const [e, setE] = useState<JelzoErtek>(kezdo);
  return (
    <>
      <JelzoKartya cim="Kommunikáció" leiras="Mennyire értjük egymást, és jut-e el mindenkihez, ami fontos?" ertek={e} onValtozas={setE} {...rest} />
      <p className="bc-muted" data-out={id} style={{ overflowWrap: 'anywhere' }}>{JSON.stringify(e)}</p>
    </>
  );
}

function HibasKartya() {
  const [e, setE] = useState<JelzoErtek>({});
  const [proba, setProba] = useState(false);
  return (
    <form onSubmit={(ev) => { ev.preventDefault(); setProba(true); }} noValidate>
      <JelzoKartya cim="Tanulás" ertek={e} onValtozas={setE} kotelezo szovegMezok={false}
        hiba={proba && !e.jelzes ? 'Válassz egy színt – e nélkül nem kerül a kerékre.' : undefined} />
      <button type="submit" className="bc-btn" style={{ marginTop: 'var(--bc-sp-3)' }}>Beküldöm</button>
    </form>
  );
}

function Oldal() {
  return (
    <>
      <Grid title="Működés">
        <Case id="ures" title="Üres kártya (vezérelt) – kattintás, nyilak, szövegek" wide>
          <Vezerelt id="ures" />
        </Case>
        <Case id="kitoltott" title="Kitöltve: sárga, helyben, szöveggel (a szöveges rész nyitva)">
          <Vezerelt id="kitoltott" cimSzint={2} kezdo={{ jelzes: 'sarga', irany: 'helyben', szovegek: { akadaly: 'Sok az e-mail, kevés a személyes beszélgetés.' } }} />
        </Case>
        <Case id="hiba" title="Hiba: kötelező, beküldés választás nélkül">
          <HibasKartya />
        </Case>
      </Grid>
      <Grid title="Változatok és szélső esetek">
        <Case id="tiltott" title="Tiltott (lezárt forduló), kitöltött értékkel">
          <JelzoKartya cim="Jókedv" ertek={{ jelzes: 'zold', irany: 'elore' }} onValtozas={() => {}} disabled szovegMezok={false} />
        </Case>
        <Case id="irany-nelkul" title="Irány és szövegek nélkül (gyors pulzus)">
          <Vezerelt id="irany-nelkul" irany={false} szovegMezok={false} />
        </Case>
        <Case id="sajat-mezo" title="Egy saját szöveges mező, max. 40 karakter">
          <Vezerelt id="sajat-mezo" szovegNyitva szovegMezok={[{ kulcs: 'egy', cimke: 'Egy szó a hónapról', sugo: 'Egyetlen szó vagy rövid kifejezés.', max: 40 }]} />
        </Case>
        <Case id="hosszu" title="Nagyon hosszú cím és leírás">
          <JelzoKartya cim="Pszichológiai biztonság és Megszentségteleníthetetlenségeskedéseitekért-felelős-csoport" leiras="Egy nagyon hosszú leírás, ami több sorba tördelődik keskeny képernyőn is, és nem lóg ki a kártyából, akkor sem, ha sok a szó benne."
            ertek={{}} onValtozas={() => {}} szovegMezok={false} />
        </Case>
        <Case id="angol" title="Angol feliratok (labels)">
          <JelzoKartya cim="Communication" ertek={{ jelzes: 'piros' }} onValtozas={() => {}} szovegMezok={false}
            labels={{ jelzesKerdes: 'How is it now?', iranyKerdes: 'Where is it heading?', jelzesek: { zold: { cim: 'Green', leiras: 'Going well' }, sarga: { cim: 'Yellow', leiras: 'Bumpy' }, piros: { cim: 'Red', leiras: 'Stuck, needs help' } }, iranyok: { elore: 'Forward', helyben: 'Steady', hatra: 'Slipping' } }} />
        </Case>
      </Grid>
    </>
  );
}

mount('Jelzőkártya (JelzoKartya)', 'Csapat-egészség szavazókártya: zöld / sárga / piros (ikon + szöveg), irány, rövid szövegek – vezérelt, billentyűzettel, hibával és tiltva is.', <Oldal />);
