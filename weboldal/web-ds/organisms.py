"""Web DS v2 organisms and page templates (docs/web-ds.md, 5–6. fejezet).

One place for the section-level building blocks of beeco.hu pages. A page generator composes these, `page()` adds the
`DS · Domb` divider variant automatically (the colour of the NEXT section, none between equal backgrounds) and
`check_page()` verifies the mandatory organisms of the chosen template before anything is inserted into Webflow.

Class names stay the existing Hungarian `ds-` names (Webflow compatibility keys); code identifiers are English (G1).
Markup only: no CSS is emitted here, every class already exists in Webflow. Component placeholders are empty
`<div data-komp="…">` elements; after `data_whtml_builder` the matching component instance goes inside (COMPONENTS).

Usage:  python3 weboldal/web-ds/organisms.py --demo
"""
from html import escape as e
import json, re, sys

S3 = 'https://s3.amazonaws.com/webflow-prod-assets/648ebb1f9ae84f3d530e2f2d/'

# background key → section class, and the `DS · Domb` variant name that leads INTO a section of that background
BACKGROUNDS = {'cream': '', 'white': 'ds-hatter-feher', 'green': 'ds-hatter-zold', 'butter': 'ds-hatter-vaj', 'dark': 'ds-hatter-sotet'}
DIVIDER_VARIANT = {'cream': 'Krém', 'white': 'Fehér', 'green': 'Halványzöld', 'butter': 'Vaj', 'dark': 'Sötét'}
DIVIDER_VARIANT_ID = {'Krém': 'base', 'Fehér': '75cb5962-6ba0-8742-5cee-1cf889ab2f1f', 'Halványzöld': 'd9745016-fb29-20af-3223-381c512488d0',
                      'Vaj': 'a30d8f7f-5abf-5be7-53af-a785122e1579', 'Zöld': 'a133ab3d-73da-c9c9-f870-3b2fdbd391ea', 'Sötét': 'f559d66c-fd9c-6841-5403-5b14b9c59315'}
COMPONENTS = {  # placeholder name → Webflow component id
    'divider': 'ad993b5e-bdbd-a8e3-169e-0fbe16aaf0a7',        # DS · Domb
    'download': '53f370d6-0097-8392-41d7-af795dfd8cb0',       # DOWNLOAD_BLOCK: store buttons + QR code
    'faq-more': '3c90afc8-1d53-ebc7-228a-020a939b8640',       # DS · GYIK tovább
    'gallery-control': 'e3bff70b-4460-0ea0-f7e9-8598064ff13a' # DS · Fotósor vezérlő
}
APP_IMAGE = ('6afcc87f4177226d75adeb3d_beeco-app-telefon-650.webp', 'A beeco app kezdőképernyője telefonon, mellette a köpenyes méhecske és piktogramok.')
YELLOW_PICTOGRAMS = {  # yellow splash only (docs/web-ds.md 2.); name → asset id of `fs-piko-<name>[-sarga].svg`
    'kuka': '6acdcf7c1adc944900c3696a', 'kesvilla': '6acdcf7c1f7962a21f69b845', 'play': '6acdcfb031a1079e200f5490', 'sziv': '6acdcfb0356d56416f62a171',
    'taska': '6acdcfb0aac2053c2cb040ee', 'olvas': '6acdcfafdf4b15324ccb4a5b', 'otlet': '6acdcfaf356d56416f62a0d9', 'telepules': '6acdcfb1a57f9d8d1eba51c5',
    'terkep-sarga': '6afcc9f5f783849b543af581', 'lab-sarga': '6afcc9f5ba56a7d1a86927e9', 'naptar-sarga': '6afcc9f5ba260d82ee8288ff', 'kupon-sarga': '6afcc9f544ef1d884df74edb'}


# ---------- atoms and molecules ----------
def button(href, label, cta, secondary=False):
    """Primary (honey) or secondary (white) button. At most one primary per section; label ≤ 3 words."""
    return f'<a class="ds-gomb{" ds-masod" if secondary else ""}" href="{href}" data-app-cta="{e(cta)}">{e(label)}</a>'

def text_link(href, label):
    return f'<a class="ds-szoveglink" href="{href}">{e(label)} ›</a>'

def pictogram(name, css_class='ds-kartya-piko'):
    """Decorative yellow-splash pictogram (empty alt)."""
    return f'<img class="{css_class}" src="{S3}{YELLOW_PICTOGRAMS[name]}_fs-piko-{name}.svg" alt="" loading="lazy">'

def chips(labels):
    return '<div class="ds-chipsor">' + ''.join(f'<div class="ds-chip">{e(x)}</div>' for x in labels) + '</div>' if labels else ''

def section_head(eyebrow, h2, lead=None):
    return (f'<div class="ds-szekcio-fej"><div class="ds-szalag">{e(eyebrow)}</div><h2 class="ds-cim2">{e(h2)}</h2>'
            + (f'<p class="ds-lead">{e(lead)}</p>' if lead else '') + '</div>')

def _section(kind, bg, inner, sid='', compact=False, grid=False, components=()):
    classes = ' '.join(c for c in ('ds-szekcio', 'ds-szekcio-tomor' if compact else '', BACKGROUNDS[bg]) if c)
    wrap = 'ds-burok ds-hero-racs' if grid else 'ds-burok'
    html = f'<section class="{classes}"' + (f' id="{sid}"' if sid else '') + f'><div class="{wrap}">{inner}</div></section>'
    return {'kind': kind, 'id': sid, 'bg': bg, 'html': html, 'components': list(components)}


# ---------- organisms ----------
def gallery(slides, aria_label):
    """Hero image row (Javaslat 34): slides = [(asset_file, alt, title, description, image_class)]. First image loads eagerly."""
    items = ''
    for i, (asset, alt, title, text, *rest) in enumerate(slides):
        loading = 'eager" fetchpriority="high' if i == 0 else 'lazy'
        items += (f'<figure class="ds-foto ds-fotosor-elem"><img class="ds-foto-kep{" " + rest[0] if rest and rest[0] else ""}" src="{S3}{asset}" alt="{e(alt)}" loading="{loading}">'
                  f'<figcaption class="ds-foto-felirat ds-felirat-leiras"><div class="ds-felirat-cim">{e(title)}</div><div>{e(text)}</div></figcaption></figure>')
    return (f'<div class="ds-fotosor ds-fotosor-hero"><div class="ds-fotosor-sor ds-fotosor-sor-hero" role="region" tabindex="0" aria-label="{e(aria_label)}">'
            f'{items}</div></div>')  # the `gallery-control` component instance is appended into .ds-fotosor (no wrapper)

def hero(eyebrow, h1_html, lead, buttons_html, chip_labels=(), slides=None, gallery_label='Képek (vízszintesen görgethető)', source_html=None):
    """Page opener: one message, one primary button. With `slides` it is the two-column hero with the image row.
    `h1_html` may contain one <span class="ds-kiemel"> only when the heading is longer than 30 characters (lint R8)."""
    text = (f'<div class="ds-hero-szoveg"><div class="ds-szalag">{e(eyebrow)}</div><h1 class="ds-cim1">{h1_html}</h1><p class="ds-lead">{e(lead)}</p>'
            f'<div class="ds-gombsor">{buttons_html}</div>{chips(chip_labels)}' + (f'<p class="ds-forras">{source_html}</p>' if source_html else '') + '</div>')
    return _section('hero', 'butter', text + (gallery(slides, gallery_label) if slides else ''), 'kezdes', grid=bool(slides),
                    components=['gallery-control'] if slides else [])

