# Flutter app → beeco design system (specifikáció Bencének)

*Kristóf döntése (2026-10-01): a termékbőr **az app mostani neo-brutalista vonala**, fekete tintával. Az appnak ezért
nem kell átrajzolódnia – a cél, hogy ugyanabból a token-forrásból dolgozzon, mint az admin, a partner-felület és a web.*

## Mit kap az app

`dist/dart/beeco_tokens.dart` (generált, ne szerkeszd kézzel – a DS-repóból másold, új verziónál cseréld):
- `BeecoPalette` – 38 primitív szín (`BeecoPalette.honey`, `.olive`, `.leaf`, …)
- `BeecoRoles.light` / `BeecoRoles.dark` – szín-szerepek (`ink`, `bg`, `surface`, `accent`, `onAccent`, `line`, `shadow`, `success/-Bg/-Ink`, …)
- `BeecoTokens` – betűméret (`fsXs` … `fs3xl`), térköz (`sp1` … `sp8`), sarok (`rS` 4, `rM` 8, `rL` 12), keret (`bwHair` 1, `bwBase` 2),
  árnyék-eltolás (`shadowS` 2,2 · `shadowM` 4,4 · `shadowL` 6,6), időzítés (`tPress` 120 ms, `tBase` 200 ms), `easeOut`, `tap` 44.

## Javasolt lépések (Bence dönt a sorrendről)

1. **Beemelés:** `lib/presentation/theme/beeco_tokens.dart`; az `AppColors` azonos értékű konstansai a `BeecoPalette`-re mutatnak (lent a tábla) – a hívó kód nem változik.
2. **ThemeExtension:** a `BeecoColors` extension kapjon szerep-mezőket a `BeecoRoles`-ból; sötét témához `BeecoRoles.dark`.
3. **ElevatedContainer:** az árnyék-eltolás és a sarok csak `BeecoTokens.shadowS/M/L` és `rS/rM/rL` legyen (most 1, 2, 3, 4, 5 px vegyesen; a sarok 1–150).
4. **Közeli ismétlések összevonása** (lent), új szín csak a DS-repón át.
5. **Betűskála:** 10 px-es szöveg → `fsXs` (12); a 17 / 22 / 24 / 30 / 36 / 40-es méretek a legközelebbi skálaelemre.
   Open Sans w800 → w700 (a webes változó betű 400–700).

## Megfeleltetés (azonos hex)

| App (`AppColors`) | DS primitív | Termék-szerep |
|---|---|---|
| `beecoYellow` | `honey` | `accent` |
| `pressedYellow` | `honeyDeep` | `accentPress` |
| `blackStrong` | `black` | `ink`, `line`, `shadow`, `onAccent` |
| `blackMedium` | `coal` | – |
| `beecoBgMain` | `cream` | `bg` |
| `whiteStrong` | `white` | `surface` |
| `beecoBgLightestGreen` | `sprout` | `surface2` |
| `yellowVeryLight` (+ `yellowMuted` `#FEEEBA` → összevonva) | `butter` | `surfaceAccent`, `warningBg` |
| `hint` | `graphite` | `inkSoft` |
| `disabledButtonColor` | `slate` | `inkMuted` |
| `dividerGrey` | `silver` | `lineSoft` |
| `silver` | `mist` | – |
| `beecoGreen` | `leaf` | `success` |
| `beecoGreenStrong` | `forest` | `successInk` |
| `beecoBgLightGreen` | `sageBg` | `successBg` |
| `beecoLightGreen` | `sage` | – |
| `oliveDark` / `oliveStrong` / `oliveMedium` | `olive` / `oliveStrong` / `oliveSoft` | (sötét mód) |
| `greenVivid` | `lime` | (sötét `success`) |
| `redAccent` | `red` | `danger` |
| `beecoBgRed` | `blush` | `dangerBg` |
| `beecoOrange` | `ember` | `warning` |
| `brownMedium` | `rust` | `warningInk` |
| `waterBlue` | `water` | `info` |
| `highlightBlue` / `progressBarBlue` | `ice` | `infoBg` |
| `blueStrong` | `navy` | `infoInk` |
| `blueAccent` | `focus` | `focus` |
| `beecoPink` | `blossom` | `highlight` |
| `markerBlue` | – (`sky` #B1DEFF a legközelebbi) | döntés kell |

**Hiba-szöveg:** a `redAccent` fehéren épp 4,50:1 – szövegnek a `crimson` (`#B3261E`, `dangerInk`) kell.

## Ami nincs a DS-ben (maradhat az appban, de ne szaporodjon)

A ~20 szürke/barna/kék árnyalat (`grey200`, `lighterGrey`, `brownAccent`, `bronze`, `specialShadow #000B2F` …): ha kell
valamelyik a közösbe, a DS-repóban kell felvenni (indoklással), különben idővel a legközelebbi szerepre áll.

## Ellenőrzés

A Dart-fájlokat a webes `ds-lint` nem vizsgálja. Javaslat: egy egyszerű teszt, ami a `lib/` alatt a `Color(0x…)` előfordulásokat
számolja (racsni, mint a weben) – ha Bence kéri, megírjuk.
