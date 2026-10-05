import type { ReactNode } from 'react';
export type StatDelta = {
    /** A változás (előjelesen): +12 vagy −3,5 */
    value: number;
    /** '%' vagy mértékegység („db”) – a % csak akkor, ha az előző érték nem 0 */
    unit?: string;
    decimals?: number;
    /** Mihez képest: „az előző 30 naphoz” */
    compare: string;
    /** Előző érték 0 volt → a % nem értelmezhető: „+37 (előtte 0)” */
    fromZero?: boolean;
};
export type StatTileProps = {
    label: string;
    /** Mit számol, honnan (ⓘ) – kötelező */
    help: ReactNode;
    /** Az érték; null = nincs adat („—”) */
    value: number | null;
    /** Szöveges érték (Javaslat 18), pl. „Frissítésre vár” – ha meg van adva, ezt mutatja a szám helyett (a value-t ilyenkor null-ra állítsd) */
    text?: string;
    unit?: string;
    decimals?: number;
    /** Időszak: „2026. 07–09.” */
    period?: string;
    /** Változás; 'new' = nincs előző időszak („új”) */
    delta?: StatDelta | 'new';
    /** Melyik irány a jó: up (több = jó), down (több = rossz, pl. hibajegy, CO₂), none (semleges) – Javaslat 02 3A */
    good?: 'up' | 'down' | 'none';
    /** Elemszám: hány érintettből számoltuk; 1–4 között az érték rejtve (adatvédelmi küszöb) */
    n?: number;
    nLabel?: string;
    /** A rejtés küszöbe (alap: 5 – ennél kevesebb érintett rejtve) */
    minN?: number;
    /** Becsült érték: „~” jel + „becslés” (a beeco adatszabálya) */
    estimate?: boolean;
    /** Forrás és lekérdezés ideje */
    source?: ReactNode;
    /** Irány-vonal (sparkline) – csak a szám mellett, soha egyedül */
    trend?: Array<number | null>;
    loading?: boolean;
    error?: string;
    onRetry?: () => void;
    className?: string;
};
/**
 * StatTile / KPI (molekula, Javaslat 02 – 3A): érték + egység, változás a jelentés szerint színezve (nyíl + előjel + szöveg, nem csak szín),
 * időszak, súgó ⓘ, elemszám, forrás, rejtett érték (1–4 érintett), „—” ha nincs adat, csontváz töltéskor.
 */
export declare function StatTile(p: StatTileProps): import("react").JSX.Element;
