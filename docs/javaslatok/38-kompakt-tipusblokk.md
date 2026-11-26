# Javaslat 38 – Kompakt tartalomtípus-blokk (kép a sarokban, chipek a képen)

*Állapot: **jóváhagyásra vár** (Kristóf kérésére készült, 2026-11-17; stagingen: `/beecopedia`) · készítette: Claude.*

## 1. Igény (Kristóf)
- A beecopedia hubon a tartalomtípus-blokkok (hulladék-kisokos, szezonális étkezés, ökos tartalmak, példaképek, címkék, blog) legyenek **kompaktak**: a hulladék-blokknál már látszódjon az alatta lévő.
- A felsoroló chipek **a képen** legyenek, a piktogram a **kép bal felső sarkában**.
- A piktogram a sárga foltos változat legyen (a fekete-fehér szabály csak az EWWR-oldalra vonatkozik).

## 2. Mire épül
- Meglévő: `ds-szekcio`, `ds-burok`, `ds-hero-racs`, `ds-hero-szoveg`, `ds-foto`, `ds-foto-kep`, `ds-chip`, `ds-gomb`, `DS · Domb`, `DS · GYIK tovább`, `DS · Fotósor vezérlő`, `DOWNLOAD_BLOCK`.
- Szint: molekula (a meglévő elemekből).

## 3. Öt új segédosztály (mind kicsi, egy-két tulajdonságos)
| Osztály | Mit csinál |
|---|---|
| `ds-szekcio-tomor` | Kompakt szekció: fent 36 px, lent 76 px (telefonon 28 / 64 px; az alsó érték a dombnak hagy helyet) |
| `ds-foto-szeles` | A `ds-foto` kerete 16:9 arányú |
| `ds-foto-piko` | A képen belül, bal felső sarokban (10 px), 56 px-es piktogram |
| `ds-foto-chipek` | A képen belül, alul (12 px) egymás mellett tördelődő chipek helye |
| `ds-app-kep` | Kompakt, keret nélküli telefonkép (max. 440 px magas, telefonon 340 px) az app-CTA-ban |

## 4. Szélső esetek
- Hosszú chipsor: tördelődik (flex-wrap), a kép alján marad.
- Mobil: egy oszlop, a kép a szöveg előtt/után a DOM-sorrend szerint.
- A piktogram dekoratív (`alt=""`), a chipek linkek.

## 5. Döntés (Kristóf tölti ki)
- Dátum: · Jóváhagyva / módosítás:
