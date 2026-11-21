# Közös weboldal-viselkedés

## horgony.js – oldalon belüli horgonygombok (lap fejléc-kódjába, beágyazva)
Sima görgetés a célra **új böngésző-előzmény nélkül** (`history.replaceState`), a Webflow saját görgetése és a
site-szintű Trustindex újrakattintása kiiktatva; a fejlécben fut, így a késleltetett szkriptek előtt is él.
Békén hagyja: `[role="button"]` / `[role="tab"]` (az oldal JS-e kezeli; a Webflow dokumentum-szintű kezelőjéig viszont nem jut fel a kattintás, mert az pushState-tel előzményt írna), `.w-tab-link` (Webflow-fülek), `.cs-utvonal_pont`.
Miért: e nélkül minden horgonykattintás előzményt írt, és a Mac trackpad „Vissza” mozdulata a gombhoz dobta vissza a látogatót.
Használja: CsicsergŐsz (`kampany-csicsergosz/fej/horgony.js`, korábbi változat), Főoldal Szuperhős (draft).
Site-szintre csak tesztelt oldalanként vihető (a nem kezelt fül- és lenyíló-megoldásokat előbb ellenőrizni kell).

## click-tracking.js – kattintásmérés GA4-be (Webflow: `beecokapcsolatmeres` 1.1.0, site-szintű, lábléc)
A Webflow-ban regisztrált, tömörített szkript olvasható forrása (`esbuild --minify --target=es2017`, ≤ 2000 karakter).
Csak a site-kód többi része által nem mért kattintásokat küldi: `contact_click` (tel/mailto), `social_click`,
`outbound_click` (külső oldal), `menu_click` (belső link menüben/láblécben), `anchor_click` (oldalon belüli horgony).
A „beeco 3/5” (áruház) és „beeco 5/5” (belső link, letöltés) eseményeit nem ismétli; a `data-kk-cta` gombokat a `beecokkmeres` méri.
A site-szkriptek listájában a `beecohorgonyv31` **előtt** kell lennie (a horgonyszkript stopImmediatePropagation-t hív).
Ellenőrzés (2026-11-04, tesztoldal): sajtólink, menü, „Érdekel!”, évszám-horgony, Instagram, e-mail – mind egy eseményt küld, a belső CTA-t továbbra is csak az 5/5.
