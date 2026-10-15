# Web DS katalógus (generált)

> Kézzel ne szerkeszd: `python3 weboldal/web-ds/katalogus.py`. A leírás: [docs/web-ds.md](../../docs/web-ds.md).

133 osztály, 13 változó, 5 oldal.

## Oldalak

| Kulcs | Oldal | Teszt-URL |
|---|---|---|
| `rolunk` | Rólunk | `/rolunk-uj-draft` |
| `hatasunk` | Hatásunk | `/hatasunk-draft` |
| `csapatunk` | Csapatunk | `/csapatunk-uj-draft` |
| `en` | English (Web Summit) | `/en` |
| `cegeknek` | Cégeknek és településeknek | `/szolgaltatas/cegeknek-draft` |

## Változók

| Név | Világos érték | Megjegyzés |
|---|---|---|
| `bc-bg` | `#FFF8E7` | tokens/ forrásból |
| `bc-surface` | `#FFFFFF` | tokens/ forrásból |
| `bc-surface-2` | `#F0F3EC` | tokens/ forrásból |
| `bc-ink` | `#000000` | tokens/ forrásból |
| `bc-ink-soft` | `#505050` | tokens/ forrásból |
| `bc-ink-muted` | `#676767` | tokens/ forrásból |
| `bc-accent` | `#FECF39` | tokens/ forrásból |
| `bc-accent-ink` | `#8A6A00` | csak a Webflow-ban, a tokens/ forrásba még fel kell venni |
| `bc-raj-bg` | `#2F371E` | csak a Webflow-ban, a tokens/ forrásba még fel kell venni |
| `bc-on-olive` | `#D3DDBB` | csak a Webflow-ban, a tokens/ forrásba még fel kell venni |
| `bc-vaj` | `#FEEEBB` | csak a Webflow-ban, a tokens/ forrásba még fel kell venni |
| `bc-domb` | `#D3DDBB` | csak a Webflow-ban, a tokens/ forrásba még fel kell venni |
| `bc-paper` | `#FFFDF6` | csak a Webflow-ban, a tokens/ forrásba még fel kell venni |

## Szekció és keret

Oldalszekció háttérváltozatokkal, tartalmi keret, szekciófej.

| Osztály | Töréspontok | Oldalak |
|---|---|---|
| `.ds-burok` | alap, ≤767 px | rolunk, hatasunk, csapatunk, en, cegeknek |
| `.ds-harom` | alap, ≤991 px | rolunk, csapatunk, en, cegeknek |
| `.ds-hatter-feher` | alap | rolunk, hatasunk, csapatunk, en, cegeknek |
| `.ds-hatter-sotet` | alap | rolunk, hatasunk, en, cegeknek |
| `.ds-hatter-vaj` | alap | rolunk, hatasunk, csapatunk, en, cegeknek |
| `.ds-hatter-zold` | alap | rolunk, hatasunk, csapatunk, en, cegeknek |
| `.ds-hero-foto` | alap | rolunk, csapatunk, en, cegeknek |
| `.ds-hero-racs` | alap, ≤991 px | rolunk, hatasunk, csapatunk, en, cegeknek |
| `.ds-hero-szoveg` | alap | rolunk, hatasunk, csapatunk, en, cegeknek |
| `.ds-ketto` | alap, ≤991 px | hatasunk, csapatunk, en, cegeknek |
| `.ds-negy` | alap, ≤991 px, ≤767 px | cegeknek |
| `.ds-szekcio` | alap, ≤991 px, ≤767 px | rolunk, hatasunk, csapatunk, en, cegeknek |
| `.ds-szekcio-fej` | alap, ≤767 px | rolunk, hatasunk, csapatunk, en, cegeknek |
| `.ds-zaro` | alap | rolunk, csapatunk, en, cegeknek |
| `.ds-zaro-lead` | alap | rolunk, csapatunk, en, cegeknek |

## Tipográfia

Szalagcím, címszintek, kiemelés, bevezető, folyószöveg, forrássor, szöveglink.

| Osztály | Töréspontok | Oldalak |
|---|---|---|
| `.ds-cim1` | alap, ≤991 px, ≤767 px | rolunk, hatasunk, csapatunk, en, cegeknek |
| `.ds-cim2` | alap, ≤991 px, ≤767 px | rolunk, hatasunk, csapatunk, en, cegeknek |
| `.ds-cim3` | alap | rolunk, hatasunk, csapatunk, en, cegeknek |
| `.ds-cimke` | alap | cegeknek |
| `.ds-forras` | alap | rolunk, hatasunk, en, cegeknek |
| `.ds-forras-sotet` | alap | rolunk, hatasunk, en, cegeknek |
| `.ds-kiemel` | alap | rolunk, hatasunk, csapatunk, en, cegeknek |
| `.ds-lead` | alap, ≤767 px | rolunk, hatasunk, csapatunk, en, cegeknek |
| `.ds-megjegyzes` | alap | hatasunk, cegeknek |
| `.ds-szalag` | alap | rolunk, hatasunk, csapatunk, en, cegeknek |
| `.ds-szoveg` | alap | rolunk, hatasunk, csapatunk, en, cegeknek |
| `.ds-szovegdoboz` | alap | cegeknek |
| `.ds-szoveglink` | alap | rolunk, hatasunk, csapatunk, en, cegeknek |

