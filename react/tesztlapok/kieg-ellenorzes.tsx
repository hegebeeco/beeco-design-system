import { useState } from 'react';
import { ReviewQueue, type ReviewDecision } from '../src';
import { Case, Grid, mount } from './_keret';

// 06a – POI minőségi sor (mintaadat)
type Poi = { id: string; name: string; city: string; issues: string[] };
const POIS: Poi[] = [
  { id: 'p1', name: 'Zöld Sarok Bolt', city: 'Budapest', issues: ['Hiányzó leírás'] },
  { id: 'p2', name: 'Javító Kávézó', city: 'Szeged', issues: ['Formailag hibás link', 'Hiányzó elérhetőség'] },
  { id: 'p3', name: 'Méhes Piac', city: 'Pécs', issues: ['Ellenőrizendő koordináta'] },
  { id: 'p4', name: 'Csomagolásmentesélelmiszerboltésjavítókávézóegyhelyen', city: 'Debrecen', issues: ['Felhasználói problémajelzés'] },
];
const OKOK = ['Hibás vagy hiányzó cím', 'Nem fenntartható hely', 'Duplikátum'];
const render = (p: Poi) => (
  <div className="bc-stack">
    <p className="bc-muted" style={{ margin: 0 }}>{p.city} · mintaadat</p>
    <div className="bc-row">{p.issues.map((x) => <span key={x} className="bc-badge is-warning">{x}</span>)}</div>
  </div>
);

function Sor({ items, fail, label }: { items: Poi[]; fail?: boolean; label?: string }) {
  const [log, setLog] = useState<string[]>([]);
  const [hiba, setHiba] = useState(Boolean(fail));
  const decide = async (p: Poi, d: ReviewDecision) => {
    await new Promise((r) => setTimeout(r, 150));
    if (hiba) { setHiba(false); throw new Error('időtúllépés'); }
    setLog((l) => [...l, `${p.id}:${d.type}${d.reason ? `(${d.reason})` : ''}`]);
  };
  const undo = (p: Poi) => setLog((l) => [...l, `${p.id}:visszavonva`]);
  return <><ReviewQueue items={items} getId={(p) => p.id} getTitle={(p) => p.name} render={render} onDecide={decide} onUndo={undo} reasons={OKOK} label={label} />
    <p className="tl-out" data-out="log">napló: {log.join(' · ') || '–'}</p></>;
}

function Oldal() {
  return (
    <>
      <Grid title="Ellenőrzési sor (ReviewQueue)">
        <Case id="rq" title="Négy tétel – J / E / K billentyűk, visszavonás" wide><Sor items={POIS} /></Case>
        <Case id="rq-hiba" title="Első mentés hibázik – újrapróbálható"><Sor items={POIS.slice(0, 1)} fail label="Hibázó sor" /></Case>
        <Case id="rq-ures" title="Üres sor"><ReviewQueue items={[] as Poi[]} getId={(p) => p.id} getTitle={(p) => p.name} render={render} onDecide={() => undefined} label="Üres ellenőrzési sor" /></Case>
      </Grid>
    </>
  );
}

mount('Kiegészítők – ellenőrzési sor', 'Egy tétel nagyban: jóváhagyás (J), elutasítás indokkal (E), kihagyás (K), haladás és visszavonás. Minden adat mintaadat.', <Oldal />);
