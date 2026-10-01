# Méhecske-sprite-ok (web + mobilapp)

*Kristóf döntései, 2026-10-01: a méhecske-sprite a DS része, és a mobilappba is bekerül. Az alapmozgások **kódból** készülnek
a meglévő méhecskéből (ingyenes, pontosan márkahű, bármikor újragenerálható); a nehéz mozgásokat (új testtartás, integetés,
földet érés) a **SpriteCook** AI készíti – a képkockákat Claude átnézi, Kristóf hagyja jóvá. Kimenet: **Lottie + sprite-lap + WebP**.
Első kör: a 6 fő szereplő.*

## A beeco méhecskét nem rajzoljuk újra
A meglévő képet (`web/assets/brand/`) a gép szín szerint **szárnyra és testre bontja** (a szárny világoskék, színárnyalat
175–215°), és a két réteget mozgatja. A test, az arc, a csíkok, a kellékek (köpeny, korona, „?”, „zzz”) változatlanok.

## Szereplők és mozgások (első kör)
| Szereplő | Forrás | Mozgás | Képkocka | fps | Ismétlés | Mikor (tokens/hangnem.json) |
|---|---|---|---|---|---|---|
| Házigazda | bee-happy | lebeg (szárnycsapás) | 12 | 24 | 3 | üdvözlés, első használat |
| Szurkoló | bee-cheer | ujjong (ugrás) | 16 | 24 | 1 | sikeres mentés |
| Gondolkodó | moods/think | tűnődik (fejbillentés) | 16 | 16 | 2 | nincs találat, hiba |
| Pihenő | moods/rest | alszik (lélegzés) | 24 | 12 | 3 | üres lista, lejárt munkamenet |
| Futár | bee-super | repül | 12 | 24 | 20 (≤ 10 mp) | 1 mp-nél hosszabb töltés |
| Bajnok | moods/rank | ünnepel | 20 | 24 | 1 | mérföldkő – ritkán |

**Végtelen mozgás nincs:** a megadott ismétlés után az utolsó képkockán megáll. A Futár töltés közben legfeljebb 10 mp-ig
repül, utána megáll, és a „toltes-hosszu” mondat jön. **Csökkentett mozgásnál** (iOS „Mozgás csökkentése”, Android
„Animációk eltávolítása”) az első képkocka áll.

## Fájlok (`dist/meh/<szereplő>/`)
| Fájl | Mire | Méret (kb.) |
|---|---|---|
| `lottie.json` | **mobilapp (ajánlott)** – éles bármekkora méretben; test és szárny külön rétegen | 14–23 KB |
| `sprite@1x.webp`, `@2x`, `@3x` | sprite-lap (vízszintes csík, kockánként 128 / 256 / 384 px) – web és Flutter | 36–272 KB |
| `anim.webp` | animált WebP (256 px), ha egyszerű kép kell | 82–194 KB |
| `anim.json` | adatlap: képkockák, fps, ismétlés, hossz | – |

## Flutter (Bence)
```dart
// pubspec.yaml: lottie: ^3.x  ·  assets: assets/meh/
Lottie.asset(
  'assets/meh/szurkolo.json',
  width: 128, height: 128,
  repeat: false,                         // ismétlés: anim.json → "ismetles"; végtelen soha
  animate: !MediaQuery.of(context).disableAnimations,   // csökkentett mozgásnál áll
)
```
- Ismétlés N-szer: `AnimationController` + `controller.repeat(count: N)` helyett: `forward()` → `onCompleted` → számláló.
- Díszítő elem: `ExcludeSemantics` (a mellette lévő mondat beszél); ha önállóan jelent valamit: `Semantics(label: …)`.
- A szöveg a szövegkészletből jön (`tokens/hangnem.json` → `dist/tokens.json`-ba is bekerülhet, ha kéred): szóvicc + sima jelentés.
- Képernyőnként legfeljebb egy méhecske; munka közben (űrlap, lista) nincs.

## Web
```tsx
import { BeeSprite } from '@beeco/design-system/react';
<BeeSprite szereplo="szurkolo" replay={mentesSzamlalo} />   // s = 64, m = 128, l = 192 px; a sűrűséghez illő lapot tölti
```

## Újragenerálás, új mozgás
```bash
python3 tools/meh-sprite/gyart.py --nezo     # mind a 6 → dist/meh/ + termek/css/bc-meh-sprite.css; áttekintő: dist/meh/nezo.png
python3 tools/meh-sprite/gyart.py futar      # csak egy szereplő
```
Új kódos mozgás: kulcsképkockák a `tools/meh-sprite/mozgasok.json`-ban (test: dx, dy, r, sx, sy; szárny: f). Új szereplő vagy
új mozgás a szabály szerint javaslattal kerül be (`docs/komponensek.md` 5.).

## SpriteCook (nehéz mozgások)
Telepítve: `spritecook-workflow-essentials`, `-generate-sprites`, `-animate-assets`, `-upload-assets` skillek (~/.claude/skills).
**Kristóf teendője** (Claude kulcsot nem lát és nem kezel):
1. Fiók a https://spritecook.ai oldalon (ingyenes: havi 40 kredit ≈ 2 animáció; „Apprentice”: 8 $/hó, 800 kredit).
2. Terminálban: `npx spritecook-mcp setup` → belépés a böngészőben.
3. A Claude Code újraindítása, hogy a SpriteCook-eszközök megjelenjenek.
Utána Claude: krediteket ellenőriz → feltölti a forrás-méhecskét → animál (részletes mód, 256–2048 px) → képkockánként
összeveti az eredetivel (szem, csíkok, arányok) → Kristóf jóváhagyja → ugyanide (`dist/meh/`) kerül, ugyanebben a formában.
A feltöltés jóváhagyva (Kristóf, 2026-10-01); a SpriteCook adatkezelési feltételeit érdemes elolvasni.
