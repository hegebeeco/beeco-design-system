# Sablonok a fogyasztó projekteknek

Ezek a fájlok a design systemet használó projektekbe (admin, partner, Kaptár, weboldal) másolhatók.

| Fájl | Hova | Mit ad |
|---|---|---|
| `renovate.json` | a projekt gyökerébe (Renovate-app kell a repón) | heti PR az új design system-címkéről, a CHANGELOG ⚠ soraira figyelmeztetéssel |
| `ds-lint.yml` | `.github/workflows/` | a `ds-lint` racsni a CI-ben: új nyers szín, nyers px, `ease-in` stb. nem kerülhet be |

Első beállítás a projektben: `npx beeco-ds-lint --init` (felírja a mostani állapotot), utána a csökkenést `--update` rögzíti.

Megjegyzés: a Renovate a `github:hegebeeco/beeco-design-system#vX.Y.Z` függőséget git-címkeként kezeli; az első PR-nál ellenőrizd, hogy a címkét jól emeli.
