# Javaslat 14 – Vonalgrafikon: állapot-paletta, sorozat-kapcsoló, végcímke csak ha kifér

*Állapot: **jóváhagyva** · Claude (PARTNERAPP) · 2026-10-02 · Kristóf: „ami itt van változás azokat tedd fel neki” (a partner-app két DS-hiánya, 2026-10-02).*

## 1. Igény
- **Hol:** partner-app, fa-öntözési statisztika → „Napi faállapot trend”: 5 vonal, a fák szomjúság-sávjai (rendben … kritikus), sávonként ki-be kapcsolható. Ez az egyetlen grafikon, ami még saját rajzolású, mert a DS `LineChart`-ból két dolog hiányzott.
- **Mit old meg:** a partner egy pillantással látja, hány fa szomjas naponta, és a többi sávot elrejtheti, hogy csak a „szomjas” vonalakat nézze.
- **Hiba is volt:** a `LineChart` a vonal végi címkének helyet foglal jobbra; 30 napnál és ~600 px-es kártyánál ettől a rajz szélesebb lett a kártyánál → vízszintesen görgethetővé vált, a címke a látható részen kívülre került („Partner ör…”). A partner-appban ezért `endLabels={false}`-szal kerültük.

## 2. Mire épül
- DS-elemek: `ChartCard`, `LineChart`, `ChartLegend`, `Frame` (3/B, 4a), Javaslat 12 (`--bc-data-allapot-1…5` + `-cb` pár).
- Kiváltja: partner `watering-statistics/status-trend-line-chart.tsx` + `status-trend-level-toggles.tsx` (saját SVG + saját kapcsolók).
- Szint: molekula-bővítés (nincs új komponens).

## 3. Változatok
| | A – adat-szintű paletta + kártya-kapcsoló (választott) | B – grafikon-prop (`<LineChart palette>`) | C – saját grafikon marad |
|---|---|---|---|
| Előny | a kártya, a rajz és a jelmagyarázat **ugyanabból az adatból** színez – nem csúszhat szét (3/B elv) | rövidebb | nincs DS-munka |
| Hátrány | `ChartData` két új mezője | a jelmagyarázat mást mutathatna, mint a rajz | két külön grafikon-stílus, akadálymentesség kézzel |

**Javaslat: A**, mert a DS-ben a jelmagyarázat és az adattábla is a `data`-ból készül.

## 4. Állapotok
- Kapcsológomb: alap · rámutatás (keret) · fókusz (3 px fókuszgyűrű) · lenyomva = bekapcsolva (`aria-pressed=true`) · kikapcsolva (áthúzott felirat, szaggatott keret, halvány minta – **a szöveg kontrasztja nem csökken**).
- Minden sorozat kikapcsolva: üres rajz, a jelmagyarázat megmarad (vissza lehet kapcsolni); az adattábla mindig minden sorozatot mutat.

## 5. Szélső esetek (tesztlap: `adat-grafikon` → „graf-allapot”)
- 30 nap, 5 sorozat, 560 px-es kártya: végcímke helyett jelmagyarázat, **nincs vízszintes görgetés**.
- Színtévesztő-barát mód: az `allapot-cb` pár.
- Kikapcsolt sorozat: a többi vonal színe/alakja nem tolódik el (a `hidden` sorozat az indexén marad).
- A tengely a látható sorozatokhoz igazodik.

## 6. API
```tsx
const data: ChartData = { …, palette: 'allapot' };            // 1 = jó … 5 = rossz (legfeljebb 5 sorozat)
<ChartCard … data={data} seriesToggle>                        // csak LineChart-tal
  <LineChart data={data} />                                   // endLabels: alapból csak, ha görgetés nélkül kifér
</ChartCard>
```
- `ChartSeries.hidden?: boolean` (a ChartCard állítja; kézzel is használható), `ChartPalette = 'kategoria' | 'allapot'`.
- `Frame` `padRight(narrow, spare)` – a `spare` a görgetés nélkül megmaradó hely (visszafelé kompatibilis).
- CSS: `.bc-pal-allapot` (kártyán, rajzon, jelmagyarázaton), `.bc-legend-btn` (+ `.is-off`).

## 7. Hozzáférhetőség
- Kapcsolók: valódi `<button>`, `aria-pressed`, a jelmagyarázat neve jelzi, hogy kapcsolható; billentyűzettel Tab + Szóköz/Enter.
- Érintőn ≥ 44 px (`--bc-tap`), egérrel 32 px.
- A szín nem beszél egyedül: alak (● ■ ▲ ◆) + felirat + adattábla.

## 8. Döntés
- Dátum: 2026-10-02
- Választott változat: A
- Megjegyzés: Kristóf jóváhagyta a partner-app DS-tételeinek feltételét („ami itt van változás azokat tedd fel neki”).
