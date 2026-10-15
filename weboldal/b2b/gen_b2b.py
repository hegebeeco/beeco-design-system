"""B2B sales-oldalak (cégeknek és településeknek) natív Webflow-jelölése a whtml-építőhöz.
A Rólunk-generátor (../rolunk/gen_ds.py) közös `ds-` blokkjaira épül; itt csak az új B2B-blokkok vannak:
ds-csomag (Belépő / Mag / Partnerség), ds-lepesek, ds-eset, ds-jelentes (Hatásjelentés-minta), ds-urlap (ajánlatkérés).
A GYIK ds-ketto + ds-kartya, a vevőválasztó ds-utak + ds-ut: nincs új osztály.
Számok csak a szamok.json-ból (N()); a végén gépi ellenőrzés, hogy nincs forrás nélküli szám.
Kimenet: ki/<oldal>.json – sorrendben beszúrandó whtml-akciók (új CSS csak az első használatnál)."""
import os, re, json, sys, io, contextlib

D = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(D, 'ki'); os.makedirs(OUT, exist_ok=True)
sys.path.insert(0, os.path.join(D, '..', 'rolunk'))
with contextlib.redirect_stdout(io.StringIO()):
    import gen_ds as G  # a Rólunk-, Hatás-, Csapat- és /en-oldalak: ezek osztályai már léteznek a Webflow-ban
e, V, T, M, S, X, DISP, EASE, B4, R4, P4 = G.e, G.V, G.T, G.M, G.S, G.X, G.DISP, G.EASE, G.B4, G.R4, G.P4
fej, foto, kartya3, ut, pk = G.fej, G.foto, G.kartya3, G.ut, G.pk

SZAM = json.load(open(os.path.join(D, 'szamok.json')))
def N(k, mezo='ertek'):
    v = SZAM[k][mezo]
    assert v, f'szamok.json: „{k}” értéke hiányzik (döntés kell), nem írható ki'
    return v

LETEZO = set()
for nev in ('A', 'B', 'C', 'E'):
    for a in getattr(G, nev):
        LETEZO |= {c for x in re.findall(r'class="([^"]+)"', a['html']) for c in x.split()}

