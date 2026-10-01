import type { ReactNode } from 'react';
export type EmptyStateProps = {
    /** Egy rövid mondat: mi a helyzet („Nincs találat”) */
    title: string;
    /** Egy mondat magyarázat: miért üres, mi a következő lépés */
    children?: ReactNode;
    /** Egy teendő (pl. „Szűrők törlése” gomb) – üres állapot teendő nélkül nem jó (docs/komponensek.md 3.4) */
    action?: ReactNode;
    /** Kép helye (pl. méhecske) – a képet a projekt adja; a DS-csomag most nem tesz bele képet */
    illustration?: ReactNode;
    /** Kisebb változat (táblázatsorban, grafikon helyén) */
    compact?: boolean;
    className?: string;
};
/** EmptyState (molekula): kép-hely + egy mondat + magyarázat + egy teendő. A `bc-empty` elemre épül. */
export declare function EmptyState({ title, children, action, illustration, compact, className }: EmptyStateProps): import("react").JSX.Element;
