import { type ReactNode } from 'react';
import { type StatTileProps } from '../adat/StatTile';
import { type BeeMomentProps } from '../meh/BeeMoment';
import { type TemplateHeadProps } from './Frame';
export type DashboardStat = StatTileProps & {
    id: string;
};
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
export declare function Dashboard(p: DashboardProps): import("react").JSX.Element;
