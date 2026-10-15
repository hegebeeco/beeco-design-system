// DOM ↔ Designer-elemfa (CsicsergŐsz-másolat). Kimenet: nk2id.json {nk:{id,type,styles,komp}}, nevek.json {slug: megjelenítendő név}
const pw=require(require('os').homedir()+'/CLAUDE/Csicsergosz-webapp/node_modules/playwright');const fs=require('fs');const U='https://beeco-weboldal.webflow.io/kampanyok/csicsergosz-nativ-draft';
const slug=n=>{let s=n.toLowerCase().replace(/\s+/g,'-');if(/^\d/.test(s))s='_'+s;return s};
(async()=>{const b=await pw.chromium.launch();const ctx=await b.newContext({javaScriptEnabled:false});await ctx.route(u=>u.href.split('?')[0]===U,r=>r.fulfill({status:200,contentType:'text/html; charset=utf-8',body:fs.readFileSync('/tmp/cs/nat/jelolt.html','utf8')}));
const p=await ctx.newPage();await p.goto(U);
const dom=await p.evaluate(()=>{const f=e=>({nk:e.dataset.nk,tag:e.tagName.toLowerCase(),cl:[...e.classList],ch:(e.classList.contains('w-embed')?[]:[...e.children].filter(c=>!/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|LINK|META)$/.test(c.tagName)).map(f))});return [...document.querySelectorAll('body > [class*="dia_"]')].map(f)});
await b.close();
const fa=JSON.parse(fs.readFileSync('/tmp/cs/nat/fa-teljes.json','utf8'));
const gyok=fa.children.filter(c=>(c.styleNames||[]).some(n=>/^dia_/i.test(n)));
const map={},nevek={},hibak=[];
const jelol=(d,w,komp)=>{map[d.nk]={id:w?w.id:null,type:w?w.type:'?',styles:w?(w.styleNames||[]):[],komp};d.ch.forEach(c=>jelol(c,null,true))};
const igazit=(d,w,ut,komp)=>{if(komp||w.type==='ComponentInstance'){jelol(d,w,true);return}
  map[d.nk]={id:w.id,type:w.type,styles:w.styleNames||[],komp:false};
  (w.styleNames||[]).forEach(n=>nevek[slug(n)]=n);
  if(w.type==='HtmlEmbed'){d.ch.forEach(c=>jelol(c,null,true));return}
  const wc=(w.children||[]).filter(c=>c.type!=='String'&&!(c.settings&&c.settings.visibility===false));
  if(wc.length!==d.ch.length)hibak.push(ut+' gyerekszám DOM '+d.ch.length+' vs WF '+wc.length+' '+d.cl.join('.')+' | '+d.ch.map(x=>x.tag).join(',')+' | '+wc.map(x=>x.type).join(','));
  const n=Math.min(wc.length,d.ch.length);
  for(let i=0;i<n;i++){const dc=d.ch[i],w2=wc[i];const dcl=dc.cl.filter(c=>!c.startsWith('w-')).join(' '),wcl=(w2.styleNames||[]).map(slug).join(' ');
    if(dcl!==wcl&&w2.type!=='ComponentInstance'&&w2.type!=='HtmlEmbed')hibak.push(ut+'>'+i+' osztály '+dcl+' vs '+wcl+' ('+w2.type+')');
    igazit(dc,w2,ut+'>'+i,false)}
  for(let i=n;i<d.ch.length;i++)jelol(d.ch[i],null,true)};
if(gyok.length!==dom.length)hibak.push('gyökér '+dom.length+' vs '+gyok.length);
dom.forEach((d,i)=>igazit(d,gyok[i],'s'+i,false));
fs.writeFileSync('/tmp/cs/nat/nk2id.json',JSON.stringify(map));fs.writeFileSync('/tmp/cs/nat/nevek.json',JSON.stringify(nevek));
const v=Object.values(map);console.log('párosított',v.length,'| komponensben/embedben',v.filter(x=>x.komp).length,'| hiba',hibak.length);console.log(hibak.slice(0,25).join('\n'));
})();
