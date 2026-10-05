import { useState, type KeyboardEvent, type MouseEvent } from 'react';
import { HU_BOUNDS, LocationPicker, type LocationPickerProps, type AddressHit, type LatLng, type LocationMapProps, type LocationSource } from '../src/kieg2';
import { formatLatLng } from '../src/kieg2/geo';
import { norm } from '../src/pickers/normalize';
import { Case, Grid, mount } from './_keret';

/** Mintaadat: kitalált címek kerek koordinátákkal – a kereső hálózat nélkül, a böngészőben szűr */
const CIMEK: AddressHit[] = [
  { id: 'a1', label: 'Andrássy út 12, 1061 Budapest (mintaadat)', lat: 47.5031, lng: 19.0594 },
  { id: 'a2', label: 'Andrássy út 60, 1062 Budapest (mintaadat)', lat: 47.5066, lng: 19.0655 },
  { id: 's1', label: 'Széchenyi tér 1, 6720 Szeged (mintaadat)', lat: 46.2547, lng: 20.1486 },
  { id: 'd1', label: 'Kossuth Lajos utca 3, 4024 Debrecen (mintaadat)', lat: 47.5316, lng: 21.6273 },
  { id: 'p1', label: 'Fő tér 1, 9400 Sopron (mintaadat)', lat: 47.6849, lng: 16.5905 },
  { id: 'h1', label: 'Nagyon-nagyon-hosszú-nevű-szövetkezeti-mézfeldolgozó-üzem-és-látogatóközpont, Hosszúhetény (mintaadat)', lat: 46.1636, lng: 18.3489 },
];
const fakeSearch = (q: string, signal: AbortSignal) => new Promise<AddressHit[]>((res, rej) => {
  const t = setTimeout(() => res(CIMEK.filter((c) => norm(c.label).includes(norm(q)))), 150);
  signal.addEventListener('abort', () => { clearTimeout(t); rej(new DOMException('megszakítva', 'AbortError')); });
});
const failSearch = () => new Promise<AddressHit[]>((_, rej) => setTimeout(() => rej(new Error('szerverhiba')), 100));
const slowSearch = () => new Promise<AddressHit[]>(() => undefined);

/**
 * Mintatérkép a renderMap helyére (a projektben itt Leaflet lenne): kattintásra tűz, nyilakkal 0,05°-ot lép.
 * Lineáris vetület Magyarország befoglaló téglalapján – csak a tesztlaphoz.
 */
function MintaTerkep({ marker, onPick, markerHtml, disabled }: LocationMapProps) {
  const W = HU_BOUNDS.east - HU_BOUNDS.west, H = HU_BOUNDS.north - HU_BOUNDS.south;
  const pick = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    onPick({ lng: HU_BOUNDS.west + ((e.clientX - r.left) / r.width) * W, lat: HU_BOUNDS.north - ((e.clientY - r.top) / r.height) * H });
  };
  const key = (e: KeyboardEvent) => {
    const d = { ArrowUp: [0.05, 0], ArrowDown: [-0.05, 0], ArrowLeft: [0, -0.05], ArrowRight: [0, 0.05] }[e.key];
    if (!d) return;
    e.preventDefault();
    const m = marker ?? { lat: 47.5, lng: 19.04 };
    onPick({ lat: m.lat + d[0], lng: m.lng + d[1] });
  };
  const x = marker ? ((marker.lng - HU_BOUNDS.west) / W) * 100 : null, y = marker ? ((HU_BOUNDS.north - marker.lat) / H) * 100 : null;
  return (
    <div className="bc-map" style={{ height: 260 }}>
      <button type="button" data-terkep className="tl-hit" disabled={disabled} onClick={pick} onKeyDown={key}
        aria-label="Mintatérkép: kattints a tű letűzéséhez, vagy mozgasd nyilakkal"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'transparent', border: 0, cursor: disabled ? 'not-allowed' : 'crosshair' }} />
      {x !== null && y !== null && x >= 0 && x <= 100 && y >= 0 && y <= 100 && (
        <div className="bc-map-icon" style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: 40, height: 50, marginLeft: -20, marginTop: -50, pointerEvents: 'none' }}
          dangerouslySetInnerHTML={{ __html: markerHtml }} />
      )}
      <p className="bc-badge is-muted" style={{ position: 'absolute', left: 'var(--bc-sp-2)', bottom: 'var(--bc-sp-2)', margin: 0 }}>Mintatérkép (a projektben Leaflet)</p>
    </div>
  );
}

