import { useState, type ReactNode } from 'react';
import { cx } from '../cx';
import { HelpButton } from '../field/HelpButton';
import type { MarkerKind } from './map';

export type LegendItem = { label: string; kind: MarkerKind; letter: string };

export type MapLegendProps = {
  items: readonly LegendItem[];
  title?: string;
  /** Lenyitható (details) – alap: igen */
  collapsible?: boolean;
  /** Nyitva induljon? Alap: széles képernyőn (≥ 600 px) igen, telefonon csukva – ne takarja a térképet */
  defaultOpen?: boolean;
  className?: string;
};

/** MapLegend (molekula): a jelölők jelentése – szín ÉS betű együtt. Keskeny képernyőn lenyitható. */
const wide = () => typeof window !== 'undefined' && window.matchMedia('(min-width: 600px)').matches;

export function MapLegend({ items, title = 'Jelmagyarázat', collapsible = true, defaultOpen, className }: MapLegendProps) {
  const [open] = useState(() => defaultOpen ?? wide());
  const list = (
    <ul className="bc-map-legend-list">
      {items.map((i) => (
        <li key={i.label}><span className={`bc-map-swatch is-${i.kind}`} aria-hidden="true">{i.letter}</span>{i.label}</li>
      ))}
    </ul>
  );
  if (!collapsible) return <div className={cx('bc-map-legend', className)} role="group" aria-label={title}><strong>{title}</strong>{list}</div>;
  return (
    <details className={cx('bc-map-legend', className)} open={open}>
      <summary>{title}</summary>
      {list}
    </details>
  );
}

export type HeatScaleProps = {
  /** Mit mutat, egyszerű nyelven: „Megnyitások száma” */
  title: string;
  /** Egység és időszak: „db / nap, 2026. 09.” */
  unit: string;
  /** Honnan jön az adat, hogyan számoljuk (ⓘ) */
  help: ReactNode;
  /** A két vég felirata: [„kevés”, „sok”] vagy számok forrásból */
  ends?: [string, string];
  /** Az öt fokozat felirata (pl. „0–10”) – ha megvan, táblázatként is olvasható */
  steps?: readonly string[];
  /** „Hogyan olvasd?” – 2–4 mondat: mit jelent a sötét, mire figyelj, mi NEM következik belőle */
  howToRead?: ReactNode;
  /** Színtévesztő-barát (kék) sorozat */
  colorblind?: boolean;
  className?: string;
};

/** HeatScale (molekula, 3/B): a hőtérkép skálája a data-seq tokenekből – cím, egység, súgó, két vég, „Hogyan olvasd?”, fokozatok táblázata. */
export function HeatScale({ title, unit, help, ends = ['kevés', 'sok'], steps, howToRead, colorblind, className }: HeatScaleProps) {
  return (
    <figure className={cx('bc-heat', colorblind && 'is-cb', className)} aria-label={`${title}, ${unit}`}>
      <figcaption className="bc-label-row"><span className="bc-label">{title}</span><HelpButton label={title}>{help}</HelpButton></figcaption>
      <p className="bc-heat-unit">{unit}</p>
      <div className="bc-heat-bar" aria-hidden="true">{[1, 2, 3, 4, 5].map((i) => <i key={i} />)}</div>
      <div className="bc-heat-ends"><span>{ends[0]}</span><span>{ends[1]}</span></div>
      {steps && (
        <table className="bc-heat-steps">
          <caption className="bc-sr">{title} – fokozatok ({unit})</caption>
          <tbody><tr>{steps.map((s, i) => <td key={i}><i className={`bc-heat-sw is-${i + 1}`} aria-hidden="true" />{s}</td>)}</tr></tbody>
        </table>
      )}
      {howToRead && <details className="bc-heat-how"><summary>Hogyan olvasd?</summary><div>{howToRead}</div></details>}
    </figure>
  );
}
