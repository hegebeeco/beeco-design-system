/* CsicsergŐsz kampányoldal mérése (Levi 7 eseménye).
   A site-on nincs GTM, a „Tag manager” komponens közvetlen GA4 (gtag, G-6KVDRD0YQF): ezért gtag('event')-tel küldünk,
   a dataLayer-objektum csak egy későbbi GTM-nek szól (a gtag a sima objektumot nem továbbítja).
   Kattintás: EGY ablakszintű, capture fázisú figyelő. Ok: a site-szintű Trustindex a horgonykattintást megállítja és
   150 ms múlva újrakattint; az ugyanarra az elemre 600 ms-on belül jövő második kattintást nem számoljuk.
   scroll_depth: a site-kód (beeco 5/5) már küldi 25/50/75/90-nél, itt nem küldjük újra. */
(function(){
  var d=document, mobil=matchMedia('(max-width:767px)').matches, ua=navigator.userAgent;
  var ios=/iPhone|iPad|iPod/i.test(ua), android=/Android/i.test(ua);
  var STORE={ios:'https://apps.apple.com/hu/app/beeco/id6478549279?l=hu',android:'https://play.google.com/store/apps/details?id=hu.beeco.app'};
  var SOCIAL='a[href*="facebook.com"],a[href*="instagram.com"],a[href*="tiktok.com"],a[href*="youtube.com"],a[href*="linkedin.com"]';
  function kuld(n,p){p=p||{};if(typeof window.gtag==='function')window.gtag('event',n,p);(window.dataLayer=window.dataLayer||[]).push(Object.assign({event:n},p));}
  var utoljara=typeof WeakMap==='function'?new WeakMap():null;
  var u=new URLSearchParams(location.search);
  kuld('campaign_landing_view',{source:u.get('utm_source')||'',medium:u.get('utm_medium')||'',campaign:u.get('utm_campaign')||'csicsergosz',device:mobil?'mobile':'desktop'});
  if(mobil&&(ios||android))d.querySelectorAll('[data-cs-event="primary_cta"]').forEach(function(a){a.href=ios?STORE.ios:STORE.android;a.target='_blank';a.rel='noopener';});
  d.querySelectorAll(SOCIAL).forEach(function(a){if(!a.getAttribute('aria-label'))a.setAttribute('aria-label',(a.hostname||'').replace('www.','').split('.')[0]);});
  var gyik=[].slice.call(d.querySelectorAll('.gyik_item'));
  gyik.forEach(function(g){var q=g.querySelector('.text-size-large');g.setAttribute('tabindex','0');g.setAttribute('role','button');if(q)g.setAttribute('aria-label',q.textContent.trim());g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();g.click();}});});
  addEventListener('click',function(e){
    var t=e.target; if(!t||!t.closest)return; var a;
    var cel=t.closest('a,.gyik_item'), most=Date.now(); if(cel&&utoljara){if(most-(utoljara.get(cel)||0)<600)return; utoljara.set(cel,most);}
    if(a=t.closest('a[data-cs-activity]')){kuld('campaign_activity_select',{activity_type:a.getAttribute('data-cs-activity'),target_anchor:a.getAttribute('href')});return;}
    if(a=t.closest('[data-cs-event="primary_cta"]')){kuld('campaign_primary_cta_click',{placement:a.getAttribute('data-cs-placement')||'',destination:a.getAttribute('href'),platform:ios?'ios':(android?'android':'web')});return;}
    if(a=t.closest('a[href*="apps.apple.com"],a[href*="play.google.com"]')){var s=a.closest('section,[id]');kuld('campaign_primary_cta_click',{placement:s?(s.id||'store'):'store',destination:a.href,platform:/apple/.test(a.href)?'ios':'android'});return;}
    if(a=t.closest(SOCIAL)){kuld('campaign_social_click',{platform:(a.hostname||'').replace('www.',''),placement:'sziget'});return;}
    if(a=t.closest('.gyik_item')){kuld('campaign_faq_expand',{question_id:'q'+(gyik.indexOf(a)+1)});}
  },true);
  var f=d.querySelector('form[id^="wf-form"]'); if(f) f.addEventListener('submit',function(){kuld('campaign_newsletter_click',{placement:'sziget'});});
})();
