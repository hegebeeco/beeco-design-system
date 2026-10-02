# Javaslat 10 – Sötét módú logó és közös méhsejt-háttér

*Állapot: **jóváhagyva** · készítette: Claude (PARTNERAPP munkamenet) · dátum: 2026-10-02*
*Jóváhagyás: Kristóf, 2026-10-02 – „1. igen” (sötét logó a DS-be), „2. igen” (a partner-app méhsejt-mintája legyen a DS közös háttere, az adminban is).*

## 1. Igény
- **Logó:** a `logo.webp` fekete „be” betűi és csápjai sötét módban (éjszakai olíva háttéren) alig látszanak.
- **Méhsejt-minta:** a partner-app saját SVG-komponensével (`HoneycombPattern`) rajzolta a tartalom mögé; az adminban nem volt.

## 2. Mire épül
- A meglévő `logo.webp` – **nem rajzoltuk újra**: a sötét változatban csak az átlátszó háttér melletti fekete részek (a „be”, a csápok, a lábak) lettek krémszínűek (`#FFF8E7`, az élsimítás megtartásával); a méhecske testén futó fekete vonalak maradtak. Gyártás: a kiadás commitjában leírt szkript (PIL), 512×313, WebP.
- A partner-app méhsejt-mintája (120×104 px-es csempe, 5 hatszög, kitöltés 35 %, körvonal 1,5 px) – CSS-maszkként, a méz szerep színével.
- Szint: `Logo` atom; `.bc-honeycomb` díszítő minta; `AppShell pattern="honeycomb"`.

## 3. API
```tsx
<Logo />                         // 36 px magas; size="s" 24 · "l" 56; label="" → díszítő
<AppShell pattern="honeycomb" …> // a tartalomrész mögé (mint a partner-appban)
<div className="bc-honeycomb">…</div>   // bármely doboz mögé; erősség: --_op (alap .12)
```

## 4. Hozzáférhetőség
Új token: `z.behind = -1` (`--bc-z-behind`, Tailwind `z-behind`) – a „tartalom mögé” réteg a z-skálán, nyers z-index helyett.
A logó `role="img"` + `aria-label="beeco"` (vagy díszítő); a minta `z-index: -1`, `pointer-events: none` – a tartalom és a kattintás fölötte marad; nyomtatáskor elrejtve.

## 5. Tesztlap
`tema`: a logó világosban `logo.webp`, sötétben `logo-sotet.webp`, 36 px; a minta maszkos, a tartalom alatt.
