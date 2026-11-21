# Keresési és forgalmi adatok az auditba (`--search`)

A szkript nem hív MCP-t és nem ír BigQuery-be: **te (a modell)** futtatod az alábbi lekérdezéseket a BigQuery MCP-vel (`mcp__66d0fab0-11ab-4ba6-893e-93068c2732e4__execute_sql_readonly`, csak olvas), az eredményt összeállítod egy JSON-fájllá, és `--search <fájl>`-lal adod az auditnak. A repó nyilvános: a projektazonosító itt helyőrző, a Bing API-kulcs soha nem kerül fájlba.

- **Projekt:** `<PROJEKT>` (alapértelmezés: `beeco-406415`; a GA4-export adatkészlete: `analytics_<PROPERTY_ID>`; a Search Console-exporté: `searchconsole`).
- **Állapot (2026-11-03):** az adatkészletek **még nem léteznek**, Kristóf kapcsolja be az exportokat (GA4: Admin → BigQuery links; Search Console: Settings → Bulk data export, adatkészlet neve: `searchconsole`). Amíg nincsenek, a lekérdezés „Not found: Dataset” hibát ad: ilyenkor ne találj ki adatot, hagyd ki a `--search`-öt, és a jelentésben írd le, hogy a forrás hiányzik.
- Az első exportált nap az engedélyezés utáni nap; a régebbi adat nincs visszamenőleg. Ha az előző 28 nap még nincs meg, az `prev` blokkot hagyd ki (a „csökkenés” lelet csak ott fut, ahol van előző érték).
- Időszakok: **most** = az elmúlt 28 nap (tegnapig), **előző** = az azt megelőző 28 nap. Fájlba mindkettőt írd.

## 1. GA4: munkamenetek oldalanként (28 + 28 nap)

Munkamenet-azonosító: `user_pseudo_id` + `ga_session_id`. Elkötelezett munkamenet: `session_engaged = '1'` (a GA4-exportban string). Az oldal = az `page_view` esemény `page_location`-jéből kivett útvonal. Az `events_*` helyettesítő karakter az `events_intraday_*` táblákat a `_TABLE_SUFFIX` szűrés miatt kihagyja.

```sql
WITH ev AS (
  SELECT
    PARSE_DATE('%Y%m%d', event_date) AS d,
    user_pseudo_id,
    (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') AS sid,
    REGEXP_EXTRACT((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location'), r'^https?://[^/]+(/[^?#]*)') AS path,
    (SELECT COALESCE(value.string_value, CAST(value.int_value AS STRING)) FROM UNNEST(event_params) WHERE key = 'session_engaged') AS engaged,
    (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'engagement_time_msec') AS eng_ms,
    event_name
  FROM `<PROJEKT>.analytics_<PROPERTY_ID>.events_*`
  WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 56 DAY))
                          AND FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
)
SELECT
  IF(path = '/', '/', RTRIM(path, '/')) AS path,
  IF(d >= DATE_SUB(CURRENT_DATE(), INTERVAL 28 DAY), 'now', 'prev') AS period,
  COUNT(DISTINCT IF(event_name = 'page_view', CONCAT(user_pseudo_id, '.', CAST(sid AS STRING)), NULL)) AS sessions,
  COUNT(DISTINCT IF(event_name = 'page_view' AND engaged = '1', CONCAT(user_pseudo_id, '.', CAST(sid AS STRING)), NULL)) AS engaged_sessions,
  ROUND(SAFE_DIVIDE(SUM(IF(event_name = 'user_engagement', eng_ms, 0)) / 1000,
        COUNT(DISTINCT IF(event_name = 'page_view', CONCAT(user_pseudo_id, '.', CAST(sid AS STRING)), NULL))), 1) AS avg_engagement_s,
  -- kulcsesemények: írd át a beeco tényleges eseményneveire (GA4 Admin → Key events)
  COUNTIF(event_name IN ('generate_lead', 'form_submit', 'ajanlatkeres')) AS key_events
FROM ev
WHERE path IS NOT NULL
GROUP BY path, period
ORDER BY period, sessions DESC
```

Az `engagement_rate` = `engaged_sessions / sessions` (törtként, 0–1). A `user_engagement` eseményeket útvonal szerint csak azon az oldalon számoljuk, ahol az esemény `page_location`-je van: ez közelítés, nem egyezik 1:1 a GA4 felületével (a felület a munkamenet teljes idejét osztja). Az első futásnál vesd össze a GA4 felülettel egy oldalon, és írd a jelentésbe az eltérést.

## 2. Search Console: oldalanként és keresésenként (28 + 28 nap)

A tömeges export táblája: `<PROJEKT>.searchconsole.searchdata_url_impression` (oszlopok: `data_date`, `url`, `query`, `search_type`, `impressions`, `clicks`, `sum_position`). Átlagos pozíció (1-alapú) = `SUM(sum_position) / SUM(impressions) + 1`. Az anonimizált keresések `query`-je NULL: a kattintás- és megjelenés-összegekbe beleszámítanak, a „top keresések” listából kimaradnak. Mindig szűrj a `data_date`-re (partíció), és `search_type = 'WEB'`-re.

Oldal-összesítő:

```sql
SELECT
  REGEXP_EXTRACT(url, r'^https?://[^/]+(/[^?#]*)') AS path,
  IF(data_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 28 DAY), 'now', 'prev') AS period,
  SUM(clicks) AS clicks,
  SUM(impressions) AS impressions,
  SAFE_DIVIDE(SUM(clicks), SUM(impressions)) AS ctr,
  SAFE_DIVIDE(SUM(sum_position), SUM(impressions)) + 1 AS position
FROM `<PROJEKT>.searchconsole.searchdata_url_impression`
WHERE data_date BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 56 DAY) AND DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)
  AND search_type = 'WEB'
GROUP BY path, period
ORDER BY period, impressions DESC
```

