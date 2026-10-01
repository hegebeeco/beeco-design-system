import type { ReactNode } from 'react';
import { type MenuEntry } from '../reteg/DropdownMenu';
export type ShellAccountProps = {
    /** A belépett felhasználó neve; ha null, még töltődik („Betöltés…”) */
    name: string | null;
    /** Második sor: szerep vagy e-mail (pl. „admin”) */
    detail?: ReactNode;
    /** Profilkép URL – ha nincs, monogram */
    avatarSrc?: string;
    /** A menü elemei, legalább a kijelentkezés: { label: 'Kijelentkezés', onSelect } */
    items: MenuEntry[];
};
/**
 * ShellAccount (molekula, Javaslat 08): a felhasználó az AppShell oldalsávjának alján – avatar, név, szerep, menü (kijelentkezés).
 * Becsukott sávban csak az avatar látszik; a gomb neve a képernyőolvasónak ilyenkor is a teljes név.
 */
export declare function ShellAccount({ name, detail, avatarSrc, items }: ShellAccountProps): import("react").JSX.Element;
