const pw=require(require('os').homedir()+'/CLAUDE/Csicsergosz-webapp/node_modules/playwright');const fs=require('fs');const U='https://beeco-weboldal.webflow.io/fooldal-szuperhos-draft';
const [NK,KW]=process.argv.slice(2);
(async()=>{const b=await pw.chromium.launch();for(const f of ['jelolt.html','szim2.html']){const ctx=await b.newContext({viewport:{width:1440,height:900}});await ctx.route(u=>u.href.split('?')[0]===U,r=>r.fulfill({status:200,contentType:'text/html; charset=utf-8',body:fs.readFileSync('/tmp/fs/nat/'+f,'utf8')}));const p=await ctx.newPage();await p.goto(U);await p.waitForTimeout(2000);
console.log('== '+f);console.log(await p.evaluate(([NK,KW])=>{const e=document.querySelector(`[data-nk="${NK}"]`);const out=['osztaly: '+e.className+' | parent: '+e.parentElement.className+' '+(e.closest('[aria-pressed]')||{}).outerHTML?.slice(0,80)];
 for(const sh of document.styleSheets){let rs;try{rs=sh.cssRules}catch(_){continue}const src=(sh.ownerNode.id||sh.ownerNode.dataset.fs||'').toString();
  const walk=(rs,m)=>{for(const r of rs){if(r.cssRules&&r.type!==1){walk(r.cssRules,r.conditionText||m);continue}if(r.type!==1)continue;let ok=false;try{ok=e.matches(r.selectorText)}catch(_){}
   if(ok&&r.style.cssText.includes(KW))out.push(src+' '+(m||'')+' '+r.selectorText.slice(0,100)+' → '+r.style.cssText.slice(0,160))}};walk(rs,'')}
 return out.join('\n')},[NK,KW]));await ctx.close()}await b.close()})();
