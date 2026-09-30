import { useState } from 'react';
import { DatePicker, DateRangePicker, type DateRange } from '../src';
import { Case, Grid, mount } from './_keret';

function D({ id, start = null, withTime, ...p }: Omit<Parameters<typeof DatePicker>[0], 'value' | 'onChange' | 'time'> & { id: string; start?: string | null; withTime?: boolean }) {
  const [v, setV] = useState<string | null>(start);
  const [t, setT] = useState<string | null>(withTime ? '14:30' : null);
  return <><DatePicker {...p} value={v} onChange={setV} time={withTime ? { value: t, onChange: setT } : undefined} />
    <p className="tl-out" data-out={id}>érték: {v ?? 'nincs'}{withTime ? ` ${t ?? ''}` : ''}</p></>;
}
function R({ id }: { id: string }) {
  const [v, setV] = useState<DateRange>({ start: '2026-09-01', end: '2026-09-30' });
  return <><DateRangePicker label="Időszak" help="Az analitika ebből az időszakból számol. Legfeljebb egy év." value={v} onChange={setV} min="2025-01-01" max="2026-12-31" />
    <p className="tl-out" data-out={id}>érték: {v.start ?? '–'} → {v.end ?? '–'}</p></>;
}

const H = 'Ettől a naptól váltható be a kupon az appban. Helyi idő szerint értjük.';
function Oldal() {
  return (
    <Grid title="Dátum- és időválasztó – 2A">
      <Case id="datum-alap" title="Alap (gépelhető)"><D id="alap" label="Érvényesség kezdete" help={H} start="2026-10-01" /></Case>
      <Case id="datum-hatar" title="Tartomány: 2026. 10. 01. – 12. 31."><D id="hatar" label="Esemény napja" help="Az esemény napja; csak az idei negyedik negyedévben." min="2026-10-01" max="2026-12-31" start="2026-10-15" /></Case>
      <Case id="datum-ido" title="Nap + időpont"><D id="ido" label="Kezdés" help="Mikor kezdődik az esemény. A szerver UTC-ben kapja, itt helyi időt látsz." withTime start="2026-10-25" /></Case>
      <Case id="datum-szokonap" title="Szökőnap"><D id="szoko" label="Különleges nap" help="Pl. szökőnapi akció." start="2028-02-29" /></Case>
      <Case id="datum-ures" title="Üres, kötelező"><D id="ures" label="Lejárat" help="Eddig a napig érvényes a kupon." required /></Case>
      <Case id="datum-hiba" title="Hibával"><D id="hiba" label="Vége" help="Az esemény utolsó napja." start="2026-09-01" error="A vége a kezdet (2026. 10. 01.) előtt van – válassz későbbi napot." /></Case>
      <Case id="datum-tiltott" title="Tiltott"><D id="tiltott" label="Létrehozva" help="A rendszer tölti ki." start="2026-09-12" disabled /></Case>
      <Case id="datum-idoszak" title="Időszak"><R id="idoszak" /></Case>
    </Grid>
  );
}
mount('Dátum', 'Gépelhető dátum (2026. 10. 01.), lenyíló naptár hétfővel, tiltott napok, időpont, időszak, szökőnap.', <Oldal />);
