export type DownloadContext = {
    /** Haladás 0–1 (ha a szerver jelzi); ha soha nem hívod, mézsejt-töltő látszik */
    progress: (value: number) => void;
    /** A „Megszakítás” gomb ezt jelzi – add tovább a fetch-nek */
    signal: AbortSignal;
};
export type DownloadButtonProps = {
    /** Mit tölt le, a gomb felirata: „Excel-export”, „Lista letöltése” */
    label: string;
    /** A mentett fájl neve: „partnerek-2026-10-01.xlsx” */
    fileName: string;
    /** Becsült méret letöltés előtt, ha tudható: „kb. 40 KB” */
    sizeHint?: string;
    /** Elkészíti a fájlt. Ha Blob-ot ad vissza, a gomb menti; ha semmit, a hívó intézte a mentést. Hiba → „Újra”. */
    onDownload: (ctx: DownloadContext) => Promise<Blob | void>;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
    className?: string;
};
/** Bájt → „24,5 KB” / „1,2 MB” */
export declare function formatBytes(n: number): string;
/**
 * DownloadButton (molekula, Javaslat 06a/3): kész → készül (haladás, megszakítható) → letöltve (pipa, méret) → hiba (újra).
 * Fájlnév és méret mindig látszik; készülés közben a gomb nem nyomható kétszer; 10 mp után türelmet kér.
 */
export declare function DownloadButton({ label, fileName, sizeHint, onDownload, variant, disabled, className }: DownloadButtonProps): import("react").JSX.Element;
