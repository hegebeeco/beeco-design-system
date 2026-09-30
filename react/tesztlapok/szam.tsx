import { useState } from 'react';
import { NumberField } from '../src';
import { Case, Grid, mount } from './_keret';

function N(p: Omit<Parameters<typeof NumberField>[0], 'value' | 'onChange'> & { start?: number | null; id: string }) {
  const { start = null, id, ...rest } = p;
  const [v, setV] = useState<number | null>(start);
  return <><NumberField {...rest} value={v} onChange={setV} /><p className="tl-out" data-out={id}>érték: {v === null ? 'üres' : String(v)}</p></>;
}

function Oldal() {
  return (
    <Grid title="Számmező (NumberField) – 5A: gépelős, magyar formátum">
      <Case id="szam-szazalek" title="0–100 %, egész"><N id="szazalek" label="Kedvezmény" help="Hány százalék kedvezményt ad a kupon. 100% = ingyenes." min={0} max={100} unit="%" start={10} /></Case>
      <Case id="szam-ft" title="Pénz, nagy szám (ezres tagolás)"><N id="ft" label="Kosárérték-küszöb" help="Ennyi vásárlás felett érvényes a kupon." min={0} max={10000000} unit="Ft" start={1234567} /></Case>
      <Case id="szam-tized" title="Tizedes (1 jegy), vessző"><N id="tized" label="Távolság" help="A partner és a legközelebbi megálló távolsága." min={0} max={50} decimals={1} unit="km" start={2.5} /></Case>
      <Case id="szam-negativ" title="Negatív is lehet (−50…50)"><N id="negativ" label="Korrekció" help="Kézi pontkorrekció a ranglistán; mínusz is lehet." min={-50} max={50} unit="pont" start={0} /></Case>
      <Case id="szam-ures" title="Üres ≠ 0, kötelező"><N id="ures" label="Kupon darabszám" help="Hány kupon adható ki összesen. Üresen hagyva nem menthető." min={1} max={500} unit="db" required /></Case>
      <Case id="szam-hiba" title="Hibával"><N id="hiba" label="Kupon darabszám" help="Hány kupon adható ki összesen." min={1} max={500} unit="db" start={0} error="Legalább 1 darab kell – különben senki nem válthatja be." /></Case>
      <Case id="szam-tiltott" title="Tiltott"><N id="tiltott" label="Beváltott" help="A rendszer számolja." min={0} unit="db" start={37} disabled /></Case>
      <Case id="szam-input" title="Gépelés közbeni igazítás (clamp=input)"><N id="clampinput" label="Sorrend" help="Hányadik helyen jelenjen meg a listában (1–10)." min={1} max={10} clamp="input" start={3} /></Case>
    </Grid>
  );
}
mount('Számmező', 'Betű, második tizedesjel és fölösleges mínusz nem írható be; a tartományon kívüli érték kilépéskor a határra áll, és a mező szól.', <Oldal />);
