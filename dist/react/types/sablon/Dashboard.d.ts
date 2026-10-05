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
    /**
     * Javaslat 20 – nyomtatható riport: nyomtatáskor / PDF-be mentéskor a keret és a vezérlők rejtve, a lap mindig világos.
     * A nyomtatás gombját a projekt adja (actions; window.print()); ami még ne kerüljön papírra: className="bc-print-hide".
     * Javaslat 21: az eszközsorból (period, toolbar) csak a vezérlők tűnnek el – a szöveg (pl. „Időszak: …”) papírra kerül;
     * ami csak papírra kell (pl. a választó helyett a választott érték): className="bc-print-show" (képernyőn rejtve).
     */
    printable?: boolean;
    children?: ReactNode;
};
/**
 * Dashboard (sablon, Javaslat 06c/16): oldalfej · időszak · mérföldkő-pillanat · StatTile-sor · ChartCard-rács.
 * A csempe- és a grafikon-szakasz rejtett h2-t kap, így a ChartCard h3-a a helyes szinten van.
 * printable (Javaslat 20): nyomtatási szabályok – keret és vezérlők rejtve, mindig világos téma papíron.
 */
export declare function Dashboard(p: DashboardProps): import("react").JSX.Element;
