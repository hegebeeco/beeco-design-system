"""Natív Webflow-navbar (menu-) és -lábléc (lablec-) jelölése a whtml-építőhöz.
Csak Webflow által kezelt CSS: osztályok, :hover/:focus/:active, töréspontok (991/767/479).
Kimenet: natív/*.json – egy-egy whtml-akció (html + css), sorrendben beszúrandó."""
import os, json, html as H
from gen import CSOP, S3, PIKO, LOGO, LOGO_LAB, BEELA, ZOLDMIN, SOC  # egy forrás a tartalomhoz

D = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(D, 'nativ'); os.makedirs(OUT, exist_ok=True)
e = lambda s: H.escape(s, quote=True)
pk = lambda n, c: f'<img class="{c}" src="{S3}{PIKO[n]}_fs-piko-{n}.svg" alt="" loading="lazy">'
T, M, S, X = '', '@media screen and (max-width: 991px)', '@media screen and (max-width: 767px)', '@media screen and (max-width: 479px)'
DISP, SZOV = 'Lalezar, "Arial Black", sans-serif', '"Open Sans", sans-serif'
EASE = 'cubic-bezier(.23,1,.32,1)'

def css(szabalyok):
    """szabalyok: {media: {szelektor: 'tul:ert;...'}} -> CSS szöveg"""
    ki = []
    for m, sz in szabalyok.items():
        blokk = ''.join(f'{k}{{{v}}}' for k, v in sz.items())
        ki.append(f'{m}{{{blokk}}}' if m else blokk)
    return ''.join(ki)

