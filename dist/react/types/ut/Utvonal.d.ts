import { type ReactNode } from 'react';
import { type RenderLink } from '../reteg/NavTabs';
export type UtvonalAllapot = 'kesz' | 'most' | 'jon' | 'kihagyva';
export type UtvonalSzakasz = {
    /** Egyedi kulcs (React key) */
    kulcs: string;
    /** A szakasz neve, pl. „Rajba sorolás” */
    cim: string;
    allapot: UtvonalAllapot;
    /** Mikor lett kész – ISO dátum („2026-10-01” vagy teljes ISO időpont); a teljes nézet „Kész · 2026. 10. 01.”-ként írja ki */
    datum?: string;
    /** Egy mondat a szakaszról (a teljes nézetben minden szakasznál, a tömörben a mostaninál) */
    leiras?: ReactNode;
};
/** Az EGYETLEN következő lépés: egy mondat + egy fő gomb (href → link, onClick → gomb) */
export type UtvonalLepes = {
    szoveg: ReactNode;
    /** A gomb felirata, pl. „Válassz feladatot” */
    cta: string;
    href?: string;
    onClick?: () => void;
};
export type UtvonalSegito = {
    nev: string;
    szerep: string;
    href?: string;
};
export type UtvonalHatarido = {
    /** Hátralévő órák; negatív = ennyi órája lejárt */
    ora: number;
    /** Mire vonatkozik, pl. „Rajba sorolás” → „Rajba sorolás: még 30 óra” */
    cimke?: string;
    /** Felülírja a késés jelzését (alap: ora < 0) */
    kesik?: boolean;
};
export type UtvonalLabels = {
    /** Képernyőolvasó-szöveg a tömör térképen (a szín mellett) */
    allapot: Record<UtvonalAllapot, string>;
    /** Látható jelvény a teljes nézetben */
    jelveny: Record<UtvonalAllapot, string>;
    mostItt: (sorszam: number, osszes: number) => string;
    gorgetheto: string;
    keszCim: string;
    keszSzoveg: string;
    uresCim: string;
    uresSzoveg: string;
    nincsSegito: string;
    kesesSegitovel: string;
    kesesSegitoNelkul: string;
    ido: (ora: number) => string;
};
/** Hátralévő idő magyarul: „még 30 óra”, „még 3 nap”, „5 órája lejárt”, „2 napja lejárt” */
export declare function hataridoSzoveg(ora: number): string;
export declare const UTVONAL_LABELS_HU: UtvonalLabels;
export type UtvonalProps = {
    szakaszok: readonly UtvonalSzakasz[];
    /** A szakaszlista neve képernyőolvasónak, pl. „Az út szakaszai” */
    cimke: string;
    /** Egy következő lépés, egy fő gombbal (a komponensben ez az egyetlen fő gomb) */
    kovetkezo?: UtvonalLepes;
    /** Ki segít; `null` = még nincs (kíméletes szöveg), elhagyva = nem jelenik meg */
    segito?: UtvonalSegito | null;
    hatarido?: UtvonalHatarido;
    /** Tömör: vízszintes térkép (irányítópultra); alap: függőleges idővonal (teljes oldalra) */
    tomor?: boolean;
    /** A szakaszcímek (és a tömör nézet mostani címe) címszintje – alap 3 */
    cimSzint?: 2 | 3 | 4;
    /** Router-link (React Router, Next) a gombhoz és a segítő nevéhez; alap <a> */
    renderLink?: RenderLink;
    /** Saját feliratok (pl. angol partner-app) – alap: magyar */
    labels?: Partial<UtvonalLabels>;
    /** A mostani szakasz kiegészítése (pl. Progress, előkészület-jelvények) – a következő lépés fölött */
    children?: ReactNode;
    className?: string;
};
/**
 * Utvonal (organizmus, jóváhagyva 2026-10-07 – a Kaptár „Az utad” jelöltje): egy út szakaszai + EGY következő lépés,
 * a segítővel és a határidővel. Két nézet: `tomor` – vízszintes térkép a saját dobozában görgetve, a mostani szakasz középen
 * (irányítópult); alap – függőleges idővonal (mögötted dátummal, most, ami jön). Az állapotot szöveg is mondja, nem csak szín;
 * a lista <ol>, a mostani szakasz aria-current="step". Üres, végigért, késő határidő és hiányzó segítő állapota beépített.
 */
export declare function Utvonal({ szakaszok, cimke, kovetkezo, segito, hatarido, tomor, cimSzint, renderLink, labels, children, className }: UtvonalProps): import("react").JSX.Element;
