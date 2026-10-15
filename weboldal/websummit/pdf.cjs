const pw=require(require('os').homedir()+'/CLAUDE/Csicsergosz-webapp/node_modules/playwright');
(async()=>{const b=await pw.chromium.launch();const p=await b.newPage();await p.goto('file://'+__dirname+'/one-pager.html',{waitUntil:'networkidle'});await p.waitForTimeout(800);
const tul=await p.evaluate(()=>({h:document.body.scrollHeight,w:document.body.scrollWidth,ch:document.body.clientHeight}));console.log('méret',tul);
await p.pdf({path:__dirname+'/beeco-websummit-onepager.pdf',format:'A4',printBackground:true,margin:{top:0,right:0,bottom:0,left:0}});
await p.setViewportSize({width:794,height:1123});await p.screenshot({path:__dirname+'/one-pager.png',fullPage:false});await b.close()})();
