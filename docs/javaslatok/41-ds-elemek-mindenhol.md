# Javaslat 41 – DS-elemek mindenhol: domb, címke, piktogram, polaroid, appképernyő

*Állapot: **részben jóváhagyva** (Kristóf kérése és döntései, 2026-11-21) · készítette: Claude.*

## 1. Igény (Kristóf, 2026-11-21)
„A DS-elemeket tedd be, ahol nem használjuk őket”: elválasztó, appképernyős animáció, a sárga ragasztócsíkos „valódi fénykép” galéria (többször használni), árnyék csak kattinthatón, elválasztó mindig a szekciók között, egységes piktogram (fehér flekken fekete), a szekció tetején mindig címke. Plusz: más gyors egységesítési ötlet.

## 2. Döntések (Kristóf, 2026-11-21)
| Kérdés | Döntés |
|---|---|
| Szekciócímke színe | **fekete mindenhol** (`ds-szalag`), sötét szekcióban sárga (`ds-szalag-vilagos`) |
| Kampányoldalak | **igazodnak** a formaszabályokhoz (árnyék, sarok, domb, piktogram, címke); a saját színük, betűjük, rajzaik maradnak |
| Régi pasztell hátterek | DS-színre: zöld → zöld (`bc-success-bg`), sárga → vaj, **kék → halványzöld**; szaggatott vonal helyett domb |
| Piktogram | fehér flekken fekete, minden oldalon (a „sárga foltos” szabály megszűnt) |

## 3. Elkészült (tesztoldal)
- Mérő: `ds-lint` R11 megfordítva (sárga folt = eltérés), új R12 (címke nélküli szekció), R4 felismeri a régi `dia_*` szekciókat, a domb színét és a kampányok saját dombját.
- Piktogram: 19 sárga foltos csere (Beecopédia, Hatásunk, Kapcsolat, /en); 4 új fehér változat (kés-villa, ház, katt, alma).
- Domb és címke: régi oldalakon `ds-domb-sor` + `DS · Domb`, címke a cím fölött; 17 oldal és 8 CMS-sablon (Sonnet-ágens), plusz a kampányoldalak. Mérés a 72 oldalon: 1040 → **386** eltérés; R4 (domb) 116 → 3, R12 (címke) 92 → 5, R11 (piktogram) 36 → 8 (a maradék a főoldalon).
- Kampányok: CsicsergŐsz és Madárkisokos kb. 60 `cs-` osztály v2 formára + `cs-ds-v2.css`; Vízadás `ov-ds-v2.css` (sarok, árnyék, domb a fűrészfog helyett); nyereményjáték kampányszínekkel és dombbal; EWWR fejkód.
- **Polaroid-csík** (a Vízadás-galéria sárga ragasztócsíkja) a DS-fotókon: fotósor, nyitófotó, „hogyan dolgozunk” képek, idővonal (`ds-foto` kombók `::before` eleme). Egy helyen állítható, minden oldalon megjelenik.

## 4. Javaslat – jóváhagyásra vár
**A) `DS · Appképernyő` (új komponens).** Telefonkeret (`ds-kep-telefon`) + 2–3 appképernyő lassú áttűnéssel (≤ 900 ms, csökkentett mozgásnál álló első kép), a főoldali `fs-app-kep` minta alapján. Helyek: Kuponok, Eseménynaptár, Térkép, Letöltés, Partner, Madárraj, Önkormányzatoknak. Kell hozzá: melyik oldalon melyik képernyők (valódi appképek).

**B) Gyors egységesítések (osztályszinten, sok oldalt egyszerre javítanak):**
1. **Címskála:** a régi címosztályok (`main_heading`, `headline1–3`, `H1`; 600+ elem) a `ds-cim1–3` méretére és sorközére. A legnagyobb látható nyereség, kockázata kicsi.
2. **Fotók a CMS-sablonokban** (recept, blog, ökoirányító, zöldség): a kép `ds-foto` keretet kap (fehér keret, felirat, csík), így a több száz CMS-oldal is a Partner/Csapat-oldal képi nyelvén szól.
3. **App letöltés blokk:** a 13 kézzel épített letöltés-szakasz cseréje `DS · App letöltés`-re (egységes QR + áruházgombok + appkép, mérési címkével).
4. **Morzsamenü:** 18 kézi morzsa → `DS · Morzsamenü`.
5. **Csúszkák pöttyei:** a natív Webflow-csúszkák elmosott árnyékú pöttyei → lapos fekete/fehér pötty.

**Javasolt sorrend:** B1 → B2 → A → B3 → B4 → B5.

## 5. Nyitva (Kristóf döntése kell)
- Lábnyomkalkulátor: egy „X” című, félkész szekció (a címke kimaradt) – törölni vagy kitölteni?
- Új címkék szövegei (kb. 90, pl. „Az első év”, „Ajánlás”, „Visszajelzés”): Levi átnézheti; lista: ágens-jelentés és a Webflow.

## 6. Döntés (Kristóf tölti ki)
- A) Appképernyő-komponens: igen / nem / módosítással
- B) sorrend: …
