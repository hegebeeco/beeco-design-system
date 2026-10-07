import { type ReactNode } from 'react';
/** Egy zóna (oszlop) a vásznon */
export type RetroZona = {
    kulcs: string;
    cim: string;
    kerdes?: string;
    ikon?: ReactNode;
};
/** Egy cetli. `sajat` = a nézőé (szerkesztheti, mozgathatja, törölheti); a moderátor bárkiét kezelheti. */
export type RetroCetli = {
    id: string;
    zona: string;
    szoveg: string;
    /** Név nélkül – a szerző nem jelenik meg */
    anonim?: boolean;
    szerzo?: string;
    sajat?: boolean;
};
export type RetroKeret = {
    cim: string;
    leiras: string;
    zonak: readonly RetroZona[];
};
/** Kész keretek (a Kaptár retró-keretei): vitorlás (4 zóna), 4L, Start–Stop–Folytasd */
export declare const RETRO_KERETEK: Readonly<Record<'vitorlas' | '4l' | 'ssc', RetroKeret>>;
export type RetroVaszonLabels = {
    ujCetli: string;
    ujCetliMezo: (zona: string) => string;
    ujSugo: string;
    anonim: string;
    felteszem: string;
    megse: string;
    mentes: string;
    szerkesztes: (szoveg: string) => string;
    szerkesztesMezo: string;
    torles: (szoveg: string) => string;
    athelyezes: (szoveg: string) => string;
    huzas: string;
    nevNelkul: string;
    ismeretlen: string;
    tied: string;
    ures: string;
    csakOlvashato: string;
    betoltes: string;
    athelyezve: (zona: string) => string;
    db: (n: number) => string;
    hibaUres: string;
};
export declare const RETRO_VASZON_LABELS_HU: RetroVaszonLabels;
export type RetroVaszonProps = {
    /** A zónák (pl. `RETRO_KERETEK.vitorlas.zonak`) */
    zonak: readonly RetroZona[];
    cetlik: readonly RetroCetli[];
    /** Új cetli; `false` (vagy Promise<false>) = nem sikerült, az űrlap nyitva marad a szöveggel */
    onUj?: (zona: string, szoveg: string, anonim: boolean) => void | boolean | Promise<void | boolean>;
    /** Áthelyezés (húzás vagy a cetli „Áthelyezés” választója) */
    onMozgat?: (id: string, zona: string) => void;
    onSzerkeszt?: (id: string, szoveg: string) => void;
    onTorol?: (id: string) => void;
    /** Moderátor: bárki cetlijét mozgathatja, szerkesztheti, törölheti */
    moderator?: boolean;
    /** Lezárt retró: semmi nem változtatható */
    csakOlvashato?: boolean;
    tolt?: boolean;
    /** Egy cetli legfeljebb ennyi karakter – alap 280 */
    maxHossz?: number;
    /** A zónacímek szintje – alap 3 */
    cimSzint?: 2 | 3 | 4;
    /** Kivetítő-mód: nagyobb betű */
    nagy?: boolean;
    labels?: Partial<RetroVaszonLabels>;
    className?: string;
};
/**
 * RetroVaszon (organizmus, jóváhagyva 2026-10-07 – a Kaptár retró-jelöltje): zónák cetlikkel (vitorlás, 4L, Start–Stop–Folytasd
 * vagy saját). Zónánként „Cetli ide” (név nélkül is), a saját cetli szerkeszthető és törölhető; áthelyezés húzással (egér ÉS
 * érintés – pointer-események) és billentyűzettel (a cetli „Áthelyezés” választója); az áthelyezést élő régió mondja be.
 * Üres, töltés és csak olvasható állapot; keskeny képernyőn a zónák egymás alá kerülnek.
 */
export declare function RetroVaszon({ zonak, cetlik, onUj, onMozgat, onSzerkeszt, onTorol, moderator, csakOlvashato, tolt, maxHossz, cimSzint, nagy, labels, className, }: RetroVaszonProps): import("react").JSX.Element;
