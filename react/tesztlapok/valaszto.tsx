import { useState } from 'react';
import { Combobox, TagPicker, type ComboOption } from '../src';
import { Case, Grid, mount } from './_keret';

const cimkek: ComboOption[] = ['bio', 'vegán', 'csomagolásmentes', 'javító', 'bérlés', 'kávézó', 'helyi termék', 'second hand'].map((l, i) => ({ value: `t${i}`, label: l }));
const sok: ComboOption[] = Array.from({ length: 1200 }, (_, i) => ({ value: `p${i}`, label: `Mintapartner ${i + 1}${i % 7 === 0 ? ' – Kávézó' : ''}` }));
const hosszu: ComboOption[] = [{ value: 'h', label: 'Fenntartható Belváros Kezdeményezés 2026 – őszi kupon- és javítóhét partnerprogram, kiemelt' }, ...cimkek];
const huszonot: ComboOption[] = Array.from({ length: 25 }, (_, i) => ({ value: `c${i}`, label: `címke ${i + 1}` }));
let uj = 0;

function Egy({ id, ...p }: Omit<Extract<Parameters<typeof Combobox>[0], { multiple?: false }>, 'value' | 'onChange'> & { id: string; start?: string | null }) {
  const [v, setV] = useState<string | null>(p.start ?? null);
  return <><Combobox {...p} value={v} onChange={setV} /><p className="tl-out" data-out={id}>érték: {v ?? 'nincs'}</p></>;
}
function Tobb({ id, start = [], ...p }: Omit<Extract<Parameters<typeof Combobox>[0], { multiple: true }>, 'value' | 'onChange' | 'multiple'> & { id: string; start?: string[] }) {
  const [v, setV] = useState<string[]>(start);
  const [opts, setOpts] = useState(p.options);
  return <><Combobox {...p} options={opts} multiple value={v} onChange={setV}
    onCreate={p.onCreate ? (l) => { const nv = `uj${++uj}`; setOpts((o) => [...o, { value: nv, label: l }]); return nv; } : undefined} />
    <p className="tl-out" data-out={id}>érték: {v.join(', ') || 'nincs'}</p></>;
}
function Tag({ id, options, max, start = [] }: { id: string; options: ComboOption[]; max?: number; start?: string[] }) {
  const [v, setV] = useState<string[]>(start);
  const [opts, setOpts] = useState(options);
  return <><TagPicker label="Címkék" help="A felhasználók ezekre szűrhetnek a térképen. Csak ami tényleg igaz a partnerre." options={opts} value={v} onChange={setV} max={max}
    onCreate={(l) => { const nv = `uj${++uj}`; setOpts((o) => [...o, { value: nv, label: l }]); return nv; }} />
    <p className="tl-out" data-out={id}>érték: {v.join(', ') || 'nincs'}</p></>;
}

const PH = 'Melyik partnerhez tartozik. Kezdd el gépelni a nevét – ékezet nélkül is megtalálja.';
function Oldal() {
  return (
    <>
      <Grid title="Keresős legördülő (Combobox) – 1A">
        <Case id="combo-egy" title="Egyes, keresés ékezet nélkül"><Egy id="egy" label="Partner" help={PH} options={cimkek} placeholder="Keresés…" /></Case>
        <Case id="combo-tobb" title="Többes, max. 5, új elem"><Tobb id="tobb" label="Címkék" help="A felhasználók ezekre szűrhetnek. Legfeljebb 5." options={cimkek} max={5} start={['t0', 't2', 't3', 't5']} onCreate={() => ''} /></Case>
        <Case id="combo-sok" title="1200 opció (teljesítmény)"><Egy id="sok" label="Partner" help={PH} options={sok} placeholder="Keresés 1200 partner között…" /></Case>
        <Case id="combo-ures" title="Nincs opció"><Egy id="ures" label="Partner" help={PH} options={[]} placeholder="Keresés…" /></Case>
        <Case id="combo-hosszu" title="Hosszú opciónév"><Tobb id="hosszu" label="Programok" help="Mely programokban vesz részt." options={hosszu} start={['h']} /></Case>
        <Case id="combo-tolt" title="Töltés"><Egy id="tolt" label="Partner" help={PH} options={[]} loading /></Case>
        <Case id="combo-hiba" title="A lista nem töltött be"><Egy id="lhiba" label="Partner" help={PH} options={[]} loadError="Nem sikerült betölteni a partnereket." onRetry={() => undefined} /></Case>
        <Case id="combo-tiltott" title="Tiltott, eltűnt érték"><Egy id="tiltott" label="Partner" help={PH} options={cimkek} start="torolt-123" disabled /></Case>
        <Case id="combo-mezohiba" title="Mezőhiba"><Egy id="mhiba" label="Partner" help={PH} options={cimkek} error="Válassz partnert – a kupon csak partnerhez tartozhat." required /></Case>
      </Grid>
      <Grid title="Címkeválasztó (TagPicker) – 4A">
        <Case id="tag-felho" title="Felhő (8 címke), max. 3"><Tag id="felho" options={cimkek} max={3} start={['t0']} /></Case>
        <Case id="tag-sok" title="25 címke → legördülő"><Tag id="tagsok" options={huszonot} /></Case>
        <Case id="tag-ures" title="Nincs még címke"><Tag id="tagures" options={[]} /></Case>
      </Grid>
    </>
  );
}
mount('Választók', 'Keresős legördülő (egyes, többes, új elem, 1200 opció, töltés, hiba) és címkeválasztó (felhő / legördülő).', <Oldal />);
