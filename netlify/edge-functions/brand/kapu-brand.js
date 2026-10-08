/* ============================================================
   beeco BRAND BOOK (új docs-oldal, _site/brand) – jelszókapu (Netlify Edge Function)

   A működés a régi kapuval AZONOS (netlify/edge-functions/kapu.js: HMAC-süti „bb_kapu”, BRANDBOOK_JELSZO / BRANDBOOK_TITOK,
   POST /belepes, /kilepes, jelszócserekor minden régi süti érvénytelen) – a függvényt onnan veszi át, csak a szabad
   útvonalak igazodnak az új kimenethez: a belépő oldal (belepes.html) és ami ahhoz kell (assets/docs.css, tema.js,
   belepes.js, a betűk, a logó és az ikon). A kimenet többi része (minden oldal, assets/kereses.json, repo/, sablonok/,
   illusztraciok/) a kapun át.

   MIÉRT KÜLÖN MAPPÁBAN (netlify/edge-functions/brand/): a Netlify a netlify/edge-functions/ minden <név>.js fájlját
   minden oldalon élesíti. Ha ez a fájl ott állna, a MOSTANI (aktív netlify.toml-os) brandbook-oldalon is futna – rossz
   szabad útvonalakkal. Ebben az almappában a Netlify alapból nem keresi (csak brand/brand.js vagy brand/index.js
   lenne függvény), az új oldal konfigja (netlify.docs-brand.toml) pedig EZT a mappát adja meg edge_functions-nak –
   így ott a régi kapu.js nem fut, itt csak ez.
   ============================================================ */
import kapu from '../kapu.js';

export default kapu;

// A belépő oldal és statikus eszközei – süti nélkül is elérhetők (tests/docs-check.js ellenőrzi, hogy léteznek a kimenetben).
// Literál: a Netlify a config-ot statikusan olvassa.
export const config = {
  path: '/*',
  excludedPath: ['/belepes.html', '/assets/docs.css', '/assets/tema.js', '/assets/belepes.js', '/assets/fonts/*',
    '/assets/brand/logo.webp', '/assets/brand/logo-sotet.webp', '/assets/brand/ikon-32.png', '/favicon.ico'],
};