## Gomb és chip

Elsődleges és másodlagos gomb, gombsor, chip-címke.

| Osztály | Töréspontok | Oldalak |
|---|---|---|
| `.ds-chip` | alap | rolunk, hatasunk, csapatunk, en, cegeknek |
| `.ds-chipsor` | alap | rolunk, hatasunk, csapatunk, en, cegeknek |
| `.ds-gomb` | alap | rolunk, hatasunk, csapatunk, en, cegeknek |
| `.ds-gombsor` | alap | rolunk, hatasunk, csapatunk, en, cegeknek |
| `.ds-masod` | alap | rolunk, hatasunk, csapatunk, en, cegeknek |

## Kártyák és utak

Ikonos kártya, link-kártya (út), tovább-kártya képpel, ár- és nyílsor.

| Osztály | Töréspontok | Oldalak |
|---|---|---|
| `.ds-kartya` | alap | rolunk, csapatunk, en, cegeknek |
| `.ds-kartya-piko` | alap | rolunk, hatasunk, csapatunk, en, cegeknek |
| `.ds-tovabb` | alap, ≤767 px | rolunk, csapatunk |
| `.ds-tovabb-kartya` | alap | rolunk, csapatunk |
| `.ds-tovabb-kep` | alap | rolunk, csapatunk |
| `.ds-tovabb-nyil` | alap | rolunk, hatasunk, csapatunk, en, cegeknek |
| `.ds-tovabb-test` | alap | rolunk, csapatunk |
| `.ds-ut` | alap | hatasunk, csapatunk, en, cegeknek |
| `.ds-ut-ar` | alap | cegeknek |
| `.ds-ut-kiemelt` | alap | hatasunk, csapatunk, en, cegeknek |
| `.ds-utak` | alap, ≤991 px | hatasunk, en, cegeknek |

## Fotó

Keretes fotó felirattal, hero- és idővonal-arányok.

| Osztály | Töréspontok | Oldalak |
|---|---|---|
| `.ds-foto` | alap | rolunk, csapatunk, en, cegeknek |
| `.ds-foto-felirat` | alap | rolunk, csapatunk, en, cegeknek |
| `.ds-foto-kep` | alap | rolunk, csapatunk, en, cegeknek |
| `.ds-hogyan-foto` | alap | csapatunk |
| `.ds-ido-foto` | alap | rolunk |
| `.ds-ido-fotok` | alap | rolunk |

## Idővonal és lista

Évszámos idővonal, hónap-címkés lista.

| Osztály | Töréspontok | Oldalak |
|---|---|---|
| `.ds-ido` | alap, ≤767 px | rolunk |
| `.ds-ido-elem` | alap, ≤767 px | rolunk, hatasunk, en |
| `.ds-ido-ev` | alap, ≤991 px | rolunk |
| `.ds-ido-ho` | alap | rolunk, hatasunk, en |
| `.ds-ido-lista` | alap | rolunk, hatasunk, en |
| `.ds-ido-szam` | alap | rolunk |
| `.ds-ido-szoveg` | alap | rolunk |

## Számok és grafikon

Számsáv sötét háttéren, méretarányos sávdiagram.

| Osztály | Töréspontok | Oldalak |
|---|---|---|
| `.ds-grafikon` | alap | hatasunk, en |
| `.ds-grafikon-felirat` | alap | hatasunk, en, cegeknek |
| `.ds-sav` | alap | hatasunk, en |
| `.ds-sav-100` | alap | hatasunk, en |
| `.ds-sav-51` | alap | hatasunk, en |
| `.ds-sav-69` | alap | hatasunk, en |
| `.ds-sav-elozo` | alap | hatasunk, en |
| `.ds-sav-ev` | alap | hatasunk, en |
| `.ds-sav-sor` | alap | hatasunk, en |
| `.ds-szam` | alap | rolunk, hatasunk, en, cegeknek |
| `.ds-szam-ertek` | alap, ≤767 px | rolunk, hatasunk, en, cegeknek |
| `.ds-szam-felirat` | alap | rolunk, hatasunk, en, cegeknek |
| `.ds-szamsav` | alap, ≤991 px, ≤479 px | rolunk, hatasunk, en, cegeknek |

## Logók, sajtó, idézet

Logórács, cikk-kártya, értékelés-idézet.

