import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cx } from '../cx';
import { HelpButton } from '../field/HelpButton';
import { Button } from '../inputs/Button';
import { NumberField } from '../inputs/NumberField';
import { markerHtml } from '../media/map';
import { AddressSearch } from './AddressSearch';
import { formatLatLng, HU_CENTER, inHungary, LAT_RANGE, LNG_RANGE, looksSwapped, roundLatLng, sameLatLng, validLatLng, type AddressHit, type LatLng } from './geo';
import { MiniMap } from './MiniMap';
import { accuracyText, useGeolocation } from './useGeolocation';

/** Honnan jött az új pont (naplózáshoz, analitikához) */
export type LocationSource = 'map' | 'search' | 'fields' | 'geo' | 'swap';

/** Amit a projekt térképe kap: a DS nem függ a Leaflettől – a projekt rajzol, a DS adja az adatot és a jelölőt */
export type LocationMapProps = {
  center: LatLng;
  marker: LatLng | null;
  /** A térképre kattintáskor / a jelölő húzásakor hívd */
  onPick: (p: LatLng) => void;
  /** A DS tű-jelölője (L.divIcon html-nek, MARKER_ICON_SELECTED méretekkel) */
  markerHtml: string;
  disabled: boolean;
};

export type LocationPickerProps = {
  label: string;
  /** Súgó: mit és miért kell megadni (kötelező, 3/A) */
  help: ReactNode;
  value: LatLng | null;
  onChange: (value: LatLng | null, source: LocationSource) => void;
  /** A projekt térképe (pl. Leaflet). Ha nincs, vázlatos mini-térkép jelenik meg. */
  renderMap?: (p: LocationMapProps) => ReactNode;
  /** Címkereső (a projekt szolgáltatása). Ha nincs, a címkereső mező nem jelenik meg. */
  search?: (query: string, signal: AbortSignal) => Promise<ReadonlyArray<AddressHit>>;
  /** „Jelenlegi helyem” gomb (alap: van) */
  geolocation?: boolean;
  /** Térkép-középpont, ha még nincs pont (alap: Budapest) */
  defaultCenter?: LatLng;
  /** Koordináta-pontosság (alap: 6 tizedes ≈ 11 cm) */
  decimals?: number;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
};

type Draft = { lat: number | null; lng: number | null };
const toDraft = (v: LatLng | null): Draft => ({ lat: v?.lat ?? null, lng: v?.lng ?? null });
const SRC: Record<LocationSource, string> = { map: 'térképről', search: 'címkeresésből', fields: 'a mezőkből', geo: 'a jelenlegi helyedből', swap: 'felcserélve' };

/**
 * LocationPicker (organizmus, Javaslat 06b/13): térkép-tű + címkereső + koordináta-mezők, egymást frissítik.
 * Érvényesség: szélesség −90…90, hosszúság −180…180 (kilépéskor a határra igazít + jelzés);
 * Magyarországon kívüli pont csak FIGYELMEZTETÉS (lehet valódi), felcserélt koordinátára „Felcserélem” ajánlat.
 */
