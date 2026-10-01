import type { ReactNode } from 'react';
export type DataStatus = 'ready' | 'loading' | 'empty' | 'error' | 'forbidden';
export type DataStateProps = {
    status: DataStatus;
    /** Mit töltünk („a partnereket”) – a töltés- és hibaszövegbe kerül */
    what?: string;
    /** Hibaüzenet – alapból: „Nem sikerült betölteni …” */
    error?: string;
    onRetry?: () => void;
    /** Az újrapróbálás folyamatban (a gomb nem nyomható kétszer) */
    retrying?: boolean;
    /** Üres állapot (EmptyState) – alapból „Még nincs adat” */
    empty?: ReactNode;
    /** Töltés közben ez látszik (pl. csontváz) – alapból pörgő + szöveg */
    skeleton?: ReactNode;
    children?: ReactNode;
};
/**
 * DataState (molekula): töltés / üres / hiba (újrapróbálás) / nincs jogosultság / kész – egy kapcsoló.
 * A hiba `role="alert"`, a töltés `role="status"` – a képernyőolvasó is hallja.
 */
export declare function DataState({ status, what, error, onRetry, retrying, empty, skeleton, children }: DataStateProps): import("react").JSX.Element;
/** SkeletonRows (atom): csontváz-sorok a táblázat törzsében – a fejléc marad, a sorok helyén `rows` szürke sáv. */
export declare function SkeletonRows({ rows, cols }: {
    rows?: number;
    cols: number;
}): import("react").JSX.Element;
export type DataNoteProps = {
    title?: string;
    children: ReactNode;
    tone?: 'info' | 'warning';
    className?: string;
};
/** DataNote (molekula): oldalszintű adat-megjegyzés (mit számol az oldal, mi hiányzik) – `bc-alert is-info`. */
export declare function DataNote({ title, children, tone, className }: DataNoteProps): import("react").JSX.Element;
