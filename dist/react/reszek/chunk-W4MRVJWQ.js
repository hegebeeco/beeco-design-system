/* beeco design system 1.47.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/tema/tema.ts
var THEME_STORAGE_KEY = "bc-theme";
var DARK_QUERY = "(prefers-color-scheme: dark)";
var isThemeMode = (v) => v === "light" || v === "dark" || v === "auto";
function readThemeMode(storageKey = THEME_STORAGE_KEY, fallback = "auto") {
  try {
    const v = localStorage.getItem(storageKey);
    return isThemeMode(v) ? v : fallback;
  } catch {
    return fallback;
  }
}
function writeThemeMode(mode, storageKey = THEME_STORAGE_KEY) {
  try {
    localStorage.setItem(storageKey, mode);
  } catch {
  }
}
var systemPrefersDark = () => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia(DARK_QUERY).matches;
var resolveTheme = (mode, prefersDark) => mode === "auto" ? prefersDark ? "dark" : "light" : mode;
function applyTheme(mode, resolved, root = document.documentElement) {
  root.dataset.theme = resolved;
  root.dataset.themeMode = mode;
  root.classList.toggle("dark", resolved === "dark");
}
function themeInitScript(storageKey = THEME_STORAGE_KEY, fallback = "auto") {
  const k = JSON.stringify(storageKey);
  const f = JSON.stringify(fallback);
  return `(function(){var m;try{m=localStorage.getItem(${k})}catch(e){}if(m!=='light'&&m!=='dark'&&m!=='auto')m=${f};var d=m==='dark'||(m==='auto'&&!!window.matchMedia&&matchMedia(${JSON.stringify(DARK_QUERY)}).matches);var r=document.documentElement;r.setAttribute('data-theme',d?'dark':'light');r.setAttribute('data-theme-mode',m);if(d)r.classList.add('dark');else r.classList.remove('dark')})()`;
}

export {
  THEME_STORAGE_KEY,
  DARK_QUERY,
  isThemeMode,
  readThemeMode,
  writeThemeMode,
  systemPrefersDark,
  resolveTheme,
  applyTheme,
  themeInitScript
};