def feature_row(index, eyebrow, lead, button_html, image, pictogram_name, h2=None, link_chips=(), bg='white', sid=''):
    """Compact alternating row (Javaslat 38): 16:9 photo with the pictogram in its top-left corner and link chips on it,
    text on the other side. Even index: photo left. `image` = (asset_file, alt); `link_chips` = [(href, label)], at most 4."""
    assert len(link_chips) <= 4, 'legfeljebb 4 chip fér a képre mobilon'
    chip_html = ('<div class="ds-foto-chipek">' + ''.join(f'<a class="ds-chip" href="{h}">{e(n)}</a>' for h, n in link_chips) + '</div>') if link_chips else ''
    media = (f'<figure class="ds-foto ds-foto-szeles"><img class="ds-foto-kep" src="{S3}{image[0]}" alt="{e(image[1])}" loading="lazy">'
             + pictogram(pictogram_name, 'ds-foto-piko') + chip_html + '</figure>')
    text = (f'<div class="ds-hero-szoveg"><div class="ds-szalag">{e(eyebrow)}</div>' + (f'<h2 class="ds-cim2">{e(h2)}</h2>' if h2 else '')
            + f'<p class="ds-lead">{e(lead)}</p><div class="ds-gombsor">{button_html}</div></div>')
    return _section('feature-row', bg, (media + text) if index % 2 == 0 else (text + media), sid, compact=True, grid=True)

def card_grid(eyebrow, h2, cards, lead=None, columns=3, bg='cream', sid=''):
    """Static cards (no shadow). cards = [(pictogram_name or None, title, text, href or None)]."""
    grid = {2: 'ds-ketto', 3: 'ds-harom'}[columns]
    body = ''.join('<div class="ds-kartya">' + (pictogram(p) if p else '') + '<h3 class="ds-cim3">'
                   + (f'<a class="ds-szoveglink" href="{h}">{e(t)}</a>' if h else e(t)) + f'</h3><p class="ds-szoveg">{e(s)}</p></div>' for p, t, s, h in cards)
    return _section('card-grid', bg, section_head(eyebrow, h2, lead) + f'<div class="{grid}">{body}</div>', sid)

def steps(eyebrow, h2, items, bg='green', sid='igy-mukodik'):
    """Numbered process, three steps read best. items = [(title, text)]."""
    body = ''.join(f'<div class="ds-lepes"><div class="ds-lepes-szam">{i}</div><h3 class="ds-cim3">{e(t)}</h3><p class="ds-szoveg">{e(s)}</p></div>' for i, (t, s) in enumerate(items, 1))
    return _section('steps', bg, section_head(eyebrow, h2) + f'<div class="ds-lepesek">{body}</div>', sid)

def cms_list(eyebrow, h2, slot_name, all_href, all_label, lead=None, bg='white', sid=''):
    """Heading plus an empty slot for a Webflow collection list (source, limit and card bindings are set in Webflow)."""
    return _section('cms-list', bg, section_head(eyebrow, h2, lead) + f'<div data-lista="{e(slot_name)}"></div><p class="ds-szoveg">{text_link(all_href, all_label)}</p>', sid)

def app_cta(h2='Töltsd le a beeco appot!', lead='A térkép, a lábnyomkalkulátor, a kuponok és a zöld programok is veled vannak. Az app ingyenes.', sid='app'):
    """App download call: text, store buttons and QR code (DOWNLOAD_BLOCK component), phone image. Mandatory on consumer pages."""
    inner = (f'<div class="ds-hero-szoveg"><div class="ds-szalag">Az appban</div><h2 class="ds-cim2">{e(h2)}</h2><p class="ds-lead">{e(lead)}</p>'
             f'<div data-komp="download"></div></div><img class="ds-app-kep" src="{S3}{APP_IMAGE[0]}" alt="{e(APP_IMAGE[1])}" loading="lazy">')
    return _section('app-cta', 'green', inner, sid, grid=True, components=['download'])

def faq(items, h2, lead):
    """FAQ template with native <details>. items = [(question, answer_html)]; the same items feed the FAQPage JSON-LD."""
    rows = ''.join(f'<details class="ds-kerdes"><summary class="ds-kerdes-k">{e(q)}</summary><p class="ds-kerdes-v">{a}</p></details>' for q, a in items)
    inner = (f'<div class="ds-gyik-racs"><div class="ds-gyik-fej"><div class="ds-szalag">GYIK</div><h2 class="ds-cim2">{e(h2)}</h2><p class="ds-lead">{e(lead)}</p>'
             f'<div data-komp="faq-more"></div></div><div class="ds-kerdesek">{rows}</div></div>')
    return _section('faq', 'white', inner, 'gyik', components=['faq-more'])


