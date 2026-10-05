import { useState } from 'react';
import { Button, IcLeft, IcRight, Stepper, SwitchInput, TooltipIconButton, type Step } from '../src';
import { Case, Grid, mount } from './_keret';

// Javaslat 20: kattintható lépésjelző, tömör (sorbeli) kapcsoló, nyíl-piktogramok. Minden név mintaadat.
const CIMKEK = ['Alapadatok', 'Hely', 'Képek', 'Ellenőrzés'];

function Lepesjelzo({ id, hibas = false }: { id: string; hibas?: boolean }) {
  const [cur, setCur] = useState(2);
  const [reached, setReached] = useState(2);
  const [log, setLog] = useState('–');
  const steps: Step[] = CIMKEK.map((label, i) => ({
    id: String(i), label, reachable: i <= reached,
    state: i === cur ? 'current' : hibas && i === 0 ? 'error' : i < reached ? 'done' : 'todo',
  }));
  return (
    <div className="bc-stack">
      <Stepper label="Az új hely felvételének lépései" steps={steps} onSelect={(i, s) => { setCur(i); setLog(`${s.label} (${i + 1}.)`); }} />
      <div className="bc-row">
        <Button variant="secondary" icon={<IcLeft />} disabled={cur === 0} onClick={() => setCur(cur - 1)}>Vissza</Button>
        <Button icon={<IcRight />} disabled={cur === CIMKEK.length - 1} onClick={() => { setCur(cur + 1); setReached((r) => Math.max(r, cur + 1)); }}>Tovább</Button>
      </div>
      <p className="tl-out" data-out={id}>választva: {log}</p>
    </div>
  );
}

const SOROK = [
  { id: 'p1', nev: 'Méhes Kávézó', lathato: true, kiemelt: false },
  { id: 'p2', nev: 'Zöld Sarok Csomagolásmentes Bolt és Javítókávézó a belvárosban', lathato: false, kiemelt: true },
  { id: 'p3', nev: 'Javító Kávézó', lathato: true, kiemelt: false },
];

function Tablazat() {
  const [sorok, setSorok] = useState(SOROK);
  const [menti, setMenti] = useState<string | null>(null);
  const valt = (id: string, mezo: 'lathato' | 'kiemelt', v: boolean) => {
    setMenti(id);
    setTimeout(() => { setSorok((s) => s.map((x) => (x.id === id ? { ...x, [mezo]: v } : x))); setMenti(null); }, 400);
  };
  return (
    <div className="bc-stack">
      <div className="bc-table-wrap">
      <table className="bc-table is-dense">
        <thead><tr><th scope="col">Név</th><th scope="col">Látható az appban</th><th scope="col">Kiemelt</th></tr></thead>
        <tbody>
          {sorok.map((s) => (
            <tr key={s.id} data-sor={s.id}>
              <td style={{ overflowWrap: 'anywhere' }}>{s.nev}</td>
              <td><SwitchInput size="sm" checked={s.lathato} onChange={(v) => valt(s.id, 'lathato', v)} aria-label={`Látható az appban: ${s.nev}`} onText="Látható" offText="Rejtett" busy={menti === s.id} /></td>
              <td><SwitchInput size="sm" checked={s.kiemelt} onChange={(v) => valt(s.id, 'kiemelt', v)} aria-label={`Kiemelt: ${s.nev}`} busy={menti === s.id} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <p className="tl-out" data-out="tabla">{sorok.map((s) => `${s.id}:${s.lathato ? 'L' : 'R'}${s.kiemelt ? 'K' : ''}`).join(' ')}</p>
    </div>
  );
}

function Kapcsolo({ id, ...p }: { id: string; size?: 'md' | 'sm'; disabled?: boolean; onText?: string; offText?: string }) {
  const [v, setV] = useState(false);
  return <><SwitchInput checked={v} onChange={setV} aria-label="Hírlevél küldése" {...p} /><p className="tl-out" data-out={id}>{v ? 'be' : 'ki'}</p></>;
}

function Oldal() {
  return (
    <>
      <Grid title="Kattintható lépésjelző (Stepper onSelect)">
        <Case id="lepes" title="A bejárt lépés gomb, a mostani aria-current" wide><Lepesjelzo id="lepes" /></Case>
        <Case id="lepes-hiba" title="Hibás lépés – az is választható" wide><Lepesjelzo id="lepes-hiba" hibas /></Case>
        <Case id="lepes-mutato" title="onSelect nélkül csak mutat (mint eddig)">
          <Stepper label="Videófeltöltés lépései" steps={[{ id: 'a', label: 'Fájl', state: 'done' }, { id: 'b', label: 'Feltöltés', state: 'current' }, { id: 'c', label: 'Kész', state: 'todo' }]} />
        </Case>
      </Grid>
      <Grid title="Tömör kapcsoló táblázatsorba (SwitchInput size=&quot;sm&quot;)">
        <Case id="sor" title="Táblázat: állapot szövegben is, mentés közben tiltva, hosszú név" wide><Tablazat /></Case>
        <Case id="kapcs-md" title="Alapméret, címke nélkül (aria-label)"><Kapcsolo id="kapcs-md" /></Case>
        <Case id="kapcs-sm" title="Tömör, állapot-szöveggel"><Kapcsolo id="kapcs-sm" size="sm" onText="Be" offText="Ki" /></Case>
        <Case id="kapcs-tiltott" title="Tiltott"><Kapcsolo id="kapcs-tiltott" size="sm" disabled onText="Be" offText="Ki" /></Case>
      </Grid>
      <Grid title="Nyíl-piktogramok (IcLeft, IcRight)">
        <Case id="nyil" title="Szöveges és csak-piktogramos gomb">
          <div className="bc-row">
            <Button variant="secondary" icon={<IcLeft />}>Előző</Button>
            <Button icon={<IcRight />}>Következő</Button>
            <TooltipIconButton label="Előző hónap"><IcLeft /></TooltipIconButton>
            <TooltipIconButton label="Következő hónap"><IcRight /></TooltipIconButton>
          </div>
        </Case>
      </Grid>
    </>
  );
}

mount('Tömör vezérlők', 'Kattintható lépésjelző, sorbeli kapcsoló (44 px érintés, a sort nem nyújtja), nyíl-piktogramok – Javaslat 20. Minden név mintaadat.', <Oldal />);
