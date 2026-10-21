const pw=require(require('os').homedir()+'/CLAUDE/Csicsergosz-webapp/node_modules/playwright');const fs=require('fs');
const U='https://beeco-weboldal.webflow.io/fooldal-szuperhos-draft';const [NK,PROP,FILE]=process.argv.slice(2);
(async()=>{const b=await pw.chromium.launch();
for(const f of ['jelolt.html',FILE||'szim2.html']){const ctx=await b.newContext({viewport:{width:+(process.env.W||1440),height:900}});
 await ctx.route(u=>u.href.split('?')[0]===U,r=>r.fulfill({status:200,contentType:'text/html; charset=utf-8',body:fs.readFileSync('/tmp/fs/nat/'+f,'utf8')}));
 const p=await ctx.newPage();await p.goto(U);await p.waitForTimeout(2000);
 console.log('== '+f);console.log(await p.evaluate(([NK,PROP])=>{const e=/^\d+$/.test(NK)?document.querySelector(`[data-nk="${NK}"]`):document.querySelector(NK);const out=['osztaly: '+e.className+' | '+PROP+'='+getComputedStyle(e).getPropertyValue(PROP)];
  for(const sh of document.styleSheets){let rs;try{rs=sh.cssRules}catch(_){continue}const src=(sh.ownerNode.id||sh.ownerNode.dataset.fs||sh.href||'').toString().slice(-25);
   const walk=(rs,m)=>{for(const r of rs){if(r.cssRules&&r.type!==1){walk(r.cssRules,r.conditionText||m);continue}if(r.type!==1)continue;let ok=false;try{ok=e.matches(r.selectorText)}catch(_){}
    if(ok&&r.style.getPropertyValue(PROP))out.push(src+' '+(m||'')+' '+r.selectorText.slice(0,90)+' → '+r.style.getPropertyValue(PROP))}};walk(rs,'')}
  let x=e.parentElement,d=0;while(x&&d<3){out.push('  ős: '+x.className.slice(0,60)+' '+PROP+'='+getComputedStyle(x).getPropertyValue(PROP));x=x.parentElement;d++}
  return out.join('\n')},[NK,PROP]));await ctx.close()}
await b.close()})();
