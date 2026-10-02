# Javaslat 12 – „Állapot” adatskála (jó → rossz, 5 fok)

*Állapot: **jóváhagyva** · Claude (PARTNERAPP) · 2026-10-02 · Kristóf: „10. legyen DS paletta” (a partner-app öntözési szomjúság-skálája).*

## Igény
A partner-app öntözési térképe és grafikonjai a fák szomjúságát 5 fokozattal mutatják (0 = jól öntözött … 4 = szomjas).
Eddig saját, kiszámolt köztes színekkel (zöld → vörös); a DS meglévő skálái (sorozat, eltérés) pasztellek, a középső
szinte fehér – térképjelölőn (fehér keret, fekete jel) nem különülnek el. Az admin is használhatja (pl. POI-minőség).

## Megoldás
- `core.data.allapot` = levél · világos levél · méz · parázs · piros (`#6E8947 #A6BF7B #FECF39 #EA580C #DB3A34`) → `--bc-data-allapot-1…5`.
- `core.data.allapot-cb` (színtévesztő-barát): víz · ég · vaj · világos narancs · parázs (`#0083E4 #80B5E6 #FEEEBB #F0A35E #EA580C`) → `--bc-data-allapot-cb-1…5`.
- Mindegyik a DS meglévő színe vagy adatszíne; a **fekete jel/szám minden fokozaton ≥ 4,5:1** (legkisebb: piros 4,67) – a `check-tokens` ellenőrzi.
- Szabály (docs/adatskala.md): a szín soha nem beszél egyedül – mellé jel, szám vagy felirat.

## Teszt
`adat-mutato` tesztlap: „Állapot-skála” – mindkét változat 5 fokozata számmal; `check-tokens`: 5 különböző szín, kontraszt.
