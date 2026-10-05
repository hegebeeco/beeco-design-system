import { type ReactNode } from 'react';
import { type AddressHit, type LatLng } from './geo';
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
    /** A koordináta-mezők `name`-je (Javaslat 18) – az űrlap hibaösszesítője ezekre a mezőkre ugrik (pl. 'latitude', 'longitude') */
    latName?: string;
    lngName?: string;
};
/**
 * LocationPicker (organizmus, Javaslat 06b/13): térkép-tű + címkereső + koordináta-mezők, egymást frissítik.
 * Érvényesség: szélesség −90…90, hosszúság −180…180 (kilépéskor a határra igazít + jelzés);
 * Magyarországon kívüli pont csak FIGYELMEZTETÉS (lehet valódi), felcserélt koordinátára „Felcserélem” ajánlat.
 */
export declare function LocationPicker({ label, help, value, onChange, renderMap, search, geolocation, defaultCenter, decimals, error, required, disabled, readOnly, className, latName, lngName }: LocationPickerProps): import("react").JSX.Element;