Top keresések oldalanként (csak az elmúlt 28 nap, oldalanként 5):

```sql
SELECT path, query, clicks, impressions, position FROM (
  SELECT
    REGEXP_EXTRACT(url, r'^https?://[^/]+(/[^?#]*)') AS path,
    query,
    SUM(clicks) AS clicks,
    SUM(impressions) AS impressions,
    SAFE_DIVIDE(SUM(sum_position), SUM(impressions)) + 1 AS position,
    ROW_NUMBER() OVER (PARTITION BY REGEXP_EXTRACT(url, r'^https?://[^/]+(/[^?#]*)') ORDER BY SUM(clicks) DESC, SUM(impressions) DESC) AS rn
  FROM `<PROJEKT>.searchconsole.searchdata_url_impression`
  WHERE data_date BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 28 DAY) AND DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)
    AND search_type = 'WEB' AND query IS NOT NULL
  GROUP BY path, query
) WHERE rn <= 5
ORDER BY path, rn
```

Az `execute_sql_readonly` a `projectId` paramétert is kéri: `beeco-406415` (vagy a `<PROJEKT>`).

## 3. Bing Webmaster Tools (nincs BigQuery-export)

A Bing adata a Webmaster API-ból jön, API-kulccsal. **A kulcsot a `BING_WEBMASTER_API_KEY` környezeti változó tartalmazza (a felhasználó állítja be a saját shelljében). Ne írd ki, ne tedd fájlba, jelentésbe, logba vagy a repóba; a parancsot ne futtasd `set -x`-szel vagy `curl -v`-vel.**

```bash
# oldalankénti statisztika (válasz: JSON, a kulcs a környezetből jön; a kimenetet fájlba, a kulcsot nem a parancsba írd)
curl -s -G "https://ssl.bing.com/webmaster/api.svc/json/GetPageStats" \
  --data-urlencode "siteUrl=https://www.beeco.hu/" \
  --data-urlencode "apikey=${BING_WEBMASTER_API_KEY}" -o "$TMPDIR/bing-pages.json"

# kulcsszavak (GetQueryStats), ugyanígy
curl -s -G "https://ssl.bing.com/webmaster/api.svc/json/GetQueryStats" \
  --data-urlencode "siteUrl=https://www.beeco.hu/" \
  --data-urlencode "apikey=${BING_WEBMASTER_API_KEY}" -o "$TMPDIR/bing-queries.json"
```
A válasz `d` tömbjében dátumonkénti sorok vannak (`Date` `/Date(ms)/` formában, `Clicks`, `Impressions`, `AvgClickPosition`, `AvgImpressionPosition`, a `Query` mező oldalnál az URL). Az első hívásnál ellenőrizd a tényleges mezőneveket, aztán összegezd 28 napra (most / előző) oldalanként. Ha a környezeti változó nincs beállítva (`[ -z "$BING_WEBMASTER_API_KEY" ]`), ne próbálkozz: hagyd ki a Bing blokkot, és jelezd.

## A `--search` JSON alakja

Kulcs: teljes URL vagy útvonal (`/rolunk`). A `_`-sal kezdődő kulcsok metaadatok.

```json
{
  "_range": { "from": "2026-10-06", "to": "2026-11-02", "prevFrom": "2026-09-08", "prevTo": "2026-10-05" },
  "_site": { "gsc": { "clicks": 1200, "impressions": 54000, "prev": { "clicks": 900, "impressions": 41000 } },
             "ga4": { "sessions": 8800, "prev": { "sessions": 6500 } }, "bing": { "clicks": 80, "prev": { "clicks": 60 } } },
  "_gsc_complete": true,
  "/rolunk": {
    "gsc": { "clicks": 40, "impressions": 3200, "ctr": 0.0125, "position": 8.4,
             "top_queries": [ { "query": "beeco", "clicks": 20, "impressions": 400, "position": 1.8 } ] },
    "ga4": { "sessions": 310, "engaged_sessions": 190, "engagement_rate": 0.61, "avg_engagement_s": 42, "key_events": 6 },
    "bing": { "clicks": 3, "impressions": 140, "position": 7.1 },
    "prev": { "gsc": { "clicks": 30, "impressions": 2900, "position": 9.0 }, "ga4": { "sessions": 380 }, "bing": { "clicks": 2, "impressions": 100 } }
  }
}
```
- `_site`: az egész oldal összege (ha nincs, a szkript az oldalankénti értékeket adja össze, ami csak a bejárt oldalakra igaz). A `--history` sora ebből tárolja a `clicks`, `impressions`, `sessions` összegeket: ebből készül a trend-oldal „munkamenet + havi +30 % cél” grafikonja.
- `_gsc_complete: true`: a Search Console-export minden megjelenést kapott oldalt tartalmaz, ezért az a bejárt oldal, amelyik nincs a fájlban, **0 megjelenésű** (a „0 megjelenés, indexelhető oldal” lelethez). Nélküle csak az explicit `"impressions": 0` számít.
- A CTR törtként (0–1) vagy hiányozhat: a szkript `clicks / impressions`-ből számolja.
- Leletek (seo terület): ≥ 500 megjelenés és CTR < 1 % (P2), pozíció 5–15 és > 100 megjelenés (P2), munkamenet > 20 %-os csökkenés az előző időszakhoz (P1, előző ≥ 20), 0 megjelenés indexelhető oldalon (P2).
