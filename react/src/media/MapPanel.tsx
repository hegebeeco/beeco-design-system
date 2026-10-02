import { useState, type ReactNode } from 'react';
import { cx } from '../cx';
import { DataState } from '../adat/DataState';
import { EmptyState } from '../adat/EmptyState';
import { SegmentedControl } from '../inputs/SegmentedControl';
import { defaultLink, type LinkRenderProps } from '../reteg/NavTabs';

/** A térkép egy eleme a „Lista” nézetben (ugyanaz, amit a térképen tűk mutatnak) */
export type MapListItem = { id: string; title: ReactNode; detail?: ReactNode; href?: string; badge?: ReactNode };

export type MapPanelProps = {
  /** A térkép neve (régió-név a képernyőolvasónak), pl. „A partner POI-jai és eseményei” */
  label: string;
  /** Jelmagyarázat (MapLegend, HeatLegend vagy saját) – a térkép fölött */
  legend?: ReactNode;
  /** Megjegyzés a térkép alatt (pl. „3 tétel hibás koordináta miatt nem látszik”) */
  note?: ReactNode;
  /** Eszközsáv a nézetváltó mellett (pl. hőtérkép-kapcsoló) */
  toolbar?: ReactNode;
  status?: 'ready' | 'loading' | 'error';
  what?: string;
  error?: string;
  onRetry?: () => void;
  /** Üres: nincs megjeleníthető pont – EmptyState címe (és magyarázata) */
  empty?: { title: string; text?: ReactNode } | null;
  /** A térkép elemei listaként – ha megadod, megjelenik a „Térkép | Lista” váltó (billentyűzet, képernyőolvasó, telefon) */
  list?: MapListItem[];
  /** Vezérelt nézet (pl. az URL-ből); ha nincs, a panel maga tartja */
  view?: 'map' | 'list';
  onViewChange?: (v: 'map' | 'list') => void;
  /** A térkép magassága (alap: min(420px, 60vh)) */
  height?: string;
  renderLink?: (p: LinkRenderProps) => ReactNode;
  className?: string;
  /** A térkép-tároló tartalma (pl. a Leaflet div) – a `.bc-map` öltözet (tűk, nagyító, buborék, forrás) magától rá kerül */
  children?: ReactNode;
};

/**
 * MapPanel (organizmus, Javaslat 13/2): egységes térkép-keret a meglévő `.bc-map` Leaflet-öltözettel (bc-media-terkep.css).
 * Állapotok (töltés, hiba, üres), jelmagyarázat-hely, megjegyzés, és „Térkép | Lista” nézetváltó: a lista ugyanazokat az elemeket
 * mutatja linkként – így a térkép tartalma billentyűzettel és képernyőolvasóval is elérhető. A térképet a projekt rajzolja (Leaflet).
 */
export function MapPanel({ label, legend, note, toolbar, status = 'ready', what = 'a térképet', error, onRetry, empty, list, view, onViewChange, height = 'min(420px, 60vh)', renderLink = defaultLink, className, children }: MapPanelProps) {
  const [sajat, setSajat] = useState<'map' | 'list'>('map');
  const nezet = view ?? sajat;
  const valt = (v: 'map' | 'list') => { setSajat(v); onViewChange?.(v); };

  return (
    <div className={cx('bc-map-panel', className)}>
      {(list || toolbar) && (
        <div className="bc-row bc-map-panel-bar">
          {list && <SegmentedControl label="Nézet" value={nezet} onChange={valt} items={[{ value: 'map', label: 'Térkép' }, { value: 'list', label: `Lista (${list.length})` }]} />}
          {toolbar}
        </div>
      )}
      <DataState status={status} what={what} error={error} onRetry={onRetry}>
        {empty ? <EmptyState title={empty.title}>{empty.text}</EmptyState> : (
          <>
            {legend && nezet === 'map' && <div className="bc-map-panel-legend">{legend}</div>}
            {nezet === 'map' || !list ? (
              <div className="bc-map bc-map-panel-map" role="region" aria-label={label} style={{ minHeight: height }}>{children}</div>
            ) : (
              <ul className="bc-divided bc-map-panel-list" aria-label={`${label} – lista`}>
                {list.map((it) => (
                  <li key={it.id}>
                    <span className="bc-map-panel-item">
                      {it.href ? renderLink({ href: it.href, children: <strong>{it.title}</strong> }) : <strong>{it.title}</strong>}
                      {it.badge}
                    </span>
                    {it.detail && <span className="bc-muted">{it.detail}</span>}
                  </li>
                ))}
              </ul>
            )}
            {note && <p className="bc-muted bc-map-panel-note">{note}</p>}
          </>
        )}
      </DataState>
    </div>
  );
}
