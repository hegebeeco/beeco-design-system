# Webflow-oldali ellenőrzés: adatgyűjtés MCP-vel (`--webflow <json>`)

A szkript nem tud MCP-t hívni: **te (a modell)** gyűjtöd össze a Webflow MCP-vel, amit az élő HTML nem mutat (draft, noindex a fejkódban, linkcélok, embedek, komponensek), és az alábbi JSON-ba írod. Utána: `node audit.mjs <url…> --out … --webflow <fájl>`. **Csak olvasó hívásokat használj** (list/get/query); ebben a körben semmit nem írsz a Webflow-ba, és nem publikálsz.

- Webflow-webhely azonosítója (`siteId`): `648ebb1f9ae84f3d530e2f2d`.
- Minden hívásnál kötelező: `session_id` (az első hívásnál `"start"`, utána a kapott `ses_…` érték), `agent_id` (pl. `<modell>|claude-code|<4-6 betű>`, a feladat alatt végig ugyanaz), `context` (15–25 szó, miért hívod).
- A kimenetek nagyok: mentsd fájlba (a hívás eredménye a Bash-ből nem érhető el, ezért a modell a visszakapott JSON-t egy `Write`-tal írja a scratchpadbe), és a feldolgozást Pythonnal végezd, **`json.JSONDecoder().raw_decode`**-dal: a válaszok végén gyakran van a JSON után szöveg („nextActions” stb.), amit a sima `json.loads` elutasít.

```python
import json
def load(path):
    s = open(path, encoding='utf-8').read()
    i = s.index('{') if '{' in s else s.index('[')
    obj, _ = json.JSONDecoder().raw_decode(s[i:])
    return obj
```

## 1. lépés: az összes oldal listája (id → útvonal, draft)

`data_pages_tool` → `list_pages` (lapozva: `limit: 100`, `offset: 0, 100, 200…` amíg üres nem jön):

```json
{ "actions": [ { "label": "oldalak", "list_pages": { "site_id": "648ebb1f9ae84f3d530e2f2d", "limit": 100, "offset": 0 } } ],
  "session_id": "start", "agent_id": "<modell>|claude-code|<suffix>", "context": "A beeco.hu Webflow-oldalainak listázása az audit Webflow-oldali ellenőrzéséhez." }
```
Írd ki egy `pages.json`-ba. A listából gyűjtsd: `id`, `title`, `slug` (és ha szerepel: `draft`, `archived`, szülő mappa → az útvonal a mappa-slug + slug). Ha a listában nincs `draft`/mappa-adat, kérd le oldalanként (2. lépés).

## 2. lépés: oldalankénti metaadat (draft, SEO, noindex-beállítás)

Csak az auditált oldalakra (és a 4. lépésben talált link-célokra, ha a listából nem derül ki a draft): `data_pages_tool` → `get_page_metadata` (több oldal egy hívásban, `actions` tömb):

```json
{ "actions": [ { "label": "cegeknek", "get_page_metadata": { "page_id": "<PAGE_ID>" } } ],
  "session_id": "<ses_…>", "agent_id": "<…>", "context": "Egy oldal draft jelzőjének és SEO-beállításainak olvasása." }
```
Olvasd ki: `draft` (bool), `archived`, és a SEO-blokkból, hogy az oldal ki van-e zárva a keresőből („Exclude this page from search results” / `noindex`; a mező pontos nevét az első válaszon ellenőrizd).

## 3. lépés: oldalszintű fej-/lábkód (noindex, egyedi CSS/JS)

`data_scripts_tool` → `get_page_freeform_code` (a `location` elhagyásával mindkét blokk jön):

```json
{ "actions": [ { "label": "kod", "get_page_freeform_code": { "page_id": "<PAGE_ID>" } } ],
  "session_id": "<ses_…>", "agent_id": "<…>", "context": "Az oldalszintű fej- és lábkód olvasása noindex és egyedi CSS/JS kereséséhez." }
```
Számold:
- `headCodeLen` / `footerCodeLen`: a blokk karakterhossza.
- `headCodeHasStyle`: tartalmaz-e `<style` vagy `rel="stylesheet"`; `headCodeHasScript`: tartalmaz-e `<script` (a JSON-LD, azaz `type="application/ld+json"` NEM számít scriptnek).
- `noindex`: a fejkódban van `<meta name="robots" content="…noindex…">` (kis-nagybetű mindegy), **vagy** a 2. lépésben az oldal ki van zárva a keresőből. `noindexSource`: `"head-code"` vagy `"seo-setting"`.

