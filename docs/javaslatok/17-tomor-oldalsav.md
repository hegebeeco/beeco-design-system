# Javaslat 17 – tömör oldalsáv (`AppShell density="compact"`) menücsoportokkal

*Állapot: **jóváhagyva** · készítette: Claude (PARTNERAPP) · dátum: 2026-10-03*

## 1. Igény
- Hol: partner app oldalsávja (12 menüpont: Főoldal, Keresés, Első lépések, Profil & Fiók, Térkép pontok, Kuponok,
  Beváltás, Események, Edukáció, Közösség, GYIK, Analitika).
- Mit old meg: Kristóf (2026-10-03): „csoportosítsd a bal menü elemeit és csökkentsd a méretét, hogy kompaktabb legyen”.
  12 egyenrangú, 44 px-es sor 1280×800-as laptopon már görgetést kér, és a sorrend nem mutatja, mi tartozik össze.
- Ma helyette: egyetlen csoport, alapsűrűség.

## 2. Mire épül
- `AppShell` (Javaslat 03/08), `NavGroup.label` (a csoportcím már létezik), a 820 px alatti tömörítés (Javaslat 15, 3.3).
- Szint: sablon-változat (opcionális prop, alapból a mai viselkedés).

## 3. Változatok
| | A – sűrűség-prop (választott) | B – mindig tömör | C – lenyitható csoportok |
|---|---|---|---|
| Előny | opcionális, az admin is választhatja | egyszerű | nagyon rövid |
| Hátrány | egy prop több | az admin kinézete is változna kérés nélkül | rejtett menüpontok, egy kattintással több |
**Javaslat:** A.

## 4. Méretek
- Sáv: 248 → 224 px (becsukva 84 → 72 px); márka 30 px; betű `fs-s`; ikon 18 px; csoportcím-köz `sp-3`.
- Menüpont: **egérrel 36 px** magas (WCAG 2.5.8: ≥ 24 px); **érintőképernyőn 44 px marad** (`pointer: coarse`).
- A telefonos fiók (portál) is tömör (a közök), az érintési felület ott is 44 px.

## 5. Szélső esetek (tesztlap: `reteg-vaz-tomor`)
- 1280×800: 12 menüpont + 3 csoportcím görgetés nélkül elfér.
- Becsukott sáv: csak ikonok, a csoportok vonallal elválasztva (mint eddig).
- Telefon: a fiókban a csoportcímek látszanak, a sorok 44 px-esek.

## 6. API
```tsx
<AppShell density="compact" nav={[{ items: […] }, { label: 'Kínálatod', items: […] }]} … />
```

## 7. Hozzáférhetőség
Változatlan: a csoportcím a lista neve (`aria-labelledby`), a fókusz és a billentyűzet ugyanúgy; kontraszt a meglévő szerepekből.

## 8. Döntés
- Dátum: 2026-10-03 · Kristóf kérése („csoportosítsd … kompaktabb legyen”) · Választott változat: A.
- A partner csoportjai: (cím nélkül) Főoldal, Keresés, Analitika · **Kínálatod:** Térkép pontok, Kuponok, Beváltás, Események ·
  **Tudás és közösség:** Közösség, Edukáció · **Fiók és segítség:** Profil & Fiók, Első lépések, GYIK.
