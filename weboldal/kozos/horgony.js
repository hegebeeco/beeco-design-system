(function(){var d=document,w=window,ut=0;
function fent(){var n=d.querySelector('.cs_fejlec,.navbar,nav.w-nav');return n&&/fixed|sticky/.test(getComputedStyle(n).position)?n.offsetHeight:0}
function hova(c){return Math.max(0,c.getBoundingClientRect().top+scrollY-fent()-8)}
w.addEventListener('click',function(e){var a=e.target&&e.target.closest&&e.target.closest('a[href^="#"]');if(!a||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
var id=decodeURIComponent(a.getAttribute('href').slice(1)),c=id&&d.getElementById(id);if(!c)return;e.preventDefault();
if(a.matches('[role="button"],[role="tab"]')){a.addEventListener('click',function(v){v.stopPropagation()},{once:true});return}
if(a.matches('.w-tab-link,.cs-utvonal_pont'))return;
e.stopImmediatePropagation();if(a.classList.contains('cs_kinek_gomb'))return;
var most=Date.now();if(!e.isTrusted&&most-ut<1200)return;ut=most;
var csend=matchMedia('(prefers-reduced-motion: reduce)').matches,sajat=false,y=hova(c);scrollTo({top:y,behavior:csend?'auto':'smooth'});
try{history.replaceState(history.state,'','#'+id)}catch(x){}
function kez(){sajat=true}['wheel','touchstart','keydown','mousedown'].forEach(function(v){w.addEventListener(v,kez,{once:true,passive:true})});
[900,1700].forEach(function(ms){setTimeout(function(){if(sajat)return;var u=hova(c);if(Math.abs(scrollY-u)>40)scrollTo({top:u,behavior:'auto'})},ms)})},true)})();