# ---------------- ÚJ B2B-BLOKKOK ----------------
B2B_CSS = {
 T: {
  '.ds-negy': 'display:grid;grid-template-columns:repeat(4,minmax(0,1fr));column-gap:22px;row-gap:22px',
  '.ds-ut-ar': f'color:{V("bc-accent-ink")};font-size:14px;font-weight:800;line-height:1.3',
  '.ds-csomagok': 'display:grid;grid-template-columns:repeat(3,minmax(0,1fr));column-gap:22px;row-gap:22px;align-items:stretch',
  '.ds-csomag': f'display:flex;flex-direction:column;align-items:flex-start;row-gap:12px;{P4("28px", "26px", "28px", "26px")}{B4("2px", "solid", "#000000")}{R4("18px", "6px")}background-color:{V("bc-surface")};box-shadow:4px 4px 0 0 #000000;color:{V("bc-ink")}',
  '.ds-csomag-kiemelt': f'background-color:{V("bc-accent")};box-shadow:6px 6px 0 0 #000000;transform:translate(0px,-8px)',
  '.ds-csomag-ar': f'font-family:{DISP};font-size:30px;line-height:1.05',
  '.ds-csomag-lista': 'display:flex;flex-direction:column;row-gap:8px;margin-top:4px;margin-bottom:0px;padding-left:0px;list-style-type:none;font-size:16px;line-height:1.5',
  '.ds-csomag-elem': 'display:grid;grid-template-columns:22px minmax(0,1fr);column-gap:6px',
  '.ds-csomag-pipa': 'font-weight:800',
  '.ds-lepesek': 'display:grid;grid-template-columns:repeat(4,minmax(0,1fr));column-gap:22px;row-gap:28px',
  '.ds-lepes': 'display:flex;flex-direction:column;align-items:flex-start;row-gap:10px',
  '.ds-lepes-szam': f'display:flex;align-items:center;justify-content:center;width:52px;height:52px;{R4("999px", "999px")}background-color:#000000;color:{V("bc-accent")};font-family:{DISP};font-size:26px;line-height:1',
  '.ds-eset': f'display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,0.8fr);column-gap:28px;row-gap:24px;{P4("28px", "28px", "28px", "28px")}{B4("2px", "solid", "#000000")}{R4("20px", "6px")}background-color:{V("bc-surface")};box-shadow:6px 6px 0 0 #000000',
  '.ds-eset-resz': 'display:flex;flex-direction:column;row-gap:8px',
  '.ds-eset-eredmeny': f'display:flex;flex-direction:column;row-gap:14px;{P4("22px", "22px", "22px", "22px")}{R4("16px", "5px")}background-color:#000000;color:#ffffff',
  '.ds-jelentes': f'display:flex;flex-direction:column;row-gap:16px;{P4("28px", "28px", "28px", "28px")}{B4("2px", "solid", "#000000")}{R4("18px", "6px")}background-color:{V("bc-paper")};box-shadow:6px 6px 0 0 #000000;transform:rotate(0.6deg)',
  '.ds-jelentes-fej': 'display:flex;flex-direction:column;row-gap:4px;padding-bottom:14px;border-bottom-style:dashed;border-bottom-width:2px;border-bottom-color:#000000',
  '.ds-jelentes-szamok': 'display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:14px;row-gap:14px',
  '.ds-jelentes-szam': f'display:flex;flex-direction:column;row-gap:2px;{P4("12px", "14px", "12px", "14px")}border-left-style:solid;border-left-width:4px;border-left-color:{V("bc-accent")};background-color:{V("bc-surface")}',
  '.ds-jelentes-ertek': f'font-family:{DISP};font-size:32px;line-height:1',
  '.ds-allitas': f'{P4("12px", "14px", "12px", "14px")}{B4("2px", "solid", "#000000")}{R4("12px", "4px")}background-color:{V("bc-surface-2")};font-size:15px;line-height:1.5',
  '.ds-allitas-kerul': f'border-top-style:dashed;border-right-style:dashed;border-bottom-style:dashed;border-left-style:dashed;background-color:{V("bc-surface")};color:{V("bc-ink-soft")}',
  '.ds-urlap-doboz': f'width:100%;max-width:820px;margin-left:auto;margin-right:auto;{P4("32px", "32px", "32px", "32px")}{B4("2px", "solid", "#000000")}{R4("20px", "6px")}background-color:{V("bc-surface")};box-shadow:6px 6px 0 0 #000000;text-align:left',
  '.ds-urlap': 'display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:18px;row-gap:18px',
  '.ds-mezo': 'display:flex;flex-direction:column;row-gap:6px',
  '.ds-mezo-teljes': 'grid-column-start:span 2;grid-column-end:span 2',
  '.ds-cimke': f'margin-bottom:0px;color:{V("bc-ink")};font-size:14px;font-weight:800;line-height:1.3',
  '.ds-bemenet': f'width:100%;min-height:48px;margin-bottom:0px;{P4("12px", "14px", "12px", "14px")}{B4("2px", "solid", "#000000")}{R4("12px", "4px")}background-color:#ffffff;color:{V("bc-ink")};font-size:16px;line-height:1.4',
  '.ds-bemenet:focus': f'border-top-color:#000000;border-right-color:#000000;border-bottom-color:#000000;border-left-color:#000000;box-shadow:0 0 0 3px {V("bc-accent")};outline-style:none',
  '.ds-szovegdoboz': 'min-height:120px',
  '.ds-jelolo': f'display:flex;align-items:flex-start;column-gap:10px;min-height:44px;margin-bottom:0px;padding-left:0px;color:{V("bc-ink-soft")};font-size:14.5px;line-height:1.5',
  # combók: a whtml nem hoz létre combót, ezeket data_style_tool create_style + parent_style_names viszi fel
  '.ds-ut-ar.ds-tinta': f'color:{V("bc-ink")}',  # sárga (kiemelt) kártyán a mézsárga tinta 3,4:1 lenne
  '.ds-grafikon-felirat.ds-tinta': f'color:{V("bc-ink")}',
  '.ds-grafikon-felirat.ds-forras-sotet': f'color:{V("bc-on-olive")}',  # fekete eredménydobozban
  '.ds-urlap-uzenet': f'{P4("18px", "20px", "18px", "20px")}{B4("2px", "solid", "#000000")}{R4("14px", "4px")}background-color:{V("bc-surface-2")};color:{V("bc-ink")};font-size:16px;line-height:1.5',
 },
 M: {
  '.ds-negy': 'grid-template-columns:repeat(2,minmax(0,1fr))',
  '.ds-csomagok': 'grid-template-columns:minmax(0,1fr)',
  '.ds-csomag-kiemelt': 'transform:none',
  '.ds-lepesek': 'grid-template-columns:repeat(2,minmax(0,1fr))',
  '.ds-eset': 'grid-template-columns:minmax(0,1fr)',
 },
 S: {
  '.ds-negy': 'grid-template-columns:minmax(0,1fr)',
  '.ds-lepesek': 'grid-template-columns:minmax(0,1fr)',
  '.ds-urlap': 'grid-template-columns:minmax(0,1fr)',
  '.ds-mezo-teljes': 'grid-column-start:span 1;grid-column-end:span 1',
  '.ds-urlap-doboz': P4('22px', '18px', '22px', '18px'),
  '.ds-jelentes': 'transform:none',
  '.ds-jelentes-szamok': 'grid-template-columns:minmax(0,1fr)',
 },
}