# ---------------- NAVBAR ----------------
NAV_CSS = {
 T: {
  '.menu-sav': 'position:relative;display:flex;align-items:center;column-gap:14px;width:100%;max-width:1320px;margin-left:auto;margin-right:auto;padding-top:10px;padding-right:24px;padding-bottom:10px;padding-left:24px;min-height:72px',
  '.menu-logo': 'display:flex;align-items:center;flex-grow:0;flex-shrink:0;min-height:44px',
  '.menu-logo-kep': 'height:34px;width:auto',
  '.menu-most': f'display:flex;align-items:center;justify-content:center;column-gap:6px;min-height:44px;min-width:44px;padding-top:6px;padding-right:6px;padding-bottom:6px;padding-left:6px;border-top-left-radius:999px;border-top-right-radius:999px;border-bottom-left-radius:999px;border-bottom-right-radius:999px;background-color:#000000;color:#ffffff;font-family:{SZOV};font-size:12.5px;font-weight:800;letter-spacing:.02em;white-space:nowrap;text-decoration:none;transition:transform 160ms {EASE}',
  '.menu-most:hover': 'color:#ffffff;text-decoration:none;transform:translate(0px,-2px)',
  '.menu-most-piko': 'width:24px;height:24px',
  '.menu-most-szoveg': 'display:none',
  '.menu-most-cimke': 'color:#FECF39',
  '.menu-vissza': 'display:none;align-items:center;min-height:44px;margin-left:auto;padding-top:10px;padding-right:6px;padding-bottom:10px;padding-left:6px;color:#000000;font-size:14px;font-weight:700;text-decoration:none',
  '.menu-vissza:hover': 'color:#000000;text-decoration:underline',
  '.menu-mobil': 'position:static;margin-left:auto;margin-right:0px',
  '.menu-hamb': 'display:none;align-items:center;column-gap:8px;min-height:44px;padding-top:8px;padding-right:12px;padding-bottom:8px;padding-left:12px;border-top-style:solid;border-right-style:solid;border-bottom-style:solid;border-left-style:solid;border-top-width:2px;border-right-width:2px;border-bottom-width:2px;border-left-width:2px;border-top-color:#000000;border-right-color:#000000;border-bottom-color:#000000;border-left-color:#000000;border-top-left-radius:12px;border-top-right-radius:3px;border-bottom-right-radius:12px;border-bottom-left-radius:3px;background-color:#ffffff;box-shadow:2px 2px 0 0 #000000;color:#000000;font-size:14px;font-weight:800',
  '.menu-hamb-ikon': 'position:static;font-size:18px;line-height:18px',
  '.menu-lista': 'position:static;display:flex;align-items:center;column-gap:2px;min-width:0px;background-color:transparent',
  '.menu-csoport': 'position:static;margin-left:0px;margin-right:0px',
  '.menu-gomb': f'display:flex;align-items:center;column-gap:6px;min-height:44px;padding-top:11px;padding-right:9px;padding-bottom:8px;padding-left:9px;border-top-left-radius:999px;border-top-right-radius:999px;border-bottom-left-radius:999px;border-bottom-right-radius:999px;color:#000000;font-family:{DISP};font-size:17px;line-height:1;white-space:nowrap;transition:background-color 160ms {EASE}',
  '.menu-gomb:hover': 'background-color:#FEEEBB;color:#000000',
  '.menu-gomb-piko': 'display:none;width:30px;height:30px',
  '.menu-nyil': 'position:static;width:12px;height:12px;margin-top:-3px;margin-right:0px;margin-bottom:0px;margin-left:0px;font-size:12px;line-height:12px',
  '.menu-panel': 'position:absolute;left:16px;right:16px;top:100%;z-index:1000;padding-top:18px;padding-right:18px;padding-bottom:18px;padding-left:18px;border-top-style:solid;border-right-style:solid;border-bottom-style:solid;border-left-style:solid;border-top-width:0px;border-right-width:2px;border-bottom-width:2px;border-left-width:2px;border-top-color:#000000;border-right-color:#000000;border-bottom-color:#000000;border-left-color:#000000;border-bottom-left-radius:16px;border-bottom-right-radius:16px;background-color:#FFFDF6;box-shadow:5px 5px 0 0 #000000',
  '.menu-panel-racs': 'display:grid;grid-template-columns:minmax(0,1fr) 250px;column-gap:16px;row-gap:16px',
  '.menu-csempek': 'display:grid;grid-template-columns:1fr 1fr 1fr;column-gap:6px;row-gap:6px;align-content:start',
  '.menu-csempe': f'display:flex;align-items:center;column-gap:10px;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;border-top-style:solid;border-right-style:solid;border-bottom-style:solid;border-left-style:solid;border-top-width:2px;border-right-width:2px;border-bottom-width:2px;border-left-width:2px;border-top-color:transparent;border-right-color:transparent;border-bottom-color:transparent;border-left-color:transparent;border-top-left-radius:12px;border-top-right-radius:3px;border-bottom-right-radius:12px;border-bottom-left-radius:3px;color:#000000;text-decoration:none;transition:transform 160ms {EASE}, box-shadow 160ms {EASE}, background-color 160ms {EASE}',
  '.menu-csempe:hover': 'background-color:#ffffff;border-top-color:#000000;border-right-color:#000000;border-bottom-color:#000000;border-left-color:#000000;box-shadow:3px 3px 0 0 #000000;transform:translate(-1px,-2px);color:#000000;text-decoration:none',
  '.menu-csempe-piko': 'width:44px;height:44px;flex-grow:0;flex-shrink:0',
  '.menu-csempe-szoveg': 'display:flex;flex-direction:column;row-gap:2px',
  '.menu-csempe-cim': f'padding-top:4px;font-family:{DISP};font-size:18px;line-height:1.05',
  '.menu-csempe-al': 'color:#4F5640;font-size:13px;font-weight:400;line-height:1.3',
  '.menu-kiemel': 'display:flex;flex-direction:column;align-items:flex-start;row-gap:8px;padding-top:16px;padding-right:16px;padding-bottom:16px;padding-left:16px;border-top-left-radius:14px;border-top-right-radius:4px;border-bottom-right-radius:14px;border-bottom-left-radius:4px;background-color:#000000;color:#ffffff',
  '.menu-kiemel-szalag': f'padding-top:6px;padding-right:10px;padding-bottom:3px;padding-left:10px;background-color:#FECF39;color:#000000;font-family:{DISP};font-size:14px;line-height:1;transform:rotate(-2deg)',
  '.menu-kiemel-cim': f'font-family:{DISP};font-size:24px;line-height:1.05',
  '.menu-kiemel-szoveg': 'margin-top:0px;margin-bottom:0px;color:#E9E2CF;font-size:14px;line-height:1.45',
  '.menu-kiemel-link': 'padding-top:6px;padding-bottom:6px;color:#FECF39;font-size:14px;font-weight:800;text-decoration:underline',
  '.menu-kiemel-link:hover': 'color:#FECF39;text-decoration:underline',
  '.menu-bolt': f'display:flex;align-items:center;column-gap:6px;min-height:44px;margin-left:6px;padding-top:6px;padding-right:6px;padding-bottom:6px;padding-left:6px;border-top-left-radius:12px;border-top-right-radius:3px;border-bottom-right-radius:12px;border-bottom-left-radius:3px;background-color:#000000;box-shadow:3px 3px 0 0 #FECF39;color:#ffffff;font-family:{DISP};font-size:17px;line-height:1;text-decoration:none;transform:rotate(-1.5deg);transition:transform 160ms {EASE}',
  '.menu-bolt:hover': 'color:#ffffff;text-decoration:none;transform:translate(0px,-2px)',
  '.menu-bolt-piko': 'width:28px;height:28px',
  '.menu-bolt-szo': 'display:none',
  '.menu-cta': f'flex-grow:0;flex-shrink:0;min-height:44px;padding-top:12px;padding-right:16px;padding-bottom:9px;padding-left:16px;border-top-style:solid;border-right-style:solid;border-bottom-style:solid;border-left-style:solid;border-top-width:2px;border-right-width:2px;border-bottom-width:2px;border-left-width:2px;border-top-color:#000000;border-right-color:#000000;border-bottom-color:#000000;border-left-color:#000000;border-top-left-radius:12px;border-top-right-radius:3px;border-bottom-right-radius:12px;border-bottom-left-radius:3px;background-color:#FECF39;box-shadow:3px 3px 0 0 #000000;color:#000000;font-family:{DISP};font-size:19px;line-height:1;white-space:nowrap;text-decoration:none;transition:transform 160ms {EASE}, box-shadow 160ms {EASE}',
  '.menu-cta:hover': 'color:#000000;text-decoration:none;transform:translate(-1px,-2px);box-shadow:4px 5px 0 0 #000000',
  '.menu-cta:active': 'transform:translate(2px,2px);box-shadow:1px 1px 0 0 #000000',
 },
 M: {
  '.menu-sav': 'column-gap:10px;padding-top:8px;padding-right:16px;padding-bottom:8px;padding-left:16px;min-height:64px',
  '.menu-logo-kep': 'height:30px',
  '.menu-most': 'padding-right:12px',
  '.menu-most-szoveg': 'display:block',
  '.menu-hamb': 'display:flex',
  '.menu-cta': 'padding-top:10px;padding-right:12px;padding-bottom:7px;padding-left:12px;font-size:16px',
  '.menu-lista': 'display:none;position:absolute;left:0px;right:0px;top:100%;max-height:calc(100vh - 64px);overflow:auto;padding-top:10px;padding-right:16px;padding-bottom:16px;padding-left:16px;border-bottom-style:solid;border-bottom-width:2px;border-bottom-color:#000000;background-color:#FFFDF6',
  '.menu-csoport': 'display:block;width:100%;margin-bottom:8px;border-top-style:solid;border-right-style:solid;border-bottom-style:solid;border-left-style:solid;border-top-width:2px;border-right-width:2px;border-bottom-width:2px;border-left-width:2px;border-top-color:#000000;border-right-color:#000000;border-bottom-color:#000000;border-left-color:#000000;border-top-left-radius:12px;border-top-right-radius:3px;border-bottom-right-radius:12px;border-bottom-left-radius:3px;background-color:#ffffff;overflow:hidden',
  '.menu-gomb': 'width:100%;column-gap:10px;min-height:52px;padding-top:10px;padding-right:12px;padding-bottom:10px;padding-left:12px;border-top-left-radius:0px;border-top-right-radius:0px;border-bottom-left-radius:0px;border-bottom-right-radius:0px;font-size:20px',
  '.menu-gomb-piko': 'display:block',
  '.menu-nyil': 'margin-left:auto',
  '.menu-panel': 'position:static;padding-top:8px;padding-right:10px;padding-bottom:10px;padding-left:10px;border-top-width:2px;border-top-style:dashed;border-top-color:#E0D8C2;border-right-width:0px;border-bottom-width:0px;border-left-width:0px;border-bottom-left-radius:0px;border-bottom-right-radius:0px;box-shadow:none',
  '.menu-panel-racs': 'grid-template-columns:1fr',
  '.menu-csempek': 'grid-template-columns:1fr',
  '.menu-csempe': 'padding-top:8px;padding-right:6px;padding-bottom:8px;padding-left:6px',
  '.menu-csempe-piko': 'width:36px;height:36px',
  '.menu-kiemel': 'padding-top:12px;padding-right:12px;padding-bottom:12px;padding-left:12px',
  '.menu-kiemel-cim': 'font-size:20px',
  '.menu-bolt': 'display:inline-flex;margin-left:0px;padding-right:12px;transform:none',
  '.menu-bolt-szo': 'display:block',
 },
 X: {
  '.menu-most': 'padding-right:6px',
  '.menu-most-szoveg': 'display:none',
  '.menu-hamb-szoveg': 'display:none',
  '.menu-vissza-domain': 'display:none',
 },
}
# a ≥1280 px-es (large) értékeket a whtml nem kezeli, ezeket a stílus-eszköz írja: lásd LARGE
LARGE = {'menu-most': {'padding-right': '12px'}, 'menu-most-szoveg': {'display': 'block'},
         'menu-gomb': {'font-size': '18px', 'padding-right': '12px', 'padding-left': '12px'},
         'menu-bolt': {'padding-right': '12px'}, 'menu-bolt-szo': {'display': 'block'}}

