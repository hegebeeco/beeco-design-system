# Csatlakozz oldal: „Kaptár-kapu” (Webflow)

A beeco.hu Csatlakozz oldalának élő, interaktív blokkjai: önkéntes-toborzás konkrét feladatokra, rajpont és szintek,
helyi csapatok városonként. Az adat a Kaptárból (belső HR- és önkéntes-platform) jön; amíg nincs élő végpont, a
`kapu-minta.json` mintaadata látszik „Mintaadat” címkével, és **az oldal így nem élesíthető**.
A weboldal-réteg többi szabálya (`docs/weboldal.md`) érvényes rá; a színek a termékbőr tokenjei (`beeco DS` Webflow-gyűjtemény).

## Mi van a mappában

| Fájl | Mi | Hova kerül |
|---|---|---|
| `kk.js` | a hat blokk, az űrlap-előtöltés, a „Rajok részletesen” harmonika pótlása és a mérés | oldal lábléckód (jsDelivr) |
| `kk.css` | a blokkok stílusa, idővonal-pötty, horgony-eltolás | oldal fejkód (jsDelivr) |
| `kapu-minta.json` | mintaadat (`"minta": true`) | addig, amíg nincs élő végpont |
| `kapu-adat-szerzodes.md` | az élő végpont, a Kaptár-mezők és a szükséges Kaptár-változások | a Kaptár fejlesztőjének |
| `review-szabalyok.json` | az oldal ellenőrzésének szabályai (mintaadat = P1) | a `landing_review.mjs`-nek (minőségkapu skill) |

## Beillesztés

```html
<!-- fejkód -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/hegebeeco/beeco-design-system@1.46/weboldal/csatlakozz/kk.css">
<!-- lábléckód -->
<script src="https://cdn.jsdelivr.net/gh/hegebeeco/beeco-design-system@1.46/weboldal/csatlakozz/kk.js" defer></script>
```

A verziósáv (`@1.46`) miatt a javító-kiadás kódcsere nélkül kijut az oldalra.

## Jelölés a Designerben

| Jelölő | Mi jelenik meg |
|---|---|
| `data-kk="szamok"` (+ `data-kk-forras="<végpont>"`) | 4 szám, felpörögnek: aktív önkéntes, nyitott feladat, helyi csapat, havi rajpont |
| `data-kk="feladatok"` | nyitott feladatok kártyán, szűrő: raj, hol (online/helyben), hogyan (kézzel/vibe-code); „Ezt választom” |
| `data-kk="valaszto"` | 3 kérdés → ajánlott raj + 2 illő feladat |
| `data-kk="szintek"` | a Kaptár karrierszintjei + mire váltható a rajpont |
| `data-kk="ranglista"` | a hónap top 8 rajtagja (csak hozzájárulással) |
| `data-kk="csapatok"` | városok: aktív csapat („Csatlakozom”) vagy induló („Én indítom”) |
| `data-kk-cta="<név>"` | linkre téve: kattintásmérés (`kapu_cta_click`) |

Minden gyökérben legyen egy rövid betöltés-szöveg (JS nélkül az látszik). A blokkok helyet foglalnak, amíg betöltenek
(nincs elcsúszás). Minden választás a meglévő Webflow-űrlapra (`#onkentes`) visz, és kitölti a „Milyen területen
segítenéd a rajt?” mezőt; a fókusz a név mezőre ugrik.

**Harmonika:** a duplikált oldalra a Webflow „Nyitott méhsejtek” harmonikájának interakciója (IX2) nem jön át. Ha a
panelen nincs a Webflow kezdőállapota, a `kk.js` csukja és nyitja (`role=button`, `aria-expanded`, Enter/Szóköz).
Ahol az interakció működik, a modul nem nyúl hozzá.

## Mérés

GA4 (`gtag`, a site-on nincs GTM). A kattintásokat egy ablakszintű, capture fázisú figyelő méri, 600 ms-os
elemenkénti ismétlésszűréssel, mert a Trustindex a horgonykattintást megállítja és újrakattint. Az események listája:
`kapu-adat-szerzodes.md`. Ellenőrizve 2026-10-06 (staging, Playwright): mind a kilenc esemény egyszer fut le.

## Arculati szabályok

- Fekete tinta és keret, méz kiemelés, kemény árnyék csak kattinthatón (gomb, választógomb).
- 44 px-es érintési felület, látható fókusz (`--bc-focus`), csökkentett mozgásnál nincs számláló-animáció és átmenet.
- Mintaadat élesben tilos (a `review-szabalyok.json` P1-et ad, amíg `[data-kk-allapot="minta"]` van az oldalon).
