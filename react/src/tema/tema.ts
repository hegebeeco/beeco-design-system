/* ============================================================
   Téma (világos / sötét / rendszer szerint) – a logika, React nélkül
   A DS tokenjei a <html> data-theme="dark" VAGY .dark osztályára váltanak (dist/css/beeco-tokens.css),
   a Tailwind preset `dark:` változata ugyanezekre. Itt mindkettőt beállítjuk, mindig a FELOLDOTT értékkel
   (rendszer szerint módban is 'light' vagy 'dark'), így a Tailwind és a CSS-szerepek ugyanazt látják.
   ============================================================ */
export type ThemeMode = 'light' | 'dark' | 'auto';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'bc-theme';
export const DARK_QUERY = '(prefers-color-scheme: dark)';

export const isThemeMode = (v: unknown): v is ThemeMode => v === 'light' || v === 'dark' || v === 'auto';

/** A mentett mód; privát módban / tiltott tárolónál az alapérték */
export function readThemeMode(storageKey = THEME_STORAGE_KEY, fallback: ThemeMode = 'auto'): ThemeMode {
  try {
    const v = localStorage.getItem(storageKey);
    return isThemeMode(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

export function writeThemeMode(mode: ThemeMode, storageKey = THEME_STORAGE_KEY) {
  try { localStorage.setItem(storageKey, mode); } catch { /* privát mód: csak erre a látogatásra érvényes */ }
}

export const systemPrefersDark = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(DARK_QUERY).matches;

export const resolveTheme = (mode: ThemeMode, prefersDark: boolean): ResolvedTheme =>
  mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode;

/** A <html> elemre írja: data-theme (feloldott), .dark osztály (Tailwind), data-theme-mode (a választott mód) */
export function applyTheme(mode: ThemeMode, resolved: ResolvedTheme, root: HTMLElement = document.documentElement) {
  root.dataset.theme = resolved;
  root.dataset.themeMode = mode;
  root.classList.toggle('dark', resolved === 'dark');
}

/**
 * Villanásmentes indítás: ezt a szöveget tedd a <head>-be egy <script>-be, a stíluslapok ELÉ.
 * Így a téma már az első kirajzolás előtt beáll (különben sötét módban egy pillanatra világos az oldal).
 *   <script>{themeInitScript('theme')}</script>  ·  Vite/HTML: másold be a kimenetét az index.html-be.
 */
export function themeInitScript(storageKey = THEME_STORAGE_KEY, fallback: ThemeMode = 'auto') {
  const k = JSON.stringify(storageKey);
  const f = JSON.stringify(fallback);
  return `(function(){var m;try{m=localStorage.getItem(${k})}catch(e){}if(m!=='light'&&m!=='dark'&&m!=='auto')m=${f};`
    + `var d=m==='dark'||(m==='auto'&&!!window.matchMedia&&matchMedia(${JSON.stringify(DARK_QUERY)}).matches);`
    + `var r=document.documentElement;r.setAttribute('data-theme',d?'dark':'light');r.setAttribute('data-theme-mode',m);`
    + `if(d)r.classList.add('dark');else r.classList.remove('dark')})()`;
}
