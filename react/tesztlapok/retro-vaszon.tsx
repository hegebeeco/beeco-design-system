// Tesztlap – RetroVaszon (06e, jóváhagyva 2026-10-07): vitorlás / 4L / Start–Stop–Folytasd keret, új cetli zónánként,
// név nélkül, saját cetli szerkesztése és törlése, áthelyezés húzással és választóval, üres, töltés, csak olvasható,
// moderátor, kivetítő-mód, hosszú szöveg. Forgatókönyv: retro-vaszon.test.mjs
import { useState } from 'react';
import { RETRO_KERETEK, RetroVaszon, type RetroCetli, type RetroZona } from '../src';
import { Case, Grid, mount } from './_keret';

const KEZDO: RetroCetli[] = [
  { id: 'c1', zona: 'szel', szoveg: 'Az új rajvezetők nagyon lelkesek.', szerzo: 'Kovács Anna', sajat: true },
  { id: 'c2', zona: 'szel', szoveg: 'Végre van közös naptár.', anonim: true },
  { id: 'c3', zona: 'horgony', szoveg: 'Kevés az idő a heti egyeztetésre.', szerzo: 'Nagy Péter' },
  { id: 'c4', zona: 'sziklak', szoveg: 'Ha a pályázat csúszik, nincs pénz a nyári táborra.', anonim: true, sajat: true },
];

function Elo({ id, zonak, kezdo, ...rest }: { id: string; zonak: readonly RetroZona[]; kezdo: RetroCetli[] } & Partial<Parameters<typeof RetroVaszon>[0]>) {
  const [c, setC] = useState(kezdo);
  const [n, setN] = useState(100);
  return (
    <>
      <RetroVaszon zonak={zonak} cetlik={c}
        onUj={(zona, szoveg, anonim) => { setC((x) => [...x, { id: `u${n}`, zona, szoveg, anonim, szerzo: 'Te', sajat: true }]); setN(n + 1); }}
        onMozgat={(cid, zona) => setC((x) => x.map((y) => (y.id === cid ? { ...y, zona } : y)))}
        onSzerkeszt={(cid, szoveg) => setC((x) => x.map((y) => (y.id === cid ? { ...y, szoveg } : y)))}
        onTorol={(cid) => setC((x) => x.filter((y) => y.id !== cid))} {...rest} />
      <p className="bc-muted" data-out={id} style={{ overflowWrap: 'anywhere' }}>{c.map((x) => `${x.id}@${x.zona}`).join(' ')}</p>
    </>
  );
}

function Oldal() {
  return (
    <>
      <Grid title="Működés">
        <Case id="vitorlas" title="Vitorlás (4 zóna): új cetli, húzás, áthelyezés választóval, szerkesztés, törlés" wide>
          <Elo id="vitorlas" zonak={RETRO_KERETEK.vitorlas.zonak} kezdo={KEZDO} />
        </Case>
        <Case id="moderator" title="Moderátor: bárki cetlijét kezelheti (4L)" wide>
          <Elo id="moderator" zonak={RETRO_KERETEK['4l'].zonak} moderator kezdo={[
            { id: 'm1', zona: 'tetszett', szoveg: 'A közös takarítás.', szerzo: 'Kiss Júlia' },
            { id: 'm2', zona: 'hianyzott', szoveg: 'Visszajelzés a partnerektől.', anonim: true },
          ]} />
        </Case>
        <Case id="ssc" title="Start–Stop–Folytasd (3 zóna), hosszú szöveggel" wide>
          <Elo id="ssc" zonak={RETRO_KERETEK.ssc.zonak} kezdo={[
            { id: 's1', zona: 'start', szoveg: 'Megszentségteleníthetetlenségeskedéseitekért-felelős-munkacsoport-alakítása-minden-hónapban', sajat: true, szerzo: 'Te' },
            { id: 's2', zona: 'folytat', szoveg: 'Egy hosszabb gondolat több sorban:\nmásodik sor, ami a sortörést is megtartja, és nem lóg ki a cetliből keskeny képernyőn sem.', anonim: true },
          ]} />
        </Case>
      </Grid>
      <Grid title="Állapotok">
        <Case id="ures" title="Üres vászon (írható)" wide>
          <Elo id="ures" zonak={RETRO_KERETEK.vitorlas.zonak} kezdo={[]} />
        </Case>
        <Case id="csak-olvashato" title="Csak olvasható (lezárt retró)" wide>
          <RetroVaszon zonak={RETRO_KERETEK.vitorlas.zonak} cetlik={KEZDO} csakOlvashato onUj={() => {}} onMozgat={() => {}} onTorol={() => {}} />
        </Case>
        <Case id="tolt" title="Töltés" wide>
          <RetroVaszon zonak={RETRO_KERETEK.ssc.zonak} cetlik={[]} tolt onUj={() => {}} />
        </Case>
        <Case id="nagy" title="Kivetítő-mód (nagy betű, kezelőgombok nélkül)" wide>
          <RetroVaszon zonak={RETRO_KERETEK.vitorlas.zonak} cetlik={KEZDO} nagy />
        </Case>
        <Case id="angol" title="Saját zónák, angol feliratok (labels)" wide>
          <Elo id="angol" zonak={[{ kulcs: 'jo', cim: 'Went well' }, { kulcs: 'rossz', cim: 'To improve' }]} kezdo={[{ id: 'e1', zona: 'jo', szoveg: 'Great kickoff', sajat: true, szerzo: 'You' }]}
            labels={{ ujCetli: 'Add note', felteszem: 'Post', megse: 'Cancel', anonim: 'Anonymous', ures: 'Empty.', tied: 'yours', ujCetliMezo: (z) => `New note – ${z}`, ujSugo: 'One thought, short.' }} />
        </Case>
      </Grid>
    </>
  );
}

mount('Retró-vászon (RetroVaszon)', 'Zónák cetlikkel (vitorlás, 4L, Start–Stop–Folytasd): új cetli név nélkül is, áthelyezés húzással és billentyűzettel, szerkesztés, törlés, üres, töltés, csak olvasható.', <Oldal />);
