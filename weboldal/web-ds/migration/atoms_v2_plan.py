"""Web DS v2 atom migration plan (2026-11-21): the team's design review rules applied to the shared `ds-` classes in Webflow.
Rules (docs/web-ds.md, 2. fejezet): clickable = 4 px radius + hard shadow (4 px large, 2 px small); static card = 4 px radius, no shadow;
design element (photo, label, bar) = no radius, no shadow; border 2 px. Output: atoms_v2_plan.json, a list of `data_style_tool`
`update_style` actions. Applying them needs the Webflow MCP; this script only writes the plan (no network)."""
import json, os

R_S = 'var(--_beeco-ds---bc-r-s)'
CORNERS = ['border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius']
SIDES = ['top', 'right', 'bottom', 'left']
SH_L, SH_S = '4px 4px 0 0 #000000', '2px 2px 0 0 #000000'
radius = lambda v: [{'property_name': c, 'property_value': v} for c in CORNERS]
border2 = lambda: [{'property_name': f'border-{s}-width', 'property_value': '2px'} for s in SIDES]
prop = lambda n, v: {'property_name': n, 'property_value': v}

# selector (space separated combo chain) → category
LARGE = ['ds-ut', 'ds-cikk', 'ds-tovabb-kartya', 'ds-short', 'ds-videokeret', 'ds-valaszto-elem']   # clickable cards, buttons
SMALL = ['ds-fotosor-gomb', 'ds-kerdes', 'ds-tartalom-link']                                        # small controls
CARD = ['ds-kartya', 'ds-csomag', 'ds-dij', 'ds-eset', 'ds-eset-eredmeny', 'ds-grafikon', 'ds-jelentes', 'ds-idezet', 'ds-allitas',
        'ds-megjegyzes', 'ds-level', 'ds-raj', 'ds-urlap-doboz', 'ds-urlap-uzenet', 'ds-szam-csoport', 'ds-szam ds-szam-sotet',
        'ds-sziget', 'ds-burok ds-sziget', 'ds-cetli', 'ds-kepsor', 'ds-bemenet', 'ds-chip ds-chip-sarga', 'ds-ajanlat-ful', 'ds-pipa']
DESIGN = ['ds-foto', 'ds-alapito-kep', 'ds-csapat-kep', 'ds-ember-foto', 'ds-hero-dia', 'ds-qr', 'ds-ref-kep', 'ds-sav', 'ds-sav-kiemelt',
          'ds-ido-szam-1', 'ds-tovabb-nyil', 'ds-foto ds-ido-foto ds-polaroid', 'ds-fotosor-csik', 'ds-logo']
SHORTHAND_RADIUS = {'ds-alapito-kep', 'ds-csapat-kep', 'ds-qr', 'ds-szam ds-szam-sotet', 'ds-hero-dia', 'ds-chip ds-chip-sarga',
                    'ds-cetli', 'ds-pipa', 'ds-sav-kiemelt'}
SHORTHAND_BORDER = {'ds-alapito-kep': '2px solid #000000', 'ds-csapat-kep': '2px solid #000000', 'ds-hero-dia': '2px solid #000000',
                    'ds-qr': '2px solid #000000', 'ds-sav-kiemelt': '2px solid #000000'}
THICK = ['ds-foto', 'ds-tovabb-kartya', 'ds-short', 'ds-videokeret', 'ds-ember-foto']                # 3 px longhand borders → 2 px
SMALL_BP_SHADOW = ['ds-kartya', 'ds-csomag', 'ds-foto ds-ido-foto ds-polaroid']                       # had their own mobile shadow

def action(sel, props, pseudo=None, bp=None, remove=None):
    chain = sel.split()
    a = {'style_name': chain[-1], 'properties': props}
    if len(chain) > 1: a['parent_style_names'] = chain[:-1]
    if pseudo: a['pseudo'] = pseudo
    if bp: a['breakpoint_id'] = bp
    if remove: a['remove_properties'] = remove
    return {'label': sel.replace(' ', '.') + (':' + pseudo if pseudo else '') + ('@' + bp if bp else ''), 'update_style': a}

plan = []
for sel in LARGE:
    plan.append(action(sel, radius(R_S) + [prop('box-shadow', SH_L)] + (border2() if sel in THICK else [])))
    if sel not in ('ds-short', 'ds-videokeret'):
        plan.append(action(sel, [prop('transform', 'translate(-1px,-1px)'), prop('box-shadow', '5px 5px 0 0 #000000')], pseudo='hover'))
        plan.append(action(sel, [prop('transform', 'translate(3px,3px)'), prop('box-shadow', '1px 1px 0 0 #000000')], pseudo='active'))
for sel in SMALL:
    plan.append(action(sel, radius(R_S) + [prop('box-shadow', SH_S)]))
    if sel != 'ds-kerdes':
        plan.append(action(sel, [prop('transform', 'translate(-1px,-1px)'), prop('box-shadow', '3px 3px 0 0 #000000')], pseudo='hover'))
for sel in CARD:
    plan.append(action(sel, radius(R_S) + [prop('box-shadow', 'none')], remove=['border-radius'] if sel in SHORTHAND_RADIUS else None))
for sel in DESIGN:
    extra = [prop('border', SHORTHAND_BORDER[sel])] if sel in SHORTHAND_BORDER else (border2() if sel in THICK else [])
    plan.append(action(sel, radius('0px') + [prop('box-shadow', 'none')] + extra, remove=['border-radius'] if sel in SHORTHAND_RADIUS else None))
for sel in SMALL_BP_SHADOW:
    plan.append(action(sel, [prop('box-shadow', 'none')], bp='small'))

# featured pricing card: no soft shadow, no lift; the accent background carries the emphasis
plan.append(action('ds-csomag-kiemelt', [prop('box-shadow', 'none'), prop('transform', 'none')]))
# partner logos: no container, single colour (review: „partner logónak nem kell container, legyen egyszínű”)
plan.append(action('ds-logo', [prop(f'border-{s}-style', 'none') for s in SIDES] + [prop('background-color', 'transparent')]))
plan.append(action('ds-logo-kep', [prop('filter', 'grayscale(100%)'), prop('mix-blend-mode', 'multiply')]))
# section label: black fill, white text, no outline, no cut corner, straight (review: „szekció címke alternatíva”)
plan.append(action('ds-szalag', [prop('transform', 'none'), prop('clip-path', 'none'), prop('color', '#ffffff')]))
# brown text → label with fill (review: „barna kártyaszöveg címkeként, háttér fill”)
for sel in ['ds-cikk-forras', 'ds-ut-ar', 'ds-ido-ho']:
    plan.append(action(sel, [prop('color', 'var(--_beeco-ds---bc-ink)'), prop('background-color', 'var(--_beeco-ds---bc-vaj)'),
                             prop('padding-top', '3px'), prop('padding-right', '8px'), prop('padding-bottom', '2px'), prop('padding-left', '8px'),
                             prop('align-self', 'flex-start')]))
# white button variant follows the primary button shape (it inherits from ds-gomb); focus ring for keyboard users
plan.append(action('ds-gomb', [prop('outline-color', 'var(--_beeco-ds---bc-focus)'), prop('outline-style', 'solid'), prop('outline-width', '3px'), prop('outline-offset', '3px')], pseudo='focus-visible'))

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'atoms_v2_plan.json')
json.dump(plan, open(out, 'w'), ensure_ascii=False, indent=1)
print(len(plan), 'actions →', out)