# ---------------- ÉPÍTŐKOCKÁK ----------------
AJ = '#ajanlatkeres'
def gomb(href, szoveg, hely, masod=False):
    return f'<a class="ds-gomb{" ds-masod" if masod else ""}" href="{href}" data-b2b-cta="{hely}">{e(szoveg)}</a>'
def ajanlat(href, piko, cim, szov, ar, nyil, hely, kiem=False):
    return (f'<a class="ds-ut{" ds-ut-kiemelt" if kiem else ""}" href="{href}" data-b2b-cta="{hely}">{pk(piko, "ds-kartya-piko")}<h3 class="ds-cim3">{e(cim)}</h3>'
            f'<p class="ds-szoveg">{e(szov)}</p><div class="ds-ut-ar{" ds-tinta" if kiem else ""}">{e(ar)}</div><div class="ds-tovabb-nyil">{e(nyil)} ›</div></a>')
def csomag(szint, cim, ar, elemek, hely, kiem=False):
    lista = ''.join(f'<li class="ds-csomag-elem"><span class="ds-csomag-pipa">✓</span><span>{e(x)}</span></li>' for x in elemek)
    return (f'<div class="ds-csomag{" ds-csomag-kiemelt" if kiem else ""}"><div class="ds-grafikon-felirat{" ds-tinta" if kiem else ""}">{e(szint)}</div><h3 class="ds-cim3">{e(cim)}</h3>'
            f'<div class="ds-csomag-ar">{e(ar)}</div><ul class="ds-csomag-lista">{lista}</ul>{gomb(AJ, "Ajánlatot kérek", hely, not kiem)}</div>')
def lepesek(items):
    return '<div class="ds-lepesek">' + ''.join(f'<div class="ds-lepes"><div class="ds-lepes-szam">{i}</div><h3 class="ds-cim3">{e(c)}</h3><p class="ds-szoveg">{e(s)}</p></div>'
                                              for i, (c, s) in enumerate(items, 1)) + '</div>'
def gyik(items):
    return '<div class="ds-ketto">' + ''.join(f'<div class="ds-kartya"><h3 class="ds-cim3">{e(q)}</h3><p class="ds-szoveg">{a}</p></div>' for q, a in items) + '</div>'
def jelentes_minta():
    sz = [('12 400', 'liter víz a fiatal fáknak'), ('42', 'megöntözött fa, a térképen ellenőrizhető'), ('38', 'résztvevő munkatárs'), ('114', 'önkéntes óra')]
    return ('<div class="ds-jelentes"><div class="ds-jelentes-fej"><div class="ds-grafikon-felirat">Hatásjelentés · Minta</div>'
            '<h3 class="ds-cim3">Locsolóraj 2026 · Minta Példa Kft.</h3><p class="ds-szoveg">3 locsolónap, Budapest</p></div>'
            '<div class="ds-jelentes-szamok">' + ''.join(f'<div class="ds-jelentes-szam"><div class="ds-jelentes-ertek">{a}</div><div class="ds-szoveg">{e(b)}</div></div>' for a, b in sz) + '</div>'
            '<p class="ds-szoveg"><strong>Módszer:</strong> öntözések az appban rögzítve, fotóval; a fák a FŐKERT fakataszteréből. Kapcsolódás: SDG 11, 13, 15; VSME: munkavállalói önkéntesség, helyi közösség.</p>'
            '<p class="ds-allitas"><strong>Mondhatod:</strong> „Munkatársaink 2026 nyarán 12 400 liter vizet adtak 42 fiatal fának Budapesten.”</p>'
            '<p class="ds-allitas ds-allitas-kerul"><strong>Kerüld:</strong> „Környezetbarát cég vagyunk.” Általános, nem igazolt állítás.</p>'
            '<p class="ds-forras">A számok mintaadatok, nem valódi ügyfél eredményei.</p></div>')
