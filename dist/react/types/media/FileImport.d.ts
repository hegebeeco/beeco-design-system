import { type ReactNode } from 'react';
import { type UploadFn } from './files';
import { type ImportSummary } from './ImportResult';
export type FileImportProps = {
    label: string;
    help: ReactNode;
    /** Az import (a projekt küldi a backendnek), a végén az eredmény soronként */
    importFile: UploadFn<ImportSummary>;
    maxSizeMB?: number;
    /** Régi .xls is jöhet? Alap: igen */
    allowXls?: boolean;
    /** A sablon letöltése (link) – ha van */
    template?: {
        href: string;
        label?: string;
    };
    disabled?: boolean;
};
/**
 * FileImport (organizmus, Javaslat 04 – 5B, átmeneti: backend-próbaimport nélkül): egy lépés –
 * fájl kiválasztása (típus a tartalom szerint, méret) → feltöltés haladással → eredménylista (sor, oszlop, ok, teendő).
 */
export declare function FileImport({ label, help, importFile, maxSizeMB, allowXls, template, disabled }: FileImportProps): import("react").JSX.Element;