def nav_szelektorok(kulcsok):
    return {m: {k: v for k, v in sz.items() if k.split(':')[0].lstrip('.') in kulcsok} for m, sz in NAV_CSS.items()}

SAV_OSZT = {'menu-sav', 'menu-logo', 'menu-logo-kep', 'menu-most', 'menu-most-piko', 'menu-most-szoveg', 'menu-most-cimke', 'menu-vissza', 'menu-vissza-domain',
            'menu-mobil', 'menu-hamb', 'menu-hamb-ikon', 'menu-hamb-szoveg', 'menu-lista', 'menu-bolt', 'menu-bolt-piko', 'menu-bolt-szo', 'menu-cta'}
NAV_SAV = ('<div class="menu-sav">'
  f'<a class="menu-logo" href="/"><img class="menu-logo-kep" src="{LOGO}" alt="beeco főoldal"></a>'
  f'<a class="menu-most" href="/kampanyok/csicsergosz">{pk("madarpont", "menu-most-piko")}<div class="menu-most-szoveg"><span class="menu-most-cimke">Most fut:</span> CsicsergŐsz</div></a>'
  '<a class="menu-vissza" href="/">‹ <span class="menu-vissza-domain">beeco.hu </span>főoldal</a>'
  '<div class="menu-mobil w-dropdown" data-hover="false" data-delay="0"><div class="menu-hamb w-dropdown-toggle"><div class="menu-hamb-ikon w-icon-nav-menu"></div><div class="menu-hamb-szoveg">Menü</div></div>'
  f'<nav class="menu-lista w-dropdown-list"><a class="menu-bolt" href="/beebolt">{pk("doboz", "menu-bolt-piko")}<div class="menu-bolt-szo">beebolt</div></a></nav></div>'
  '<a class="menu-cta" href="/letoltes">Töltsd le!</a></div>')

