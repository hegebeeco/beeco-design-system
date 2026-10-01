import { type ReactNode } from 'react';
import { type ResolvedTheme, type ThemeMode } from './tema';
export type ThemeContextValue = {
    /** A választott mód: világos, sötét vagy rendszer szerint */
    mode: ThemeMode;
    /** Ami most ténylegesen látszik (rendszer szerint módban a gép beállítása) */
    resolved: ResolvedTheme;
    setMode: (mode: ThemeMode) => void;
    /** Világos ↔ sötét (rendszer szerint módból a láthatóval ellentétesre vált) */
    toggle: () => void;
};
export type ThemeProviderProps = {
    /** A mentés kulcsa a böngészőben (egy gépen több app: külön kulcs). Alap: 'bc-theme' */
    storageKey?: string;
    /** Ha még nincs mentett választás. Alap: 'auto' (rendszer szerint) */
    defaultMode?: ThemeMode;
    children: ReactNode;
};
/**
 * ThemeProvider (sablon-szint, Javaslat 09): a téma egy helyen él; a <html> data-theme / .dark jelzőit írja,
 * a választást az eszköz megjegyzi, és más fülön történt váltást is követ. A villanásmentes induláshoz: themeInitScript().
 */
export declare function ThemeProvider({ storageKey, defaultMode, children }: ThemeProviderProps): import("react").JSX.Element;
/** A téma olvasása és váltása – csak ThemeProvider alatt */
export declare function useTheme(): ThemeContextValue;
