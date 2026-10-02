# Javaslat 11 – Évszakos díszítés a méhsejt-háttéren

*Állapot: **jóváhagyva** · Claude (PARTNERAPP) · 2026-10-02 · Kristóf: „mehet mind” (a partner-app ötletlistájának 10. pontja, `beeco-partner/docs/otletek-kedvesebb-felulet.md`).*

## Igény
A méhsejt-háttér (Javaslat 10) apró, évszak szerinti motívumot kap – tavasszal virág, nyáron nap, ősszel levél, télen hópehely –, hogy a felület „éljen”, de a tartalmat ne zavarja.

## Megoldás
- `.bc-honeycomb[data-evszak="tavasz|nyar|osz|tel"]` → `::after` réteg: ritkás motívum (240×208 px-es csempe, csempénként 2 motívum a hatszögekbe illesztve), CSS-maszk, a szín DS-szerep/primitív: tavasz `highlight`, nyár `accent-press`, ősz `ember`, tél `sky`; erősség `--_op-evszak` (alap .4); a tartalom alatt (`--bc-z-behind`), nyomtatáskor rejtve.
- `AppShell season="auto"` (a mai dátumból) vagy egy adott évszak; `evszak(date)` segéd: III–V tavasz, VI–VIII nyár, IX–XI ősz, XII–II tél.
- Nincs mozgás, nincs új szín.

## Teszt
`tema` tesztlap: mind a négy évszak maszkos, egymástól eltérő motívum, a tartalom alatt; `evszak()` a hónap szerint.