export function LocationPicker({ label, help, value, onChange, renderMap, search, geolocation = true, defaultCenter = HU_CENTER,
  decimals = 6, error, required, disabled = false, readOnly = false, className }: LocationPickerProps) {
  const id = useId();
  const [draft, setDraft] = useState<Draft>(() => toDraft(value));
  const [said, setSaid] = useState('');
  const emitted = useRef<LatLng | null>(value);
  const geo = useGeolocation();
  const locked = disabled || readOnly;

  // Kívülről jövő érték (űrlap visszaállítása) – a saját kibocsátásunkat nem írjuk vissza
  useEffect(() => {
    if (!sameLatLng(value, emitted.current, decimals)) { emitted.current = value; setDraft(toDraft(value)); }
  }, [value, decimals]);

  const emit = (v: LatLng | null, source: LocationSource) => {
    emitted.current = v;
    onChange(v, source);
    if (v && source !== 'fields') setSaid(`A hely beállítva ${SRC[source]}: ${formatLatLng(v, decimals)}`);
  };
  const setPoint = (p: LatLng, source: LocationSource) => {
    const r = roundLatLng(p, decimals);
    if (!validLatLng(r)) return;
    setDraft(r); emit(r, source);
  };
  const setField = (k: 'lat' | 'lng', n: number | null) => {
    const d = { ...draft, [k]: n };
    setDraft(d);
    const p = d.lat !== null && d.lng !== null ? { lat: d.lat, lng: d.lng } : null;
    // Gépelés közben a tartományon kívüli érték még nem pont (kilépéskor a mező a határra igazítja)
    emit(p && validLatLng(p) ? p : null, 'fields');
  };

  const point = draft.lat !== null && draft.lng !== null && validLatLng({ lat: draft.lat, lng: draft.lng }) ? { lat: draft.lat, lng: draft.lng } : null;
  const outside = point && !inHungary(point);
  const swapped = point && looksSwapped(point);
  const gs = geo.state;

  return (
    <fieldset className={cx('bc-loc', className)} disabled={disabled} aria-describedby={error ? `${id}-err` : undefined} aria-invalid={error ? true : undefined}>
      <legend className="bc-loc-legend">
        <span className="bc-label">{label}{required && <span className="is-req" aria-hidden="true">*</span>}{required && <span className="bc-sr"> (kötelező)</span>}</span>
        <HelpButton label={label}>{help}</HelpButton>
      </legend>
      <div className="bc-loc-grid">
        <div className="bc-loc-map">
          {renderMap ? renderMap({ center: point ?? defaultCenter, marker: point, disabled: locked, onPick: (p) => !locked && setPoint(p, 'map'),
            markerHtml: markerHtml({ label: '', kind: 'neutral', selected: true, title: 'Kiválasztott hely' }) }) : <MiniMap point={point} />}
        </div>
        <div className="bc-loc-side">
          {search && !readOnly && <AddressSearch search={search} disabled={disabled} onPick={(h) => setPoint(h, 'search')} />}
          <div className="bc-loc-coords">
            <NumberField label="Szélesség (lat)" help="Észak–dél irányú helyzet fokban. Magyarországon kb. 45,7 és 48,6 között van. Tizedesvesszővel vagy ponttal is írhatod."
              value={draft.lat} onChange={(n) => setField('lat', n)} min={LAT_RANGE.min} max={LAT_RANGE.max} decimals={decimals} unit="°" readOnly={readOnly} disabled={disabled} />
            <NumberField label="Hosszúság (lng)" help="Kelet–nyugat irányú helyzet fokban. Magyarországon kb. 16,1 és 22,9 között van. Tizedesvesszővel vagy ponttal is írhatod."
              value={draft.lng} onChange={(n) => setField('lng', n)} min={LNG_RANGE.min} max={LNG_RANGE.max} decimals={decimals} unit="°" readOnly={readOnly} disabled={disabled} />
          </div>
          {geolocation && !readOnly && (
            <div className="bc-loc-geo">
              <Button variant="secondary" busy={gs.status === 'locating'} disabled={disabled} onClick={() => geo.locate((p) => setPoint(p, 'geo'))}
                icon={<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /></svg>}>
                {gs.status === 'locating' ? 'Keresem a helyed…' : 'Jelenlegi helyem'}
              </Button>
              {gs.status === 'found' && <p className="bc-notice" role="status">Megvan: {accuracyText(gs.accuracy)} pontossággal.</p>}
              {(gs.status === 'denied' || gs.status === 'unavailable' || gs.status === 'timeout') && <p className="bc-loc-geo-err" role="alert" data-geo={gs.status}>{gs.message}</p>}
            </div>
          )}
          {outside && (
            <div className="bc-alert is-warning bc-loc-warn" role="status">
              <p>{swapped ? 'Ez a pont Magyarországon kívül van – lehet, hogy felcserélted a szélességet és a hosszúságot.' : 'Ez a pont Magyarországon kívül van. Ha tényleg ott a hely, hagyd így.'}</p>
              {swapped && !locked && <Button size="sm" variant="secondary" onClick={() => setPoint({ lat: point.lng, lng: point.lat }, 'swap')}>Felcserélem</Button>}
            </div>
          )}
        </div>
      </div>
      {error && <p className="bc-error" id={`${id}-err`} role="alert">{error}</p>}
      <p className="bc-sr" role="status">{said}</p>
    </fieldset>
  );
}
