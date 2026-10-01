import { type ReactNode } from 'react';
export type DetailAction = {
    label: string;
    icon?: ReactNode;
    /** A művelet; megerősítésnél ígéretet adhat – közben a gomb pörög, hiba esetén az ablak nyitva marad */
    onSelect: () => void | Promise<void>;
    /** Ez marad látható (alap: az első nem veszélyes) – a többi a „⋯” menübe kerül */
    primary?: boolean;
    /** Veszélyes (törlés): a menü aljára kerül, elválasztva, pirossal */
    danger?: boolean;
    disabled?: boolean;
    disabledReason?: string;
    /** Visszafordíthatatlan műveletnél: előbb megerősítő ablak (a következménnyel) */
    confirm?: {
        title: string;
        body?: ReactNode;
        confirmLabel: string;
    };
};
/**
 * Az oldal műveletei a RowActions szabálya szerint, oldalfejbe méretezve:
 * a fő művelet felirattal látszik, a többi a „⋯” menüben, a veszélyes alul; megerősítés ConfirmDialoggal.
 */
export declare function DetailActions({ actions, subject }: {
    actions: DetailAction[];
    subject: string;
}): import("react").JSX.Element;
