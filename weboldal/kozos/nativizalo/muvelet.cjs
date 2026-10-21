// Webflow-műveletlista a terv2.json-ból. Kimenet: /tmp/fs/nat/ops/NN-*.json  (mindegyik: {tool, actions})
const fs = require('fs');
const D = '/tmp/fs/nat/';
const T = JSON.parse(fs.readFileSync(D + 'terv2.json', 'utf8'));
const L = JSON.parse(fs.readFileSync(D + 'lapit.json', 'utf8'));
const MAP = JSON.parse(fs.readFileSync(D + 'nk2id.json', 'utf8'));
const OUT = D + 'ops/'; fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT);
const PS = { '|': 'noPseudo', '|hover': 'hover', '|focus': 'focus', '|focus-visible': 'focus-visible', '|active': 'active', 'before|': 'before', 'after|': 'after', 'placeholder|': 'placeholder' };
const BP = { main: null, xl: 'xl', medium: 'medium', small: 'small', tiny: 'tiny' };
let n = 0; const ki = (nev, tool, actions) => { for (let i = 0; i < actions.length; i += 25) fs.writeFileSync(OUT + String(++n).padStart(2, '0') + '-' + nev + '.json', JSON.stringify({ tool, actions: actions.slice(i, i + 25) })); };

// 1) régi natív értékek törlése (a site CSS-ben lévő fs-/fo- szabályok)
const MEDIABP = m => !m ? null : /min-width:\s*1920/.test(m) ? 'xxl' : /min-width:\s*1440/.test(m) ? 'xl' : /min-width:\s*1280/.test(m) ? 'large' : /max-width:\s*991/.test(m) ? 'medium' : /max-width:\s*767/.test(m) ? 'small' : /max-width:\s*479/.test(m) ? 'tiny' : '?';
const torl = [];
for (const r of L.main.szab.filter(r => r.site)) for (const sp of r.sel.split(',')) {
  const m = sp.trim().match(/^((?:\.[\w-]+)+)(:[\w-]+(?:\([^)]*\))?|::[\w-]+)?$/); if (!m) continue;
  const cs = m[1].split('.').filter(Boolean); const psz = m[2] ? m[2].replace(/^::?/, '') : 'noPseudo';
  if (cs.some(c => c.startsWith('fo-ereje'))) continue; // a saját natív blokk marad
  const bp = MEDIABP(r.media); const props = r.decl.map(d => d[0]);
  const a = { label: 'del-' + cs.join('.') + '-' + (bp || 'main') + '-' + psz, update_style: { style_name: cs[cs.length - 1], remove_properties: props } };
  if (cs.length > 1) a.update_style.parent_style_names = cs.slice(0, -1); if (bp) a.update_style.breakpoint_id = bp; if (psz !== 'noPseudo') a.update_style.pseudo = psz;
  torl.push(a);
}
ki('torles', 'data_style_tool', torl);

// 2) új osztályok létrehozása (combo: szülőlánc = az elem lánca)
const letre = []; const uj = new Set(Object.values(T.ujOsztaly));
const szulo = {}; for (const [nk, nev] of Object.entries(T.ujOsztaly)) szulo[nev] = L.main.ki[nk].osztaly;
for (const nev of uj) { const p = szulo[nev] || []; const a = { label: 'uj-' + nev, create_style: { name: nev, properties: [{ property_name: 'box-sizing', property_value: 'border-box' }] } }; if (p.length) a.create_style.parent_style_names = p; letre.push(a); }
ki('letrehoz', 'data_style_tool', letre);

// 3) osztályok az elemekre
const elemek = []; const hiany = [];
for (const [nk, nev] of Object.entries(T.ujOsztaly)) { const m = MAP[nk]; if (!m) { hiany.push(nk); continue; }
  elemek.push({ label: 'el-' + nk + '-' + nev, set_style: { id: m.id, style_names: [...L.main.ki[nk].osztaly, nev] } }); }
ki('elemek', 'data_element_tool', elemek);

// 4) stílusírások
const irasok = [];
for (const t of T.terv) { const cs = t.lanc; const a = { label: cs.join('.') + '-' + t.bp + '-' + PS[t.kulcs], update_style: { style_name: cs[cs.length - 1], properties: Object.entries(t.props).map(([p, v]) => ({ property_name: p, property_value: v })) } };
  if (cs.length > 1) a.update_style.parent_style_names = cs.slice(0, -1); if (BP[t.bp]) a.update_style.breakpoint_id = BP[t.bp]; if (PS[t.kulcs] !== 'noPseudo') a.update_style.pseudo = PS[t.kulcs];
  irasok.push(a); }
ki('stilus', 'data_style_tool', irasok);
console.log('törlés', torl.length, '| létrehozás', letre.length, '| elem', elemek.length, '(hiányzó leképezés:', hiany.length, ') | írás', irasok.length, '| fájlok', fs.readdirSync(OUT).length);
