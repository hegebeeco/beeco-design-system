import { useEffect, useRef, useState } from 'react';
import { SegmentedControl } from '../src/inputs/SegmentedControl';
import { clusterHtml, clusterIcon, heatGradient, HeatScale, MapLegend, markerHtml, MARKER_ICON, MARKER_ICON_SELECTED, type MarkerOptions } from '../src/media';
import { Case, Grid, mount } from './_keret';

/**
 * A Leaflet itt NINCS betöltve: a tesztlap a Leaflet által kirakott szerkezetet utánozza (divIcon-burok, .leaflet-bar vezérlők, buborék),
 * hogy a DS-öltöztetést (bc-map) minden nézetben mérni lehessen. Minden hely és szám mintaadat.
 */
type Pin = MarkerOptions & { x: number; y: number };
const PINS: Pin[] = [
  { x: 22, y: 38, label: 'P', kind: 'info', title: 'Zöld Sarok kávézó (mintaadat)' },
  { x: 48, y: 62, label: 'E', kind: 'success', title: 'Kertnyitó (mintaadat)' },
  { x: 64, y: 30, label: 'P', kind: 'info', title: 'Hosszú nevű partner <b>HTML-lel</b> a címében (mintaadat)', selected: true },
  { x: 80, y: 70, label: 'K', kind: 'warning', title: 'Kaptár (mintaadat)' },
  { x: 35, y: 80, label: '!', kind: 'danger', title: 'Lezárt hely (mintaadat)' },
];

function Icon({ x, y, html, size, anchor }: { x: number; y: number; html: string; size: [number, number]; anchor?: [number, number] }) {
  const [ax, ay] = anchor ?? [size[0] / 2, size[1] / 2];
  return <div className="leaflet-marker-icon bc-map-icon" tabIndex={0} role="button" style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: size[0], height: size[1], marginLeft: -ax, marginTop: -ay }}
    dangerouslySetInnerHTML={{ __html: html }} />;
}

function Terkep({ name, pins, clusters = [], empty }: { name: string; pins: Pin[]; clusters?: Array<{ x: number; y: number; n: number }>; empty?: boolean }) {
  return (
    <div className="bc-map" style={{ height: 300 }} aria-label={`Térkép: ${name}`} role="region">
      {pins.map((p, i) => { const ic = p.selected ? MARKER_ICON_SELECTED : MARKER_ICON; return <Icon key={i} x={p.x} y={p.y} html={markerHtml(p)} size={ic.iconSize} anchor={ic.iconAnchor} />; })}
      {clusters.map((c, i) => <Icon key={`c${i}`} x={c.x} y={c.y} html={clusterHtml(c.n)} size={clusterIcon(c.n).iconSize} />)}
      {empty && <p className="bc-alert is-info" style={{ position: 'absolute', left: 'var(--bc-sp-3)', right: 'calc(var(--bc-tap) + var(--bc-sp-5))', top: 'var(--bc-sp-3)', margin: 0 }}>Ezen a területen nincs találat – kicsinyíts, vagy mozgasd a térképet.</p>}
      <div className="leaflet-bar leaflet-control" style={{ position: 'absolute', right: 'var(--bc-sp-2)', top: 'var(--bc-sp-2)' }}>
        <a className="leaflet-control-zoom-in" href="#nagyit" role="button" aria-label="Nagyítás" onClick={(e) => e.preventDefault()}>+</a>
        <a className="leaflet-control-zoom-out" href="#kicsinyit" role="button" aria-label="Kicsinyítés" onClick={(e) => e.preventDefault()}>−</a>
        <a href="#hely" role="button" aria-label="Saját helyem" onClick={(e) => e.preventDefault()}>◎</a>
      </div>
      <div style={{ position: 'absolute', left: 'var(--bc-sp-2)', bottom: 'var(--bc-sp-2)' }}>
        <MapLegend items={[{ label: 'Partner', kind: 'info', letter: 'P' }, { label: 'Esemény', kind: 'success', letter: 'E' }, { label: 'Kaptár', kind: 'warning', letter: 'K' }, { label: 'Lezárt', kind: 'danger', letter: '!' }]} />
      </div>
    </div>
  );
}

function Gradiens() {
  const ref = useRef<HTMLDivElement>(null);
  const [g, setG] = useState('');
  useEffect(() => { if (ref.current) setG(Object.entries(heatGradient(ref.current, true)).map(([k, v]) => `${k}: ${v}`).join(' · ')); }, []);
  return <div ref={ref}><p className="tl-out" data-out="gradiens">{g}</p></div>;
}

const HOW = <><p>A sötétebb zöld több megnyitást jelent az adott környéken.</p><p>A szín csak arányt mutat: a világos terület nem „rossz”, lehet, hogy ott egyszerűen kevesebben laknak.</p></>;

function Oldal() {
  const [nezet, setNezet] = useState<'terkep' | 'lista'>('terkep');
  return (
    <>
      <Grid title="Térkép – jelölő (6A), csoport, vezérlők, jelmagyarázat">
        <Case id="terkep" title="Tű betűvel, kijelölt (méz), csoportok 3 méretben, 44 px vezérlők" wide>
          <SegmentedControl label="Nézet" value={nezet} onChange={setNezet} items={[{ value: 'terkep', label: 'Térkép' }, { value: 'lista', label: 'Lista' }]} />
          {nezet === 'terkep' ? <Terkep name="partnerek" pins={PINS} clusters={[{ x: 12, y: 15, n: 7 }, { x: 88, y: 20, n: 24 }, { x: 60, y: 88, n: 150 }, { x: 34, y: 18, n: 12000 }]} />
            : <ul data-lista>{PINS.map((p) => <li key={p.title}>{p.title}</li>)}</ul>}
        </Case>
        <Case id="terkep-ures" title="0 pont"><Terkep name="üres terület" pins={[]} empty /></Case>
        <Case id="terkep-egy" title="1 pont, sötét módban is"><Terkep name="egy pont" pins={[PINS[0]]} /></Case>
      </Grid>
      <Grid title="Hőtérkép-skála (3/B) – data-seq tokenekből">
        <Case id="hoskala" title="Cím, egység, súgó, két vég, „Hogyan olvasd?”">
          <HeatScale title="Megnyitások száma" unit="db / nap, 2026. 09. (mintaadat)" help="Hány alkalommal nyitották meg az appban a hely oldalát. Egy felhasználó naponta egyszer számít." howToRead={HOW} />
        </Case>
        <Case id="hoskala-fok" title="Fokozatokkal (táblázatként is olvasható)">
          <HeatScale title="Beváltott kuponok" unit="db, 2026. 07–09. (mintaadat)" help="A kuponbeváltások helye a partner címe szerint." ends={['0', '200+']} steps={['0–9', '10–49', '50–99', '100–199', '200+']} />
        </Case>
        <Case id="hoskala-cb" title="Színtévesztő-barát (kék sorozat)">
          <HeatScale title="Megnyitások száma" unit="db / nap (mintaadat)" help="Mint fent, kék skálával." colorblind steps={['kevés', '', '', '', 'sok']} />
          <Gradiens />
        </Case>
      </Grid>
    </>
  );
}
mount('Média – térkép', 'A Leaflet-térkép DS-öltöztetése: tű alakú jelölő betűvel, kijelölt állapot, számozott csoport, 44 px vezérlők, jelmagyarázat, hőskála a data-seq tokenekből.', <Oldal />);
