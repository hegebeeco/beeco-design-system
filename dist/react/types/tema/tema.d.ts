export type ThemeMode = 'light' | 'dark' | 'auto';
export type ResolvedTheme = 'light' | 'dark';
export declare const THEME_STORAGE_KEY = "bc-theme";
export declare const DARK_QUERY = "(prefers-color-scheme: dark)";
export declare const isThemeMode: (v: unknown) => v is ThemeMode;
/** A mentett mód; privát módban / tiltott tárolónál az alapérték */
export declare function readThemeMode(storageKey?: string, fallback?: ThemeMode): ThemeMode;
export declare function writeThemeMode(mode: ThemeMode, storageKey?: string): void;
export declare const systemPrefersDark: () => boolean;
export declare const resolveTheme: (mode: ThemeMode, prefersDark: boolean) => ResolvedTheme;
/** A <html> elemre írja: data-theme (feloldott), .dark osztály (Tailwind), data-theme-mode (a választott mód) */
export declare function applyTheme(mode: ThemeMode, resolved: ResolvedTheme, root?: HTMLElement): void;
/**
 * Villanásmentes indítás: ezt a szöveget tedd a <head>-be egy <script>-be, a stíluslapok ELÉ.
 * Így a téma már az első kirajzolás előtt beáll (különben sötét módban egy pillanatra világos az oldal).
 *   <script>{themeInitScript('theme')}</script>  ·  Vite/HTML: másold be a kimenetét az index.html-be.
 */
export declare function themeInitScript(storageKey?: string, fallback?: ThemeMode): string;