# ---------- page assembly and checks ----------
TEMPLATES = {  # mandatory organism kinds, in order; other sections may sit between them
    'hub':     ['hero', 'feature-row', 'app-cta', 'faq'],       # e.g. /beecopedia
    'landing': ['hero', 'steps', 'app-cta', 'faq'],             # e.g. /app/kuponok, /app/zold-esemenynaptar
    'guide':   ['hero', 'card-grid', 'app-cta', 'faq'],         # e.g. hulladék-kisokos
    'service': ['hero', 'card-grid', 'steps', 'faq'],           # B2B: ends with the `DS · Ajánlatkérés` component instead of the app CTA
}

def page(sections):
    """Adds `divider`: the `DS · Domb` variant leading into the next section, or None between equal backgrounds.
    The last section gets no divider (the footer component brings its own)."""
    out = []
    for i, s in enumerate(sections):
        nxt = sections[i + 1] if i + 1 < len(sections) else None
        variant = DIVIDER_VARIANT[nxt['bg']] if nxt and nxt['bg'] != s['bg'] else None
        out.append({**s, 'divider': variant, 'divider_variant_id': DIVIDER_VARIANT_ID[variant] if variant else None})
    return out

def check_page(sections, template):
    """Returns a list of problems (empty = fine): template order, one h1, one hero, highlight length, chip count, alt texts."""
    problems, kinds = [], [s['kind'] for s in sections]
    pos = -1
    for kind in TEMPLATES[template]:
        if kind not in kinds[pos + 1:]: problems.append(f'hiányzik vagy rossz helyen van: {kind}')
        else: pos = kinds.index(kind, pos + 1)
    html = ''.join(s['html'] for s in sections)
    if len(re.findall(r'<h1\b', html)) != 1: problems.append('pontosan egy h1 kell')
    for h in re.findall(r'<h[12][^>]*>(.*?)</h[12]>', html):
        if 'ds-kiemel' in h and len(re.sub(r'<[^>]+>', '', h)) <= 30: problems.append('kiemelés 30 karakternél nem hosszabb címben: ' + re.sub(r'<[^>]+>', '', h))
    if re.search(r'<img(?![^>]*\balt=)', html): problems.append('kép alt attribútum nélkül')
    for s in sections:
        if len(re.findall(r'class="ds-gomb"', s['html'])) > 1: problems.append(f'több elsődleges gomb egy szekcióban: {s["id"] or s["kind"]}')
    if any(a['bg'] == b['bg'] == 'dark' for a, b in zip(sections, sections[1:])): problems.append('két sötét szekció egymás után')
    return problems


if __name__ == '__main__' and '--demo' in sys.argv:
    demo = page([
        hero('beecopedia', 'Zöld <span class="ds-kiemel">tudástár</span> a mindennapi döntésekhez', 'Rövid, gyakorlatias válaszok egy helyen.',
             button('/beecopedia/szemet-csokkento-kisokos', 'Hova dobjam?', 'demo-hero')),
        feature_row(0, 'Hulladék-kisokos', 'Megtudod, melyik kukába vagy gyűjtőpontra kerüljön.', button('/beecopedia/szemet-csokkento-kisokos', 'Nézd meg a kisokost', 'demo-row', True),
                    ('6afcc87f8a0681284cf2a895_beecopedia-blokk-900-hulladek.webp', 'Három színes kuka a parkban'), 'kuka', h2='Melyik kukába való?',
                    link_chips=[('/online-okoiranytu/pet-palack', 'PET palack')]),
        app_cta(),
        faq([('Mi az a beecopedia?', 'A beeco ingyenes, magyar nyelvű tudásbázisa.')], 'Kérdések a beecopediáról', 'A leggyakoribb kérdések.'),
    ])
    print(json.dumps([{k: s[k] for k in ('kind', 'id', 'bg', 'divider', 'components')} for s in demo], ensure_ascii=False, indent=1))
    print('check:', check_page(demo, 'hub') or 'rendben')
