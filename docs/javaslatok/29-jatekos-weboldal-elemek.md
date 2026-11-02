# Javaslat 29 – Játékos Web DS-elemek: domb, polaroid, piktogramkör, tájképes hero, lebegő méh, idővonal-út

*Állapot: **jóváhagyva (elvben)**, Kristóf, 2026-11-03 („Igen, natívan”) – a részletek a 8. pontban · készítette: Claude · dátum: 2026-11-03*

## 1. Igény

- **Hol kell:** beeco.hu, Web DS-oldalak (`ds-`): /en (Web Summit), és az újraépítendő Térkép, Kuponok, Eseménynaptár, GYIK, Letöltés.
- **Mit old meg (egy mondat):** a Web DS-oldalak ugyanazt a játékos, „színes és szagos” arcot kapják, mint a főoldal (`fs-`) és a CsicsergŐsz, a Designerben újrahasználható, natív elemekből.
- **Mit használnak ma helyette:** az /en oldal egy oldalszintű CSS-réteget (`weboldal/en/en-szines.css`, 2026-11-03), amely a `ds-` osztályokat felülírja, és a rajzokat háttérképként teszi be. Gyors volt, de a Designerben nem látszik, nem cserélhető, és minden új oldalon párhuzamos megoldás lenne.

## 2. Mire épül (meglévő anyagok)

- **Web DS** ([`docs/web-ds.md`](../web-ds.md)): `ds-szekcio` + `ds-hatter-*`, `ds-szalag` (+ `ds-szalag-vilagos`), `ds-kartya`, `ds-foto`, `ds-szamsav`/`ds-szam`, `ds-ido-lista`, `ds-gomb`. A 7. pont egységes alapelemei (szalagcím, címskála, kártya) érvényben maradnak.
- **Landing (`fs-`):** a mérce: domb (`::after`, a következő szekció színe, felfelé eső lágy árnyék), polaroid fotó ragasztószalaggal (`fs-foto`), piktogram világos körben (`fo-ereje-piko`), Zöld 2050 táj (`fs-hero-taj`), szaggatott út (`fs-u-ut`).
- **Rajzok:** a grafikai katalógus (Javaslat 28) azonosítói: `fs-zold-2050-v2.svg`, `bee-superhero-group` (`fs-meh-raj.png`), Beela, `fs-piko-*` (26 piktogram). Csak mosolygós méh.
- **Szint:** molekula (polaroid, piktogramkör, lebegő méh), organizmus-kiegészítő (domb, tájképes hero, idővonal-út).

## 3. Változatok

| | A: natív osztály + közös CSS a pszeudoelemekre | B: oldalszintű CSS-réteg (mint ma az /en) | C: mindent Webflow-interakcióval |
|---|---|---|---|
| Előny | A Designerben látszik és cserélhető (kép, szín, sorrend); egy helyen javítható | Leggyorsabb | Teljesen natív |
| Hátrány | A `::before`/`::after` és a `@keyframes` csak közös CSS-ben megy (a Web DS 1. elve ezt engedi) | Nem újrahasználható, oldalanként másolódik, felülírja a `ds-` alapot | A domb és a ragasztószalag pszeudoelem, IX-szel nem megy; a lebegés IX-ben nehezen karbantartható |

**Javaslat: A**, mert a Web DS 1. elve (natív, újrahasználható) így teljesül, és csak az kerül közös CSS-be, amit a Webflow-stílus nem tud.

## 4. Az elemek

