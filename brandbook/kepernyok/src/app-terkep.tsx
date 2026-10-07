// MOBIL APP – Térkép + POI alsó lap. Forrás: mobile-app/lib/presentation/features/map/components/map_widget.dart, search_bar.dart,
// category_selector.dart, map_menu_button.dart, poi_details_modal.dart; szövegek: assets/translations/hu.json (2026-10-07). A hely és a térkép MINTA.
import { useState } from 'react';
import { Avatar, Bee, Button, IconButton, MapLegend, SearchBox, StatusBadge, markerHtml, type MarkerKind } from '../../../react/src';
import { telefon, ik, P } from './_telefon';

// a chipek az app fix listájából (MapLayerType.enabledCategories) – a szöveges chipek
const CHIPEK = ['Vízadás', 'Rajok', 'Vásárlás', 'Javítás', 'Kölcsönzés', 'Vendéglátó helyek', 'Hulladék'];
// jelölők: a DS-jelölő szín + betű párosa; a hely MINTA
const PONTOK: Array<{ id: string; nev: string; tipus: string; kind: MarkerKind; betu: string; cls: string }> = [
  { id: 'a', nev: 'Minta Zöldbolt', tipus: 'Vásárlás · minta', kind: 'success', betu: 'V', cls: 'is-1' },
  { id: 'b', nev: 'Minta Szerviz', tipus: 'Javítás · minta', kind: 'neutral', betu: 'J', cls: 'is-2' },
  { id: 'c', nev: 'Minta Hulladékudvar', tipus: 'Hulladék · minta', kind: 'info', betu: 'H', cls: 'is-3' },
  { id: 'd', nev: 'Minta Bisztró', tipus: 'Vendéglátó helyek · minta', kind: 'warning', betu: 'É', cls: 'is-4' },
];

function Terkep() {
  const [chip, setChip] = useState('Vásárlás');
  const [kijelolt, setKijelolt] = useState<string | null>('a');
  const p = PONTOK.find((x) => x.id === kijelolt);
  return (
    <div className="kpm-terkep">
      <div className="kpm-terkep-alap" aria-hidden="true"><span className="kpm-ut is-a" /><span className="kpm-ut is-b" /><span className="kpm-ut is-c" /><span className="kpm-park" /></div>
      <div className="kpm-terkep-fej">
        <div className="kpm-kereso-sor" data-ds="1"><SearchBox label="Ökos pont keresése" /><IconButton aria-label="Térképrétegek: Mit szeretnél csinálni?" className="kpm-lebego">{ik(P.retegek)}</IconButton></div>
        <div className="kpm-chipek" role="group" aria-label="Térkép kategóriák" data-ds="2">
          {CHIPEK.map((c) => <Button key={c} variant="secondary" size="sm" className="kpm-chip" aria-pressed={c === chip} onClick={() => setChip(c)}>{c}</Button>)}
        </div>
      </div>
      <ul className="kpm-pontok">
        {PONTOK.map((x) => (
          <li key={x.id} className={`kpm-pont bb-poz ${x.cls}`} data-ds={x.id === 'a' ? 3 : undefined}>
            <button type="button" className="kpm-pont-gomb" aria-label={`${x.nev} – ${x.tipus}`} aria-pressed={x.id === kijelolt} onClick={() => setKijelolt(x.id)}
              dangerouslySetInnerHTML={{ __html: markerHtml({ label: x.betu, kind: x.kind, selected: x.id === kijelolt, title: x.nev }) }} />
          </li>
        ))}
      </ul>
      <span className="kpm-en"><Bee szerep="hazigazda" size="s" buzz={false} /></span>
      <MapLegend className="kpm-jelmagyarazat" items={[{ label: 'Vásárlás', kind: 'success', letter: 'V' }, { label: 'Javítás', kind: 'neutral', letter: 'J' }, { label: 'Hulladék', kind: 'info', letter: 'H' }, { label: 'Vendéglátó helyek', kind: 'warning', letter: 'É' }]} defaultOpen={false} />
      <div className="kpm-vezerlo bb-poz" role="group" aria-label="Térkép vezérlők" data-ds="4">
        <IconButton aria-label="Saját pozíció meghatározása">{ik(P.hely)}</IconButton>
        <IconButton aria-label="Térkép menü">{ik(P.menu)}</IconButton>
      </div>
      {p ? (
        <section className="kpm-lap bb-poz" aria-labelledby="kpm-lap-cim" data-ds="5">
          <span className="kpm-lap-fogo" aria-hidden="true" />
          <div className="kpm-lap-fej">
            <Avatar name={p.nev} size={64} shape="square" decorative />
            <div className="kpm-lap-nev"><h2 id="kpm-lap-cim" className="kpm-lap-cim">{p.nev}</h2><p className="kpm-kicsi">{p.tipus}</p></div>
            <IconButton aria-label="Lap bezárása" onClick={() => setKijelolt(null)}>{ik(P.x)}</IconButton>
          </div>
          <div className="kpm-sor kpm-lap-sor"><a href="#" className="kpm-link">Értékeld!</a><StatusBadge tone="success">Nyitva</StatusBadge></div>
          <p className="kpm-kicsi kpm-cim-sor">{ik(P.terkep)}Minta utca 1. · 350 m</p>
          <Button block data-ds="6">Részletek</Button>
        </section>
      ) : (
        <p className="kpm-lap is-ures bc-muted" role="status">Koppints egy jelölőre a részletekért.</p>
      )}
    </div>
  );
}

telefon({ cim: 'Térkép', aktiv: 'Térkép', navDs: 7, gorgo: false, tartalom: <Terkep />, jelek: [['.kpm-jelmagyarazat', 8]] });
