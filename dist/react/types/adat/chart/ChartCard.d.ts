import { type ReactNode } from 'react';
import { type ChartData } from './types';
export type ChartCardProps = {
    /** Mit mutat, egyszerű nyelven: „Beváltott kuponok hetente” */
    title: string;
    /** Mértékegység az alcímben: „db / hét” */
    unit: string;
    /** Időszak az alcímben: „2026. 07. 06. – 09. 27.” */
    period: string;
    /** Súgó (ⓘ): honnan jön az adat, hogyan számoljuk */
    help: ReactNode;
    /** „Hogyan olvasd?” – 2–4 mondat: mit jelent a magas/alacsony, mire figyelj, mi NEM következik belőle */
    howToRead: ReactNode;
    /** Forrás és lekérdezés ideje – a láblécben */
    source: ReactNode;
    /** Ugyanaz az adat, amit a grafikon kap – ebből készül a jelmagyarázat és az adattábla */
    data: ChartData;
    /** A grafikon (BarChart, LineChart, GroupedBarChart, StackedBarChart) */
    children: ReactNode;
    status?: 'ready' | 'loading' | 'error';
    error?: string;
    onRetry?: () => void;
    /** Üres állapot teendője, pl. „Válassz hosszabb időszakot” gomb */
    emptyAction?: ReactNode;
    /** Színtévesztő-barát adatszínek erre a kártyára (a data-cb / .ds-cb az oldalon is bekapcsolja) */
    cb?: boolean;
    /** Mintaadat-jelölés (bemutató, tesztlap) */
    sample?: boolean;
    /** Ha megadod, az eszköz megjegyzi, hogy a „Hogyan olvasd?”-t becsuktad (első látogatáskor nyitva) */
    rememberKey?: string;
    headingLevel?: 2 | 3 | 4;
    className?: string;
};
/**
 * ChartCard (organizmus, 3/B): cím · alcím (egység, időszak) · súgó ⓘ · jelmagyarázat felül · grafikon · „Hogyan olvasd?” (lenyitható, 4b A) ·
 * adattábla (lenyitható, mindig elérhető) · forrás · töltés / üres / hiba. A kötelező részek nélkül nem fordul (TypeScript).
 */
export declare function ChartCard(p: ChartCardProps): import("react").JSX.Element;