def csoport(k, nev, ik, cs, ki):
    sz, cim, szov, lsz, lu = ki
    csempek = ''.join(f'<a class="menu-csempe" href="{u}">{pk(p, "menu-csempe-piko")}<div class="menu-csempe-szoveg"><div class="menu-csempe-cim">{e(c)}</div><div class="menu-csempe-al">{e(s)}</div></div></a>' for p, c, s, u in cs)
    return (f'<div class="menu-csoport w-dropdown" data-hover="false" data-delay="0"><div class="menu-gomb w-dropdown-toggle">{pk(ik, "menu-gomb-piko")}<div class="menu-gomb-nev">{e(nev)}</div><div class="menu-nyil w-icon-dropdown-toggle"></div></div>'
            f'<nav class="menu-panel w-dropdown-list"><div class="menu-panel-racs"><div class="menu-csempek">{csempek}</div>'
            f'<div class="menu-kiemel"><div class="menu-kiemel-szalag">{e(sz)}</div><div class="menu-kiemel-cim">{e(cim)}</div><p class="menu-kiemel-szoveg">{e(szov)}</p><a class="menu-kiemel-link" href="{lu}">{e(lsz)} ›</a></div></div></nav></div>')

CSOP_OSZT = {k.split(':')[0].lstrip('.') for k in NAV_CSS[T]} - SAV_OSZT
akciok = [{'nev': 'nav-sav', 'html': NAV_SAV, 'css': css(nav_szelektorok(SAV_OSZT))}]
for i, c in enumerate(CSOP):
    akciok.append({'nev': f'nav-{c[0]}', 'html': csoport(*c), 'css': css(nav_szelektorok(CSOP_OSZT)) if i == 0 else ''})
