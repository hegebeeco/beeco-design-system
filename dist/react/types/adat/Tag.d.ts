import type { ReactNode } from 'react';
export type TagProps = {
    children: ReactNode;
    icon?: ReactNode;
    title?: string;
    className?: string;
};
/**
 * Tag (atom, Javaslat 19): TULAJDONSÁG jelvénye (típus, kategória, címke, „Kiemelt”) – semleges, nem állapot.
 * Állapothoz (aktív, lejárt, hiba…) a StatusBadge való; így a szín mindig jelentést hordoz.
 */
export declare function Tag({ children, icon, title, className }: TagProps): import("react").JSX.Element;
