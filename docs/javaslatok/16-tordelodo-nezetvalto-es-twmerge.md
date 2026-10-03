# Javaslat 16 – tördelődő nézetváltó (`bc-seg is-wrap`) és tailwind-merge kiegészítés

*Állapot: **jóváhagyva** · készítette: Claude (PARTNERAPP) · dátum: 2026-10-03*

## 1. Igény
- **Tördelődő nézetváltó** – hol: partner app GYIK (9 téma). Mit old meg: sok elemnél a `bc-seg` rejtett görgetősávval
  görget, így a jobb szélső elemek (pl. „A partner app használata”) észrevétlenek maradnak; a szűk rácsoszlopban az
  egész oldalt is szétnyomta. Ma helyette: helyi CSS a partnerben (`.bc-seg.faq-temak`).
- **tailwind-merge kiegészítés** – hol: a partner app `cn()`-je (React + Tailwind + tailwind-merge). Mit old meg: a
  tailwind-merge nem ismeri a DS-preset neveit (`text-s`, `shadow-s`, `z-modal`, `min-h-tap`…): a `text-s`-t színnek
  hiszi, így `cn('text-s', 'text-ink')`-ből csendben eltűnik egyik; a `z-modal z-[1200]`-ből mindkettő marad, és a 55 nyer
  (a partner térkép-panele a sötét háttér alá került – HIBA, 2026-10-03). Ma helyette: kézzel írt lista a partnerben.

## 2. Mire épül
- DS-elemek: `.bc-seg` / `SegmentedControl` (Javaslat 01 – 3A), Tailwind-preset (`dist/tailwind/preset.cjs`).
- Szint: molekula-változat + eszköz-kimenet.

## 3. Változatok
| | A – tördelődik (választott) | B – görget, széleken halványítás | C – „Továbbiak” legördülő |
|---|---|---|---|
| Előny | minden elem látszik; egyszerű CSS | egy sor marad | egy sor, sok elemre is |
| Hátrány | több sor (magasabb) | még mindig rejtett elemek | egy kattintással több, a témák nem látszanak |
**Javaslat:** A – 9 elem körül a láthatóság fontosabb a magasságnál.

## 4. Állapotok
Ugyanazok, mint a `bc-seg`-é (kijelölt, rámutatás, fókusz, tiltott); tördelve az elválasztó vonalak nem duplázódnak.

## 5. Szélső esetek (tesztlap: `vezerlok` → „Sok elem, tördelődő (wrap)”)
- 9 elem 320 px-en: több sor, nincs vízszintes kilógás.
- Hosszú elemfelirat: a gomb szélesedik, a sor tördelődik.

## 6. API
```tsx
<SegmentedControl wrap label="Téma" value={…} onChange={…} items={…} />
// vagy CSS-ből: <div class="bc-seg is-wrap">…</div>
```
```ts
import { extendTailwindMerge } from 'tailwind-merge';
import beecoTwMerge from '@beeco/design-system/tailwind-merge';
const twMerge = extendTailwindMerge(beecoTwMerge);
```
A kiegészítés ugyanabból a tokenforrásból készül, mint a preset (`tools/tokens-build.js`) – új token esetén magától frissül.
**A `rounded-l` szándékosan kimarad:** Tailwindben a bal oldali sarkok osztálya is (`rounded-l` = bal felső + bal alsó),
ezért kétértelmű a DS `l` sarok-nevével. Nagy sarokhoz a `rounded-m` / `rounded-pill`, vagy a DS-osztályok (`bc-card`).

## 7. Hozzáférhetőség
Változatlan: rádiócsoport, egy Tab-megálló, nyilakkal vált; a tördelés a DOM-sorrendet nem változtatja.

## 8. Döntés
- Dátum: 2026-10-03 · Kristóf: „DS javaslatot elfogadom” · Választott változat: A + a tailwind-merge kiegészítés.
