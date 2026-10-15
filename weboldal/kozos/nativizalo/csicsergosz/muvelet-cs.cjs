// Webflow-műveletek a terv.json-ból (CsicsergŐsz): csak ÚJ osztályok, meglévőhöz nem nyúl. Kimenet: ops/NN-*.json
const fs = require('fs'); const D = '/tmp/cs/nat/';
const T = JSON.parse(fs.readFileSync(D + 'terv.json', 'utf8')); const L = JSON.parse(fs.readFileSync(D + 'lapit.json', 'utf8'));
const MAP = JSON.parse(fs.readFileSync(D + 'nk2id.json', 'utf8')); const NEV = JSON.parse(fs.readFileSync(D + 'nevek.json', 'utf8'));
const OUT = D + 'ops/'; fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT);
const PS = { '|': 'noPseudo', '|hover': 'hover', '|focus': 'focus', '|focus-visible': 'focus-visible', '|active': 'active', 'before|': 'before', 'after|': 'after', 'placeholder|': 'placeholder' };
const BP = { main: null, xl: 'xl', medium: 'medium', small: 'small', tiny: 'tiny' };
let n = 0; const ki = (nev, tool, a) => { for (let i = 0; i < a.length; i += 25) fs.writeFileSync(OUT + String(++n).padStart(2, '0') + '-' + nev + '.json', JSON.stringify({ tool, actions: a.slice(i, i + 25) })); };
const disp = s => { if (!NEV[s]) throw new Error('nincs megjelenítendő név: ' + s); return NEV[s]; };
const uj = new Set(T.nevek); const szulo = {};
for (const [k, nv] of Object.entries(T.ujOsztaly)) { const p = MAP[k].styles; if (szulo[nv] && JSON.stringify(szulo[nv]) !== JSON.stringify(p)) throw new Error('eltérő szülőlánc ' + nv); szulo[nv] = p; }
const letre = [...uj].map(nv => { const a = { label: 'uj-' + nv, create_style: { name: nv, properties: [{ property_name: 'box-sizing', property_value: 'border-box' }] } }; if (szulo[nv].length) a.create_style.parent_style_names = szulo[nv]; return a; });
ki('letrehoz', 'data_style_tool', letre);
const elemek = Object.entries(T.ujOsztaly).map(([k, nv]) => ({ label: 'el-' + k + '-' + nv, set_style: { id: MAP[k].id, style_names: [...MAP[k].styles, nv] } }));
ki('elemek', 'data_element_tool', elemek);
const irasok = T.terv.map(t => { const cs = t.lanc; const nv = cs[cs.length - 1]; if (!uj.has(nv)) throw new Error('meglévő osztályba írna: ' + cs.join('.'));
  const a = { label: cs.join('.') + '-' + t.bp + '-' + PS[t.kulcs], update_style: { style_name: nv, properties: Object.entries(t.props).map(([p, v]) => ({ property_name: p, property_value: v })) } };
  if (cs.length > 1) a.update_style.parent_style_names = cs.slice(0, -1).map(disp); if (BP[t.bp]) a.update_style.breakpoint_id = BP[t.bp]; if (PS[t.kulcs] !== 'noPseudo') a.update_style.pseudo = PS[t.kulcs]; return a; });
// a szülőlánc a combo létrehozásakor használt névsorral egyezzen
for (const a of irasok) { const nv = a.update_style.style_name; a.update_style.parent_style_names = szulo[nv].length ? szulo[nv] : undefined; if (!a.update_style.parent_style_names) delete a.update_style.parent_style_names; }
ki('stilus', 'data_style_tool', irasok);
const props = irasok.reduce((s, a) => s + a.update_style.properties.length, 0);
const varos = irasok.reduce((s, a) => s + a.update_style.properties.filter(p => /var\(--_/.test(p.property_value)).length, 0);
console.log('létrehozás', letre.length, '| elem', elemek.length, '| írás', irasok.length, '(tulajdonság', props, ', ebből változóra kötött', varos, ') | fájlok', fs.readdirSync(OUT).length);
