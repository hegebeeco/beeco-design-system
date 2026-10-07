import { type ReactNode } from 'react';
export type Jelzes = 'zold' | 'sarga' | 'piros';
export type Irany = 'elore' | 'helyben' | 'hatra';
/** A kártya értéke (vezérelt): jelzés, irány és a szabad szövegek (mező-kulcs → szöveg) */
export type JelzoErtek = {
    jelzes?: Jelzes | null;
    irany?: Irany | null;
    szovegek?: Readonly<Record<string, string>>;
};
/** Egy rövid szöveges mező (pl. „Mi megy jól?”) – a súgó kötelező (3/A) */
export type JelzoSzovegMezo = {
    kulcs: string;
    cimke: string;
    sugo: ReactNode;
    max?: number;
};
export type JelzoKartyaLabels = {
    jelzesKerdes: string;
    iranyKerdes: string;
    jelzesek: Record<Jelzes, {
        cim: string;
        leiras: string;
    }>;
    iranyok: Record<Irany, string>;
    szovegCim: string;
    kotelezo: string;
};
export declare const JELZO_KARTYA_LABELS_HU: JelzoKartyaLabels;
/** A Team-Health-Check három alapkérdése – a Kaptár szövegei; a `szovegMezok` prop felülírja */
export declare const JELZO_SZOVEG_MEZOK_HU: readonly JelzoSzovegMezo[];
/** A jelzések piktogramja – a szín mellett MINDIG alak és szöveg is (nem csak szín) */
export declare const JELZES_IKON: Record<Jelzes, ReactNode>;
export declare const IRANY_IKON: Record<Irany, ReactNode>;
export type JelzoKartyaProps = {
    /** A terület neve (a kártya címe) */
    cim: string;
    /** Egy mondat a területről */
    leiras?: ReactNode;
    /** A cím szintje – alap 3 */
    cimSzint?: 2 | 3 | 4;
    ertek: JelzoErtek;
    onValtozas: (uj: JelzoErtek) => void;
    /** Irány-kérdés (előre / helyben / hátra) – alap: igen */
    irany?: boolean;
    /** Szabad szöveges mezők (lenyitható részben) – alap: a 3 Kaptár-kérdés; `false` = nincs */
    szovegMezok?: readonly JelzoSzovegMezo[] | false;
    /** A szöveges rész nyitva induljon (alap: csak ha már van benne szöveg) */
    szovegNyitva?: boolean;
    /** Hiba a jelzésnél, pl. „Válassz egy színt – ez kell a kerékhez.” */
    hiba?: string;
    /** A jelzés kötelező (a csoport neve mellett jelölve) */
    kotelezo?: boolean;
    disabled?: boolean;
    labels?: Partial<JelzoKartyaLabels>;
    className?: string;
};
/**
 * JelzoKartya (organizmus, jóváhagyva 2026-10-07 – a Kaptár Team-Health-Check jelöltje): egy terület szavazókártyája.
 * Három nagy választás (zöld / sárga / piros) – mindegyiknél piktogram + szöveg, nem csak szín –, irány (előre / helyben / hátra)
 * és legfeljebb néhány rövid, nem kötelező szöveg. Vezérelt (`ertek`, `onValtozas`). Natív rádiócsoportok: egy Tab-megálló,
 * nyilakkal léptethető; 44 px; hiba szövegesen, `aria-invalid` + `aria-describedby`; tiltott állapot.
 */
export declare function JelzoKartya({ cim, leiras, cimSzint, ertek, onValtozas, irany, szovegMezok, szovegNyitva, hiba, kotelezo, disabled, labels, className, }: JelzoKartyaProps): import("react").JSX.Element;
