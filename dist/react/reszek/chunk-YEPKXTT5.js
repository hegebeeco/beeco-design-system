/* beeco design system 1.48.2 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  DARK_QUERY,
  THEME_STORAGE_KEY,
  applyTheme,
  isThemeMode,
  readThemeMode,
  resolveTheme,
  systemPrefersDark,
  writeThemeMode
} from "./chunk-6RIUPS7Q.js";

// react/src/tema/ThemeProvider.tsx
import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { jsx } from "react/jsx-runtime";
var ThemeContext = createContext(null);
var subscribeSystem = (cb) => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return () => {
  };
  const mq = window.matchMedia(DARK_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
function ThemeProvider({ storageKey = THEME_STORAGE_KEY, defaultMode = "auto", children }) {
  const [mode, setModeState] = useState(() => readThemeMode(storageKey, defaultMode));
  const prefersDark = useSyncExternalStore(subscribeSystem, systemPrefersDark, () => false);
  const resolved = resolveTheme(mode, prefersDark);
  useEffect(() => {
    applyTheme(mode, resolved);
  }, [mode, resolved]);
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === storageKey && isThemeMode(e.newValue)) setModeState(e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey]);
  const setMode = useCallback((m) => {
    setModeState(m);
    writeThemeMode(m, storageKey);
  }, [storageKey]);
  const toggle = useCallback(() => setMode(resolved === "dark" ? "light" : "dark"), [resolved, setMode]);
  const value = useMemo(() => ({ mode, resolved, setMode, toggle }), [mode, resolved, setMode, toggle]);
  return /* @__PURE__ */ jsx(ThemeContext.Provider, { value, children });
}
function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme: a komponens nincs ThemeProvider alatt (tedd az app gy\xF6ker\xE9be).");
  return ctx;
}

export {
  ThemeProvider,
  useTheme
};