def urlap(forras):
    opt = lambda l: ''.join(f'<option value="{e(x)}">{e(x)}</option>' for x in l)
    mezo = lambda cimke, mid, belso, teljes=False: f'<div class="ds-mezo{" ds-mezo-teljes" if teljes else ""}"><label class="ds-cimke" for="{mid}">{cimke}</label>{belso}</div>'
    sel = lambda mid, nev, l, elso: f'<select class="ds-bemenet" id="{mid}" name="{nev}" required><option value="">{e(elso)}</option>{opt(l)}</select>'
    return ('<div class="ds-urlap-doboz w-form"><form id="ajanlatkeres-urlap" name="ajanlatkeres" data-name="Ajánlatkérés" method="get" class="ds-urlap">'
      + mezo('Neved *', 'ak-nev', '<input class="ds-bemenet" type="text" id="ak-nev" name="nev" autocomplete="name" required>')
      + mezo('Cég vagy település *', 'ak-ceg', '<input class="ds-bemenet" type="text" id="ak-ceg" name="ceg" autocomplete="organization" required>')
      + mezo('E-mail-címed *', 'ak-email', '<input class="ds-bemenet" type="email" id="ak-email" name="email" autocomplete="email" required>')
      + mezo('Telefonszám', 'ak-tel', '<input class="ds-bemenet" type="tel" id="ak-tel" name="telefon" autocomplete="tel">')
      + mezo('Mi érdekel? *', 'ak-termek', sel('ak-termek', 'termek', ['Települési csomag', 'beeco@work', 'Locsolóraj', 'Madárraj', 'Zöld programok', 'Partnerprogram', 'Zöld marketing', 'Még nem tudom'], 'Válassz'))
      + mezo('Hány embert érint? *', 'ak-letszam', sel('ak-letszam', 'letszam', ['1–20 fő', '21–100 fő', '101–500 fő', '500 fő felett', 'Település, lakosság'], 'Válassz'))
      + mezo('Mikor indulnál? *', 'ak-ido', sel('ak-ido', 'idopont', ['3 hónapon belül', 'Idén', 'Jövőre', 'Csak tájékozódom'], 'Válassz'))
      + mezo('Tervezett keret', 'ak-keret', '<select class="ds-bemenet" id="ak-keret" name="keret"><option value="">Válassz</option>' + opt(['300 ezer Ft alatt', '300 ezer és 1 millió Ft között', '1–3 millió Ft', '3 millió Ft felett', 'Még nem tudom']) + '</select>')
      + mezo('Miben segíthetünk?', 'ak-uzenet', '<textarea class="ds-bemenet ds-szovegdoboz" id="ak-uzenet" name="uzenet" maxlength="2000"></textarea>', True)
      + f'<input type="hidden" name="forras" value="{e(forras)}">'
      + '<div class="ds-mezo ds-mezo-teljes"><label class="ds-jelolo w-checkbox"><input class="w-checkbox-input" type="checkbox" id="ak-hirlevel" name="b2b_hirlevel"><span>Kérem a negyedéves B2B hírlevelet eredményekkel és új ajánlatokkal.</span></label>'
      + '<p class="ds-forras">Az adataidat csak az ajánlatkéréshez használjuk. <a class="ds-szoveglink" href="/privacy-policy">Adatkezelési tájékoztató ›</a></p></div>'
      + '<div class="ds-mezo ds-mezo-teljes"><input class="ds-gomb" type="submit" value="Ajánlatot kérek" data-wait="Küldés…" data-b2b-cta="urlap"></div>'
      + '</form><div class="ds-urlap-uzenet w-form-done"><strong>Köszönjük!</strong> Megkaptuk az ajánlatkérésed, hamarosan jelentkezünk.</div>'
      '<div class="ds-urlap-uzenet w-form-fail">Valami hiba történt a küldéskor. Próbáld újra, vagy írj a hello@beeco.hu címre.</div></div>')

def osszeallit(szekciok):
    return G.osszeallit(szekciok, G.KOZOS, G.A_CSS, G.C_CSS, G.B_CSS, B2B_CSS, kesz0=LETEZO)

# ---------------- HUB · Cégeknek és településeknek ----------------
SZ = '/szolgaltatas/'
H_HERO = ('<section class="ds-szekcio ds-hatter-vaj" id="kezdes"><div class="ds-burok ds-hero-racs"><div class="ds-hero-szoveg">'
  '<div class="ds-szalag">Cégeknek és településeknek</div>'
  '<h1 class="ds-cim1">Ne csak állítsd. <span class="ds-kiemel">Tedd, mérd,</span> mutasd meg.</h1>'
  '<p class="ds-lead">A beeco valódi zöld tetteket ad a munkatársaidnak, lakóidnak és vásárlóidnak, megméri őket, és kész, igazolható mondatokat ad a kommunikációdhoz.</p>'
  '<div class="ds-gombsor">' + gomb(AJ, 'Ajánlatot kérek', 'hero') + gomb('#melyik', 'Melyik vagy?', 'hero-valaszto', True) + '</div>'
  f'<div class="ds-chipsor"><div class="ds-chip">{N("onkormanyzat")} {N("onkormanyzat", "felirat")}</div><div class="ds-chip">{N("vizadas_liter")} liter víz 2026-ban</div><div class="ds-chip">ONE Digitális Díj 2025: 1. hely</div></div>'
  '</div>' + foto('fresk', 'Tízfős csapat egy nagy asztal körül, rajta Klímafreskó-kártyák', 'Klímafreskó egy csapattal', ' ds-hero-foto') +
  '</div></section>')
