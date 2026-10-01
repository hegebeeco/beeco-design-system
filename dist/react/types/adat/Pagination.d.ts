export type PaginationProps = {
    /** Aktuális lap, 0-tól */
    page: number;
    pageSize: number;
    /** Az összes elem száma (szerveroldali lapozásnál a szervertől) */
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    /** Választható oldalméretek – jóváhagyva: 10 / 25 / 100 */
    pageSizes?: number[];
    /** Mit számolunk: „1–25 / 312 partner” */
    itemLabel?: string;
    /** A lapozó neve (több lapozó egy oldalon: legyen egyedi) */
    label?: string;
    className?: string;
};
/**
 * Pagination (molekula): „1–25 / 312 POI” · ‹ 1 2 … 13 › · oldalméret 10 / 25 / 100.
 * Az aktuális lap `aria-current="page"`; az első/utolsó lapnál a nyíl tiltott.
 */
export declare function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange, pageSizes, itemLabel, label, className }: PaginationProps): import("react").JSX.Element;
