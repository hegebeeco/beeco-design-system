import { useId, useRef, type ReactNode } from 'react';
import { DataState } from '../adat/DataState';
import { StatTile, type StatTileProps } from '../adat/StatTile';
import { BeeMoment, type BeeMomentProps } from '../meh/BeeMoment';
import { Stagger, useCountUp } from '../meh/motion';
import { PageHeader } from '../reteg/PageHeader';
import { SablonFrame, useTemplateTitle, type TemplateHeadProps } from './Frame';

export type DashboardStat = StatTileProps & { id: string };

export type DashboardProps = TemplateHeadProps & {
  /** Oldal-műveletek a fejlécben (pl. „Export”) */
  actions?: ReactNode;
  /** Időszak-választó (DateRangePicker) – a fejléc alatti eszközsorban */
  period?: ReactNode;
  /** További vezérlők az időszak mellett (pl. SegmentedControl: nap/hét/hónap) */
  toolbar?: ReactNode;
  /** Az egész oldal állapota (az egyes csempék és grafikonok saját töltés/hiba állapotot is kapnak) */
  status?: 'ready' | 'error' | 'forbidden';
  what?: string;
  error?: string;
  onRetry?: () => void;
  /** Legfeljebb EGY méhecske-pillanat (pl. 'merfoldko') a csempék fölött */
  moment?: BeeMomentProps;
  /** A fő számok – első megjelenéskor beúsznak és felpörögnek, időszakváltáskor már nem */
  stats?: DashboardStat[];
  statsTitle?: string;
  /** Grafikonkártyák (ChartCard) – 2 oszlop széles helyen, 1 telefonon; className="is-wide" → teljes sor */
  charts?: ReactNode;
  chartsTitle?: string;
  children?: ReactNode;
};

/**
 * Dashboard (sablon, Javaslat 06c/16): oldalfej · időszak · mérföldkő-pillanat · StatTile-sor · ChartCard-rács.
 * A csempe- és a grafikon-szakasz rejtett h2-t kap, így a ChartCard h3-a a helyes szinten van.
 */
export function Dashboard(p: DashboardProps) {
  const { title, description, breadcrumbs, renderLink, status = 'ready', stats, charts } = p;
  useTemplateTitle(title, p.docTitle, p.docTitleSuffix);
  const id = useId();
  return (
    <SablonFrame kind="iranyitopult" standalone={p.standalone} skipLabel={p.skipLabel} className={p.className}>
      <PageHeader title={title} description={description} breadcrumbs={breadcrumbs} renderLink={renderLink} actions={p.actions} />
      {(p.period || p.toolbar) && status === 'ready' && <div className="bc-sablon-toolbar">{p.period}{p.toolbar}</div>}
      <DataState status={status} what={p.what ?? 'az irányítópultot'} error={p.error} onRetry={p.onRetry}>
        {p.moment && <div className="bc-card is-flat bc-sablon-moment"><BeeMoment inline {...p.moment} /></div>}
        {stats && stats.length > 0 && (
          <section aria-labelledby={`${id}-s`}>
            <h2 id={`${id}-s`} className="bc-sr">{p.statsTitle ?? 'Fő számok'}</h2>
            <Stagger className="bc-stats bc-sablon-stats">
              {stats.map(({ id: key, ...s }) => <div key={key} className="bc-sablon-stat"><CountedStat {...s} /></div>)}
            </Stagger>
          </section>
        )}
        {charts && (
          <section aria-labelledby={`${id}-c`}>
            <h2 id={`${id}-c`} className="bc-sr">{p.chartsTitle ?? 'Grafikonok'}</h2>
            <div className="bc-sablon-charts">{charts}</div>
          </section>
        )}
        {p.children}
      </DataState>
    </SablonFrame>
  );
}

/**
 * A szám csak az ELSŐ valódi értéknél pörög fel (useCountUp). Ha utána újratölt (időszakváltás → loading → új érték),
 * a csempe már a végső értéket mutatja – a felpörgés nem ismétlődik.
 */
function CountedStat(s: StatTileProps) {
  const phase = useRef<'wait' | 'count' | 'done'>('wait');
  const ready = !s.loading && !s.error && typeof s.value === 'number';
  if (phase.current === 'wait' && ready) phase.current = 'count';
  else if (phase.current === 'count' && !ready) phase.current = 'done';
  return phase.current === 'count' ? <Counting {...s} value={s.value as number} /> : <StatTile {...s} />;
}

function Counting(s: StatTileProps & { value: number }) {
  const v = useCountUp(s.value);
  return <StatTile {...s} value={v} />;
}
