import { cloneElement, isValidElement, useId, useState, type ReactElement, type ReactNode } from 'react';
import { cx } from '../../cx';
import { HelpButton } from '../../field/HelpButton';
import { DataState } from '../DataState';
import { EmptyState } from '../EmptyState';
import { ChartLegend } from './ChartLegend';
import { ChartTable } from './ChartTable';
import { LineChart } from './LineChart';
import { isEmptyData, paletteClass, type ChartData } from './types';

export type ChartCardProps = {
  /** Mit mutat, egyszerű nyelven: „Beváltott kuponok hetente” */
  title: string;
  /** Mértékegység az alcímben: „db / hét” */
  unit: string;
  /** Időszak az alcímben: „2026. 07. 06. – 09. 27.” */
  period: string;
  /** Súgó (ⓘ): honnan jön az adat, hogyan számoljuk */
  help: ReactNode;
  /** „Hogyan olvasd?” – 2–4 mondat: mit jelent a magas/alacsony, mire figyelj, mi NEM következik belőle */
  howToRead: ReactNode;
  /** Forrás és lekérdezés ideje – a láblécben */
  source: ReactNode;
  /** Ugyanaz az adat, amit a grafikon kap – ebből készül a jelmagyarázat és az adattábla */
  data: ChartData;
  /** A grafikon (BarChart, LineChart, GroupedBarChart, StackedBarChart) */
  children: ReactNode;
  status?: 'ready' | 'loading' | 'error';
  error?: string;
  onRetry?: () => void;
  /** Üres állapot teendője, pl. „Válassz hosszabb időszakot” gomb */
  emptyAction?: ReactNode;
  /** Színtévesztő-barát adatszínek erre a kártyára (a data-cb / .ds-cb az oldalon is bekapcsolja) */
  cb?: boolean;
  /** Mintaadat-jelölés (bemutató, tesztlap) */
  sample?: boolean;
  /** Ha megadod, az eszköz megjegyzi, hogy a „Hogyan olvasd?”-t becsuktad (első látogatáskor nyitva) */
  rememberKey?: string;
  /**
   * Sorozat-kapcsoló (csak LineChart-tal): a jelmagyarázat elemei gombok, amelyekkel a vonalak ki-be kapcsolhatók –
   * pl. 5 állapot-sávból csak a „szomjas” fákat nézni. A kikapcsolt sorozat az adattáblában megmarad.
   */
  seriesToggle?: boolean;
  headingLevel?: 2 | 3 | 4;
  className?: string;
};

const KEY = (k: string) => `bc-howto:${k}`;
const readOpen = (k?: string) => { if (!k) return true; try { return localStorage.getItem(KEY(k)) !== 'closed'; } catch { return true; } };

/**
 * ChartCard (organizmus, 3/B): cím · alcím (egység, időszak) · súgó ⓘ · jelmagyarázat felül · grafikon · „Hogyan olvasd?” (lenyitható, 4b A) ·
 * adattábla (lenyitható, mindig elérhető) · forrás · töltés / üres / hiba. A kötelező részek nélkül nem fordul (TypeScript).
 */
export function ChartCard(p: ChartCardProps) {
  const { title, unit, period, help, howToRead, source, data, children, status = 'ready', headingLevel = 3 } = p;
  const id = useId();
  const [howOpen, setHowOpen] = useState(() => readOpen(p.rememberKey));
  const [tableOpen, setTableOpen] = useState(false); // az adattábla csak nyitva épül fel (90+ sornál is gyors betöltés)
  const H = `h${headingLevel}` as 'h3';
  const empty = status === 'ready' && isEmptyData(data);
  const kind = isValidElement(children) && children.type === LineChart ? 'line' : 'bar';
  // Kikapcsolt sorozatok: a grafikon az adat másolatát kapja `hidden` jelöléssel (a szín/alak indexe nem tolódik el).
  // Csak a kapcsolók döntenek (a hívó `hidden`-je itt nem számít), és csak a most létező kulcsok – adatcsere után nem ragad be semmi.
  const [offRaw, setOff] = useState<ReadonlySet<string>>(() => new Set());
  const toggles = !!p.seriesToggle && kind === 'line' && data.series.length > 1;
  const off = new Set([...offRaw].filter((k) => data.series.some((s) => s.key === k)));
  const childData = isValidElement(children) ? (children.props as { data?: ChartData }).data ?? data : data;
  const mark = (d: ChartData): ChartData => ({ ...d, series: d.series.map((s) => ({ ...s, hidden: off.has(s.key) })) });
  const shown: ChartData = toggles ? mark(data) : data;
  const chart = toggles && isValidElement(children)
    ? cloneElement(children as ReactElement<{ data: ChartData }>, { data: mark(childData) })
    : children;
  // Az utolsó látható sorozatot nem lehet kikapcsolni – különben üres, magyarázat nélküli rajz maradna
  const toggle = (key: string) => setOff((cur) => {
    const n = new Set([...cur].filter((k) => data.series.some((s) => s.key === k)));
    if (n.has(key)) n.delete(key);
    else if (data.series.length - n.size > 1) n.add(key);
    return n;
  });
  const pal = paletteClass(data);
  const onHow = (open: boolean) => {
    setHowOpen(open);
    if (p.rememberKey) try { localStorage.setItem(KEY(p.rememberKey), open ? 'open' : 'closed'); } catch { /* privát mód: nem jegyezzük meg */ }
  };
  return (
    <figure className={cx('bc-card', 'bc-chart-card', pal, p.className)} aria-labelledby={`${id}-t`} data-cb={p.cb ? 'true' : undefined}>
      <header className="bc-chart-head">
        <div className="bc-chart-titles">
          <div className="bc-label-row">
            <H className="bc-chart-title" id={`${id}-t`}>{title}</H>
            <HelpButton label={title}>{help}</HelpButton>
          </div>
          <p className="bc-chart-sub">{unit} · {period}{p.sample && <span className="bc-badge is-muted">mintaadat</span>}</p>
        </div>
      </header>
      {status === 'ready' && !empty && <ChartLegend data={shown} kind={kind} onToggle={toggles ? toggle : undefined} />}
      <div className="bc-chart-body">
        {empty ? (
          <EmptyState compact title="Ebben az időszakban nincs adat" action={p.emptyAction}>Válassz hosszabb vagy másik időszakot.</EmptyState>
        ) : (
          <DataState status={status} what="a grafikont" error={p.error} onRetry={p.onRetry} skeleton={<span className="bc-skeleton bc-chart-skel" />}>{chart}</DataState>
        )}
      </div>
      <details className="bc-disclosure" open={howOpen} onToggle={(e) => onHow((e.currentTarget as HTMLDetailsElement).open)}>
        <summary>Hogyan olvasd?</summary>
        <div className="bc-disclosure-body">{howToRead}</div>
      </details>
      {status === 'ready' && !empty && (
        <details className="bc-disclosure" onToggle={(e) => setTableOpen((e.currentTarget as HTMLDetailsElement).open)}>
          <summary>Adattábla ({data.categories.length} sor)</summary>
          <div className="bc-disclosure-body">{tableOpen && <ChartTable data={data} caption={title} />}</div>
        </details>
      )}
      <footer className="bc-chart-source">Forrás: {source}</footer>
    </figure>
  );
}
