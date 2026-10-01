import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react';
import {
  applyTheme, DARK_QUERY, isThemeMode, readThemeMode, resolveTheme, systemPrefersDark, THEME_STORAGE_KEY, writeThemeMode,
  type ResolvedTheme, type ThemeMode,
} from './tema';

export type ThemeContextValue = {
  /** A választott mód: világos, sötét vagy rendszer szerint */
  mode: ThemeMode;
  /** Ami most ténylegesen látszik (rendszer szerint módban a gép beállítása) */
  resolved: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  /** Világos ↔ sötét (rendszer szerint módból a láthatóval ellentétesre vált) */
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

// A rendszer beállításának figyelése (a gép éjszakai módra vált → rendszer szerint módban azonnal követjük)
const subscribeSystem = (cb: () => void) => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {};
  const mq = window.matchMedia(DARK_QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
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
export function ThemeProvider({ storageKey = THEME_STORAGE_KEY, defaultMode = 'auto', children }: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(() => readThemeMode(storageKey, defaultMode));
  const prefersDark = useSyncExternalStore(subscribeSystem, systemPrefersDark, () => false);
  const resolved = resolveTheme(mode, prefersDark);

  useEffect(() => { applyTheme(mode, resolved); }, [mode, resolved]);

  // Másik fülön váltott a felhasználó → itt is
  useEffect(() => {
    const onStorage = (e: StorageEvent) => { if (e.key === storageKey && isThemeMode(e.newValue)) setModeState(e.newValue); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [storageKey]);

  const setMode = useCallback((m: ThemeMode) => { setModeState(m); writeThemeMode(m, storageKey); }, [storageKey]);
  const toggle = useCallback(() => setMode(resolved === 'dark' ? 'light' : 'dark'), [resolved, setMode]);
  const value = useMemo(() => ({ mode, resolved, setMode, toggle }), [mode, resolved, setMode, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** A téma olvasása és váltása – csak ThemeProvider alatt */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme: a komponens nincs ThemeProvider alatt (tedd az app gyökerébe).');
  return ctx;
}
