import { type ReactNode } from 'react';
/** A fájl mérete emberi formában: kicsinél kB, különben MB (tizedesvesszővel) */
export declare const fileSizeText: (bytes: number) => string;
export type FilePickerProps = {
    label: string;
    /** Súgó: mit kell kiválasztani és miért (kötelező, 3/A) */
    help: ReactNode;
    /** A kiválasztott fájl (vezérelt) */
    value: File | null;
    onChange: (file: File | null) => void;
    /** Elfogadott MIME-típusok – a DS a fájl TARTALMÁBÓL ellenőrzi, nem a kiterjesztésből */
    accept: readonly string[];
    /** A fájlválasztó `accept` attribútuma (pl. '.xlsx') – a böngésző szűréséhez */
    acceptAttr?: string;
    maxSizeMB: number;
    /** E fölött csak figyelmeztet (pl. a szerver alapértelmezett határa) */
    warnSizeMB?: number;
    /** Rövid formátum-leírás a korlát-sorba (pl. „.xlsx”) */
    formatText: string;
    /** Rossz típusnál a teendő (pl. „Mentsd el Excel-munkafüzetként (.xlsx)”) */
    typeHint?: string;
    sizeHint?: string;
    /** Külső hiba (pl. a feltöltés nem sikerült) */
    error?: string;
    required?: boolean;
    disabled?: boolean;
    /** Folyamatban (a fájlkártyán „Feltöltés…”, a „Másik fájl” tiltva) */
    busy?: boolean;
};
/**
 * FilePicker (molekula, Javaslat 18): EGY fájl kiválasztása – húzd-ide mező, a DS tartalom-alapú ellenőrzése (típus, méret),
 * kiválasztás után fájlkártya (név, méret, „Másik fájl”). NEM tölt fel: a feltöltést a projekt indítja (pl. egy ablak
 * „Feltöltés” gombja). A FileImport-tól abban tér el, hogy nincs automatikus import és eredménylista.
 */
export declare function FilePicker({ label, help, value, onChange, accept, acceptAttr, maxSizeMB, warnSizeMB, formatText, typeHint, sizeHint, error, required, disabled, busy }: FilePickerProps): import("react").JSX.Element;
