# Javaslat 09 – Téma-váltó (világos / sötét / rendszer szerint) és felülírható feliratok

*Állapot: **jóváhagyva** · készítette: Claude (PARTNERAPP munkamenet) · dátum: 2026-10-01*
*Jóváhagyás: Kristóf általános utasítása, 2026-10-01: „ha a GitHub (DS) hiányos és például a partnerappon van dark mode, akkor hozd
létre a GitHubon a dark mode-ot, hogy az adminappot is tudjam fejleszteni ezáltal”, és „a partnerapp maradhat kétnyelvű”.*

## 1. Igény
- Hol kell: partner-app (most saját `ThemeProvider` + oldalsáv-gomb), admin (sötét mód következik), később web.
- Mit old meg: a felhasználó választhat világos, sötét vagy a gépe szerinti megjelenést; a választást az eszköz megjegyzi.
- Ma helyette: a partner-app `src/context/theme.tsx` (csak világos/sötét, `.dark` osztály, betöltéskor villan); az adminban nincs.
- Feliratok: a DS vázának (AppShell), fiókmenüjének (ShellAccount) és súgójának (HelpButton) képernyőolvasós szövegei fixen magyarok
  voltak – a kétnyelvű partner-app angol módjában magyarul szóltak volna.

## 2. Mire épül
- DS-elemek: `SegmentedControl` (háromállású kapcsoló), `TooltipIconButton` (kompakt ikongomb, 6/A), tokenek sötét módja
  (`dist/css/beeco-tokens.css`: `data-theme="dark"` / `.dark`), Tailwind preset `darkMode`.
- Kiváltja: a partner-app `context/theme.tsx`-ét és a sávban lévő saját téma-gombot.
- Szint: `ThemeProvider` sablon-szint (az app gyökerében), `ThemeToggle` atom (ikon) / molekula (háromállású).

## 3. Változatok
| | A – ikongomb | B – háromállású kapcsoló |
|---|---|---|
| Hol | oldalsáv alja, eszközsáv (kompakt hely) | beállítás / fiók oldal |
| Mit tud | világos ↔ sötét (a piktogram azt mutatja, amire vált) | Világos · Sötét · Rendszer szerint |
**Mindkettő benne van** (`variant="icon"` az alap, `variant="segmented"`), mert más helyre valók.

## 4. Állapotok
alap · rámutatás (súgó-buborék) · fókusz · kijelölt (kapcsoló) · rendszer szerint mód élő követése.

## 5. Szélső esetek (tesztlap: `tema`, `reteg-vaz-felirat`)
- nincs mentett érték → rendszer szerint · hibás mentett érték („lila”) → alapérték, nem omlik össze
- privát mód (a tároló tiltott) → működik, csak nem jegyzi meg
- a gép a használat közben vált éjszakai módra → rendszer szerint módban azonnal követi
- másik fülön váltott a felhasználó → itt is vált (storage esemény)
- újratöltés → megmarad; villanás nélkül, ha a `themeInitScript()` a `<head>`-ben van
- angol feliratok (`labels`, `menuLabel`, `srLabel`) – ami nincs megadva, magyar marad

## 6. API
```tsx
import { ThemeProvider, ThemeToggle, useTheme, themeInitScript } from '@beeco/design-system/react';

<ThemeProvider storageKey="theme" defaultMode="auto">…app…</ThemeProvider>   // a <html> data-theme + .dark jelzőit írja
<ThemeToggle />                                                              // ikongomb (kompakt hely)
<ThemeToggle variant="segmented" labels={{ group: t('…'), light: t('…') }} /> // beállítás-oldal
const { mode, resolved, setMode, toggle } = useTheme();
// index.html <head>: <script>…themeInitScript('theme') kimenete…</script> – villanásmentes indulás

<AppShell labels={{ openMenu, closeMenu, menuTitle, expand, collapse }} … />
<ShellAccount menuLabel={(n) => t('menu', { name: n })} loadingLabel={t('loading')} … />
<HelpButton label="Cégnév" srLabel={t('help', { field: 'Cégnév' })}>…</HelpButton>
```

## 7. Hozzáférhetőség
Ikongomb: 44 px, a neve a teendő („Sötét mód bekapcsolása”), súgó-buborék egérrel/billentyűvel. Kapcsoló: `radiogroup`, nyilakkal
vált, a fókusz követi. A téma csak szerepeket vált – a kontrasztot a `npm test` mindkét módban ellenőrzi.

## 8. Döntés
- Dátum: 2026-10-01 (Kristóf általános utasítása, lásd fent)
- Választott: A + B; feliratok felülírhatók, az alapérték magyar (az admin semmit nem vesz észre)
