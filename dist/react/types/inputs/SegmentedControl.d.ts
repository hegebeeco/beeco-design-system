import { type ReactNode } from 'react';
export type SegmentedControlProps<T extends string> = {
    /** Mit vált (képernyőolvasónak), pl. „Nézet” */
    label: string;
    value: T;
    onChange: (value: T) => void;
    items: ReadonlyArray<{
        value: T;
        label: string;
        icon?: ReactNode;
        disabled?: boolean;
    }>;
    /** sok elemnél: több sorba tördelődik (teljes szélesség), nem rejtetten görget – Javaslat 16 */
    wrap?: boolean;
    className?: string;
};
/**
 * SegmentedControl (molekula, Javaslat 01 – 3A): nézetváltó gombsor, méz kijelölés.
 * Rádiócsoport-viselkedés: egy Tab-megálló, a nyilak a következő engedélyezett elemre lépnek ÉS váltanak (a tiltottat átugorják).
 * Nem adatbevitel (nézetet vált), ezért nincs súgó gombja. Mindig van kijelölt elem.
 */
export declare function SegmentedControl<T extends string>({ label, value, onChange, items, wrap, className }: SegmentedControlProps<T>): import("react").JSX.Element;
