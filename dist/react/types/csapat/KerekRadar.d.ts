import { type ReactNode } from 'react';
/** Egy tengely (terület) – a kerék egy küllője */
export type KerekTengely = {
    /** Egyedi kulcs; a sorozatok `ertekek`-je erre hivatkozik, az `onValaszt` ezt adja vissza */
    kulcs: string;
    /** Teljes név – a listában és a táblázatban egészben, a rajzon tördelve (legfeljebb 3 sor, utána „…”) */
    nev: string;
};
/** Egy adatsor: tengely-kulcs → érték (0–max); null vagy hiányzó kulcs = nincs adat (NEM nulla – a rajzon kimarad) */
export type KerekSorozat = {
    kulcs: string;
    /** A sorozat neve a jelmagyarázatban és a táblázat fejlécében, pl. „2026. október” */
    nev: string;
    ertekek: Readonly<Record<string, number | null | undefined>>;
};
/** Opcionális jelzés egy értékhez (pl. lámpa-szín) – a táblázat „Jelzés” oszlopa; mindig szöveggel, nem csak színnel */
export type KerekJelzes = {
    tone: 'success' | 'warning' | 'danger' | 'info';
    szoveg: string;
} | null;
export type KerekNezet = 'kerek' | 'tablazat';
export type KerekRadarLabels = {
    nezet: string;
    kerek: string;
    tablazat: string;
    jelmagyarazat: string;
    /** A rajz alatti skála-magyarázat */
    skala: (max: number) => string;
    /** A tengely-lista neve (képernyőolvasónak) */
    lista: string;
    terulet: string;
    valtozas: string;
    jelzes: string;
    nincsAdat: string;
    /** Változás, ha az előző sorozatban nincs adat */
    uj: string;
    /** A tengelycímke-gomb neve: „Csapatmunka: 7,5, előző 6, változás +1,5” */
    tengelyNev: (nev: string, ertek: string, elozo?: string, valtozas?: string) => string;
    tablaFelirat: (cim: string, max: number) => string;
    keves: string;
    sok: string;
    uresCim: string;
    uresSzoveg: string;
    betoltes: string;
};
export declare const KEREK_RADAR_LABELS_HU: KerekRadarLabels;
export type KerekRadarProps = {
    /** A tengelyek (területek) sorrendben, felülről az óramutató járásával – 3–12 ajánlott */
    tengelyek: readonly KerekTengely[];
    /** 1–2 sorozat: az első a mostani (kitöltött sokszög), a második az összevetés (szaggatott vonal), pl. előző hónap */
    sorozatok: readonly KerekSorozat[];
    /** A grafikon neve (képernyőolvasónak, a táblázat felirata), pl. „Csapat-kerék, 2026. október” */
    cim: string;
    /** A kijelölt tengely kulcsa (vezérelt) */
    kijelolt?: string | null;
    /** Tengely választása (kattintás a címkére / a listára, Enter, Szóköz) – nélküle a kerék csak megjelenít */
    onValaszt?: (kulcs: string) => void;
    /** A skála felső határa – alap 10 */
    max?: number;
    /** Tizedesjegyek a feliratokban – alap 1 */
    tizedes?: number;
    /** Jelzés-oszlop a táblázatban (pl. érték → zöld/sárga/piros) */
    jelzes?: (ertek: number | null) => KerekJelzes;
    /** Kezdő nézet (nem vezérelt) vagy vezérelt nézet az `onNezet`-tel */
    nezet?: KerekNezet;
    onNezet?: (n: KerekNezet) => void;
    /** A rajz melletti tengely-lista (érték, változás) – alap: igen */
    lista?: boolean;
    /** Betöltés */
    tolt?: boolean;
    /** Az üres állapot teendője (pl. „Kitöltöm” gomb) */
    uresTeendo?: ReactNode;
    labels?: Partial<KerekRadarLabels>;
    className?: string;
};
/**
 * KerekRadar (organizmus, jóváhagyva 2026-10-07 – a Kaptár „Beeco-kerék” jelöltje): interaktív radar 3–12 tengellyel,
 * 1–2 egymásra vetített sorozattal (most vs. előző), 0–max skálán. A rajz valódi pixelben készül (a felirat sosem torzul),
 * a tengelycímkék gombok (egy Tab-megálló, nyilakkal léptethető, Enter/Szóköz választ), a kijelölt tengely kiemelve.
 * A szín sosem egyedül hordoz jelentést: a két sorozat alakja is más (kitöltött ● / szaggatott ■), és ugyanaz az adat
 * listában és táblázatban is ott van (3/B). Hiányzó érték = „nincs adat”, nem nulla. Üres és töltés állapot beépített.
 */
export declare function KerekRadar({ tengelyek, sorozatok, cim, kijelolt, onValaszt, max, tizedes, jelzes, nezet, onNezet, lista, tolt, uresTeendo, labels, className, }: KerekRadarProps): import("react").JSX.Element;