| Osztály | Töréspontok | Oldalak |
|---|---|---|
| `.ds-cikk` | alap | hatasunk |
| `.ds-cikk-forras` | alap | hatasunk |
| `.ds-cikk-logo` | alap | hatasunk |
| `.ds-cikkek` | alap, ≤991 px | hatasunk |
| `.ds-idezet` | alap | hatasunk |
| `.ds-idezet-nev` | alap | hatasunk |
| `.ds-idezet-szoveg` | alap, ≤767 px | hatasunk |
| `.ds-idezetek` | alap, ≤991 px | hatasunk |
| `.ds-logo` | alap, ≤767 px | rolunk, hatasunk, en |
| `.ds-logo-kep` | alap | rolunk, hatasunk, en |
| `.ds-logosor` | alap, ≤991 px, ≤767 px, ≤479 px | rolunk, hatasunk, en |
| `.ds-logosor-sajto` | alap | hatasunk, en |

## Díjak

Helyezés-korong díjsorral.

| Osztály | Töréspontok | Oldalak |
|---|---|---|
| `.ds-dij` | alap | hatasunk |
| `.ds-dij-cim` | alap | hatasunk |
| `.ds-dij-helyezes` | alap | hatasunk |
| `.ds-dij-szoveg` | alap | hatasunk |
| `.ds-dij-test` | alap | hatasunk, csapatunk |
| `.ds-dijak` | alap | hatasunk |

## Emberek és rajok

Portré saját méhecskével, raj-kártya taglistával, tanácsadó, alapítói levél.

| Osztály | Töréspontok | Oldalak |
|---|---|---|
| `.ds-ember` | alap | csapatunk |
| `.ds-ember-foto` | alap | csapatunk |
| `.ds-ember-kepek` | alap | csapatunk |
| `.ds-ember-meh` | alap | csapatunk |
| `.ds-ember-nev` | alap | csapatunk |
| `.ds-ember-szerep` | alap | csapatunk |
| `.ds-emberek` | alap, ≤991 px, ≤767 px | csapatunk |
| `.ds-level` | alap, ≤767 px | csapatunk |
| `.ds-level-alairas` | alap | csapatunk |
| `.ds-level-szoveg` | alap, ≤767 px | csapatunk |
| `.ds-raj` | alap | csapatunk |
| `.ds-raj-kep` | alap | csapatunk |
| `.ds-raj-tag-szerep` | alap | csapatunk |
| `.ds-raj-tagok` | alap | csapatunk |
| `.ds-raj-test` | alap | csapatunk |
| `.ds-rajok` | alap, ≤991 px, ≤767 px | csapatunk |
| `.ds-tanacsado` | alap, ≤767 px | csapatunk |
| `.ds-tanacsado-foto` | alap, ≤767 px | csapatunk |

## Csomagok (B2B)

Belépő / Mag / Partnerség ajánlati létra, kiemelt középső szinttel.

| Osztály | Töréspontok | Oldalak |
|---|---|---|
| `.ds-csomag` | alap | cegeknek |
| `.ds-csomag-ar` | alap | cegeknek |
| `.ds-csomag-elem` | alap | cegeknek |
| `.ds-csomag-kiemelt` | alap, ≤991 px | cegeknek |
| `.ds-csomag-lista` | alap | cegeknek |
| `.ds-csomag-pipa` | alap | cegeknek |
| `.ds-csomagok` | alap, ≤991 px | cegeknek |

## Lépések és eset (B2B)

Számozott folyamat, esettanulmány kihívás–megoldás–eredmény bontásban.

| Osztály | Töréspontok | Oldalak |
|---|---|---|
| `.ds-eset` | alap, ≤991 px | cegeknek |
| `.ds-eset-eredmeny` | alap | cegeknek |
| `.ds-eset-resz` | alap | cegeknek |
| `.ds-lepes` | alap | cegeknek |
| `.ds-lepes-szam` | alap | cegeknek |
| `.ds-lepesek` | alap, ≤991 px, ≤767 px | cegeknek |

## Hatásjelentés (B2B)

Jelentésminta: fej, számrács, mondhatod / kerüld állítás.

| Osztály | Töréspontok | Oldalak |
|---|---|---|
| `.ds-allitas` | alap | cegeknek |
| `.ds-allitas-kerul` | alap | cegeknek |
| `.ds-jelentes` | alap, ≤767 px | cegeknek |
| `.ds-jelentes-ertek` | alap | cegeknek |
| `.ds-jelentes-fej` | alap | cegeknek |
| `.ds-jelentes-szam` | alap | cegeknek |
| `.ds-jelentes-szamok` | alap, ≤767 px | cegeknek |

## Űrlap (B2B)

Natív Webflow-űrlap: mező, címke, bemenet, jelölőnégyzet, visszajelzés.

| Osztály | Töréspontok | Oldalak |
|---|---|---|
| `.ds-bemenet` | alap | cegeknek |
| `.ds-jelolo` | alap | cegeknek |
| `.ds-mezo` | alap | cegeknek |
| `.ds-mezo-teljes` | alap, ≤767 px | cegeknek |
| `.ds-urlap` | alap, ≤767 px | cegeknek |
| `.ds-urlap-doboz` | alap, ≤767 px | cegeknek |
| `.ds-urlap-uzenet` | alap | cegeknek |
