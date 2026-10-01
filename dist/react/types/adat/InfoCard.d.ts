import { type ReactNode } from 'react';
/** Egy sor: címke + érték. Üres érték (null, undefined, '') helyett halvány „nincs megadva” látszik – a hiány is információ. */
export type InfoRow = {
    label: string;
    value: ReactNode;
    wide?: boolean;
};
export type InfoCardProps = {
    /** A kártya címe (h3 – a DetailPage fülei alatt a 3. szint) */
    title?: string;
    rows: ReadonlyArray<InfoRow | [string, ReactNode]>;
    /** Az üres érték szövege */
    emptyText?: string;
    /** Kártya alja: pl. „Szerkesztés” link vagy megjegyzés */
    footer?: ReactNode;
    className?: string;
};
/**
 * InfoCard (molekula): címke–érték adatlap egy kártyán (dl/dt/dd). Részletoldalak „Áttekintés” fülére.
 * A hosszú szöveg tördelődik, a sortörés megmarad; telefonon a címke az érték fölött van.
 */
export declare function InfoCard({ title, rows, emptyText, footer, className }: InfoCardProps): import("react").JSX.Element;
/** InfoGrid: InfoCard-ok rácsa – a tartalom szélességéhez tördel (min. 320 px oszlop) */
export declare function InfoGrid({ children, className }: {
    children: ReactNode;
    className?: string;
}): import("react").JSX.Element;
