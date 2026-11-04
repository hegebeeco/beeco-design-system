# Javaslat 30 – Szolgáltatásoldalak szemléltetése: történet, appképek, képcsúszka

*Állapot: **jóváhagyva** · készítette: Claude · dátum: 2026-11-04*

## 1. Igény
- Hol kell: a beeco.hu szolgáltatásoldalai (`/szolgaltatas/*`, első: beeco@work).
- Mit old meg: a céges látogató gyorsan látja, milyen gondot old meg a szolgáltatás, hogyan néz ki a gyakorlatban, és miért éri meg annak, aki kifizeti.
- Mit használnak ma helyette: szöveges kártyák (`ds-kartya`), egy-egy hero-fotó.

## 2. Mire épül
- DS-elemek: `ds-szekcio`, `ds-burok`, `ds-szekcio-fej`, `ds-szalag`, `ds-cim2/3`, `ds-lead`, `ds-szoveg`, `ds-ut-ar`, `ds-kartya`, `ds-harom`, `ds-negy`.
- Webflow natív elem: Slider (a képcsúszkához).
- Szint: organizmus (mindhárom).

## 3. Az elemek
| Elem | Felépítés | Osztályok |
|---|---|---|
| **Történet** (gond → amit a beeco ad → amit a fizető nyer) | szekciófej + 3 nem kattintható kártya | `ds-kartya` (puha árnyék), `ds-ut-ar` a kártyák felső címkéjéhez, `data-ds="tortenet"` |
| **Appképek** | szekciófej + 4 oszlop: valódi appképernyő, cím, egy mondat; telefonon 2 oszlop | `ds-appkep`, `ds-appkep-kep`, `ds-negy.ds-appsor`, `data-ds="appkepek"` |
| **Képcsúszka** | szekciófej + natív Webflow Slider, saját fotókkal | `ds-kepsor` (keret, 520 px / telefonon 300 px), `ds-kepsor-kep` (cover), `ds-kepsor-nyil`, `data-ds="kepsor"` |

Új dia az API-n keresztül nem tehető a Slider maszkjába: ideiglenes Sliderből költöztethető át (sliderenként egy dia, mert az utolsó dia nem hagyhatja el a maszkját), utána az ideiglenes Slider törlendő.

## 4. Állapotok és szabályok
- A fotók alt szövege a képen látható dolgot írja le; a képen nem azonosítható céget, eseményt nem nevezünk meg.
- Appképernyő csak valódi, mai funkcióról mehet ki; a még nem kész beeco@work-funkciókat (csapatverseny, riport) nem mutatjuk képernyőként.
- Stockkép csak ott, ahol saját fotó nincs; letöltés előtt képenként forrás és méret Kristófnak.
- Mozgás: a Slider a Webflow saját áttűnését használja, automatikus lapozás nincs.

## 5. Döntés
- 2026-11-04, Kristóf: jóváhagyva (chatben). Próbaoldal: `/szolgaltatas/beeco-at-work` (staging). A többi szolgáltatásoldal a próbaoldal átnézése után; a három blokk komponens (`DS · Történet`, `DS · Appképek`, `DS · Képcsúszka`) a kiterjesztéskor lesz.
