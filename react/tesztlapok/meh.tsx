import { useRef, useState } from 'react';
import { Bee, BeeMoment, BeeSprite, type SpriteSzereplo, Button, celebrate, HexLoader, pillanatok, ProgressBar, shake, Stagger, szerepek, TextField, useCountUp, type Szerep } from '../src';
import { Case, Grid, mount } from './_keret';

function Szamlalo() {
  const [n, setN] = useState(128);
  const shown = useCountUp(n);
  return <div className="bc-stat"><span className="bc-stat-label">Aktív partner (mintaadat)</span><span className="bc-stat-value" data-out="szam">{Math.round(shown)}</span><Button size="sm" variant="secondary" onClick={() => setN((x) => x + 1)}>+1 (nem pörög újra)</Button></div>;
}
function Pecset() {
  const [on, setOn] = useState(false);
  const [k, setK] = useState(0);
  return <div className="bc-row"><span key={k} className={`bc-badge ${on ? 'is-success' : 'is-warning'} ${k ? 'bc-anim-stamp' : ''}`} data-out="pecset">{on ? 'Jóváhagyva' : 'Függőben'}</span><Button size="sm" onClick={() => { setOn(!on); setK(k + 1); }}>Állapot váltása</Button></div>;
}
function Razas() {
  const form = useRef<HTMLFormElement>(null);
  const [err, setErr] = useState<string>();
  return <form ref={form} data-out="razas" onSubmit={(e) => { e.preventDefault(); setErr('Add meg a partner nevét – enélkül nem menthető.'); shake(form.current); }}>
    <TextField label="Partner neve" help="Így jelenik meg az appban." maxLength={60} error={err} />
    <Button type="submit">Mentés</Button></form>;
}
function Halado() {
  const [v, setV] = useState(0.42);
  return <><ProgressBar value={v} label="Feltöltés" moving /><p className="tl-out" data-out="halad">{(v * 5).toFixed(1).replace('.', ',')}/5 MB</p><Button size="sm" variant="secondary" onClick={() => setV(1)}>Kész</Button></>;
}
function Unnep() {
  const b = useRef<HTMLButtonElement>(null);
  return <><BeeMoment pillanat="merfoldko" valtozat={0} inline /><Button ref={b} variant="secondary" onClick={() => celebrate(b.current)}>Hatszög-konfetti (mérföldkő)</Button></>;
}

function SpriteEset({ s }: { s: SpriteSzereplo }) {
  const [n, setN] = useState(0);
  return <Case id={`sprite-${s}`} title={`sprite: ${s}`}><div className="bc-row"><BeeSprite szereplo={s} size="s" replay={n} /><BeeSprite szereplo={s} replay={n} /><Button size="sm" variant="secondary" onClick={() => setN(n + 1)}>Újra</Button></div></Case>;
}

function Oldal() {
  return (
    <>
      <Grid title="Szereplők (meglévő méhecskék, szerep szerint)">
        {(Object.keys(szerepek) as Szerep[]).map((s) => (
          <Case key={s} id={`szerep-${s}`} title={s}><div className="bc-row" style={{ flexWrap: 'nowrap' }}><Bee szerep={s} buzz={false} /><p className="tl-out">{szerepek[s].erzelem} – {szerepek[s].mikor}</p></div></Case>
        ))}
      </Grid>
      <Grid title="Méhecske-sprite-ok (kódból animálva a meglévő méhecskéből)">
        {(['hazigazda', 'szurkolo', 'gondolkodo', 'piheno', 'futar', 'bajnok'] as SpriteSzereplo[]).map((s) => <SpriteEset key={s} s={s} />)}
      </Grid>
      <Grid title="Méhes pillanatok (szóvicc + sima jelentés)">
        {pillanatok.map((p) => (
          <Case key={p} id={`pill-${p}`} title={p}><BeeMoment pillanat={p} valtozat={0} live={p === 'szerverhiba' ? 'alert' : undefined} action={p === 'ures' ? <Button size="sm">Kupon létrehozása</Button> : p === 'visszavonhato' ? <Button size="sm" variant="secondary">Visszavonás</Button> : undefined} /></Case>
        ))}
        <Case id="pill-inline" title="Sorban (kártyában)"><BeeMoment pillanat="mentve" valtozat={1} inline live="status" /></Case>
      </Grid>
      <Grid title="Mozgás – neo-brutalista és méhecskés">
        <Case id="mozg-stagger" title="Lista beúszás (Stagger)"><Stagger as="ul">{['Zöld Sarok', 'Javító Kávézó', 'Méhes Piac', 'Bio Kuckó'].map((n) => <li key={n}>{n} (mintaadat)</li>)}</Stagger></Case>
        <Case id="mozg-szam" title="Szám felpörgés"><Szamlalo /></Case>
        <Case id="mozg-pecset" title="Pecsét-állapotváltás"><Pecset /></Case>
        <Case id="mozg-razas" title="Kíméletes rázás hibás beküldésnél"><Razas /></Case>
        <Case id="mozg-emel" title="Kártya-emelés (egérrel)"><a className="bc-card bc-lift" href="#mozg-emel">Mutass rá: a kemény árnyék nő.</a></Case>
        <Case id="mozg-halad" title="Csíkos haladásjelző"><Halado /></Case>
        <Case id="mozg-tolt" title="Mézsejt-töltő"><HexLoader label="Töltöm a partnereket" /></Case>
        <Case id="mozg-unnep" title="Mérföldkő"><Unnep /></Case>
      </Grid>
    </>
  );
}
mount('Méhecske és mozgás', 'A meglévő méhecskék szerepekben, a méhes pillanatok szóviccel és sima jelentéssel, és a mozgás-készlet. Csökkentett mozgásnál semmi nem mozog.', <Oldal />);
