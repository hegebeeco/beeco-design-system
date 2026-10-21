# Raj-adat: szerződés a beeco app és a kampányoldal között

**Kinek:** Bence (app-backend). **Mire:** a CsicsergŐsz-oldal élő közösségi blokkjai (számláló, közös cél, kerületi verseny, fotófal).
**Most:** az oldal a `raj-minta.json` mintaadatot mutatja „Mintaadat” címkével. Az élő végpont kész → a Webflow Designerben a
„A raj ereje” szekció számláló-dobozán a `data-cs-raj-forras` attribútumot át kell írni a végpont címére. Más teendő nincs.

## Végpont

| | |
|---|---|
| Módszer, cím | `GET https://<api>/kampany/csicsergosz/raj.json` (a pontos címet te adod) |
| Formátum | JSON, UTF-8 |
| Frissítés | elég naponta egyszer (pl. 04:00), előre kiszámolt fájlként is jó (statikus tárhely, CDN) |
| Gyorsítótár | `Cache-Control: public, max-age=900` |
| CORS | `Access-Control-Allow-Origin: https://www.beeco.hu` és `https://beeco-weboldal.webflow.io` (vagy `*`, mert nincs benne személyes adat) |
| Hiba esetén | az oldal „Az adatok most nem érhetők el” szöveget mutat; nem kell külön hibaformátum |

## Mezők

```json
{
  "verzio": 1,
  "minta": false,
  "frissitve": "2026-10-06T04:00:00+02:00",
  "szamlalo": { "itato": 0, "eteto": 0, "odu": 0, "megfigyeles": 0, "resztvevo": 0 },
  "cel": { "cim": "Közös célunk: 2000 madáritató", "mertek": "itato", "cel": 2000, "allas": 0,
           "hatarido": "2026-11-30", "szponzor": "E.ON", "jutalom": "<az E.ON vállalása egy mondatban>" },
  "keruletek": [ { "kod": "XIII", "nev": "XIII. kerület", "pont": 0, "itato": 0, "eteto": 0, "odu": 0, "megfigyeles": 0 } ],
  "varosok":   [ { "nev": "Debrecen", "pont": 0 } ],
  "fotok":     [ { "kep": "https://…/kep.jpg", "faj": "Vörösbegy", "hely": "XIII. kerület", "szerzo": "Becenév", "fokusz": "50% 40%" } ]
}
```

| Mező | Jelentés | Szabály |
|---|---|---|
| `minta` | mintaadat-e | élő adatnál **mindig `false`** (különben „Mintaadat” címke jelenik meg) |
| `szamlalo.*` | kampány kezdete (2026-10-01) óta a térképre felrajzolt, **ellenőrzött** pontok és a megfigyelések száma; `resztvevo` = egyedi felhasználó, aki legalább egy ilyet rögzített | teszt-, törölt és elutasított rekord nélkül |
| `cel` | a közös cél; `allas` a `mertek` szerinti szám (most: itató) | a `jutalom` szövegét az E.ON-nal egyeztetett formában Levi adja |
| `keruletek` | mind a 23 budapesti kerület, `kod` római számmal (`I` … `XXIII`) | `pont` = 3 × itató + 3 × etető + 5 × odú + 1 × megfigyelés (javaslat, módosítható; az oldal csak a `pont`-ot rangsorolja) |
| `varosok` | a 10 legtöbb pontot gyűjtő vidéki város | ugyanaz a pontszabály |
| `fotok` | legfeljebb 8 jóváhagyott közösségi fotó | **csak** olyan fotó, amelynek feltöltője hozzájárult a nyilvános megjelenéshez, és amit moderáltak; a `szerzo` becenév, nem teljes név; a kép legalább 640 px széles; `fokusz` opcionális (CSS `object-position`) |

## Adatvédelem

A fájlban nincs személyes adat: csak összesítések, kerület- és városnevek, becenév és moderált fotó.
Pontos helyet (koordinátát, utcát) **ne** tegyél bele: a fotóknál a `hely` legfeljebb kerület vagy település.
A fotófalhoz az appban kell egy hozzájárulás-kapcsoló („a fotóm megjelenhet a beeco oldalain”); enélkül nem kerülhet fel kép.

## v1.50 kiegészítés (2026-10-07)

| Mező | Jelentés | Forrás az élő végpontnál |
|---|---|---|
| `orszagos.letoltes` | összes letöltés (a hero „A raj országosan” blokkja) | az áruházak összesítője; addig a főoldalon publikált szám |
| `orszagos.heti.itato/eteto/odu` | az elmúlt 7 napban felrajzolt pontok | `kiallitott_pontok` ahol `letrehozva >= now() - 7 nap` |
| `varosok[].lat`, `varosok[].lon` | a település középpontja (WGS84) | a települések törzsadata |

A kerületi térkép geometriája nem az adatból jön: `cs-terkep.json` (OpenStreetMap-határok, egyszerűsítve; Natural Earth országkörvonal).
A kiválasztott kerület linkelhető: `?kerulet=XI` (a megosztás gomb ezt küldi tovább).
