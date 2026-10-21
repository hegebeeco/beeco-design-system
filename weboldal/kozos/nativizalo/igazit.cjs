const pw=require(require('os').homedir()+'/CLAUDE/Csicsergosz-webapp/node_modules/playwright');const fs=require('fs');const U='https://beeco-weboldal.webflow.io/fooldal-szuperhos-draft';
(async()=>{const b=await pw.chromium.launch();const ctx=await b.newContext({javaScriptEnabled:false});await ctx.route(u=>u.href.split('?')[0]===U,r=>r.fulfill({status:200,contentType:'text/html; charset=utf-8',body:fs.readFileSync('/tmp/fs/nat/jelolt.html','utf8')}));
const p=await ctx.newPage();await p.goto(U);
const dom=await p.evaluate(()=>{const f=e=>({nk:e.dataset.nk,tag:e.tagName.toLowerCase(),cl:[...e.classList],ch:(e.classList.contains('w-embed')?[]:[...e.children].map(f))});return f(document.querySelector('.fs-oldal'))});
await b.close();
const fa=JSON.parse(fs.readFileSync('/tmp/fs/nat/fa.json','utf8'));
const map={};const hibak=[];
const igazit=(d,w,ut)=>{map[d.nk]={id:w.id,type:w.type,styles:w.styleNames||[]};
  const wc=(w.children||[]).filter(c=>c.type!=='String');
  if(w.type==='HtmlEmbed'||w.type==='ComponentInstance')return;
  if(wc.length!==d.ch.length){hibak.push(ut+' gyerekszám '+d.ch.length+' vs '+wc.length+' '+d.cl.join('.'));}
  const n=Math.min(wc.length,d.ch.length);
  for(let i=0;i<n;i++){const dc=d.ch[i],w2=wc[i];const dcl=dc.cl.filter(c=>!c.startsWith('w-')).join(' '),wcl=(w2.styleNames||[]).join(' ');
    if(dcl!==wcl&&!(w2.type==='HtmlEmbed'||w2.type==='ComponentInstance'))hibak.push(ut+'>'+i+' osztály '+dcl+' vs '+wcl+' ('+w2.type+')');
    igazit(dc,w2,ut+'>'+i)}};
igazit(dom,fa,'r');
fs.writeFileSync('/tmp/fs/nat/nk2id.json',JSON.stringify(map));
console.log('párosított',Object.keys(map).length,'hiba',hibak.length);console.log(hibak.slice(0,20).join('\n'));
})();
