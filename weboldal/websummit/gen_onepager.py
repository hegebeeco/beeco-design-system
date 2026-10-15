"""Web Summit egyoldalas (A4) – ugyanaz az üzenetház és számkészlet, mint a /en oldal. Kimenet: one-pager.html (+ PDF a pdf.cjs-sel)."""
import os, re, json, html as H
D = os.path.dirname(os.path.abspath(__file__))
SITE = '648ebb1f9ae84f3d530e2f2d'; CDN = f'https://cdn.prod.website-files.com/{SITE}/'
g = open(os.path.join(D, '..', 'kozos', 'navigacio', 'gen.py')).read()
PIKO = dict(re.findall(r"'([a-z]+)': '([0-9a-f]{24})'", g.split('PIKO = {', 1)[1].split('}', 1)[0])); PIKO['raj'] = '6acdcfb0f2f41b180badebb7'
pk = lambda n: f'{CDN}{PIKO[n]}_fs-piko-{n}.svg'
LOGO_BEECO = CDN + '655512ff22c587d4c7112378_linear%20logo.svg'
LOGO = json.load(open(os.path.join(D, '..', 'web-ds', 'adat', 'logok.json')))  # alt → URL, a főoldal logósorából
QR = open(os.path.join(D, 'qr-en.svg')).read()
e = lambda s: H.escape(s)
AJANLAT = [('telefon', 'beeco@work', 'Your team in the app: green challenges, shared footprint, nectar competitions, monthly Impact Report.'),
           ('kanna', 'Watering Swarm', 'Corporate tree-watering days in Hungary\'s first community tree-watering campaign. June to September.'),
           ('madarpont', 'Bird Swarm', 'Nest boxes, feeders and bird walks with BirdLife Hungary (MME). October to March.'),
           ('telepules', 'City package', 'Tree watering, bird protection, local green map and resident programmes, with a yearly report.'),
           ('taska', 'Partner program', 'Green shops on the map, with coupons that bring conscious customers through the door.'),
           ('otlet', 'Green marketing', 'Campaigns and content built only on verified claims, plus campaign sponsorship.')]
SZAM = [('25,000+', 'downloads'), ('4.6', 'App Store rating'), ('23,000+', 'green spots on the map'),
        ('15', 'partner municipalities'), ('784,352', 'litres of water to young trees, 2026'), ('2,162', 'active volunteers, 2026')]
