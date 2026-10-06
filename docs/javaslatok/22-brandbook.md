# Javaslat 22 – beeco Brand Book (design system + márkakönyv egy felületen)

*Állapot: **javaslat** · készítette: Claude (Kristóf kérésére) · dátum: 2026-10-06*
*(Jóváhagyás után: **jóváhagyva** – lent a Döntés részben.)*

## 1. Igény
- **Hol kell:** egy önálló, jelszóval megosztható webes felület (Netlify), amit új önkéntes, partner és fejlesztő-tervező kap meg.
- **Mit old meg:** egy helyen látszik, hogyan néz ki és hogyan szól a beeco; mi közös és mi tér el a hat felületen (ADMIN, PARTNER, MOBIL APP, KAPTÁR, WEBOLDAL, JÁTÉKOK); ki mit hogyan használjon.
- **Mi van ma helyette:** a GitHub Pages hub (`index.html`), `termek/bemutato.html`, `web/arculat.html`, a szabálykönyvek (`docs/*.md`). Ezek fejlesztőknek szólnak. Márkaszöveg (küldetés, értékek, logóhasználat, partneri és önkéntes szabályok) nincs a repóban.

## 2. Mire épül (meglévő anyagok)
- **Tokenek:** `tokens/core.json`, `theme-termek.json`, `theme-jatek.json` (web/css/tokens.css), `hangnem.json`.
- **Elemek:** a termékbőr `bc-` CSS-elemei (`bc-shell`, `bc-card`, `bc-btn`, `bc-badge`, `bc-table`, `bc-field`…). Saját, csak itt használt elrendezés `bb-` előtaggal, kizárólag tokenekből (`brandbook/css/bb.css`). Nem DS-elem, nem kerül a `termek/css`-be.
- **Generált adatok:** `dist/tokens.json`, `dist/weboldal/webflow-valtozok.json`, `dist/dart/beeco_tokens.dart`, `docs/komponens-katalogus.md`, `CHANGELOG.md`.
- **Szint:** sablon (oldal). Új DS-komponenst nem vezet be.

## 3. Változatok
| | A – Ki vagy? utak | B – Témák szerint | **C – hibrid (választott)** |
|---|---|---|---|
| Nyitóoldal | 3 belépő út | számozott fejezetek | utak a nyitóoldalon + számozott menü minden oldalon |
| Előny | gyors indulás | teljes áttekintés | mindkettő |
| Hátrány | rejtett tartalom | új embernek sok | kicsit több navigáció |

Az összevetés a felhasználó választása szerint mátrix plusz élő minták.

## 4. Állapotok
- **Belépés:** alap · rossz jelszó (hibaüzenet + teendő) · beállítatlan jelszó (503, magyar üzenet).
- **Keresés:** üres · találat · nincs találat.
- **Témák:** világos · sötét · rendszer szerint.
- **Tartalomblokkok:** „Jóváhagyásra vár” (Claude-javaslat) · „Hiányzik” (nincs forrás) · jóváhagyott.

## 5. Szélső esetek
- Nincs JavaScript: minden tartalom olvasható, csak a keresés és a témaváltó nem működik.
- 320 px szélesség: a menü fiókká válik, a mátrix vízszintesen görgethető táblázat.
- Jelszócsere: minden régi belépés érvényét veszti.

## 6. Felépítés (fájlok)
- `brandbook/tartalom/*.json`: a fejezetek szövegei.
- `brandbook/feluletek/*.json`: a hat felület felmért profilja.
- `tools/brandbook-felmeres.js`: helyben frissíti a profilok mért értékeit.
- `tools/brandbook-build.js`: kimenet a `_brandbook/` mappa (nem commitoljuk, a Netlify építi).
- `netlify/edge-functions/kapu.js`: jelszókapu.
- `netlify.toml`: build és biztonsági fejlécek.
- `tests/check-brandbook.js`: ellenőrzés.

## 7. Hozzáférhetőség
- natív `<a>`/`<button>`, látható fókusz, 44 px;
- a menü billentyűzettel és Esc-kel működik;
- a keresés `aria-live` találatszámot ad;
- kontraszt AA világos és sötét módban;
- csökkentett mozgásnál nincs animáció.

## 8. Fontos korlát
**A repó nyilvános.** A jelszó csak a Netlify-oldalt védi, a forrás a GitHubon bárki számára olvasható. Ezért a brand bookba nem kerülhet:
- magánszemély elérhetősége;
- belső szerződéses vagy pénzügyi adat;
- jelszó vagy kulcs.

A jelszót és a titkot a Netlify felületén kell beállítani (`BRANDBOOK_JELSZO`, `BRANDBOOK_TITOK`), soha nem a repóban.

## 9. Döntés (Kristóf tölti ki)
- Dátum: …
- Választott változat: C (hibrid), mátrix + élő minták – a beszélgetésben 2026-10-06
- Megjegyzés / módosítás: …
