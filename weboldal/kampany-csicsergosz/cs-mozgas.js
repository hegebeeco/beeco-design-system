/* CsicsergŐsz mozgáskészlet v1 (cs-mozgas.js). Párja: cs-mozgas.css.
   A fejlécben előbb fut: document.documentElement.classList.add('cs-js') + 2,5 mp-es vészfék.
   Egyszer mutat meg mindent (nem ismétel), és a lépcsőt testvérenként számolja. */
(function(){
  var d=document, h=d.documentElement, csend=matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.csMozgasKesz=true;
  function sorszam(el){var i=0,s=el.previousElementSibling;while(s){if(s.hasAttribute('data-cs-anim'))i++;s=s.previousElementSibling;}return i;}
  d.querySelectorAll('[data-cs-anim]').forEach(function(el){el.style.setProperty('--cs-i',Math.min(sorszam(el),6));});
  d.querySelectorAll('[data-cs-gyerekek]').forEach(function(k){Array.prototype.forEach.call(k.children,function(c,i){c.style.setProperty('--cs-i',Math.min(i,6));});});
  function szamlal(el){
    var cel=parseInt(el.getAttribute('data-cs-szamlal'),10), n=el.firstChild;
    while(n&&n.nodeType!==3)n=n.firstChild;
    if(!n||isNaN(cel)||csend)return;
    var eredeti=n.nodeValue, minta=String(cel), hossz=parseFloat(getComputedStyle(h).getPropertyValue('--_csicsergosz---cs-ido-szamlalo-ms'))||1200, t0=null;
    if(eredeti.indexOf(minta)<0)return;
    el.setAttribute('aria-label',el.textContent.trim());
    function lep(t){if(!t0)t0=t;var p=Math.min((t-t0)/hossz,1),e=1-Math.pow(1-p,3);n.nodeValue=eredeti.replace(minta,String(Math.round(cel*e)));if(p<1)requestAnimationFrame(lep);else n.nodeValue=eredeti;}
    requestAnimationFrame(lep);
  }
  var celok=d.querySelectorAll('[data-cs-anim],[data-cs-gyerekek],[data-cs-szamlal]');
  function mutat(el){el.classList.add('cs-latszik');if(el.hasAttribute('data-cs-szamlal'))szamlal(el);}
  if(!('IntersectionObserver' in window)){celok.forEach(mutat);return;}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){mutat(e.target);io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px',threshold:0.12});
  celok.forEach(function(el){io.observe(el);});
})();
