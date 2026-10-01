import type { ReactNode } from 'react';
export type RowAction = {
    label: string;
    /** Ikon a soron belüli gombhoz (a menüben is megjelenik) */
    icon: ReactNode;
    onSelect: () => void;
    /** Veszélyes (törlés): mindig a menü aljára kerül, elválasztva, pirossal */
    danger?: boolean;
    disabled?: boolean;
    disabledReason?: string;
    /** Ez a fő művelet (3+ műveletnél ez marad látható). Alap: az első nem veszélyes. */
    primary?: boolean;
};
export type RowActionsProps = {
    actions: RowAction[];
    /** A sor neve – a „⋯” gomb így szól: „További műveletek: Méhes Kávézó” */
    rowLabel: string;
};
/**
 * RowActions (molekula, Javaslat 03 – 5A) – a sorvégi műveletek szabálya egy helyen:
 * ≤ 2 művelet → ikongombok (felirattal); 3+ → a fő művelet látszik, a többi a „⋯” menüben, a törlés alul, elválasztva.
 */
export declare function RowActions({ actions, rowLabel }: RowActionsProps): import("react").JSX.Element;
export declare function MoreIcon(): import("react").JSX.Element;