LOGOK = ['Telex', 'Trade magazin', 'Marie Claire', 'Startuponline', 'BME', 'Budapesti Corvinus Egyetem', 'ELTE TáTK', '10 millió fa', 'Élhető Települések Országos Szövetsége', 'Humusz Szövetség']
html = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><title>beeco · Web Summit one-pager</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lalezar&family=Open+Sans:wght@400;600;700;800&display=swap">
<style>
@page{{size:A4;margin:0}}
*{{box-sizing:border-box}}
html,body{{margin:0;background:#fff}}
body{{width:210mm;height:297mm;font-family:"Open Sans",sans-serif;color:#1B1F12;font-size:8.8pt;line-height:1.38;display:flex;flex-direction:column}}
h1,h2,h3{{font-family:Lalezar,"Arial Black",sans-serif;font-weight:400;margin:0;line-height:1.02}}
.fej{{background:#FECF39;padding:8mm 12mm 6.5mm;position:relative}}
.logo-alap{{display:inline-flex;background:#fff;border:.5mm solid #1B1F12;border-radius:3.2mm 1.2mm 3.2mm 1.2mm;padding:1.6mm 3.2mm;box-shadow:.8mm .8mm 0 #1B1F12}}.logo{{height:7mm;display:block}}
.fej h1{{font-size:24pt;margin-top:3.5mm;max-width:170mm}}
.fej h1 span{{background:#1B1F12;color:#FECF39;padding:0 2.2mm}}
.fej p{{margin:2.4mm 0 0;font-size:9.8pt;max-width:172mm}}
.bel{{padding:5mm 12mm 0;display:flex;flex-direction:column;gap:3.2mm;flex:1}}
.ket{{display:grid;grid-template-columns:1fr 1fr;gap:6mm}}
.cimke{{display:inline-block;background:#FECF39;font-family:Lalezar,sans-serif;font-size:9.5pt;padding:.8mm 2.4mm .2mm;transform:rotate(-2deg);margin-bottom:1.6mm}}
h2{{font-size:12.5pt;margin-bottom:1.6mm}}
.pont{{margin:0;padding-left:4.2mm}} .pont li{{margin-bottom:.9mm}}
.pill{{display:grid;grid-template-columns:repeat(3,1fr);gap:2.4mm}}
.pill div{{border:.5mm solid #1B1F12;border-radius:4mm 1.4mm 4mm 1.4mm;padding:1.8mm 2.2mm;font-size:8pt}}
.pill b{{display:block;font-family:Lalezar,sans-serif;font-weight:400;font-size:11.5pt}}
.ajanlat{{display:grid;grid-template-columns:repeat(3,1fr);gap:2.6mm}}
.aj{{border:.5mm solid #1B1F12;border-radius:4mm 1.4mm 4mm 1.4mm;box-shadow:1mm 1mm 0 #1B1F12;padding:2mm 2.4mm;display:grid;grid-template-columns:8.5mm 1fr;gap:2mm;align-items:start;background:#fff}}
.aj:first-child{{background:#FEEEBB}}
.aj img{{width:8.5mm;height:8.5mm}}
.aj b{{display:block;font-family:Lalezar,sans-serif;font-weight:400;font-size:10.8pt;line-height:1.05;margin-bottom:.6mm}}
.aj span{{font-size:7.7pt;line-height:1.3}}
.szam{{background:#2F371E;color:#D3DDBB;border-radius:5mm 1.6mm 5mm 1.6mm;padding:3.2mm 4.4mm;display:grid;grid-template-columns:repeat(6,1fr);gap:2mm}}
.szam b{{display:block;font-family:Lalezar,sans-serif;font-weight:400;font-size:14.5pt;color:#FECF39;line-height:1}}
.szam span{{font-size:7.6pt;color:#fff;line-height:1.25;display:block;margin-top:.8mm}}
.allit div{{border-radius:2.4mm;padding:1.2mm 2.2mm;margin-bottom:1.2mm;font-size:8pt}}
.ok{{background:#E3ECCD}} .ok::before{{content:"You can say: ";font-weight:800;color:#3D6B2A}}
.no{{background:#FDEEE6}} .no::before{{content:"You can't: ";font-weight:800;color:#B3261E}}
.logok{{display:grid;grid-template-columns:repeat(10,1fr);gap:2mm;align-items:center}}
.logok img{{width:100%;height:7.5mm;object-fit:contain}}
.forras{{font-size:7.2pt;color:#4F5640}}
.lab{{margin-top:auto;background:#FFF8E7;border-top:.6mm solid #1B1F12;padding:3.6mm 12mm;display:grid;grid-template-columns:1fr 24mm;gap:6mm;align-items:center}}
.lab h3{{font-size:13.5pt}}
.lab p{{margin:1.4mm 0 0}}
.qr{{width:24mm;height:24mm}} .qr svg{{width:100%;height:100%}}
</style></head><body>
<header class="fej"><span class="logo-alap"><img class="logo" src="{LOGO_BEECO}" alt="beeco"></span>
<h1>Don't just claim it. <span>Do it, measure it,</span> show it.</h1>
<p>beeco is an award-winning Hungarian green lifestyle app and community. We turn employees and residents into a swarm of real, measurable green action, and hand you the numbers to prove it.</p></header>
<main class="bel">
<div class="ket"><div><div class="cimke">Why now</div><h2>Green claims need proof</h2><ul class="pont">
<li><b>EU 2024/825:</b> since 27 Sept 2026, unproven generic green claims and offset-based claims are banned.</li>
<li><b>CSRD after Omnibus I:</b> mandatory above 1,000 employees and EUR 450M turnover; most others report with the simpler VSME standard.</li>
<li>Companies need concrete, verified action. That is what beeco delivers.</li></ul></div>
<div><div class="cimke">How it works</div><h2>Engage. Measure. Show.</h2><div class="pill">
<div><b>Engage</b>People act, playfully: water trees, build nest boxes, complete app challenges.</div>
<div><b>Measure</b>Every paid package includes an Impact Report with sources and method.</div>
<div><b>Show</b>Campaigns, press, in-app visibility and verified sentences to use.</div></div></div></div>
<div><div class="cimke">For companies &amp; cities</div><div class="ajanlat">{''.join(f'<div class="aj"><img src="{pk(p)}" alt=""><div><b>{e(c)}</b><span>{e(s)}</span></div></div>' for p, c, s in AJANLAT)}</div></div>
<div class="szam">{''.join(f'<div><b>{a}</b><span>{e(b)}</span></div>' for a, b in SZAM)}</div>
<div class="ket"><div><div class="cimke">Impact Report</div><h2>Numbers you can publish</h2><div class="allit">
<div class="ok">“Our team gave 12,400 litres of water to 42 young trees in Budapest in summer 2026.”</div>
<div class="no">“We are an eco-friendly company.” (generic, unproven)</div>
<div class="no">“Our watering offsets our emissions.” (offset claim)</div></div><p class="forras">Sample figures. Every report links to its method and sources; SDG 11, 13, 15 and VSME data points.</p></div>
<div><div class="cimke">Track record</div><h2>Trusted and recognised</h2><ul class="pont">
<li>ONE Digital Award 2025, 1st place (green category)</li><li>F6S 2025: 2nd most outstanding sustainability startup in Hungary</li>
<li>EIT Climate Launchpad international finalist · MVM Edison 3rd place</li><li>Partners: E.ON, FŐKERT, BirdLife Hungary (MME), 10 Million Trees</li></ul></div></div>
<div class="logok">{''.join(f'<img src="{LOGO[l]}" alt="{e(l)}">' for l in LOGOK if l in LOGO)}</div>
<p class="forras">Sources: App Store and Google Play listings; beeco campaign close, Oct 2026; Telex, 21 Sept 2025. The app is currently available in Hungarian.</p>
</main>
<footer class="lab"><div><h3>Meet us at Web Summit in Lisbon</h3><p><b>Kristóf Hegedűs</b>, co-founder and CEO · kristof.hegedus@beeco.hu</p><p>Read more and get the app: beeco.hu/en</p></div><div class="qr">{QR}</div></footer>
</body></html>'''
open(os.path.join(D, 'one-pager.html'), 'w').write(html)
print('ok', len(html), 'logók:', sum(l in LOGO for l in LOGOK))