H_MIERT = ('<section class="ds-szekcio ds-hatter-feher" id="miert"><div class="ds-burok">'
  + fej('Miért most', 'A szabályozás a valódi tettek mellé állt')
  + '<div class="ds-ketto">'
  '<div class="ds-kartya"><h3 class="ds-cim3">Tilos az üres zöld állítás</h3><p class="ds-szoveg">2026. szeptember 27. óta az EU-ban tilos az általános, nem igazolt környezeti állítás („környezetbarát cég”, „zöld márka”), és a kompenzációra (offset) épülő állítás is. Konkrét, mért tett kell: liter, fa, odú, résztvevő, óra.</p>'
  '<p class="ds-forras"><a class="ds-szoveglink" href="https://eur-lex.europa.eu/legal-content/HU/TXT/?uri=CELEX:32024L0825" target="_blank" rel="noopener">2024/825/EU irányelv ›</a></p></div>'
  '<div class="ds-kartya"><h3 class="ds-cim3">A riportálás egyszerűbb lett, nem szűnt meg</h3><p class="ds-szoveg">Az Omnibus I után a CSRD az 1000 fő és 450 millió euró árbevétel feletti cégekre kötelező. A többiek önkéntesen, az egyszerűbb VSME szerint riportálnak, ehhez egyszerű, hiteles munkavállalói és közösségi adat kell.</p>'
  '<p class="ds-forras"><a class="ds-szoveglink" href="https://www.aoshearman.com/en/insights/agreement-on-the-csrd-cs3d-omnibus-package-key-changes-and-implications" target="_blank" rel="noopener">A&amp;O Shearman: CSRD Omnibus ›</a></p></div>'
  '</div></div></section>')
H_PILLER = ('<section class="ds-szekcio"><div class="ds-burok">'
  + fej('Így működik', 'Bevonunk. Mérünk. Megmutatjuk.', 'Minden ajánlatunk ugyanerre a három lépésre épül.')
  + kartya3([('raj', 'Bevonunk', 'Emberek cselekednek, játékosan: locsolnak, odút építenek, kihívást teljesítenek az appban, nektárt gyűjtenek.'),
             ('kupa', 'Mérünk', 'Minden fizetős csomaghoz Hatásjelentés jár: mért adatok, forrás és módszer, SDG- és VSME-kapcsolat.'),
             ('sziv', 'Megmutatjuk', 'Kampány, sajtó, megjelenés az appban, és kész, jogszerű mondatok, amiket bátran használhatsz.')])
  + '</div></section>')
H_MELYIK = ('<section class="ds-szekcio ds-hatter-zold" id="melyik"><div class="ds-burok">'
  + fej('Melyik vagy?', 'Mondd el, mi a célod, és megmutatjuk az utat')
  + '<div class="ds-utak">'
  + ut(SZ + 'zold-esemeny-szervezes', 'raj', 'HR és csapatépítés', 'Értelmes közös program kell, amiről utána mindenki büszkén mesél.', 'Zöld programok')
  + ut(SZ + 'beeco-at-work', 'kupa', 'ESG és fenntarthatóság', 'Mért, forrásolt adat kell a jelentésbe, greenwashing-kockázat nélkül.', 'beeco@work')
  + ut(SZ + 'zold-marketing', 'otlet', 'Marketing és márka', 'Hiteles zöld üzenet kell, igazolt állításokra építve.', 'Zöld marketing')
  + ut(SZ + 'partner', 'taska', 'Zöld bolt, termelő, KKV', 'Új, tudatos vásárlók kellenek a zöld térképről, kuponnal.', 'Partnerprogram')
  + ut(SZ + 'onkormanyzatoknak', 'telepules', 'Önkormányzat', 'Fiatal fák, madárbarát kertek, mozgósított lakók, évente számokkal.', 'Települési csomag')
  + ut(AJ, 'posta', 'Még nem tudod?', 'Írd meg, mit szeretnél elérni, és összerakjuk a neked való csomagot.', 'Ajánlatot kérek', True)
  + '</div></div></section>')
