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
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/hegebeeco/beeco-design-system@1.47/weboldal/csatlakozz/kk.css">
<!-- lábléckód -->
<script src="https://cdn.jsdelivr.net/gh/hegebeeco/beeco-design-system@1.47/weboldal/csatlakozz/kk.js" defer></script>
```

A verziósáv (`@1.46`) miatt a javító-kiadás kódcsere nélkül kijut az oldalra.

## Jelölés a Designerben (v2)

| Jelölő | Mi történik |
|---|---|
| szakasz-azonosítók (`udv`, `rolunk`, `mit-csinalunk`, `tortenetunk`, `sikereink`, `partnerek`, `igy-mukodik`, `rajok`, `jelentkezes`, `gyik`) | méhecskés oldalnavigáció a jobb szélen (szaggatott vonal, hatszögek, a méhecske az aktuális szakaszhoz repül); a címke `data-kk-nav`-val felülírható |
| `data-kk-galeria` (benne `ul > li > figure`) | képnézegető: előző/következő gomb, számláló, nyilak |
| `data-kk="feladatok"` (+ `data-kk-forras`) | kereső- és szűrősáv, „Legjobban itt kell a segítség” sor (max. 3), a feladatok a raj-lenyílókba kerülnek (a lenyíló fejléce = raj neve) |
| `data-kk-cms="feladat"` (+ `data-kk-raj/-hol/-hogyan/-cim/-ora/-varos/-szint/-leiras/-kiemelt`) | Webflow CMS-listaelem: ha van, ez az adat, a modul a lenyílókba mozgatja; gomb: `data-kk-valaszt` |
| `#jelentkezes form` | legördülők feltöltése (raj a lenyílókból), UTM és oldal rejtett mezőkbe, előtöltés feladatból és szerepkártyából |
| `data-kk-cta="<név>"` | kattintásmérés (`kapu_cta_click`) |

Űrlapmezők (a Kaptár `webflow-jelentkezes` functionje ezeket várja): `nev`, `email`, `raj`, `feladat`, `varos`, `heti_ido`,
`munkamod`, `tapasztalat`, `portfolio`, `telefon`, `forras`, `uzenet`, `adatkezeles` (kötelező), `nyilvanos_profil`, és a modul
rejtett mezői: `utm_source`, `utm_medium`, `utm_campaign`, `oldal`. Az űrlap neve: „Csatlakozz jelentkezés”.

## Az oldal felépítése (2026-10-06)

A hub (v2, 2026-10-06) a site meglévő blokkjaiból épül, tömörítve: kéthasábos hero (üdvözlés + fotóslider), „Írtak rólunk” logósáv, „Kik vagyunk” három kártyában + piktogramos alapértékek, „Mit csinálunk” képnézegető, rövid történet két fotóval, Elismerések, Partneri és szakértői háló, Hogyan (3 lépés + Téged várunk / Amit kínálunk), Rajok és feladatok egy felületen, „Egy méh nem csinál csodát” (Jelentkezem gombbal), bővített űrlap, GYIK. Korábbi elemek: hero a /csapatunk fotóslideréből (`CSAPAT_FOTOSLIDER` komponens) és a főoldal
számcímkéiből; „Erről szól a beeco” és „Alapértékeink” a /rolunk blokkjaiból (`ROLUNK_VIZIO`, `ROLUNK_ERTEKEK`
komponens, a /rolunk érintetlen); `APP_FEATURE_BLOKK`; a főoldal „Egy méh nem csinál csodát” blokkja (`Csapat`);
`Versenyek - szereplések`, `MÉDIA_BLOKK`, `Együttműködések`; a GYIK a főoldali harmonika osztályaival. A modul csak
ott rajzol, ahol élő adat kell.

## Mérés

GA4 (`gtag`, a site-on nincs GTM). A kattintásokat egy ablakszintű, capture fázisú figyelő méri, 600 ms-os
elemenkénti ismétlésszűréssel, mert a Trustindex a horgonykattintást megállítja és újrakattint. Az események listája:
`kapu-adat-szerzodes.md`. Ellenőrizve 2026-10-06 (staging, Playwright): mind a kilenc esemény egyszer fut le.

## Arculati szabályok

- Fekete tinta és keret, méz kiemelés, kemény árnyék csak kattinthatón (gomb, választógomb).
- 44 px-es érintési felület, látható fókusz (`--bc-focus`), csökkentett mozgásnál nincs számláló-animáció és átmenet.
- Mintaadat élesben tilos (a `review-szabalyok.json` P1-et ad, amíg `[data-kk-allapot="minta"]` van az oldalon).
