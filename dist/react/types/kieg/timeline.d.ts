import { type ReactNode } from 'react';
import { type DataStatus } from '../adat/DataState';
import { type ActivityItem } from './activity';
export type TimelineProps = {
    items: ActivityItem[];
    /** Töltés / hiba / jogosultság – a DataState kapcsolja (alap: ready) */
    status?: Exclude<DataStatus, 'empty'>;
    onRetry?: () => void;
    /** Kezdetben ennyi bejegyzés látszik; a „Még …” gomb ennyivel bővít (alap 10) */
    pageSize?: number;
    /** Szerveroldali folytatás: ha van, a „Még …” ezt hívja (a hívó fűzi az items végére) */
    onLoadMore?: () => void;
    hasMore?: boolean;
    loadingMore?: boolean;
    /** Mihez képest „Ma”/„Tegnap” (teszteléshez) */
    now?: Date;
    /** Üres állapot – alapból „Még nincs bejegyzés” */
    empty?: ReactNode;
    /** A lista neve képernyőolvasónak: „Partner-aktivitás” */
    label?: string;
    className?: string;
};
/**
 * Timeline / ActivityLog (organizmus, Javaslat 06a/8): ki · mit · mikor, napok szerint („Ma”, „Tegnap”, dátum),
 * mezőszintű különbség (előtte → utána) lenyitva, „Még …” bővítés (helyi vagy szerveroldali).
 */
export declare function Timeline({ items, status, onRetry, pageSize, onLoadMore, hasMore, loadingMore, now, empty, label, className }: TimelineProps): import("react").JSX.Element;