H_MELYIK = H_MELYIK.replace('<a class="ds-ut', '<a data-b2b-cta="valaszto" class="ds-ut')
H_AJANLAT = ('<section class="ds-szekcio ds-hatter-feher" id="ajanlatok"><div class="ds-burok">'
  + fej('Ajánlataink', 'Hét ajánlat, egy közös mérce', 'Mindegyikhez Hatásjelentés jár, és mindegyik három szinten kérhető: belépő, mag és partnerség.')
  + '<div class="ds-negy">'
  + ajanlat(SZ + 'onkormanyzatoknak', 'telepules', 'Önkormányzatoknak', 'Vízadás, CsicsergŐsz, helyi zöld térkép és lakossági programok, éves jelentéssel.', 'Csatlakozás a Vízadáshoz: ingyenes', 'Települési csomag', 'ajanlat-onkormanyzat')
  + ajanlat(SZ + 'beeco-at-work', 'telefon', 'beeco@work', 'A csapatod az appban: zöld kihívások, közös lábnyom, nektárverseny, havi Hatásjelentés.', 'Kérj ajánlatot', 'Megnézem', 'ajanlat-work')
  + ajanlat(SZ + 'locsoloraj', 'kanna', 'Locsolóraj', 'Céges locsolónap az Önkéntes Vízadásban, fiatal fákért. Júniustól szeptemberig.', 'Kérj ajánlatot', 'Megnézem', 'ajanlat-locsolo')
  + ajanlat(SZ + 'madarraj', 'madarpont', 'Madárraj', 'Odú- és etetőkészítés, madárséta az MME szakmai segítségével. Októbertől márciusig.', 'Kérj ajánlatot', 'Megnézem', 'ajanlat-madar')
  + ajanlat(SZ + 'zold-esemeny-szervezes', 'naptar', 'Zöld programok', 'Klímafreskó, kvíz, ÖkoMuki, DIY műhely, előadás a csapatodnak.', N('ar_zold_program'), 'Megnézem', 'ajanlat-program')
  + ajanlat(SZ + 'partner', 'taska', 'Partnerprogram', 'Kerülj fel a zöld térképre, és kuponnal hozd be a tudatos vásárlókat.', 'Alapcsomag: kérj ajánlatot', 'Megnézem', 'ajanlat-partner')
  + ajanlat(SZ + 'zold-marketing', 'otlet', 'Zöld marketing', 'Kampány, tartalom és videó, kizárólag igazolt állításokra építve.', 'Kérj ajánlatot', 'Megnézem', 'ajanlat-marketing')
  + ajanlat(AJ, 'raj', 'Egyedi csomag', 'Több ajánlatot kombinálnál, vagy egész évre terveznél? Összerakjuk veled.', 'Közös tervezés', 'Ajánlatot kérek', 'ajanlat-egyedi', True)
  + '</div></div></section>')
H_LETRA = ('<section class="ds-szekcio"><div class="ds-burok">'
  + fej('Ajánlati létra', 'Kezdd kicsiben, építkezz együtt velünk', 'Az első lépés kis kockázat és gyors döntés. Ha működik, rendszeressé tesszük, majd névadó partnerséggé.')
  + '<div class="ds-csomagok">'
  + csomag('Belépő', 'Egy program, egy próba', N('ar_zold_program'), ['Egy zöld program vagy locsolónap', 'Mi szervezünk mindent', 'Hatásjelentés a végén'], 'letra-belepo')
  + csomag('Mag', 'Rendszeres együttműködés', 'Kérj ajánlatot', ['Éves előfizetés vagy szezon', 'Havi vagy szezonzáró Hatásjelentés', 'Kész mondatok a kommunikációhoz'], 'letra-mag', True)
  + csomag('Partnerség', 'Névadó partner', 'Kérj ajánlatot', ['Saját kampány a nevedhez kötve', 'Megjelenés az appban és a sajtóban', 'Éves közös tervezés'], 'letra-partner')
  + '</div><p class="ds-megjegyzes"><strong>Önkormányzatoknak:</strong> a csatlakozás az Önkéntes Vízadáshoz ingyenes, ez a belépő szint.</p>'
  + '</div></section>')
H_LEPES = ('<section class="ds-szekcio ds-hatter-zold"><div class="ds-burok">'
  + fej('Hogyan dolgozunk', 'Négy lépés az ajánlatkéréstől a jelentésig')
  + lepesek([('Írj nekünk', 'Töltsd ki az ajánlatkérőt, és visszahívunk, hogy megismerjük a célod.'),
             ('Megtervezzük', 'Közösen kiválasztjuk a programot, az időpontot és a mérőszámokat.'),
             ('Megcsináljuk', 'Mi szervezünk, a csapatod vagy a lakóid cselekednek, az appban rögzítve.'),
             ('Megkapod a jelentést', 'Számok, forrás, módszer és kész mondatok a kommunikációdhoz.')])
  + '</div></section>')