function Pelda({ id, start = null, map = true, search = fakeSearch, ...rest }: { id: string; start?: LatLng | null; map?: boolean; search?: typeof fakeSearch | null } & Omit<Partial<LocationPickerProps>, 'search'>) {
  const [v, setV] = useState<LatLng | null>(start);
  const [src, setSrc] = useState<LocationSource | ''>('');
  return (
    <>
      <LocationPicker latName="latitude" lngName="longitude" label="A hely pontos helye" help="Ide tűzzük a térképen a partnert az appban. Keress címet, kattints a térképre, vagy írd be a koordinátákat – egymást frissítik."
        value={v} onChange={(n, s) => { setV(n); setSrc(s); }} renderMap={map ? (p) => <MintaTerkep {...p} /> : undefined} search={search ?? undefined} {...rest} />
      <p className="tl-out" data-out={id}>{v ? `${formatLatLng(v, 6)}${src ? ` (${src})` : ''}` : `nincs pont${src ? ` (${src})` : ''}`}</p>
    </>
  );
}

mount('Kiegészítők – helyválasztó', 'LocationPicker (06b/13): térkép-tű, címkereső (Combobox) és koordináta-mezők egymást frissítik; tartomány-igazítás, Magyarországon kívüli figyelmeztetés, jelenlegi hely. Minden cím mintaadat.', (
  <>
    <Grid title="Alap és források">
      <Case id="hely" title="Üres → keresés / térkép / gépelés / jelenlegi helyem" wide><Pelda id="hely" /></Case>
      <Case id="hely-mini" title="Térkép nélkül: vázlatos mini-térkép, kitöltve" wide><Pelda id="hely-mini" map={false} start={{ lat: 47.4979, lng: 19.0402 }} /></Case>
    </Grid>
    <Grid title="Figyelmeztetés és hiba">
      <Case id="hely-kulfold" title="Magyarországon kívül (Bécs) – csak figyelmeztetés"><Pelda id="hely-kulfold" map={false} start={{ lat: 48.2082, lng: 16.3738 }} /></Case>
      <Case id="hely-csere" title="Felcserélt koordináták → „Felcserélem”"><Pelda id="hely-csere" map={false} start={{ lat: 19.0402, lng: 47.4979 }} /></Case>
      <Case id="hely-vazlaton-kivul" title="Messze (Tokió) – a vázlaton kívül"><Pelda id="hely-vazlaton-kivul" map={false} search={null} geolocation={false} start={{ lat: 35.6762, lng: 139.6503 }} /></Case>
      <Case id="hely-hiba" title="Kötelező, üres – hibaüzenet"><Pelda id="hely-hiba" map={false} required error="Jelöld ki a helyet – e nélkül nem jelenik meg a térképen az appban." /></Case>
      <Case id="hely-kereso-hiba" title="A címkereső hibázik (Újrapróbálás)"><Pelda id="hely-kereso-hiba" map={false} search={failSearch} /></Case>
      <Case id="hely-kereso-tolt" title="A címkereső töltődik"><Pelda id="hely-kereso-tolt" map={false} search={slowSearch} /></Case>
    </Grid>
    <Grid title="Tiltott és csak olvasható">
      <Case id="hely-tiltott" title="Tiltott"><Pelda id="hely-tiltott" disabled start={{ lat: 46.2547, lng: 20.1486 }} /></Case>
      <Case id="hely-olvas" title="Csak olvasható (kereső és gomb nélkül)"><Pelda id="hely-olvas" map={false} readOnly start={{ lat: 47.6849, lng: 16.5905 }} /></Case>
    </Grid>
  </>
));
