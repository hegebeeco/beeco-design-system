import { type ReactNode } from 'react';
import { type LinkRenderProps } from '../reteg/NavTabs';
/** A térkép egy eleme a „Lista” nézetben (ugyanaz, amit a térképen tűk mutatnak) */
export type MapListItem = {
    id: string;
    title: ReactNode;
    detail?: ReactNode;
    href?: string;
    badge?: ReactNode;
};
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
    empty?: {
        title: string;
        text?: ReactNode;
    } | null;
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
export declare function MapPanel({ label, legend, note, toolbar, status, what, error, onRetry, empty, list, view, onViewChange, height, renderLink, className, children }: MapPanelProps): import("react").JSX.Element;