H_JELENTES = ('<section class="ds-szekcio ds-hatter-feher" id="hatasjelentes"><div class="ds-burok ds-ketto"><div class="ds-hero-szoveg">'
  '<div class="ds-szalag">Hatásjelentés</div><h2 class="ds-cim2">Minden fizetős csomaghoz jár</h2>'
  '<p class="ds-lead">Egységes sablon, csomagonként más adattal, PDF-ben és linken. Ebből látod, mit értetek el, és azt is, mit mondhatsz róla.</p>'
  '<ul class="ds-csomag-lista">' + ''.join(f'<li class="ds-csomag-elem"><span class="ds-csomag-pipa">✓</span><span>{e(x)}</span></li>' for x in [
      'Mért adatok: résztvevők, órák, liter, fa, odú, kihívás', 'Forrás és módszer minden számhoz', 'Kapcsolódás az SDG-khez és a VSME-adatpontokhoz',
      'Kész mondatok, amiket jogszerűen használhatsz', 'Lábnyom-változás csak becsültként, a kalkulátor módszertanával']) + '</ul>'
  '<p class="ds-szoveg">Adatot adunk a jelentésedhez. Megfelelést nem ígérünk, azt a riportod adja.</p></div>'
  + jelentes_minta() + '</div></section>')
H_SZAM = ('<section class="ds-szekcio ds-hatter-sotet"><div class="ds-burok">'
  + '<div class="ds-szekcio-fej"><div class="ds-szalag">Bizonyíték</div><h2 class="ds-cim2">Amit eddig közösen elértünk</h2></div>'
  + '<div class="ds-szamsav">' + ''.join(f'<div class="ds-szam"><div class="ds-szam-ertek">{e(N(k))}</div><div class="ds-szam-felirat">{e(N(k, "felirat"))}</div></div>'
                                     for k in ('onkormanyzat', 'vizadas_liter', 'vizadas_fo', 'esemeny_resztvevo', 'klimafresko_fo', 'letoltes')) + '</div>'
  + '<p class="ds-forras ds-forras-sotet">Források: beeco kampányzárás (Vízadás 2026), beeco belső adatok, App Store és Google Play adatlap, 2026. október.</p>'
  + '</div></section>')
H_ESET = ('<section class="ds-szekcio"><div class="ds-burok">'
  + fej('Esettanulmány', 'Önkéntes Vízadás: egy város, egy nyár, sok kanna')
  + '<div class="ds-eset">'
  '<div class="ds-eset-resz"><div class="ds-grafikon-felirat">Kihívás</div><p class="ds-szoveg">Aszályos nyarak, kiszáradó fiatal fák, és kevés eszköz arra, hogy a lakók bekapcsolódjanak.</p></div>'
  '<div class="ds-eset-resz"><div class="ds-grafikon-felirat">Megoldás</div><p class="ds-szoveg">A beeco appban a lakók a térképen találják meg a szomjas fákat, rögzítik az öntözést, és nektárt gyűjtenek érte. Partnereink a FŐKERT és a 10 millió Fa.</p>'
  '<a class="ds-szoveglink" href="https://telex.hu/belfold/2025/09/21/aszaly-onkentes-vizadas-locsolakoma-fokert-beeco-10-millio-fa-eredmenyek" target="_blank" rel="noopener">Telex: az első év eredményei ›</a></div>'
  f'<div class="ds-eset-eredmeny"><div class="ds-grafikon-felirat ds-forras-sotet">Eredmény, 2026</div>'
  f'<div><div class="ds-szam-ertek">{N("vizadas_liter")}</div><div class="ds-szam-felirat">liter víz</div></div>'
  f'<div><div class="ds-szam-ertek">{N("vizadas_fo")}</div><div class="ds-szam-felirat">vízadó, {N("onkormanyzat")} településen</div></div></div>'
  '</div></div></section>')
