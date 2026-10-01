import type { UploadItem } from './useUploads';
/** Töltődő (vagy elakadt) kép csempéje: előnézet, „2,1/3,4 MB”, haladás, Megszakítás / Újra. */
export declare function UploadTile({ item, onCancel, onRetry }: {
    item: UploadItem;
    onCancel: () => void;
    onRetry: () => void;
}): import("react").JSX.Element;
