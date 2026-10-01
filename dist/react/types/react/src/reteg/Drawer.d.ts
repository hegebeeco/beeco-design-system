import { type ReactNode } from 'react';
export type DrawerProps = {
    /** Vezérelt: a nyitott állapot jöhet az URL-ből is (useQueryParam('reszlet')) – így a Vissza gomb bezárja */
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: ReactNode;
    description?: ReactNode;
    /** md 480 px (alap) · wide 640 px; 600 px alatt teljes képernyős lap */
    size?: 'md' | 'wide';
    /** Alsó gombsor, pl. „Teljes oldal” link + Mentés */
    footer?: ReactNode;
    busy?: boolean;
    /** El nem mentett változás: bezárás (Esc, ✕, kívül kattintás, Mégse) előtt megkérdezi */
    dirty?: boolean;
    initialFocus?: () => HTMLElement | null;
    closeLabel?: string;
    className?: string;
    children?: ReactNode;
};
/**
 * Drawer / oldalpanel (organizmus, Javaslat 03 – 3A): egy elem részletei és rövid szerkesztése a lista mellett.
 * Jobbról csúszik be (400 ms ease-drawer, csökkentett mozgásnál azonnal), a lista a helyén marad.
 * Hosszú űrlap → külön oldal (a panel alján „Teljes oldal”). Radix Dialog: fókuszcsapda, Esc, portál, görgetés-zár.
 */
export declare function Drawer({ open, onOpenChange, title, description, size, footer, busy, dirty, initialFocus, closeLabel, className, children }: DrawerProps): import("react").JSX.Element;