H_GYIK = ('<section class="ds-szekcio ds-hatter-feher" id="gyik"><div class="ds-burok">'
  + fej('Gyakori kérdések', 'Mielőtt ajánlatot kérsz')
  + gyik([('Mennyibe kerül?', f'Minden ajánlat három szinten kérhető. A zöld programok {e(N("ar_zold_program"))} indulnak, önkormányzatoknak a Vízadás-csatlakozás ingyenes. A pontos árat a létszám és az időszak alapján adjuk meg.'),
          ('Mennyi időt kér a csapattól?', 'Egy program jellemzően fél nap. Mi szervezünk mindent, a Hatásjelentést is mi írjuk.'),
          ('Megfelel ez a CSRD-nek?', 'Adatot ad a jelentésedhez, például a VSME munkavállalói és közösségi témáihoz, módszertannal és forrással. Megfelelést nem ígérünk, azt a riportod adja.'),
          ('Mit mondhatunk utána a kommunikációban?', 'Csak mért, forrásolt állítást. A Hatásjelentésben kész mondatokat kapsz, és azt is leírjuk, mit kerülj.'),
          ('Hogyan mérik az eredményt?', 'A tevékenységeket az appban rögzítjük, fotóval. A fák adatai a FŐKERT fakataszteréből jönnek. Lábnyom-változást csak becsültként, a kalkulátor módszertana szerint közlünk.'),
          ('Mi történik a munkatársak adataival?', 'A jelentésben csak összesített adat szerepel, név szerinti adat nem. Részletek az <a class="ds-szoveglink" href="/privacy-policy">adatkezelési tájékoztatóban ›</a>')])
  + '</div></section>')
H_URLAP = ('<section class="ds-szekcio ds-hatter-vaj" id="ajanlatkeres"><div class="ds-burok ds-zaro">'
  '<div class="ds-szalag">Ajánlatkérés</div><h2 class="ds-cim2">Kérj ajánlatot, és indítsuk el a rajt</h2>'
  '<p class="ds-lead ds-zaro-lead">Pár kérdés, hogy rögtön a neked való csomaggal keressünk. A csillagos mezők kötelezők.</p>'
  + urlap('cegeknek-hub') + '</div></section>')

HUB = [('h-hero', H_HERO), ('h-miert', H_MIERT), ('h-piller', H_PILLER), ('h-melyik', H_MELYIK), ('h-ajanlat', H_AJANLAT), ('h-letra', H_LETRA),
       ('h-lepes', H_LEPES), ('h-jelentes', H_JELENTES), ('h-szam', H_SZAM), ('h-eset', H_ESET), ('h-gyik', H_GYIK), ('h-urlap', H_URLAP)]
# a „Szakmai partnerek” a h-eset után a meglévő DS · Szakmai partnerek komponens példánya (nem generált HTML)

# ---------------- ELLENŐRZÉS ----------------
def ellenoriz(nev, szekciok):
    ki = osszeallit(szekciok)
    json.dump(ki, open(os.path.join(OUT, nev + '.json'), 'w'), ensure_ascii=False, indent=1)
    h = ''.join(a['html'] for a in ki)
    hasz = {c for x in re.findall(r'class="([^"]+)"', h) for c in x.split() if c.startswith('ds-')}
    defi = set(re.findall(r'\.(ds-[a-z0-9-]+)', ''.join(a['css'] for a in ki)))
    combo = {k.split('.')[2].split(':')[0] for m in B2B_CSS.values() for k in m if k.count('.') == 2}  # data_style_tool-lal felvitt combók
    hiany = sorted(hasz - defi - LETEZO - combo)
    uj = sorted(defi - LETEZO)
    # számellenőrzés: minden szám a szamok.json-ból, évszám, SDG, mintaadat vagy űrlap-sáv lehet
    szoveg = re.sub(r'<[^>]+>', ' ', re.sub(r'href="[^"]*"|src="[^"]*"|value="[^"]*"', '', h))
    ismert = {v['ertek'] for k, v in SZAM.items() if not k.startswith('_') and v['ertek']}
    minta = {'12 400', '42', '38', '114', '11', '13', '15', '3', '1', '2', '4', '1000', '450', '27', '2024/825', '1–20', '21–100', '101–500', '500', '300', '1–3', '2000', '10', '11, 13, 15'}
    talalt = re.findall(r'\d[\d .,–/]*\d\+?|\d\+?', szoveg)
    gyanus = sorted({t.strip() for t in talalt if t.strip() not in ismert and t.strip() not in minta and not re.fullmatch(r'20\d\d', t.strip()) and not any(t.strip() in v for v in ismert)})
    tiltott = [w for w in ('—', ' – ', 'környezetbarát cég vagyunk', 'CO₂-semleges', 'karbonsemleges') if w in szoveg and w not in ('környezetbarát cég vagyunk',)]
    print(f'{nev}: {len(ki)} akció, új osztály: {len(uj)} {uj}\n  CSS nélküli: {hiany}\n  ellenőrizendő szám: {gyanus}\n  tiltott minta: {tiltott}')
    return ki

if __name__ == '__main__':
    ellenoriz('hub', HUB)