json.dump(akciok, open(os.path.join(OUT, 'nav.json'), 'w'), ensure_ascii=False, indent=1)
json.dump(LARGE, open(os.path.join(OUT, 'nav-large.json'), 'w'), ensure_ascii=False, indent=1)
print('nav:', [(a['nev'], len(a['html']), len(a['css'])) for a in akciok])

# ---------------- LÁBLÉC ----------------
B4 = lambda w, st, c: ''.join(f'border-{o}-style:{st};border-{o}-width:{w};border-{o}-color:{c};' for o in ('top', 'right', 'bottom', 'left'))
R4 = lambda a, b: f'border-top-left-radius:{a};border-top-right-radius:{b};border-bottom-right-radius:{a};border-bottom-left-radius:{b};'
P4 = lambda t, r, b, l: f'padding-top:{t};padding-right:{r};padding-bottom:{b};padding-left:{l};'
LAB_CSS = {
 T: {
  '.lablec-hullam': 'height:44px;margin-top:16px;background-color:#2F371E;border-top-left-radius:50% 100%;border-top-right-radius:50% 100%',
  '.lablec-jelenet': P4('8px', '0px', '34px', '0px') + 'background-color:#2F371E',
  '.lablec-burok': 'width:100%;max-width:1180px;margin-left:auto;margin-right:auto;' + P4('0px', '24px', '0px', '24px'),
  '.lablec-jelenet-racs': 'position:relative;display:grid;grid-template-columns:120px minmax(0,1.2fr) minmax(0,1fr);column-gap:28px;row-gap:20px;align-items:center',
  '.lablec-meh': 'width:120px;height:auto;transform:rotate(-6deg)',
  '.lablec-hivas': 'display:flex;flex-direction:column;align-items:flex-start;row-gap:10px;min-width:0px',
  '.lablec-cim': f'margin-top:0px;margin-bottom:0px;color:#FFF8E7;font-family:{DISP};font-size:clamp(28px,3vw,40px);font-weight:400;line-height:1.05',
  '.lablec-szoveg': 'margin-top:0px;margin-bottom:0px;color:#D3DDBB;font-size:16px',
  '.lablec-letolt': 'width:100%',
  '.lablec-levelke': 'display:flex;flex-direction:column;row-gap:8px;min-width:0px;' + P4('18px', '18px', '18px', '18px') + B4('2px', 'solid', '#000000') + R4('16px', '4px') + 'background-color:#FEEEBB;box-shadow:5px 5px 0 0 #000000;color:#000000;transform:rotate(.6deg)',
  '.lablec-levelke-cim': f'font-family:{DISP};font-size:24px;line-height:1.05',
  '.lablec-levelke-szoveg': 'margin-top:0px;margin-bottom:0px;color:#333333;font-size:14px',
  '.lablec-levelke-urlap': 'max-width:100%;overflow:hidden',
  '.lablec-sorok': P4('8px', '0px', '22px', '0px') + 'border-top-style:dashed;border-top-width:2px;border-top-color:rgba(211,221,187,.35);background-color:#2F371E',
  '.lablec-sor': 'display:grid;grid-template-columns:150px minmax(0,1fr);column-gap:16px;row-gap:4px;align-items:baseline;' + P4('10px', '0px', '10px', '0px') + 'border-bottom-style:dashed;border-bottom-width:1px;border-bottom-color:rgba(211,221,187,.22)',
  '.lablec-sor-cim': f'color:#FECF39;font-family:{DISP};font-size:19px;line-height:1.1',
  '.lablec-sor-linkek': 'display:flex;flex-wrap:wrap;column-gap:18px;row-gap:2px',
  '.lablec-link': 'display:inline-block;' + P4('12px', '0px', '12px', '0px') + 'color:#FFF8E7;font-size:14.5px;font-weight:600;line-height:20px;text-decoration:none',
  '.lablec-link:hover': 'color:#FFF8E7;text-decoration:underline',
  '.lablec-also': P4('16px', '0px', '16px', '0px') + 'background-color:#232A16;color:#D3DDBB',
  '.lablec-also-racs': 'display:flex;flex-wrap:wrap;align-items:center;column-gap:22px;row-gap:12px',
  '.lablec-logo': 'display:flex;align-items:center;min-height:44px;' + P4('6px', '10px', '6px', '10px') + R4('12px', '3px') + 'background-color:#FFF8E7',
  '.lablec-logo-kep': 'width:47px;height:30px;max-width:none',
  '.lablec-rovid': 'display:none;flex-wrap:wrap;column-gap:16px;row-gap:4px',
  '.lablec-social': 'display:flex;column-gap:8px',
  '.lablec-social-link': f'display:flex;justify-content:center;align-items:center;width:44px;height:44px;transition:transform 160ms {EASE}',
  '.lablec-social-link:hover': 'transform:translate(0px,-3px)',
  '.lablec-social-kep': 'width:40px;height:40px;object-fit:contain',
  '.lablec-minosites': 'display:flex;align-items:center;column-gap:12px;color:#D3DDBB;font-size:13px',
  '.lablec-minosites-kep': 'width:auto;height:46px',
  '.lablec-jogi': 'display:flex;flex-wrap:wrap;align-items:center;column-gap:14px;row-gap:4px;margin-left:auto;color:#D3DDBB;font-size:12.5px',
  '.lablec-jogi-link': 'display:inline-block;' + P4('12px', '0px', '12px', '0px') + 'color:#D3DDBB;font-size:12.5px;text-decoration:underline',
  '.lablec-jogi-link:hover': 'color:#FFF8E7;text-decoration:underline',
 },
 M: {
  '.lablec-jelenet-racs': 'grid-template-columns:90px minmax(0,1fr)',
  '.lablec-meh': 'width:90px',
  '.lablec-levelke': 'grid-column-start:span 2;grid-column-end:span 2;transform:none',
 },
 S: {
  '.lablec-hullam': 'height:28px',
  '.lablec-jelenet': P4('4px', '0px', '26px', '0px'),
  '.lablec-jelenet-racs': 'grid-template-columns:minmax(0,1fr)',
  '.lablec-hivas': 'padding-right:84px',
  '.lablec-meh': 'position:absolute;right:0px;top:4px;width:76px',
  '.lablec-levelke': 'grid-column-start:auto;grid-column-end:auto',
  '.lablec-sor': 'grid-template-columns:minmax(0,1fr)',
  '.lablec-jogi': 'margin-left:0px',
 },
}
SOR = lambda n, ls: f'<div class="lablec-sor"><div class="lablec-sor-cim">{e(n)}</div><div class="lablec-sor-linkek">' + ''.join(f'<a class="lablec-link" href="{u}">{e(c)}</a>' for c, u in ls) + '</div></div>'
from gen import SOROK
LAB = ('<div class="lablec-tartalom"><div class="lablec-hullam"></div>'
  '<div class="lablec-jelenet"><div class="lablec-burok"><div class="lablec-jelenet-racs">'
  f'<img class="lablec-meh" src="{BEELA}" alt="" loading="lazy">'
  '<div class="lablec-hivas"><h2 class="lablec-cim">Légy te a változás. Kezdd egy lépéssel!</h2><p class="lablec-szoveg">Ingyenes, magyar, és minden lépésedért nektár jár.</p><div class="lablec-letolt"></div></div>'
  '<div class="lablec-levelke"><div class="lablec-levelke-cim">Kéthetente egy Levélke</div><p class="lablec-levelke-szoveg">Új funkciók, zöld tippek, események és kampányok. Bármikor leiratkozhatsz.</p><div class="lablec-levelke-urlap"></div></div>'
  '</div></div></div>'
  '<div class="lablec-sorok"><div class="lablec-burok">' + ''.join(SOR(n, ls) for n, ls in SOROK) + SOR('Webshop', [('beebolt', '/beebolt')]) + '</div></div>'
  '<div class="lablec-also"><div class="lablec-burok"><div class="lablec-also-racs">'
  f'<a class="lablec-logo" href="/"><img class="lablec-logo-kep" src="{LOGO_LAB}" alt="beeco főoldal"></a>'
  '<div class="lablec-rovid">' + ''.join(f'<a class="lablec-link" href="{u}">{c}</a>' for c, u in [('Rólunk', '/rolunk'), ('GYIK', '/gyik'), ('Kapcsolat', '/kapcsolat'), ('beebolt', '/beebolt')]) + '</div>'
  '<div class="lablec-social">' + ''.join(f'<a class="lablec-social-link" href="{u}" target="_blank" rel="noopener" aria-label="beeco a(z) {n} oldalon"><img class="lablec-social-kep" src="{i}" alt="" loading="lazy"></a>' for n, u, i in SOC) + '</div>'
  f'<div class="lablec-minosites"><img class="lablec-minosites-kep" src="{ZOLDMIN}" alt="Zöld Minősítés: környezettudatosak vagyunk" loading="lazy"><div>★ 4,6 App Store · ★ 4,2 Google Play</div></div>'
  '<div class="lablec-jogi"><div>© beeco</div><a class="lablec-jogi-link" href="/privacy-policy">Használati feltételek és adatkezelés</a><div>Hosztolja a GreenGeeks</div></div>'
  '</div></div></div></div>')
json.dump([{'nev': 'lablec', 'html': LAB, 'css': css(LAB_CSS)}], open(os.path.join(OUT, 'lablec.json'), 'w'), ensure_ascii=False, indent=1)
print('lablec:', len(LAB), len(css(LAB_CSS)))