## 4. lépés: elemfa – page-típusú linkek, embedek, komponensek

`data_element_tool` → `get_all_elements` (a `siteId` és a `pageId` a hívás szintjén áll, nem az akcióban):

```json
{ "siteId": "648ebb1f9ae84f3d530e2f2d", "pageId": "<PAGE_ID>",
  "actions": [ { "label": "elemek", "get_all_elements": { "depth": -1 } } ],
  "session_id": "<ses_…>", "agent_id": "<…>", "context": "Az oldal teljes elemfájának olvasása linkcélok, embedek és komponensek összeszámolásához." }
```
A válasz nagy: írd fájlba (`elements-<slug>.json`), és dolgozd fel Pythonnal. A mezőneveket az első válaszon ellenőrizd (a séma változhat); a szándék:

```python
import json, re
pages = {p['id']: p for p in load('pages.json')['pages']}        # id -> {slug/path,...}
tree = load('elements-cegeknek.json')

links, embeds, comps = [], 0, set()
def walk(n):
    global embeds
    if isinstance(n, dict):
        t = str(n.get('type', ''))
        if 'Embed' in t or n.get('tag') == 'embed':              # HtmlEmbed / w-embed
            embeds += 1
        if 'ComponentInstance' in t or n.get('componentName') or n.get('component_name'):
            comps.add(n.get('componentName') or n.get('component_name') or n.get('name') or '?')
        lk = n.get('link') or n.get('linkSettings')              # page-típusú link: {type:'page', pageId:'…'} jellegű
        if isinstance(lk, dict) and (lk.get('type') == 'page' or lk.get('linkType') == 'page'):
            pid = lk.get('pageId') or lk.get('page') or lk.get('value')
            if pid in pages:
                links.append({'to': pages[pid]['path'], 'text': (n.get('text') or '')[:60]})
        for v in n.values(): walk(v)
    elif isinstance(n, list):
        for v in n: walk(v)
walk(tree)
```
Ha a linkmező neve eltér, keresd meg egy ismert linkes elemen, és igazítsd a `walk`-ot; ne találgass: ha a link célja nem azonosítható, hagyd ki a `links`-et, és írd a jelentésbe.

Nagy oldalon a `depth` csökkentésével vagy `query_elements`-szel szűkíthetsz (`element_filter: { "type": "Link" }`), de a komponens- és embed-számláláshoz a teljes fa kell.

## 5. lépés: a JSON (mentsd a scratchpadbe, ne a repóba)

```json
{
  "siteId": "648ebb1f9ae84f3d530e2f2d",
  "collectedAt": "2026-11-03",
  "draftPaths": ["/szolgaltatas/klimafresko-regi"],
  "pages": [
    {
      "path": "/szolgaltatas/cegeknek",
      "title": "Cégeknek",
      "draft": false,
      "noindex": false,
      "noindexSource": null,
      "headCodeLen": 1240,
      "headCodeHasStyle": true,
      "headCodeHasScript": false,
      "footerCodeLen": 0,
      "embeds": 3,
      "components": ["Navbar", "Lablec", "Gomb"],
      "links": [ { "to": "/szolgaltatas/klimafresko-regi", "text": "Klímafreskó" } ]
    }
  ]
}
```
- `path`: a slug a mappákkal együtt, `/`-lel kezdve (a főoldal: `/`). A `pages` tömbbe tedd az **összes** lekért oldalt (a link-célok draft-állapota ebből derül ki); a `draftPaths` az olyan draft oldalak útvonala, amelyeket nem kértél le részletesen.
- A szkript a `pages` közül azt egyesíti, ami egyezik az auditált URL útvonalával (`/szolgaltatas/cegeknek`).

## Mit csinál belőle az audit (`--webflow`)

| Eset | Súly | Terület |
|---|---|---|
| Link a `-regi` / `-draft` végű vagy draft oldalra (élő oldalról) | P1 | Linkek |
| `noindex` az oldalon, és az oldal a sitemapben van | P0 | SEO |
| `noindex`, de nincs a sitemapben | P3 (megjegyzés) | SEO |
| Draft jelölésű oldal élőben is elérhető (200) | P2 | SEO |
| Oldalszintű CSS/JS a fejkódban | P3 (hosszal) | Design system |
| Embed-szám, komponens-példányok | mérőszám a jelentésben | – |

A sitemap-tagságot a szkript maga olvassa (`<origin>/sitemap.xml`), nem kell gyűjtened.