| Elem | Webflow (natív) | Közös CSS (`weboldal/kozos/web-ds-jatekos.css`, a site fejkódja tölti be) |
|---|---|---|
| **Domb** | combó a szekción: `ds-domb-krem`, `ds-domb-zold` (`bc-surface-2`), `ds-domb-mez` (`bc-success-bg`), `ds-domb-sotet` (`bc-surface-deep`), `ds-domb-feher`, `ds-domb-vaj` – a combó neve a **következő** szekció színe | `::after`: 56 px (mobilon 36 px) ellipszis, a combó színe, felfelé eső lágy árnyék (`0 -6px 14px -4px`, 16 % / sötéten 30 %), `overflow-x: clip` a szekción |
| **Polaroid** | combó a fotón: `ds-foto.ds-polaroid` (fehér keret, 2 px tinta, 6 px kemény árnyék, 2,5° dőlés; mobilon 1,5°) | `::before`: sárga ragasztószalag |
| **Piktogramkör** | `ds-piko-kor` (Image): 64 px, 2 px tinta keret, kör, `bc-accent` háttér; `ds-piko-kor-vilagos` sötét alapon (`bc-on-deep`) | – |
| **Tájképes hero** | `ds-hero-taj` combó a szekción + `ds-taj-kep` (Image, a Zöld 2050 táj, alul, teljes szélességben, `alt=""`); a szöveg `ds-hero-kartya` krém kártyán | – |
| **Lebegő méh** | `ds-meh` (Image, `alt=""`, abszolút helyzet) + helyzet-combók: `ds-meh-jobb-lent`, `ds-meh-kozep-fent` | `@keyframes` lebegés 3,2 s, csökkentett mozgásnál áll |
| **Idővonal-út** | combó: `ds-ido-lista.ds-ido-ut`; az évszám `ds-ido-ho.ds-ido-pirula` (tinta pirula, sárga szám; az első sárga) | `::before`: szaggatott függőleges út (mobilon nincs) |
| **Szaggatott lépéssor** | combó: `ds-harom.ds-lepes-ut` | `::before`: vízszintes szaggatott vonal a kártyák mögött (tablet alatt nincs) |

Minden szín, sarok és árnyék változóból (`--_beeco-ds---bc-*`). Új változó nem kell.

## 5. Szélső esetek

- Két egymást követő szekció azonos színű: nincs domb-combó (a domb nem látszana).
- Utolsó szekció a lábléc előtt: `ds-domb-sotet` (a lábléc `bc-lablec-zold`).
- 320 px: a méh és a polaroid nem lóghat ki (`overflow-x: clip`), a dőlés kisebb.
- Kép nélkül (betöltési hiba): a polaroid és a piktogramkör kerete megmarad, a szöveg olvasható.
- Csökkentett mozgás: a méh áll, a hover-emelés nincs.

## 6. API (Webflow-osztályok)

```html
<section class="ds-szekcio ds-hatter-vaj ds-hero-taj ds-domb-zold">
  <img class="ds-taj-kep" src="fs-zold-2050-v2.svg" alt="">
  <div class="ds-burok ds-hero-racs">
    <div class="ds-hero-szoveg ds-hero-kartya">…</div>
    <figure class="ds-foto ds-hero-foto ds-polaroid"><img class="ds-foto-kep" alt="…"><figcaption class="ds-foto-felirat">…</figcaption>
      <img class="ds-meh ds-meh-jobb-lent" src="fs-meh-raj.png" alt=""></figure>
  </div>
</section>
```

## 7. Hozzáférhetőség

A díszrajzok `alt=""`, a piktogramkör a kártyacím mellett díszítés. Kontraszt: sötét alapon `bc-bg` és `bc-on-deep` (≥ 8:1). A kattintható elemek a meglévő `ds-gomb`/`ds-ut`, 44 px. A mozgás csökkentett beállításnál áll.

## 8. Döntés (Kristóf tölti ki)

- Dátum: 2026-11-03
- Választott változat: **A** (natív), elvben jóváhagyva a chatben („Igen, natívan”), az élesítés utáni körre.
- Megjegyzés / módosítás: az /en oldal a natív elemekre áll át, a `weboldal/en/en-szines.css` réteg kivezetése után. A Térkép, Kuponok, Eseménynaptár, GYIK, Letöltés ezekből épül.
