import type { ReactElement, ReactNode } from 'react';
export type MenuItem = {
    label: string;
    /** Kiválasztás (Enter, Szóköz, kattintás). Ablakot nyitó elemnél a felirat végén „…”: „Törlés…” */
    onSelect?: () => void;
    icon?: ReactNode;
    /** Veszélyes elem: piros, és a menü aljára, elválasztva kerül (RowActions ezt magától rendezi) */
    danger?: boolean;
    disabled?: boolean;
    /** Miért tiltott (pl. „Ehhez admin jogosultság kell”) – a felirat alatt látszik */
    disabledReason?: string;
    /** Billentyűparancs felirata, pl. „Ctrl+D” (csak kiírás) */
    shortcut?: string;
    /** Almenü */
    items?: MenuEntry[];
};
export type MenuEntry = MenuItem | 'separator' | {
    group: string;
};
export type DropdownMenuProps = {
    /** A nyitó gomb (Button vagy IconButton) – a Radix erre teszi az aria-expanded-et */
    trigger: ReactElement;
    items: MenuEntry[];
    /** A menü neve a képernyőolvasónak, ha a nyitó gomb nem mondja el (pl. „Műveletek: Méhes Kávézó”) */
    label?: string;
    align?: 'start' | 'end';
    /** Fejléc a menü tetején (pl. profil-menüben név + szerep) */
    header?: ReactNode;
};
/**
 * DropdownMenu (molekula, Javaslat 03 – 5A): profil-menü és sor-műveletek.
 * Radix: nyilak, Home/End, kezdőbetűs ugrás, Esc (fókusz vissza a gombra), almenü → nyíllal, a képernyő alján felfelé nyílik.
 */
export declare function DropdownMenu({ trigger, items, label, align, header }: DropdownMenuProps): import("react").JSX.Element;
