# Kaptár-kapu: szerződés a Kaptár és a Csatlakozz oldal között

**Kinek:** a Kaptár fejlesztője (`beeco-hr`, Supabase „BEECO HR”). **Mire:** a beeco.hu Csatlakozz oldalának élő blokkjai
(számok, nyitott feladatok, raj-választó, szintek és bolt, ranglista, helyi csapatok).
**Most:** az oldal a `kapu-minta.json` mintaadatot mutatja „Mintaadat” címkével, ezért **nem élesíthető**.
Ha kész az élő végpont, a Webflow Designerben a hero számdobozán (`data-kk="szamok"`) a `data-kk-forras` attribútumot
át kell írni a végpont címére. Más teendő nincs: minden blokk ugyanabból a forrásból olvas.

## Végpont

| | |
|---|---|
| Módszer, cím | `GET https://kaptar.beeco.hu/api/kapu.json` (addig `https://beeco-hr-platform.netlify.app/.netlify/functions/kapu`) |
| Formátum | JSON, UTF-8, a lenti mezőkkel |
| Előállítás | Netlify function, ami egy `security definer` RPC-t hív (`public.kapu_publikus()`), anon kulccsal, szerveroldalon |
| Frissítés | elég 15 percenként; a function gyorsítótáraz |
| Gyorsítótár | `Cache-Control: public, max-age=900` |
| CORS | `Access-Control-Allow-Origin: https://www.beeco.hu` és `https://beeco-weboldal.webflow.io` |
| Hiba esetén | az oldal „Az adatok most nem érhetők el” szöveget mutat; nem kell külön hibaformátum |

**Biztonság (a Kaptár `CLAUDE.md`-je szerint):** a `service_role` kulcs nem kerül se a weboldalra, se a functionbe.
A nyilvános mezőket kizárólag az RPC adja ki (oszlopszintű jog RPC-vel), a táblák RLS-e változatlan. Az RPC csak
összesítést, nyilvánosnak jelölt feladatot és hozzájárulást adott profilt ad vissza.

## Mezők és forrásuk

```json
{
  "verzio": 1,
  "minta": false,
  "frissitve": "2026-10-06T04:00:00+02:00",
  "szamok": { "onkentes": 0, "nyitott_feladat": 0, "helyi_csapat": 0, "rajpont_honap": 0 },
  "feladatok": [{ "id": "", "cim": "", "raj": "", "ora": 0, "rajpont": 0, "mod": "online", "varos": "", "eszkoz": "kezi", "szint": "", "leiras": "" }],
  "ranglista": [{ "nev": "K. Anna", "varos": "", "raj": "", "rajpont": 0 }],
  "csapatok": [{ "varos": "", "allapot": "aktiv", "tagok": 0, "kapitany": "", "kovetkezo": "" }, { "varos": "", "allapot": "indulo", "erdeklodo": 0 }],
  "bolt": [{ "nev": "", "rajpont": 0 }]
}
```

| Mező | Forrás a Kaptárban | Megjegyzés |
|---|---|---|
| `szamok.onkentes` | `profiles` ahol `status = 'active'` | darabszám |
| `szamok.nyitott_feladat` | `tasks` ahol `status = 'open'` és `nyilvanos` | darabszám |
| `szamok.helyi_csapat` | `helyi_csapatok` ahol `allapot = 'aktiv'` | darabszám |
| `szamok.rajpont_honap` | `rajpont_monthly.points` összege az aktuális hónapra | |
| `feladatok[]` | `tasks` ahol `status = 'open'` és `nyilvanos`, legfeljebb 24 | `id`, `title`→`cim`, `rajok.name`→`raj`, `estimated_hours`→`ora`, `rajpont`, `description` első 140 karaktere→`leiras` |
| `feladatok[].mod/varos/eszkoz/szint` | új oszlopok, lásd lent | `mod`: `online`/`helyben`; `eszkoz`: `kezi`/`vibe-code` |
| `ranglista[]` | `rajpont_monthly` az aktuális hónapra, csak `profiles.recognition_opt_in = true`, top 8 | `nev`: vezetéknév kezdőbetűje + keresztnév (`Kiss Anna` → `K. Anna`), `city`→`varos`, `rajok.name`→`raj` |
| `csapatok[]` | `helyi_csapatok` | `tagok`: aktív profilok, akiknek `city` = a város; `erdeklodo`: jelentkezők az adott várossal |
| `bolt[]` | `shop_items` ahol `is_active` | `name`→`nev`, `cost_rajpont`→`rajpont` |

A `profiles` személyes mezői (e-mail, telefon, Discord, teljes név) **soha** nem kerülnek a válaszba.

## Szükséges Kaptár-változások (javaslat, a Kaptár-fejlesztővel egyeztetendő)

1. `tasks`: `nyilvanos boolean not null default false`, `mod text check (mod in ('online','helyben'))`, `varos text`,
   `eszkoz text check (eszkoz in ('kezi','vibe-code'))`, `szint text`. Csak a `nyilvanos` feladat jelenik meg a weboldalon,
   így a belső feladatok rejtve maradnak.
2. `helyi_csapatok` tábla (`varos`, `allapot` (`aktiv`/`indulo`), `kapitany_id` → `profiles`, `kovetkezo_talalkozo`),
   RLS-sel, írás csak Beecoachnak.
3. `applications` tábla a weboldali jelentkezésnek (a döntés: a jelentkező adata a Kaptárba kerül, bővített tájékoztatóval
   és megőrzési idővel). Ebből jön a városonkénti `erdeklodo` és a 48 órás válaszidő mérése.
4. `public.kapu_publikus()` RPC (`security definer`, `grant execute to anon`), ami a fenti JSON-t állítja elő.

## Mérés (GA4, `gtag`)

| Esemény | Mikor | Paraméterek |
|---|---|---|
| `kapu_cta_click` | hero- és sztori-gomb (`data-kk-cta`) | `cta` |
| `kapu_kaptar_belepes` | „Belépés a Kaptárba” | `cta` |
| `kapu_szures` | feladatszűrő változik | `raj`, `mod`, `eszkoz` |
| `kapu_feladat_valasztas` | „Ezt választom” | `feladat`, `raj`, `rajpont` |
| `kapu_rajvalaszto_kesz` | a 3 kérdéses választó végén | `raj`, `ido`, `hol` |
| `kapu_helyi_csapat` | „Csatlakozom” / „Én indítom” | `varos`, `tipus` |
| `kapu_raj_lenyitas` | a „Nyitott méhsejtek” raj lenyitása | `raj` |
| `kapu_szerep_erdekel` | szerepkártya „Érdekel!” | `szerep` |
| `kapu_jelentkezes_elotoltve` | az űrlap terület-mezője kitöltődött | `forras` |

A GA4-ben javasolt kulcsesemény: `kapu_feladat_valasztas` és az űrlap beküldése.
