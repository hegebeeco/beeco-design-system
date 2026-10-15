/* beeco navigáció: lenyílók (kattintás, Esc, kattintás kívül), mobil menügomb, aktuális oldal jelölése. */
(function(){
  document.querySelectorAll('.bn').forEach(function(bn){
    if(bn.dataset.bnKesz)return;bn.dataset.bnKesz='1';
    var elemek=[].slice.call(bn.querySelectorAll('.bn-elem')),hamb=bn.querySelector('.bn-hamb'),mob=window.matchMedia('(max-width:991px)');
    /* a Webflow-beszúrás elhagyja az ARIA-attribútumokat: itt állítjuk be */
    [].forEach.call(bn.querySelectorAll('.bn-gomb,.bn-hamb'),function(g){var id=(g.getAttribute('href')||'').slice(1);g.setAttribute('role','button');g.setAttribute('aria-expanded','false');if(id)g.setAttribute('aria-controls',id)});
    function zar(kiveve){elemek.forEach(function(el){if(el===kiveve)return;el.classList.remove('bn-nyitva');var g=el.querySelector('.bn-gomb');if(g)g.setAttribute('aria-expanded','false')})}
    elemek.forEach(function(el){var g=el.querySelector('.bn-gomb');if(!g)return;
      g.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();var ny=!el.classList.contains('bn-nyitva');zar(el);el.classList.toggle('bn-nyitva',ny);g.setAttribute('aria-expanded',ny?'true':'false');
        if(window.dataLayer)window.dataLayer.push({event:'menu_csoport',csoport:g.textContent.trim(),nyitva:ny})});
      g.addEventListener('keydown',function(e){if(e.key===' '){e.preventDefault();g.click()}});
    });
    if(hamb)hamb.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();var ny=!bn.classList.contains('bn-mobil-nyitva');bn.classList.toggle('bn-mobil-nyitva',ny);hamb.setAttribute('aria-expanded',ny?'true':'false');if(!ny)zar()});
    document.addEventListener('click',function(e){if(!mob.matches&&!bn.contains(e.target))zar()},true);
    document.addEventListener('keydown',function(e){if(e.key!=='Escape')return;var ny=bn.querySelector('.bn-elem.bn-nyitva .bn-gomb');if(ny){zar();ny.focus()}else if(bn.classList.contains('bn-mobil-nyitva')&&hamb){hamb.click();hamb.focus()}});
    bn.addEventListener('click',function(e){var a=e.target.closest('.bn-csempe,.bn-kiemel-link,.bn-bolt,.bn-most,.bn-cta');if(a&&window.dataLayer)window.dataLayer.push({event:'menu_kattintas',cel:a.getAttribute('href')})});
    /* aktuális oldal: a csempén és a csoportgombon jelölés */
    var ut=location.pathname.replace(/\/+$/,'')||'/';
    bn.querySelectorAll('.bn-csempe').forEach(function(a){var h=(a.getAttribute('href')||'').replace(/\/+$/,'');if(h&&h===ut){a.setAttribute('aria-current','page');var g=a.closest('.bn-elem').querySelector('.bn-gomb');if(g)g.classList.add('bn-aktualis')}});
  });
})();
