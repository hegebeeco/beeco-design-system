/* GENERÁLT – forrás: fs.src.js; építés: node build.mjs */
/* ============================================================
   beeco.hu főoldal – Szuperhős méhecske (fs-)  ·  forrás
   A Webflow natív elemeire épül (a Designerben is látszanak); ez a szkript adja:
   a méhecskét (a hivatalos csontváz-rigből), a lábnyom-útvonalat, a hero funkcióválasztót,
   a közösségi lábnyom-vásznat, a „Kinek szól?” kvízt, az okos boltgombot, a ragadós mobilsávot,
   a sötét/világos kapcsolót és a mérést (dataLayer).
   Építés: node weboldal/fooldal-szuperhos/build.mjs  →  fs.js (+ embed/*.css)
   ============================================================ */
(function () {
'use strict';
if (window.__fsFut) return; window.__fsFut = true;
const d = document, $ = (s, r) => (r || d).querySelector(s), $$ = (s, r) => Array.from((r || d).querySelectorAll(s));
const oldal = $('.fs-oldal'); if (!oldal) return;
const RM = matchMedia('(prefers-reduced-motion: reduce)'), kevesMozgas = () => RM.matches;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const gorget = el => el && el.scrollIntoView({ behavior: kevesMozgas() ? 'auto' : 'smooth', block: 'start' });
const NS = 'http://www.w3.org/2000/svg';
const ikon = (n, cls) => '<svg class="' + (cls || '') + '" aria-hidden="true" focusable="false"><use href="#fs-i-' + n + '"/></svg>';
d.documentElement.classList.add('fs-js');

/* ---------- szimbólumok és rig ---------- */
const sprite = d.createElement('div');
sprite.innerHTML = '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs><symbol id="fs-i-lab" viewBox="0 0 32 32"><path d="M11 4c3 0 4.5 3 4.5 7.5S14 21 13 24.5 10.5 29 8.5 28.5 5.5 26 6 22.5 7 16 7 12 8 4 11 4z" fill="currentColor"/><circle cx="20" cy="7" r="2.2" fill="currentColor"/><circle cx="24" cy="10" r="1.9" fill="currentColor"/><circle cx="26.2" cy="14.2" r="1.7" fill="currentColor"/><circle cx="26.5" cy="18.6" r="1.5" fill="currentColor"/></symbol><symbol id="fs-i-pin" viewBox="0 0 32 32"><path d="M16 29s-9-9.3-9-16a9 9 0 0 1 18 0c0 6.7-9 16-9 16z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><circle cx="16" cy="13" r="3.4" fill="currentColor"/></symbol><symbol id="fs-i-nap" viewBox="0 0 32 32"><rect x="4" y="6.5" width="24" height="21" rx="3" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M4 12.5h24M10 3.5v6M22 3.5v6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M9 17h3v3H9zM15 17h3v3h-3zM21 17h3v3h-3zM9 22h3v3H9zM15 22h3v3h-3z" fill="currentColor"/></symbol><symbol id="fs-i-kupon" viewBox="0 0 32 32"><path d="M4 9a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v4a3 3 0 0 0 0 6v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4a3 3 0 0 0 0-6z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><path d="M12 20l8-8" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><circle cx="12.5" cy="12.5" r="1.8" fill="currentColor"/><circle cx="19.5" cy="19.5" r="1.8" fill="currentColor"/></symbol><symbol id="fs-i-csepp" viewBox="0 0 32 32"><path d="M16 3.5S7 14 7 20a9 9 0 0 0 18 0c0-6-9-16.5-9-16.5z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><path d="M12 21a4 4 0 0 0 4 4" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></symbol><symbol id="fs-i-raj" viewBox="0 0 32 32"><circle cx="11" cy="11" r="4" fill="none" stroke="currentColor" stroke-width="2.6"/><circle cx="22" cy="12" r="3.3" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M3.5 26c.6-4.6 3.6-7 7.5-7s6.9 2.4 7.5 7M18 19.6c.9-.4 2.3-.6 4-.6 3.3 0 5.9 2 6.5 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></symbol><symbol id="fs-i-hir" viewBox="0 0 32 32"><path d="M16 4a8 8 0 0 0-4.5 14.6c.8.6 1.5 1.9 1.5 3.4h6c0-1.5.7-2.8 1.5-3.4A8 8 0 0 0 16 4z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><path d="M12.5 26h7M14 29.5h4" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></symbol><symbol id="fs-i-kosar" viewBox="0 0 32 32"><path d="M4 11h24l-2.5 15a2 2 0 0 1-2 1.7h-15A2 2 0 0 1 6.5 26z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><path d="M11 11l4-7M21 11l-4-7" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></symbol><symbol id="fs-i-auto" viewBox="0 0 32 32"><path d="M5 20v-4l3-7h16l3 7v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zM5 16h22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><circle cx="10" cy="24" r="2.6" fill="currentColor"/><circle cx="22" cy="24" r="2.6" fill="currentColor"/></symbol><symbol id="fs-i-busz" viewBox="0 0 32 32"><rect x="6" y="4" width="20" height="21" rx="3" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M6 15h20M6 9h20" stroke="currentColor" stroke-width="2.4"/><circle cx="11" cy="20" r="1.8" fill="currentColor"/><circle cx="21" cy="20" r="1.8" fill="currentColor"/><path d="M9 25v3M23 25v3" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></symbol><symbol id="fs-i-bicaj" viewBox="0 0 32 32"><circle cx="8" cy="21" r="5" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="24" cy="21" r="5" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M8 21l5-9h8l3 9M13 12l3 9h-8M19 8h4" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/></symbol><symbol id="fs-i-hus" viewBox="0 0 32 32"><path d="M8 22c-4-4-3-12 4-15s14 0 15 6-5 12-11 12c-3 0-5-1-8-3z" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M8 22l-4 5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><circle cx="17" cy="15" r="3" fill="currentColor"/></symbol><symbol id="fs-i-level" viewBox="0 0 32 32"><path d="M6 26C6 13 13 6 27 5c0 14-7 21-19 21z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><path d="M6 26 18 14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></symbol><symbol id="fs-i-tal" viewBox="0 0 32 32"><path d="M5 15h22a11 11 0 0 1-22 0z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><path d="M12 10c0-2 2-2 2-4M18 10c0-2 2-2 2-4" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></symbol><symbol id="fs-i-kuka" viewBox="0 0 32 32"><path d="M7 9h18l-1.6 18a2 2 0 0 1-2 1.8H10.6a2 2 0 0 1-2-1.8zM4.5 9h23M13 9V5h6v4" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/></symbol><symbol id="fs-i-ajandek" viewBox="0 0 32 32"><rect x="5" y="12" width="22" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M4 12h24M16 12v15M16 12c-2-5-7-6-7-3s4 3 7 3c3 0 7 0 7-3s-5-2-7 3" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/></symbol><symbol id="fs-i-csere" viewBox="0 0 32 32"><path d="M6 12a10 10 0 0 1 18-4M26 20a10 10 0 0 1-18 4" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M24 3v5h-5M8 29v-5h5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></symbol><symbol id="fs-i-varos" viewBox="0 0 32 32"><path d="M4 28V14l7-5 7 5v14M18 28V8h10v20M3 28h26M9 20h4M9 24h4M22 13h2M22 18h2M22 23h2" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/></symbol><symbol id="fs-i-bolt" viewBox="0 0 32 32"><path d="M4 12l2-6h20l2 6M4 12h24v2a4 4 0 0 1-8 0 4 4 0 0 1-8 0 4 4 0 0 1-8 0zM6 17v11h20V17M13 28v-7h6v7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/></symbol><symbol id="fs-i-ceg" viewBox="0 0 32 32"><rect x="5" y="5" width="16" height="23" rx="1.5" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M21 12h6v16h-6M9 10h3M14 10h3M9 15h3M14 15h3M9 20h3M14 20h3M3 28h26" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></symbol><symbol id="fs-i-cel" viewBox="0 0 32 32"><circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="16" cy="16" r="7" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="16" cy="16" r="2.4" fill="currentColor"/></symbol><symbol id="fs-i-play" viewBox="0 0 24 24"><path d="M4 2.8v18.4c0 .6.7 1 1.2.7L21 12.7c.5-.3.5-1.1 0-1.4L5.2 2.1C4.7 1.8 4 2.2 4 2.8z" fill="currentColor"/></symbol><symbol id="fs-i-alma" viewBox="0 0 24 24"><path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.9-3-.8C7 7.4 5.6 8.3 4.8 9.7c-1.7 2.9-.4 7.2 1.2 9.6.8 1.2 1.7 2.4 3 2.4 1.2-.1 1.6-.8 3.1-.8s1.8.8 3 .8c1.3 0 2.1-1.2 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7 0 0-2.5-1-2.9-4.1zM14.1 5.6c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.5 2.7-1.3z" fill="currentColor"/></symbol><symbol id="fs-i-nap-ikon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol><symbol id="fs-i-hold" viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></symbol></defs></svg>';
d.body.appendChild(sprite.firstChild);
const RIG = (() => { const t = d.createElement('template'); t.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"170\" height=\"170\" viewBox=\"0 0 170 170\" fill=\"none\" role=\"img\" aria-labelledby=\"hos-rig-cim hos-rig-leiras\" data-karakter=\"hos\"> <title id=\"hos-rig-cim\">Szuperhős méhecske – csontváz-rig</title> <desc id=\"hos-rig-leiras\">Szuperhős méhecske csontokra bontva: minden csont egy &lt;g data-csont&gt; csoport (pivot: data-pivot, szülő: data-szulo); az arc-változatok data-arc csoportok. Leírás: hos-csontvaz.json.</desc> <g id=\"karakter\" data-skala=\"0.58\" transform=\"matrix(0.5814 0 0 0.5814 -3.01 25.15)\"> <g id=\"csont-root\" data-csont=\"root\" data-pivot=\"195,138\" data-szulo=\"\"> <g id=\"csont-test\" data-csont=\"test\" data-pivot=\"195,197\" data-szulo=\"root\"> <g id=\"csont-szarnyJobb\" data-csont=\"szarnyJobb\" data-pivot=\"218,80\" data-szulo=\"test\"> <g data-reteg=\"szarny-hatso-alja\"><path d=\"M229.106 82.7136L223.441 85.5771L223.436 85.5768L214.69 89.999L211.288 84.6103L210.855 83.9233L208.688 80.4884L207.035 77.8692L207.76 77.8872L210.143 77.9383L215.633 78.0584L219.099 78.1337L225.976 81.2802L229.106 82.7136Z\" fill=\"#92DDEA\"/></g> </g> <g id=\"csont-labakHatso\" data-csont=\"labakHatso\" data-pivot=\"132,170\" data-szulo=\"test\"> <g data-reteg=\"labak-hatso\"><path d=\"M129.157 170.904L127.152 171.044L122.538 172.256L116.436 173.733L113.385 177.584L110.507 173.375L115.032 168.576L125.871 167.635L128.241 167.429L129.157 170.904Z\" fill=\"#000000\"/><path d=\"M145.262 184.853L135.801 189.072L134.477 195.44L130.25 192.86L132.937 185.816L140.527 182.229L145.262 184.853Z\" fill=\"#000000\"/></g> </g> <g id=\"csont-labakElso\" data-csont=\"labakElso\" data-pivot=\"242,185\" data-szulo=\"test\"> <g data-reteg=\"labak-elso\"><path d=\"M257.386 181.071L265.717 183.355L268.188 187.637L265.287 190.471L263.538 186.151L256.168 183.852L257.386 181.071Z\" fill=\"#000000\"/><path d=\"M247.234 197.544L242.065 200.081L241.667 195.081L231.7 189.16L237.142 187.043L245.446 192.273L247.234 197.544Z\" fill=\"#000000\"/></g> </g> <g data-reteg=\"test\"><path d=\"M219 195.36L217.83 195.64L203.36 197.54L196.66 198.51L188.93 198.9L186.14 199.07L184.58 198.56L178.56 196.57L174.7 195.3L173.26 194.83L166.89 192.72L158.53 189.96L155.9 189.1L150.27 187.24L146.93 186.14L142.23 184.59L138.47 183.35L136.22 182.6L135.81 182.47L130.01 180.55L127.27 179.65L126.24 179.31L124.87 178.86L124.04 178.16L120.19 172.1L122.05 172L121.62 170.53L119.42 170.68L114.52 161.69L112.95 158.82L110.27 153.9L101.76 132.72L102.54 119.92L104.18 114.82L108.78 100.56L116.95 92.65L126.65 87.34L134.05 84.9L136.39 84.3L145.19 82.04L150.29 80.73L162.96 77.48L165.61 76.79L168.46 76.87L175.95 77.07L177.49 77.11L181.64 77.22L182.97 77.25L189.72 77.43L195.99 77.6L199.44 77.69L207.19 77.9L207.91 77.92L210.3 77.98L215.79 78.13L215.85 78.13L219.25 78.22L226.15 81.04L228.72 82.09L229.29 82.33L229.97 82.6L231.45 83.24L239.43 86.48L244.26 88.46L251.75 91.52L251.99 91.62Z\" fill=\"#FECF39\"/><path d=\"M163.115 106.125L156.635 124.609L155.497 143.451L157.337 161.42L161.619 180.291L165.438 192.324L158.289 189.896L155.668 189.032L150.864 187.509L147.846 176.003L143.398 160.578L141.314 143.959L143.521 123.816L150.073 103.971L170.177 84.4542L177.25 76.983L181.395 77.0924L181.401 77.0927L182.719 77.1269L189.466 77.307L195.729 77.4761L188.214 84.6975L163.115 106.125Z\" fill=\"#5D300F\"/><path d=\"M133.179 104.131L126.353 121.771L125.165 141.414L128.05 163.208L135.998 183.346L135.583 183.212L129.759 181.29L127.012 180.384L126.042 179.828L125.191 179.433L124.635 179.056L123.294 177.603L120.363 172.449L116.572 165.7L114.225 161.097L113.522 156.356L113.523 156.351L110.311 141.885L111.636 119.971L119.377 101.813L124.077 97.5918L136.159 84.7392L144.996 82.4709L150.112 81.1599L162.825 77.8981L146.805 93.2922L133.179 104.131Z\" fill=\"#5D300F\"/><path d=\"M228.703 82.079L225.705 85.0466L220.287 90.3978L204.247 103.362L192.403 117.989L186.991 136.347L184.522 155.279L186.092 171.833L191.973 187.039L196.644 198.492L191.003 199.181L186.042 199.053L184.478 198.54L181.193 197.449L176.33 184.433L171.742 170.966L169.654 155.746L172.309 135.46L178.725 115.797L192.073 98.694L207.625 85.4645L208.346 84.7119L215.803 78.1142L219.213 78.202L226.127 81.027L228.703 82.079Z\" fill=\"#5D300F\"/></g> <g id=\"csont-fullank\" data-csont=\"fullank\" data-pivot=\"103,121\" data-szulo=\"test\"> <g data-reteg=\"fullank\"><path d=\"M103.368 119.841L102.258 126.415L99.075 123.077L95.1352 120.472L100.105 120.772L103.368 119.841Z\" fill=\"#000000\"/></g> </g> <g data-reteg=\"test-feny\"><path d=\"M183.039 77.7767L193.674 84.8725L178.199 84.5234L162.873 85.3134L152.721 87.5272L139.972 91.0991L124.714 97.0187L107.294 105.228L108.726 100.596L116.958 92.7054L126.911 87.1906L135.087 84.5392L149.373 81.0337L165.663 76.7756L177.043 77.1139L182.744 77.109L183.039 77.7767Z\" fill=\"#FFFFFF\" opacity=\"0.42\"/><path d=\"M230.38 86.43L226.92 85.64L223.65 84.87L217.23 83.92L211.28 84.62L210.27 84.63L210.85 83.93L215.62 78.07L219.09 78.14L225.64 80.83L228.54 82.03L229.67 82.43L229.78 83.03Z\" fill=\"#FFFFFF\" opacity=\"0.42\"/><path d=\"M247.88 89.96L243.66 89.01L237.53 87.24L231.93 86.63L231.44 83.23L239.29 86.47Z\" fill=\"#FFFFFF\" opacity=\"0.42\"/><path d=\"M219 195.34L217.65 195.65L196.65 198.5L186.02 199.06L184.47 198.56L174.6 195.4L173.16 194.94L158.44 190.22L155.82 189.38L146.85 186.5L142.16 185L126.4 179.5L125.04 178.9L124.2 178.33L114.52 161.79L110.28 153.81L112.93 156.38L114.73 158.37L124.03 165.52L134.72 173.37L145.53 176.66L156.87 180.12L168.8 183.76L173.2 184.75L182.93 186.94L190.08 188.55L202.1 189.39L217.06 190.19L220.83 189.59Z\" fill=\"#000000\" opacity=\"0.14\"/></g> <g id=\"csont-fej\" data-csont=\"fej\" data-pivot=\"196,140\" data-szulo=\"test\"> <g data-reteg=\"fej-darab\"><path d=\"M288.26 139.15L280.16 166.04L268.14 179.66L258.13 184.31L245.03 188.56L240.91 190.08L234.52 191.7L217.83 195.64L203.36 197.54L199.25 198.13L198.05 195.13L194.42 186.05L188.65 171.19L187.12 155.34L189.55 136.84L194.7 119.38L227.52 86.86L231.32 83.19L231.45 83.24L239.43 86.48L244.26 88.46L251.75 91.52L252.35 91.77L255.74 93.16L270.23 101.61L281.75 116.68Z\" fill=\"#FECF39\"/><path d=\"M228.87 85.56L230.03 84.44L230.38 86.43L228.43 85.98Z\" fill=\"#FFFFFF\" opacity=\"0.42\"/><path d=\"M247.88 89.96L243.66 89.01L237.53 87.24L231.93 86.63L231.44 83.23L239.29 86.47Z\" fill=\"#FFFFFF\" opacity=\"0.42\"/><path d=\"M274.52 172.49L268.32 179.49L258.05 184.36L236.27 191.46L217.65 195.65L199.26 198.14L195.57 188.94L202.1 189.39L217.06 190.19L235.59 187.24L257.09 182.25Z\" fill=\"#000000\" opacity=\"0.14\"/></g> <g id=\"csont-arc\" data-csont=\"arc\" data-pivot=\"244.57,130.08\" data-szulo=\"fej\"> <g id=\"csont-pir\" data-csont=\"pir\" data-pivot=\"244.57,130.08\" data-szulo=\"arc\"> <g data-reteg=\"arc-pir\"><g data-arc=\"meleg\" display=\"none\"><path d=\"M219.48 154.18L226.13 156.34L226.13 160.65L219.48 162.81L212.84 160.65L212.84 156.34Z\" fill=\"#EA6C18\" opacity=\"0.45\"/><path d=\"M275.07 147.28L280.06 149.12L280.06 152.8L275.07 154.64L270.09 152.8L270.09 149.12Z\" fill=\"#EA6C18\" opacity=\"0.45\"/></g></g> </g> <g id=\"csont-szemBal\" data-csont=\"szemBal\" data-pivot=\"226.57,133.43\" data-szulo=\"arc\"> <g data-reteg=\"arc-szemBal\"><g data-arc=\"alap\"><path d=\"M224.493 122.702L216.647 126.245L213.547 133.319L216.989 141.216L225.184 144.158L235.626 142.343L239.586 135.767L238.004 126.584L231.798 123.144L224.493 122.702Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"pislogo\" display=\"none\"><path d=\"M214.4 141.47L227.46 144.17L239.89 141.27L239.15 137.18L227.39 138.66L215.05 137.36Z\" fill=\"#000000\"/></g><g data-arc=\"vidam\" display=\"none\"><path d=\"M224.49 122.7L216.65 126.25L213.55 133.32L216.28 139.58L237.86 138.63L239.59 135.77L238 126.58L231.8 123.14Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"ujjongo\" display=\"none\"><path d=\"M216.38 143.33L222.08 139.92L227.2 138.58L232.27 139.7L237.61 142.6L240.83 138.9L235.89 132.84L227.05 130.34L218.26 133.19L213.07 139.7Z\" fill=\"#000000\"/></g><g data-arc=\"meleg\" display=\"none\"><path d=\"M216.83 143.08L222.39 140.21L227.2 139.11L232.25 140.07L237.46 142.53L240.38 138.59L235.31 133.43L227.05 131.33L219.15 133.67L213.83 139.19Z\" fill=\"#000000\"/></g><g data-arc=\"buszke\" display=\"none\"><path d=\"M214.65 135.84L216.99 141.22L225.18 144.16L235.63 142.34L239.59 135.77L239.41 134.75Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"nyugodt\" display=\"none\"><path d=\"M214.07 138.82L219.52 143.58L227.43 145.36L235.42 143.56L240.27 138.75L237.56 135.13L232.74 137.56L227.43 138.43L222.02 137.54L216.58 135.06Z\" fill=\"#000000\"/></g><g data-arc=\"alvo\" display=\"none\"><path d=\"M214.17 140.37L220.31 143.7L227.43 144.74L234.6 143.69L240.16 140.33L238.28 136.21L232.95 137.81L227.43 138.29L221.84 137.8L215.88 136.18Z\" fill=\"#000000\"/></g><g data-arc=\"kivancsi\" display=\"none\"><path d=\"M224.49 122.7L216.65 126.25L213.55 133.32L216.99 141.22L225.18 144.16L235.63 142.34L239.59 135.77L238 126.58L231.8 123.14Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"meglepett\" display=\"none\"><path d=\"M224.21 121.49L215.42 125.45L211.95 133.38L215.8 142.22L224.98 145.52L236.68 143.48L241.11 136.12L239.34 125.83L232.39 121.98Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"kacsinto\" display=\"none\"><path d=\"M216.43 142.76L222.19 140.12L227.63 139.27L233.03 140.41L237.96 143.02L241.09 139.24L236.34 133.85L227.83 131.55L219.35 133.38L213.62 138.74Z\" fill=\"#000000\"/></g><g data-arc=\"figyelmes\" display=\"none\"><path d=\"M224.4 122.3L216.24 125.98L213.01 133.34L216.59 141.55L225.12 144.61L235.98 142.72L240.09 135.88L238.45 126.33L231.99 122.76Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"szomoru\" display=\"none\"><path d=\"M214.89 136.4L216.99 141.22L225.18 144.16L235.63 142.34L239.59 135.77L238.84 131.42Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"ijedt\" display=\"none\"><path d=\"M224.25 121.69L215.62 125.59L212.21 133.37L216 142.05L225.01 145.29L236.5 143.29L240.86 136.06L239.12 125.96L232.29 122.18Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"merges\" display=\"none\"><path d=\"M224.493 122.702L216.647 126.245L213.547 133.319L216.989 141.216L225.184 144.158L235.626 142.343L239.586 135.767L238.004 126.584L231.798 123.144L224.493 122.702Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"nyami\" display=\"none\"><path d=\"M216.38 143.33L222.08 139.92L227.2 138.58L232.27 139.7L237.61 142.6L240.83 138.9L235.89 132.84L227.05 130.34L218.26 133.19L213.07 139.7Z\" fill=\"#000000\"/></g><g data-arc=\"olvas\" display=\"none\"><path d=\"M224.49 122.7L216.65 126.25L213.55 133.32L216.99 141.22L225.18 144.16L235.63 142.34L239.59 135.77L238 126.58L231.8 123.14Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"enekel\" display=\"none\"><path d=\"M216.38 143.33L222.08 139.92L227.2 138.58L232.27 139.7L237.61 142.6L240.83 138.9L235.89 132.84L227.05 130.34L218.26 133.19L213.07 139.7Z\" fill=\"#000000\"/></g><g data-arc=\"telefonal\" display=\"none\"><path d=\"M224.493 122.702L216.647 126.245L213.547 133.319L216.989 141.216L225.184 144.158L235.626 142.343L239.586 135.767L238.004 126.584L231.798 123.144L224.493 122.702Z\" fill=\"#FFFFFF\"/></g></g> <g id=\"csont-pupillaBal\" data-csont=\"pupillaBal\" data-pivot=\"226.57,133.43\" data-szulo=\"szemBal\"> <g data-reteg=\"arc-pupillaBal\"><g data-arc=\"alap\"><path d=\"M226.411 126.585L221.911 127.362L218.349 130.292L218.796 134.688L222.615 139.288L229.495 140.402L234.272 137.72L234.763 129.598L226.411 126.585Z\" fill=\"#000000\"/><path d=\"M230.624 127.544L226.834 129.875L229.646 133.799L235.586 133.533L234.882 128.54L230.624 127.544Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"vidam\" display=\"none\"><path d=\"M226.41 126.59L221.91 127.36L218.35 130.29L218.8 134.69L222.62 139.29L222.69 139.3L232.21 138.88L234.27 137.72L234.76 129.6Z\" fill=\"#000000\"/><path d=\"M230.62 127.54L226.83 129.88L229.65 133.8L235.59 133.53L234.88 128.54Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"buszke\" display=\"none\"><path d=\"M221.05 135.56L223.82 138.91L230.7 140.02L235.48 137.34L235.63 134.92Z\" fill=\"#000000\"/></g><g data-arc=\"kivancsi\" display=\"none\"><path d=\"M238.25 127.99L230.64 125.25L226.14 126.03L222.58 128.96L223.03 133.35L226.85 137.95L233.73 139.07L238.51 136.39L238.81 131.29Z\" fill=\"#000000\"/><path d=\"M238.07 126.96L234.86 126.21L231.07 128.54L233.88 132.46L238.98 132.24Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"meglepett\" display=\"none\"><path d=\"M227.28 128.17L224.13 128.71L221.64 130.77L221.95 133.84L224.63 137.06L229.44 137.84L232.79 135.97L233.13 130.28Z\" fill=\"#000000\"/><path d=\"M230.23 128.84L227.58 130.47L229.55 133.22L233.71 133.03L233.21 129.54Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"figyelmes\" display=\"none\"><path d=\"M227.48 125.91L222.8 126.72L219.1 129.76L219.56 134.33L223.53 139.12L230.69 140.28L235.66 137.49L236.17 129.04Z\" fill=\"#000000\"/><path d=\"M231.86 126.91L227.92 129.33L230.85 133.41L237.02 133.13L236.29 127.94Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"szomoru\" display=\"none\"><path d=\"M217.66 135.83L221.93 140.97L229.63 142.21L234.98 139.21L235.41 132.13Z\" fill=\"#000000\"/><path d=\"M228.86 133.5L229.8 134.82L236.46 134.52L236.1 131.99Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"ijedt\" display=\"none\"><path d=\"M227.14 129.77L225.07 130.13L223.44 131.47L223.64 133.5L225.4 135.61L228.56 136.12L230.76 134.89L230.99 131.15Z\" fill=\"#000000\"/><path d=\"M229.08 130.21L227.34 131.28L228.63 133.09L231.36 132.96L231.04 130.67Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"merges\" display=\"none\"><path d=\"M226.411 126.585L221.911 127.362L218.349 130.292L218.796 134.688L222.615 139.288L229.495 140.402L234.272 137.72L234.763 129.598L226.411 126.585Z\" fill=\"#000000\"/><path d=\"M230.624 127.544L226.834 129.875L229.646 133.799L235.586 133.533L234.882 128.54L230.624 127.544Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"olvas\" display=\"none\"><path d=\"M230.32 128.09L225.82 128.86L222.25 131.79L222.7 136.19L226.52 140.79L233.4 141.9L237.16 139.79L238.25 137.98L238.67 131.1Z\" fill=\"#000000\"/><path d=\"M238.59 130L234.53 129.05L230.74 131.38L233.55 135.3L239.46 135.04Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"telefonal\" display=\"none\"><path d=\"M226.411 126.585L221.911 127.362L218.349 130.292L218.796 134.688L222.615 139.288L229.495 140.402L234.272 137.72L234.763 129.598L226.411 126.585Z\" fill=\"#000000\"/><path d=\"M230.624 127.544L226.834 129.875L229.646 133.799L235.586 133.533L234.882 128.54L230.624 127.544Z\" fill=\"#FFFFFF\"/></g></g> </g> </g> <g id=\"csont-szemJobb\" data-csont=\"szemJobb\" data-pivot=\"262.58,126.73\" data-szulo=\"arc\"> <g data-reteg=\"arc-szemJobb\"><g data-arc=\"alap\"><path d=\"M260.35 115.961L250.197 119.798L250.339 129.243L255.525 136.711L268.545 137.498L274.958 131.605L274.41 123.009L268.303 117.921L260.35 115.961Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"pislogo\" display=\"none\"><path d=\"M250.9 131.4L262.63 133.81L274.34 131.2L273.71 127.41L262.58 128.63L251.47 127.61Z\" fill=\"#000000\"/></g><g data-arc=\"vidam\" display=\"none\"><path d=\"M260.35 115.96L250.2 119.8L250.34 129.24L253.71 134.09L273.12 133.29L274.96 131.6L274.41 123.01L268.3 117.92Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"ujjongo\" display=\"none\"><path d=\"M253.18 133.02L258.14 129.41L262.63 128.21L267.12 129.34L271.74 132.44L275.08 129.39L271.06 123.03L262.58 120.33L254.1 123.16L249.8 130.02Z\" fill=\"#000000\"/></g><g data-arc=\"meleg\" display=\"none\"><path d=\"M253.36 132.75L258.18 129.72L262.6 128.61L267.05 129.72L271.56 132.37L274.64 129.06L270.51 123.65L262.6 121.15L254.68 123.66L250.24 129.48Z\" fill=\"#000000\"/></g><g data-arc=\"buszke\" display=\"none\"><path d=\"M250.28 125.36L250.34 129.24L255.53 136.71L268.55 137.5L274.96 131.6L274.49 124.2Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"nyugodt\" display=\"none\"><path d=\"M250.57 128.77L255.44 133.51L262.6 135.42L269.81 133.5L274.38 128.73L271.82 125.45L267.13 127.93L262.6 128.83L258.04 127.92L253.03 125.42Z\" fill=\"#000000\"/></g><g data-arc=\"alvo\" display=\"none\"><path d=\"M250.62 130.39L255.94 133.66L262.6 134.77L269.31 133.66L274.32 130.37L272.5 126.63L267.64 128.17L262.6 128.67L257.54 128.17L252.36 126.61Z\" fill=\"#000000\"/></g><g data-arc=\"kivancsi\" display=\"none\"><path d=\"M260.35 115.96L250.2 119.8L250.34 129.24L255.53 136.71L268.55 137.5L274.96 131.6L274.41 123.01L268.3 117.92Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"meglepett\" display=\"none\"><path d=\"M260.05 114.7L248.68 119L248.84 129.58L254.65 137.94L269.23 138.82L276.41 132.22L275.8 122.59L268.96 116.9Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"kacsinto\" display=\"none\"><path d=\"M260.35 115.961L250.197 119.798L250.339 129.243L255.525 136.711L268.545 137.498L274.958 131.605L274.41 123.009L268.303 117.921L260.35 115.961Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"figyelmes\" display=\"none\"><path d=\"M260.25 115.54L249.69 119.53L249.84 129.35L255.23 137.12L268.77 137.94L275.44 131.81L274.87 122.87L268.52 117.58Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"szomoru\" display=\"none\"><path d=\"M252.51 118.92L250.2 119.8L250.34 129.24L255.53 136.71L268.55 137.5L274.96 131.6L274.59 125.89Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"ijedt\" display=\"none\"><path d=\"M260.1 114.91L248.93 119.13L249.09 129.52L254.79 137.74L269.12 138.6L276.17 132.12L275.57 122.66L268.85 117.07Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"merges\" display=\"none\"><path d=\"M260.35 115.961L250.197 119.798L250.339 129.243L255.525 136.711L268.545 137.498L274.958 131.605L274.41 123.009L268.303 117.921L260.35 115.961Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"nyami\" display=\"none\"><path d=\"M253.18 133.02L258.14 129.41L262.63 128.21L267.12 129.34L271.74 132.44L275.08 129.39L271.06 123.03L262.58 120.33L254.1 123.16L249.8 130.02Z\" fill=\"#000000\"/></g><g data-arc=\"olvas\" display=\"none\"><path d=\"M260.35 115.96L250.2 119.8L250.34 129.24L255.53 136.71L268.55 137.5L274.96 131.6L274.41 123.01L268.3 117.92Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"enekel\" display=\"none\"><path d=\"M253.18 133.02L258.14 129.41L262.63 128.21L267.12 129.34L271.74 132.44L275.08 129.39L271.06 123.03L262.58 120.33L254.1 123.16L249.8 130.02Z\" fill=\"#000000\"/></g><g data-arc=\"telefonal\" display=\"none\"><path d=\"M260.35 115.961L250.197 119.798L250.339 129.243L255.525 136.711L268.545 137.498L274.958 131.605L274.41 123.009L268.303 117.921L260.35 115.961Z\" fill=\"#FFFFFF\"/></g></g> <g id=\"csont-pupillaJobb\" data-csont=\"pupillaJobb\" data-pivot=\"262.58,126.73\" data-szulo=\"szemJobb\"> <g data-reteg=\"arc-pupillaJobb\"><g data-arc=\"alap\"><path d=\"M260.95 119.464L257.057 121.259L253.567 125.941L255.236 130.76L260.08 133.849L266.835 133.383L270.929 130.485L270.635 122.847L260.95 119.464Z\" fill=\"#000000\"/><path d=\"M266.472 120.802L262.682 123.133L265.493 127.061L271.434 126.791L270.73 121.797L266.472 120.802Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"vidam\" display=\"none\"><path d=\"M260.95 119.46L257.06 121.26L253.57 125.94L255.24 130.76L260.05 133.83L260.73 133.8L266.83 133.38L270.93 130.49L270.64 122.85Z\" fill=\"#000000\"/><path d=\"M266.47 120.8L262.68 123.13L265.49 127.06L271.43 126.79L270.73 121.8Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"buszke\" display=\"none\"><path d=\"M255.11 125.13L254.8 125.54L256.47 130.36L261.31 133.45L268.07 132.98L272.16 130.08L271.94 124.32Z\" fill=\"#000000\"/><path d=\"M265.28 124.64L266.73 126.66L272.67 126.39L272.37 124.3Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"kivancsi\" display=\"none\"><path d=\"M274.41 123.01L268.3 117.92L264.12 116.89L260.76 118.44L257.27 123.12L258.94 127.94L263.78 131.03L270.54 130.56L274.63 127.67L274.52 124.75Z\" fill=\"#000000\"/><path d=\"M274.41 123.01L269.14 118.62L266.39 120.31L269.2 124.24L274.47 124Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"meglepett\" display=\"none\"><path d=\"M262.16 121.02L259.43 122.28L256.99 125.55L258.16 128.93L261.55 131.09L266.28 130.76L269.14 128.73L268.94 123.39Z\" fill=\"#000000\"/><path d=\"M266.02 121.96L263.37 123.59L265.34 126.34L269.49 126.15L269 122.65Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"kacsinto\" display=\"none\"><path d=\"M260.95 119.464L257.057 121.259L253.567 125.941L255.236 130.76L260.08 133.849L266.835 133.383L270.929 130.485L270.635 122.847L260.95 119.464Z\" fill=\"#000000\"/><path d=\"M266.472 120.802L262.682 123.133L265.493 127.061L271.434 126.791L270.73 121.797L266.472 120.802Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"figyelmes\" display=\"none\"><path d=\"M261.83 118.37L257.78 120.24L254.15 125.11L255.89 130.12L260.92 133.33L267.95 132.85L272.21 129.83L271.9 121.89Z\" fill=\"#000000\"/><path d=\"M267.57 119.76L263.63 122.19L266.55 126.27L272.73 125.99L272 120.8Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"szomoru\" display=\"none\"><path d=\"M258.39 120.78L255.86 121.95L251.95 127.19L253.82 132.59L259.24 136.05L266.81 135.53L271.39 132.28L271.11 124.79Z\" fill=\"#000000\"/><path d=\"M264.39 122.67L262.16 124.05L265.31 128.45L271.96 128.14L271.5 124.92Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"ijedt\" display=\"none\"><path d=\"M262.39 122.89L260.6 123.71L258.99 125.87L259.76 128.08L261.99 129.5L265.09 129.29L266.98 127.96L266.84 124.44Z\" fill=\"#000000\"/><path d=\"M264.93 123.5L263.18 124.58L264.48 126.38L267.21 126.26L266.89 123.96Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"merges\" display=\"none\"><path d=\"M260.95 119.464L257.057 121.259L253.567 125.941L255.236 130.76L260.08 133.849L266.835 133.383L270.929 130.485L270.635 122.847L260.95 119.464Z\" fill=\"#000000\"/><path d=\"M266.472 120.802L262.682 123.133L265.493 127.061L271.434 126.791L270.73 121.797L266.472 120.802Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"olvas\" display=\"none\"><path d=\"M264.66 120.97L260.77 122.77L257.28 127.45L258.95 132.27L263.79 135.36L270.55 134.89L274.18 132.32L274.64 131.9L274.35 124.35Z\" fill=\"#000000\"/><path d=\"M274.43 123.3L270.19 122.31L266.4 124.64L269.21 128.57L274.75 128.32Z\" fill=\"#FFFFFF\"/></g><g data-arc=\"telefonal\" display=\"none\"><path d=\"M260.95 119.464L257.057 121.259L253.567 125.941L255.236 130.76L260.08 133.849L266.835 133.383L270.929 130.485L270.635 122.847L260.95 119.464Z\" fill=\"#000000\"/><path d=\"M266.472 120.802L262.682 123.133L265.493 127.061L271.434 126.791L270.73 121.797L266.472 120.802Z\" fill=\"#FFFFFF\"/></g></g> </g> </g> <g id=\"csont-szaj\" data-csont=\"szaj\" data-pivot=\"245.91,152.64\" data-szulo=\"arc\"> <g data-reteg=\"arc-szaj\"><g data-arc=\"alap\"><path d=\"M233.45 151.812L245.04 158.434L253.59 156.369L258.378 146.85L250.303 150.034L243.615 151.637L233.45 151.812Z\" fill=\"#000000\"/></g><g data-arc=\"pislogo\" display=\"none\"><path d=\"M233.45 151.812L245.04 158.434L253.59 156.369L258.378 146.85L250.303 150.034L243.615 151.637L233.45 151.812Z\" fill=\"#000000\"/></g><g data-arc=\"vidam\" display=\"none\"><path d=\"M230.69 146.23L241.56 148.47L251.15 147.83L260.42 144.95L257.86 154.86L252.11 162.22L243.16 164.13L235.8 159.66Z\" fill=\"#000000\"/><path d=\"M243.16 164.13L237.46 160.67L240.92 157.42L247.31 156.46L253.71 159.34L253.71 160.17L252.11 162.22Z\" fill=\"#EA6C18\"/></g><g data-arc=\"ujjongo\" display=\"none\"><path d=\"M227.82 144.95L239.96 147.83L252.11 146.87L262.66 143.03L261.06 155.18L254.35 165.73L243.8 169.25L233.89 163.18Z\" fill=\"#000000\"/><path d=\"M235.33 164.06L239.96 159.66L247.95 158.38L255.62 161.26L255.79 163.47L254.35 165.73L243.8 169.25Z\" fill=\"#EA6C18\"/></g><g data-arc=\"meleg\" display=\"none\"><path d=\"M233.45 151.812L245.04 158.434L253.59 156.369L258.378 146.85L250.303 150.034L243.615 151.637L233.45 151.812Z\" fill=\"#000000\"/></g><g data-arc=\"buszke\" display=\"none\"><path d=\"M232.61 147.51L242.2 156.46L252.43 155.18L262.02 142.72L258.18 144.95L251.15 150.39L242.52 151.67Z\" fill=\"#000000\"/></g><g data-arc=\"nyugodt\" display=\"none\"><path d=\"M235.69 151.98L245.2 157.28L252.21 155.62L256.13 148.01L249.51 150.56L244.03 151.84L235.69 151.98Z\" fill=\"#000000\"/></g><g data-arc=\"alvo\" display=\"none\"><path d=\"M246.35 151.67L249.81 153.43L249.81 156.94L246.35 158.7L242.89 156.94L242.89 153.43Z\" fill=\"#000000\"/></g><g data-arc=\"kivancsi\" display=\"none\"><path d=\"M237.72 154.86L248.91 152.95L255.62 149.11L257.23 151.99L250.19 156.78L238.68 158.06Z\" fill=\"#000000\"/></g><g data-arc=\"meglepett\" display=\"none\"><path d=\"M246.68 150.71L250.93 153.36L251.98 159.31L249.03 164.08L244.32 164.08L241.38 159.31L242.43 153.36Z\" fill=\"#000000\"/></g><g data-arc=\"kacsinto\" display=\"none\"><path d=\"M233.45 151.812L245.04 158.434L253.59 156.369L258.378 146.85L250.303 150.034L243.615 151.637L233.45 151.812Z\" fill=\"#000000\"/><path d=\"M245.72 156.46L253.07 155.5L254.67 160.94L250.83 164.13L246.68 162.22Z\" fill=\"#EA6C18\"/></g><g data-arc=\"figyelmes\" display=\"none\"><path d=\"M234.95 151.9L245.14 157.85L252.67 156L256.88 147.43L249.78 150.29L243.89 151.74L234.95 151.9Z\" fill=\"#000000\"/></g><g data-arc=\"szomoru\" display=\"none\"><path d=\"M234.21 160.94L242.2 153.26L251.15 153.26L258.82 160.3L256.9 161.58L250.51 156.94L242.84 156.94L236.13 162.22Z\" fill=\"#000000\"/></g><g data-arc=\"ijedt\" display=\"none\"><path d=\"M234.28 158.14L237.41 155.02L241.88 159.49L246.35 155.02L250.83 159.49L255.36 154.96L258.16 157.55L260.76 154.73L255.25 149.65L250.83 154.07L246.35 149.59L241.88 154.07L237.41 149.59L231.57 155.43Z\" fill=\"#000000\"/></g><g data-arc=\"merges\" display=\"none\"><path d=\"M232.43 157.86L236.11 153.37L240.13 149.54L245.91 149.07L251.7 148.6L255.72 152.27L259.39 156.76L254.91 156.11L250.42 155.79L245.91 156.21L241.4 156.63L236.91 157.21Z\" fill=\"#000000\"/></g><g data-arc=\"nyami\" display=\"none\"><path d=\"M231.26 144.77L235.78 149.1L240.29 153.43L246.42 154.52L251.59 152.72L255.71 148.01L259.83 143.3L255.92 149.74L252 156.17L246.78 159.48L239.86 157.14L235.56 150.95Z\" fill=\"#000000\"/></g><g data-arc=\"olvas\" display=\"none\"><path d=\"M233.45 151.812L245.04 158.434L253.59 156.369L258.378 146.85L250.303 150.034L243.615 151.637L233.45 151.812Z\" fill=\"#000000\"/></g><g data-arc=\"enekel\" display=\"none\"><path d=\"M238.75 152.59L240.64 149.74L242.53 146.9L245.91 146.66L249.32 146.45L251.4 148.66L253.07 151.63L251.58 155.02L250.01 158.32L246.35 158.84L242.98 158.67L240.87 155.63Z\" fill=\"#000000\"/></g><g data-arc=\"telefonal\" display=\"none\"><path d=\"M235.82 150.96L239.31 150.7L242.8 150.45L246.29 150.2L249.69 149.52L253.03 148.48L256.37 147.44L254.36 151.61L252.35 155.78L247.8 156.62L243.53 156.08L239.68 153.52Z\" fill=\"#000000\"/></g></g> </g> <g id=\"csont-szemoldokBal\" data-csont=\"szemoldokBal\" data-pivot=\"226.57,120.02\" data-szulo=\"arc\"> <g data-reteg=\"arc-szemoldokBal\"><g data-arc=\"merges\" display=\"none\"><path d=\"M213.66 118.4L236.87 125.18L238.39 119.15L214.73 114.13Z\" fill=\"#000000\"/></g><g data-arc=\"telefonal\" display=\"none\"><path d=\"M215.12 120.94L226.61 119.73L237.44 120.42L237.83 116.41L226.52 114.94L214.57 116.95Z\" fill=\"#000000\"/></g></g> </g> <g id=\"csont-szemoldokJobb\" data-csont=\"szemoldokJobb\" data-pivot=\"262.58,113.27\" data-szulo=\"arc\"> <g data-reteg=\"arc-szemoldokJobb\"><g data-arc=\"merges\" display=\"none\"><path d=\"M252.92 118.41L274.95 111.07L273.73 106.85L251.19 112.43Z\" fill=\"#000000\"/></g><g data-arc=\"telefonal\" display=\"none\"><path d=\"M252.87 114.04L262.82 110.06L273.28 112L274.16 108.07L262.33 105.07L251.24 110.35Z\" fill=\"#000000\"/></g></g> </g> <g id=\"csont-konny\" data-csont=\"konny\" data-pivot=\"244.57,130.08\" data-szulo=\"arc\"> <g data-reteg=\"arc-konny\"><g data-arc=\"ijedt\" display=\"none\"><path d=\"M286.5 115.23L289.49 124.23L289.69 129.99L286.27 134.57L280.98 134.47L277.59 130.28L278.75 124.81Z\" fill=\"#92DDEA\"/><path d=\"M286.5 115.23L278.75 124.81L277.59 130.28L281.61 127.66Z\" fill=\"#FFFFFF\"/></g></g> </g> </g> <g data-reteg=\"kopeny-galler\"><path d=\"M228.99 85.44L238.51 86.43L252.79 92.11L248.47 86.43L238.51 83.6L232.93 81.63Z\" fill=\"#ED2024\"/></g> </g> <g id=\"csont-kopeny1\" data-csont=\"kopeny1\" data-pivot=\"197,98\" data-szulo=\"test\"> <g data-reteg=\"kopeny\"><path d=\"M200.14 110.33L193.79 100.98L190.49 92.11L201.72 83.06L218.93 84.39L230.29 85.57L233.97 82L209.91 73.51L195.92 58.51L163.52 47.08L151.85 47.94L137.76 96.25L138.13 96.19L139.41 95.98L140.69 95.79L141.95 95.6L143.17 95.42L144.33 95.25L145.4 95.09L146.37 94.95L147.22 94.83L147.91 94.74L148.43 94.67L148.76 94.62L148.88 94.61L172.28 98.13Z\" fill=\"#ED2024\"/></g> <g id=\"csont-kopeny2\" data-csont=\"kopeny2\" data-pivot=\"149,72\" data-szulo=\"kopeny1\"> <g data-reteg=\"kopeny-kopeny2\"><path d=\"M160.37 47.31L131.6 49.44L104.8 41.38L85.52 107.52L86.26 108.04L95.29 118.92L111.05 119.79L121.88 105.81L121.95 105.73L122.16 105.49L122.48 105.13L122.9 104.66L123.42 104.1L124.01 103.47L124.65 102.78L125.34 102.07L126.06 101.35L126.8 100.63L127.53 99.94L128.24 99.31L128.93 98.74L129.57 98.26L130.15 97.89L130.65 97.65L131.12 97.51L131.76 97.34L132.56 97.17L133.49 96.99L134.54 96.79L135.68 96.59L136.88 96.39L138.13 96.19L139.41 95.98L140.69 95.79L141.95 95.6L143.17 95.42L144.33 95.25L145.4 95.09L146.37 94.95L146.48 94.94Z\" fill=\"#ED2024\"/></g> <g id=\"csont-kopeny3\" data-csont=\"kopeny3\" data-pivot=\"98,79\" data-szulo=\"kopeny2\"> <g data-reteg=\"kopeny-kopeny3\"><path d=\"M112.47 43.69L97.69 39.25L74.62 40.87L35.52 36.26L14.31 44.76L43.43 50.3L56.03 57.11L66.39 70.24L64.65 90.35L70.78 97.25L86.26 108.04L91.76 114.67Z\" fill=\"#ED2024\"/></g> </g> </g> <g data-reteg=\"kopeny-kopeny1\"><path d=\"M137.7 96.47L148.89 94.6L172.29 98.12L200.14 110.32L193.79 100.97L190.49 92.11L159.51 81.18L142.05 81.55Z\" fill=\"#B11F24\"/></g> <g id=\"csont-kopeny2--2\" data-csont=\"kopeny2\" data-pivot=\"149,72\" data-szulo=\"kopeny1\"> <g data-reteg=\"kopeny-kopeny2\"><path d=\"M84.88 109.7L95.3 118.92L111.06 119.79L130.66 97.64L146.46 95.01L150.43 81.37L139.98 81.59L107.87 83.28L96.39 95.81L88.62 96.88Z\" fill=\"#B11F24\"/></g> <g id=\"csont-kopeny3--2\" data-csont=\"kopeny3\" data-pivot=\"98,79\" data-szulo=\"kopeny2\"> <g data-reteg=\"kopeny-kopeny3\"><path d=\"M91.5 115.56L97.67 94.4L96.39 95.81L79.48 98.13L70.8 97.24Z\" fill=\"#B11F24\"/></g> </g> </g> <g data-reteg=\"kopeny-kopeny1\"><path d=\"M148.69 58.77L174.23 63.49L199.97 72.57L218.93 84.39L209.92 73.51L188.76 62.1L166.75 54.33L150.36 53.05Z\" fill=\"#B11F24\"/></g> <g id=\"csont-kopeny2--3\" data-csont=\"kopeny2\" data-pivot=\"149,72\" data-szulo=\"kopeny1\"> <g data-reteg=\"kopeny-kopeny2\"><path d=\"M99.84 58.41L113.97 61.17L129.75 62L146.07 58.28L156.6 60.23L158.51 53.69L136.6 51.98L119.24 55.33L103.01 52.76L101.58 52.45Z\" fill=\"#B11F24\"/></g> <g id=\"csont-kopeny3--3\" data-csont=\"kopeny3\" data-pivot=\"98,79\" data-szulo=\"kopeny2\"> <g data-reteg=\"kopeny-kopeny3\"><path d=\"M43.43 50.29L56.02 57.11L72.29 54.75L88.9 56.27L107.72 59.95L109.52 53.79L103.01 52.76L82.12 48.15L63.17 47.19Z\" fill=\"#B11F24\"/></g> </g> </g> </g> <g id=\"csont-szarnyJobb--2\" data-csont=\"szarnyJobb\" data-pivot=\"218,80\" data-szulo=\"test\"> <g data-reteg=\"szarny-hatso\"><path d=\"M255.148 52.2599L235.106 79.6951L232.694 80.9123L231.255 81.641L231.097 79.9794L230.61 74.9734L224.765 66.861L220.893 61.48L221.698 56.8824L215.864 57.5623L214.566 61.6138L219.751 62.9597L223.548 68.3568L228.48 75.3609L229.063 78.7879L229.68 82.4389L229.104 82.7293L225.973 81.2959L219.096 78.1494L215.63 78.0741L210.14 77.954L207.757 77.9029L207.032 77.8849L198.54 64.4345L196.19 60.7098L206.04 30.3458L217.969 24.3039L233.75 16.3111L252.56 24.8406L255.148 52.2599Z\" fill=\"#92DDEA\"/></g> </g> <g id=\"csont-szarnyBal\" data-csont=\"szarnyBal\" data-pivot=\"200,88\" data-szulo=\"test\"> <g data-reteg=\"szarny-elso\"><path d=\"M220.891 61.4856L221.529 59.1432L219.725 57.1468L215.861 57.5679L214.688 59.4161L216.092 62.2464L219.748 62.9653L223.545 68.3624L219.569 73.2381L215.628 78.0797L210.85 83.9446L210.276 84.643L204.303 91.9741L202.734 90.9294L194.949 85.7301L193.679 84.879L183.044 77.7831L182.806 77.3558L175.145 63.6665L164.508 44.6557L171.065 14.5934L193.074 7.66361L217.966 24.3095L221.924 26.9596L228.761 61.9612L224.762 66.8666L220.891 61.4856Z\" fill=\"#D2FAFC\"/><path d=\"M202.054 19.5315L193.359 12.829L175.203 17.9088L172.172 30.423L175.761 31.841L178.484 21.5388L192.987 18.9836L199.929 22.8348L202.054 19.5315Z\" fill=\"#FFFFFF\"/></g> </g> <g id=\"csont-fej--2\" data-csont=\"fej\" data-pivot=\"196,140\" data-szulo=\"test\"> <g id=\"csont-csapBal1\" data-csont=\"csapBal1\" data-pivot=\"232.2,101.5\" data-szulo=\"fej\"> <g data-reteg=\"csap-bal\"><path d=\"M232.9 102.55L232.54 102.87L231.84 102.83L231.51 102.47L231.45 94.74L230.45 86.95L229.78 83.04L229.68 82.44L229.15 79.35L231.03 79.35L231.1 79.98L231.25 81.64L231.45 83.14L232.07 87.4L232.85 94.83Z\" fill=\"#000000\"/></g> <g id=\"csont-csapBal2\" data-csont=\"csapBal2\" data-pivot=\"229.5,79.5\" data-szulo=\"csapBal1\"> <g data-reteg=\"csap-bal-csapBal2\"><path d=\"M229.21 79.65L229.06 78.79L228.48 75.36L223.55 68.36L219.75 62.96L216.09 62.24L214.7 59.41L215.86 57.56L219.73 57.14L221.56 59.14L220.89 61.48L224.76 66.86L230.61 74.97L231.06 79.65Z\" fill=\"#000000\"/></g> </g> </g> <g id=\"csont-csapJobb1\" data-csont=\"csapJobb1\" data-pivot=\"244.3,98\" data-szulo=\"fej\"> <g data-reteg=\"csap-jobb\"><path d=\"M244.98 98.93L244.55 99.17L243.88 98.98L243.63 98.56L245.14 90.99L245.74 83.15L245.88 79.19L245.9 78.58L246 75.85L247.85 75.85L247.78 76.46L247.6 78.12L247.49 79.63L247.23 83.92L246.49 91.35Z\" fill=\"#000000\"/></g> <g id=\"csont-csapJobb2\" data-csont=\"csapJobb2\" data-pivot=\"246,76\" data-szulo=\"csapJobb1\"> <g data-reteg=\"csap-jobb-csapJobb2\"><path d=\"M245.99 76.15L246.03 74.88L246.16 71.4L242.75 63.55L240.13 57.49L236.69 56.05L235.9 52.99L237.41 51.42L241.28 51.79L242.67 54.12L241.54 56.27L244.24 62.33L248.32 71.46L247.82 76.15Z\" fill=\"#000000\"/></g> </g> </g> </g> </g> </g> </g> </svg>"; return t.content.firstElementChild; })();

/* ---------- mérés: dataLayer (+ látható napló a teszt-domainen) ---------- */
window.dataLayer = window.dataLayer || [];
const naploKell = /webflow\.io$/.test(location.hostname) || /[?&]meres\b/.test(location.search) || location.protocol === 'file:';
let naploDb = 0, naploLista = null, naploSzam = null;
function mer(esemeny, adat) {
  const e = Object.assign({ event: 'beeco_' + esemeny }, adat || {});
  window.dataLayer.push(e);
  if (!naploLista) return;
  naploDb++; naploSzam.textContent = naploDb;
  const li = d.createElement('li'); li.innerHTML = '<code>' + e.event + '</code> ' + Object.entries(adat || {}).map(([k, v]) => k + ': ' + v).join(', ');
  naploLista.insertBefore(li, naploLista.firstChild);
}
if (naploKell) {
  const g = d.createElement('button'); g.type = 'button'; g.className = 'fs-meres-gomb'; g.setAttribute('aria-expanded', 'false');
  g.innerHTML = 'Mérés: <span>0</span> esemény'; naploSzam = g.querySelector('span');
  const p = d.createElement('section'); p.className = 'fs-naplo'; p.hidden = true; p.setAttribute('aria-label', 'Mérési napló (teszt)');
  p.innerHTML = '<h2>Mérési események</h2><p style="font-size:12px">Ezek mennek a dataLayer-be (Google Tag Manager). Csak a teszt-domainen látszik.</p><ol></ol>';
  naploLista = p.querySelector('ol');
  g.addEventListener('click', () => { p.hidden = !p.hidden; g.setAttribute('aria-expanded', !p.hidden); });
  d.addEventListener('keydown', e => { if (e.key === 'Escape' && !p.hidden) { p.hidden = true; g.setAttribute('aria-expanded', 'false'); g.focus(); } });
  oldal.appendChild(g); oldal.appendChild(p);
}
const kattMer = (sel, esemeny, ertek) => $$(sel, oldal).forEach(a => a.addEventListener('click', () => mer(esemeny, ertek ? { ertek: ertek(a) } : {})));
kattMer('.fs-most-fut', 'most_fut_kattintas', () => 'csicsergosz');
kattMer('.fs-logo-csempe', 'logo_kattintas', a => (a.querySelector('img') || {}).alt || '');
kattMer('.fs-bolt-kartya', 'beebolt_kattintas');
kattMer('.fs-pedia-link', 'beecopedia_kattintas', a => (a.querySelector('.fs-pedia-cim') || {}).textContent || '');
kattMer('.fs-csapat-gomb', 'csapat_csatlakozas');
kattMer('.fs-hirlevel-gomb', 'hirlevel_kattintas');
$$('.fs-kerdes', oldal).forEach(k => k.addEventListener('toggle', () => { if (k.open) mer('gyik_nyitas', { kerdes: $('summary', k).textContent }); }));
const elsoKerdes = $('.fs-kerdes', oldal); if (elsoKerdes) elsoKerdes.open = true;

/* ---------- platform: okos boltgomb, UTM ---------- */
const ua = navigator.userAgent;
const platform = /Android/i.test(ua) ? 'android' : (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) ? 'ios' : 'asztal';
d.documentElement.setAttribute('data-platform', platform);
const PLAY = 'https://play.google.com/store/apps/details?id=hu.beeco.app', IOS = 'https://apps.apple.com/hu/app/beeco/id6478549279?l=hu';
const playUtm = h => PLAY + '&referrer=' + encodeURIComponent('utm_source=beeco.hu&utm_medium=web&utm_campaign=fooldal&utm_content=' + h);
const iosUtm = h => IOS + '&ct=fooldal-' + h;
const helyNev = el => { const s = el.closest('section,[id]'); return (s && s.id) || 'ismeretlen'; };
$$('.fs-bolt', oldal).forEach(a => { const ios = a.classList.contains('fs-csak-ios'), h = helyNev(a); a.href = ios ? iosUtm(h) : playUtm(h); a.addEventListener('click', () => mer('bolt_kattintas', { bolt: ios ? 'app_store' : 'google_play', hely: h })); });
function okosLetoltes(a, h) {
  if (platform === 'android') { a.href = playUtm(h); a.target = '_blank'; a.rel = 'noopener'; }
  else if (platform === 'ios') { a.href = iosUtm(h); a.target = '_blank'; a.rel = 'noopener'; }
  a.addEventListener('click', e => { mer('letoltes_gomb', { hely: h, platform: platform }); if (platform === 'asztal') { e.preventDefault(); gorget($('#letoltes')); } });
}
$$('.fs-okos-letoltes', oldal).forEach(a => okosLetoltes(a, helyNev(a)));
if ('IntersectionObserver' in window) $$('.fs-qr', oldal).forEach(qr => { let m = false; new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && !m && platform === 'asztal') { m = true; mer('qr_megjelenes', { hely: helyNev(qr) }); } }), { threshold: .8 }).observe(qr); });

/* ---------- téma-kapcsoló (alapból világos; a választás megmarad) ---------- */
const tema = d.createElement('button'); tema.type = 'button'; tema.className = 'fs-tema';
tema.innerHTML = '<span class="fs-tema-sin" aria-hidden="true"></span>' + ikon('hold') + '<span class="fs-tema-felirat">Sötét mód</span>';
oldal.appendChild(tema);
const sotetE = () => d.documentElement.getAttribute('data-theme') === 'dark';
function temaFrissit() { const s = sotetE(); tema.setAttribute('aria-pressed', s); $('use', tema).setAttribute('href', s ? '#fs-i-nap-ikon' : '#fs-i-hold'); $('.fs-tema-felirat', tema).textContent = s ? 'Világos mód' : 'Sötét mód'; tema.setAttribute('aria-label', s ? 'Sötét mód bekapcsolva, váltás világosra' : 'Világos mód bekapcsolva, váltás sötétre'); }
try { if (localStorage.getItem('beeco-tema') === 'dark') d.documentElement.setAttribute('data-theme', 'dark'); } catch (e) { }
tema.addEventListener('click', () => { const uj = sotetE() ? 'light' : 'dark'; d.documentElement.setAttribute('data-theme', uj); try { localStorage.setItem('beeco-tema', uj); } catch (e) { } temaFrissit(); mer('tema_valtas', { tema: uj }); });
temaFrissit();

/* ---------- díszítő svg-k (domb, hurok, szaggatott vonalak) ---------- */
function svgElem(html) { const t = d.createElement('div'); t.innerHTML = html; return t.firstElementChild; }
const DOMB = '<svg class="fs-domb" viewBox="0 0 1440 70" preserveAspectRatio="none" aria-hidden="true"><path d="M0 40 C 200 6, 380 8, 560 32 S 900 60, 1100 26 S 1340 6, 1440 30 V70 H0Z" style="fill:var(--domb-h)"/><path d="M0 56 C 240 30, 420 54, 640 48 S 1000 28, 1200 50 S 1380 62, 1440 54 V70 H0Z" style="fill:var(--domb-e)"/></svg>';
['.fs-hero', '.fs-miert', '.fs-raj', '.fs-gyik'].forEach(s => { const sz = $(s, oldal); if (sz) sz.appendChild(svgElem(DOMB)); });
const kaptar = $('.fs-kaptar-szin', oldal);
if (kaptar) kaptar.insertBefore(svgElem('<svg class="fs-hurok" viewBox="0 0 400 520" preserveAspectRatio="none" aria-hidden="true"><path d="M40 40 C 160 0, 240 90, 200 140 C 160 190, 110 130, 160 110 C 220 90, 360 160, 340 260 C 320 360, 60 330, 70 420 C 80 500, 300 520, 360 470" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="7 8"/></svg>'), kaptar.firstChild);
const lepesek = $('.fs-lepesek', oldal);
let utVonal = null;
if (lepesek) { utVonal = svgElem('<svg class="fs-lepes-vonal" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true"><path d="M30 30 C 160 -10, 240 70, 360 30 S 560 -10, 660 30 S 860 70, 980 30"/></svg>'); lepesek.insertBefore(utVonal, lepesek.firstChild); }
const idov = $('.fs-idovonal', oldal);
if (idov) idov.insertBefore(svgElem('<svg class="fs-vonal" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true"><path d="M10 30 C 120 0, 200 60, 300 30 S 500 0, 600 30 S 800 60, 990 20"/></svg>'), idov.firstChild);

/* ---------- belépők: csak a hajtás alatt induló elemek kapnak eltolt kezdőállapotot ---------- */
if (!kevesMozgas() && 'IntersectionObserver' in window) {
  const beIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.remove('fs-var'); beIO.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.fs-be', oldal).forEach(n => { if (n.getBoundingClientRect().top > innerHeight * 0.92) { n.classList.add('fs-var'); const sor = $$('.fs-be', n.parentElement).indexOf(n); n.style.transitionDelay = (Math.max(0, sor) * 60) + 'ms'; beIO.observe(n); } });
  if (utVonal) new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('fs-rajzolt'); o.unobserve(e.target); } }), { threshold: .6 }).observe(utVonal);
} else if (utVonal) utVonal.classList.add('fs-rajzolt');

/* ---------- gombként viselkedő linkek ---------- */
function gombbaAlakit(a, katt) {
  a.setAttribute('role', 'button');
  a.addEventListener('click', e => { e.preventDefault(); katt(e); });
  a.addEventListener('keydown', e => { if (e.key === ' ') { e.preventDefault(); katt(e); } });
}

/* =====================================================
   Szuperhős méhecske: a hivatalos csontváz-rig klónja
   ===================================================== */
const PISLOGHAT = new Set(['alap', 'vidam', 'figyelmes', 'kivancsi', 'meleg', 'nyugodt']);
const mehek = [];
class Meh {
  constructor(host, o) {
    o = o || {}; this.host = host;
    const svg = RIG.cloneNode(true);
    svg.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
    svg.querySelectorAll('title,desc').forEach(n => n.remove());
    svg.removeAttribute('aria-labelledby'); svg.removeAttribute('role');
    svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
    host.appendChild(svg);
    this.cs = {};
    svg.querySelectorAll('[data-csont]').forEach(g => { const p = g.getAttribute('data-pivot').split(',').map(Number), k = g.getAttribute('data-csont'); (this.cs[k] = this.cs[k] || []).push({ g: g, px: p[0], py: p[1] }); });
    this.arcok = $$('[data-arc]', svg);
    this.face = null; this.tartos = o.arc || 'alap'; this.arc(this.tartos);
    this.p = { x: 0, y: 0, s: o.s || 1 }; this.v = { x: 0, y: 0, s: 0 }; this.t = { x: 0, y: 0, s: o.s || 1 };
    this.irany = 1; this.ul = !!o.ul; this.aktiv = true;
    this.ido = Math.random() * 10; this.kovPislog = 1.5 + Math.random() * 3; this.pislogVege = 0;
    this.ugrasT = -1; this.nez = { x: 0, y: 0 }; this.nezCel = { x: 0, y: 0 }; this.K = 38; this.D = 11;
    this.w = host.offsetWidth || 160;
    mehek.push(this);
  }
  hely(x, y, s) { this.p.x = this.t.x = x; this.p.y = this.t.y = y; if (s != null) this.p.s = this.t.s = s; this.v = { x: 0, y: 0, s: 0 }; this.rajzol(0); }
  cel(x, y, s) { this.t.x = x; this.t.y = y; if (s != null) this.t.s = s; }
  tav() { return Math.hypot(this.p.x - this.t.x, this.p.y - this.t.y); }
  arc(f) { this.tartos = f; this._arc(f); }
  _arc(f) { if (f === this.face) return; this.face = f; for (const g of this.arcok) g.setAttribute('display', g.getAttribute('data-arc') === f ? 'inline' : 'none'); }
  ugrik() { this.ugrasT = 0; }
  csont(n, r, dx, dy, sx, sy) {
    const l = this.cs[n]; if (!l) return; sx = sx == null ? 1 : sx; sy = sy == null ? sx : sy;
    for (const b of l) b.g.setAttribute('transform', 'translate(' + (b.px + (dx || 0)).toFixed(2) + ' ' + (b.py + (dy || 0)).toFixed(2) + ') rotate(' + (r || 0).toFixed(2) + ') scale(' + sx.toFixed(3) + ' ' + sy.toFixed(3) + ') translate(' + (-b.px) + ' ' + (-b.py) + ')');
  }
  lep(dt) {
    this.ido += dt;
    if (kevesMozgas()) { this.p.x = this.t.x; this.p.y = this.t.y; this.p.s = this.t.s; this.v.x = this.v.y = 0; }
    else {
      for (const k of ['x', 'y']) { const a = (this.t[k] - this.p[k]) * this.K - this.v[k] * this.D; this.v[k] = clamp(this.v[k] + a * dt, -1600, 1600); this.p[k] += this.v[k] * dt; }
      const as = (this.t.s - this.p.s) * 30 - this.v.s * 10; this.v.s += as * dt; this.p.s += this.v.s * dt;
    }
    this.rajzol(dt);
  }
  rajzol(dt) {
    const rm = kevesMozgas(), seb = Math.hypot(this.v.x, this.v.y), repul = seb > 45;
    if (this.v.x > 70) this.irany = 1; else if (this.v.x < -70) this.irany = -1;
    const half = this.w / 2;
    this.host.style.transform = 'translate3d(' + (this.p.x - half).toFixed(1) + 'px,' + (this.p.y - half).toFixed(1) + 'px,0) scale(' + (this.p.s * this.irany).toFixed(3) + ',' + this.p.s.toFixed(3) + ')';
    const t = this.ido, dol = rm ? 0 : clamp(Math.abs(this.v.x) * 0.011 + this.v.y * 0.009, -20, 20);
    let bob = 0, ug = 0, sx = 1, sy = 1;
    if (!this.ul && !rm) bob = Math.sin(t * 2 * Math.PI * 1.15) * 5;
    if (this.ugrasT >= 0 && !rm) { this.ugrasT += dt; const u = this.ugrasT / 0.42; if (u < 1) ug = -Math.sin(Math.PI * u) * 22; else if (u < 1.5) { const q = (u - 1) / 0.5; sx = 1 + 0.08 * Math.sin(Math.PI * q); sy = 1 - 0.08 * Math.sin(Math.PI * q); } else this.ugrasT = -1; }
    this.csont('root', dol, 0, bob + ug); this.csont('test', 0, 0, 0, sx, sy);
    let sz; if (this.ul) sz = -6; else if (rm) sz = -14; else { const f = repul ? 12 : 8, amp = repul ? 30 : 20; sz = Math.sin(t * 2 * Math.PI * f) * amp - 8; }
    this.csont('szarnyBal', sz); this.csont('szarnyJobb', sz * 0.85);
    const kw = 2 * Math.PI * (repul ? 2.6 : 1.3), ka = rm ? 0 : (repul ? 1.6 : 1), alap = rm ? 0 : clamp(seb * 0.006, 0, 9);
    this.csont('kopeny1', alap * 0.4 + Math.sin(t * kw) * 2.5 * ka); this.csont('kopeny2', alap * 0.8 + Math.sin(t * kw - 0.7) * 5 * ka); this.csont('kopeny3', alap * 1.2 + Math.sin(t * kw - 1.4) * 8 * ka);
    if (!rm) { const cw = 2 * Math.PI * 0.9; this.csont('csapBal1', Math.sin(t * cw) * 5); this.csont('csapJobb1', Math.sin(t * cw + 0.6) * 5); this.csont('csapBal2', Math.sin(t * cw - 0.8) * 7); this.csont('csapJobb2', Math.sin(t * cw - 0.2) * 7); }
    this.nez.x += (this.nezCel.x - this.nez.x) * 0.15; this.nez.y += (this.nezCel.y - this.nez.y) * 0.15;
    this.csont('pupillaBal', 0, this.nez.x, this.nez.y); this.csont('pupillaJobb', 0, this.nez.x, this.nez.y);
    if (!rm && dt > 0) {
      if (this.pislogVege && t > this.pislogVege) { this.pislogVege = 0; this._arc(this.tartos); }
      else if (!this.pislogVege && t > this.kovPislog && PISLOGHAT.has(this.tartos)) { this._arc('pislogo'); this.pislogVege = t + 0.12; this.kovPislog = t + 2.8 + Math.random() * 3.5; }
    }
  }
}
addEventListener('pointermove', e => {
  for (const m of mehek) { const r = m.host.getBoundingClientRect(); const dx = (e.clientX - (r.left + r.width / 2)) * m.irany, dy = e.clientY - (r.top + r.height / 2), dd = Math.hypot(dx, dy) || 1; m.nezCel.x = dx / dd * 3.2; m.nezCel.y = dy / dd * 2.6; }
}, { passive: true });

const ciklusok = [];
let utolso = 0, fut = false;
function keret(ts) {
  const dt = Math.min(0.05, (ts - utolso) / 1000 || 0.016); utolso = ts;
  for (const f of ciklusok) f(dt, ts);
  for (const m of mehek) if (m.aktiv) m.lep(dt);
  if (d.hidden) { fut = false; return; }
  requestAnimationFrame(keret);
}
function indit() { if (!fut) { fut = true; utolso = performance.now(); requestAnimationFrame(keret); } }
d.addEventListener('visibilitychange', () => { if (!d.hidden) indit(); });

/* ---------- ragadós letöltősáv (mobil) ---------- */
const ragados = d.createElement('div'); ragados.className = 'fs-ragados'; ragados.setAttribute('aria-hidden', 'true');
ragados.innerHTML = ikon('lab', 'fs-lab') + '<p><b>beeco app</b>Ingyenes, 4,6 ★</p><a class="fs-gomb fs-okos-letoltes" href="#letoltes" tabindex="-1">Töltsd le az appot</a>';
oldal.appendChild(ragados); okosLetoltes($('a', ragados), 'ragados');
d.body.classList.add('fs-van-ragados');
let heroLat = true, zaroLat = false;
function ragadosFrissit() { const lat = !heroLat && !zaroLat; ragados.classList.toggle('fs-lat', lat); ragados.setAttribute('aria-hidden', !lat); $('a', ragados).tabIndex = lat ? 0 : -1; }
const heroCta = $('.fs-hero .fs-cta-sor', oldal), zaro = $('#letoltes');
if (heroCta) new IntersectionObserver(es => es.forEach(e => { heroLat = e.isIntersecting; ragadosFrissit(); })).observe(heroCta);
if (zaro) new IntersectionObserver(es => es.forEach(e => { zaroLat = e.isIntersecting; ragadosFrissit(); }), { threshold: .15 }).observe(zaro);

/* =====================================================
   Főszereplő: hero → lábnyom-útvonal → leszállás → haza az appba
   ===================================================== */
const reteg = d.createElement('div'); reteg.className = 'fs-reteg'; reteg.setAttribute('aria-hidden', 'true');
reteg.innerHTML = '<div class="fs-meh"></div>'; oldal.insertBefore(reteg, oldal.firstChild);
const meh = new Meh($('.fs-meh', reteg), { arc: 'vidam', s: 0.5 });
const sin = d.createElement('div'); sin.className = 'fs-sin';
sin.innerHTML = '<svg class="fs-ut" aria-hidden="true"><path class="fs-ut-alap"/><path class="fs-ut-halvany"/><path class="fs-ut-teli"/></svg><nav aria-label="Hol tartasz az oldalon"></nav>';
oldal.appendChild(sin);
const sinSvg = $('svg', sin), halv = $('.fs-ut-halvany', sin), teli = $('.fs-ut-teli', sin), alapUt = $('.fs-ut-alap', sin), allNav = $('nav', sin);
const ALL = [['kezdes', 'Kezdés', 'vidam'], ['miert', 'Miért?', 'figyelmes'], ['raj', 'Közösség', 'meleg'], ['rolunk', 'Rólunk', 'buszke'], ['utak', 'Kinek szól?', 'vidam'], ['gyik', 'GYIK', 'figyelmes'], ['letoltes', 'Letöltés', 'ujjongo']].filter(a => d.getElementById(a[0]));
let pontok = [], hossz = [], L = 0, allT = [];
function sinEpit() {
  const r = sin.getBoundingClientRect(), W = r.width, H = r.height; if (!H) return;
  sinSvg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  pontok = []; const N = 300;
  for (let i = 0; i <= N; i++) {
    const u = i / N; let x = W * 0.55 + Math.sin(2 * Math.PI * u * 2.6) * W * 0.22, y = 8 + u * (H - 16);
    [[0.24, 1], [0.55, -1], [0.82, 1]].forEach(([c, old]) => { const LW = 0.06; if (Math.abs(u - c) < LW / 2) { const q = (u - c) / LW + 0.5, sm = q * q * (3 - 2 * q), th = 2 * Math.PI * sm, rr = Math.min(16, W * 0.2); x += rr * Math.sin(th) * old; y -= rr * (1 - Math.cos(th)) * 0.95; } });
    pontok.push([x, y]);
  }
  hossz = [0]; for (let i = 1; i < pontok.length; i++) hossz.push(hossz[i - 1] + Math.hypot(pontok[i][0] - pontok[i - 1][0], pontok[i][1] - pontok[i - 1][1]));
  L = hossz[hossz.length - 1];
  const dd = 'M' + pontok.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
  halv.setAttribute('d', dd); teli.setAttribute('d', dd); alapUt.setAttribute('d', dd);
}
function pontHossznal(l) { l = clamp(l, 0, L); let i = 1; while (i < hossz.length && hossz[i] < l) i++; i = Math.min(i, hossz.length - 1); const a = pontok[i - 1], b = pontok[i], f = (l - hossz[i - 1]) / ((hossz[i] - hossz[i - 1]) || 1); return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]; }
const gombok = ALL.map(([id, nev]) => { const b = d.createElement('button'); b.type = 'button'; b.className = 'fs-allomas'; b.setAttribute('aria-label', 'Ugrás: ' + nev); b.innerHTML = ikon('lab') + '<span>' + nev + '</span>'; b.addEventListener('click', () => { gorget(d.getElementById(id)); mer('allomas_kattintas', { allomas: nev }); }); allNav.appendChild(b); return b; });
function hatar() { const k = $('#kezdes').getBoundingClientRect().top + scrollY, v = $('#letoltes').getBoundingClientRect().bottom + scrollY - innerHeight; return [k, Math.max(k + 1, v)]; }
function allomasHely() {
  const [k, v] = hatar();
  allT = ALL.map(([id]) => clamp((d.getElementById(id).getBoundingClientRect().top + scrollY - innerHeight * 0.3 - k) / (v - k), 0, 1));
  allT[0] = 0; allT[allT.length - 1] = 1;
  gombok.forEach((b, i) => { const p = pontHossznal(allT[i] * L); b.style.left = p[0] + 'px'; b.style.top = p[1] + 'px'; });
}
const szeles = () => innerWidth >= 900;
function frissit() { sin.classList.toggle('fs-lat', szeles()); if (szeles()) { sinEpit(); allomasHely(); } }
addEventListener('resize', frissit);
addEventListener('load', frissit);
function relHely(el, fx, fy) { const r = el.getBoundingClientRect(), pr = reteg.getBoundingClientRect(); return [r.left - pr.left + r.width * (fx == null ? .5 : fx), r.top - pr.top + r.height * (fy == null ? .5 : fy)]; }

/* hero: funkció-piktogramok */
const funkok = $$('.fs-funk', oldal), kepek = $$('.fs-app-kep', oldal), felirat = $('.fs-felirat', oldal);
const KULCS = ['lab', 'terkep', 'vasarlas', 'hir', 'kozosseg', 'nektar'];
const kepDoboz = $('.fs-app-kepek', oldal); if (kepDoboz) kepDoboz.classList.add('fs-js');
if (felirat) felirat.setAttribute('aria-live', 'polite');
const tura = d.createElement('div'); tura.className = 'fs-tura'; tura.hidden = true; tura.innerHTML = '<span>A méhecske körbevezet.</span><button type="button">Megállítom</button>';
if (felirat) felirat.after(tura);
let funkCel = funkok[0], erkezett = true, turaFut = false, turaIdo = [];
function valaszt(i, kezi) {
  const s = funkok[i]; if (!s) return;
  funkok.forEach((x, j) => x.setAttribute('aria-pressed', j === i));
  kepek.forEach((x, j) => x.classList.toggle('fs-aktiv', j === i));
  if (felirat) felirat.innerHTML = '<h2 class="fs-felirat-cim">' + $('.fs-funk-cim', s).textContent + '</h2><p class="fs-felirat-szoveg">' + $('.fs-funk-szoveg', s).textContent + '</p>';
  funkCel = s; erkezett = false; meh.arc('kivancsi');
  if (kezi) { turaAll(); mer('funkcio_valasztas', { funkcio: KULCS[i] || i }); }
}
function turaAll() { if (turaFut) mer('tura_vege', {}); turaFut = false; turaIdo.forEach(clearTimeout); turaIdo = []; tura.hidden = true; }
function turaIndit() {
  if (kevesMozgas() || funkok.length < 6) return;
  turaFut = true; tura.hidden = false;
  [1, 4, 2].forEach((k, n) => turaIdo.push(setTimeout(() => { if (turaFut) valaszt(k); }, 1200 + n * 2300)));
  turaIdo.push(setTimeout(() => { if (turaFut) { valaszt(0); turaFut = false; tura.hidden = true; } }, 1200 + 3 * 2300));
}
funkok.forEach((s, i) => gombbaAlakit(s, () => valaszt(i, true)));
$('button', tura).addEventListener('click', turaAll);
valaszt(0);

let allapot = 'hero', leszallIdo = 0, playLat = false;
const leszallo = () => $$('.fs-zaro .fs-bolt', oldal).find(b => b.offsetParent !== null) || $('.fs-zaro .fs-bolt', oldal);
const boltok = $('.fs-zaro .fs-boltok', oldal);
if (boltok) new IntersectionObserver(es => es.forEach(e => { playLat = e.intersectionRatio >= 0.9; }), { threshold: [0, 0.9, 1] }).observe(boltok);
const zaroTelefon = $('.fs-zaro-telefon', oldal);
ciklusok.push(function (dt, ts) {
  const hero = $('#kezdes'); if (!hero) return;
  const hr = hero.getBoundingClientRect();
  const [k, v] = hatar(), prog = clamp((scrollY - k) / (v - k), 0, 1);
  let akt = 0;
  if (szeles() && allT.length) { for (let i = 0; i < allT.length; i++) if (prog >= allT[i] - 0.02) akt = i; }
  else ALL.forEach(([id], i) => { if (d.getElementById(id).getBoundingClientRect().top < innerHeight * 0.5) akt = i; });
  gombok.forEach((b, i) => { b.classList.toggle('fs-bejart', i <= akt); if (i === akt) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
  if (L) teli.style.strokeDasharray = (prog * L).toFixed(1) + ' ' + L;
  if (playLat) { if (allapot !== 'leszall' && allapot !== 'haza' && allapot !== 'otthon') { allapot = 'leszall'; leszallIdo = ts; meh.ul = false; } }
  else if (allapot === 'leszall' || allapot === 'haza' || allapot === 'otthon') { allapot = 'ut'; meh.ul = false; }
  if (allapot === 'leszall') { meh.host.classList.remove('fs-rejt'); const p = relHely(leszallo(), 0.86, -0.05); meh.cel(p[0], p[1] - 22, 0.55); meh.arc('ujjongo'); if (meh.tav() < 6) meh.ul = true; if (ts - leszallIdo > 2600) { allapot = 'haza'; meh.ul = false; } return; }
  if (allapot === 'haza') { const p = relHely(zaroTelefon || leszallo(), 0.5, 0.38); meh.cel(p[0], p[1], 0.2); meh.arc('meleg'); if (meh.tav() < 10) { allapot = 'otthon'; meh.host.classList.add('fs-rejt'); } return; }
  if (allapot === 'otthon') return;
  if (hr.bottom > innerHeight * 0.45) {
    if (allapot !== 'hero') { allapot = 'hero'; erkezett = false; }
    meh.host.classList.remove('fs-rejt');
    const p = relHely($('.fs-pin', funkCel), 0.9, 0.05); meh.cel(p[0], p[1], 0.5);
    if (!erkezett && meh.tav() < 8) { erkezett = true; meh.arc('ujjongo'); meh.ugrik(); setTimeout(() => { if (erkezett && allapot === 'hero') meh.arc('vidam'); }, 700); }
  } else {
    if (allapot === 'hero' && turaFut) turaAll();
    allapot = 'ut';
    if (szeles()) { meh.host.classList.remove('fs-rejt'); const sr = sin.getBoundingClientRect(), pr = reteg.getBoundingClientRect(), p = pontHossznal(prog * L); meh.cel(sr.left - pr.left + p[0], sr.top - pr.top + p[1] - 18, 0.5); }
    else { const pr = reteg.getBoundingClientRect(); meh.cel(innerWidth - 50 - pr.left, 110 - pr.top, 0.4); meh.host.classList.add('fs-rejt'); }
    meh.arc(ALL[akt][2]);
  }
});
if (kaptar) { const heroIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { heroIO.disconnect(); turaIndit(); } }), { threshold: .5 }); heroIO.observe(kaptar); }

/* =====================================================
   Közösség: app-piktogramok lábnyommá állnak össze
   ===================================================== */
(function () {
  const szin = $('.fs-raj-szin', oldal); if (!szin) return;
  const cv = d.createElement('canvas'); cv.setAttribute('aria-hidden', 'true'); szin.insertBefore(cv, szin.firstChild);
  const ctx = cv.getContext('2d');
  const IKONOK = ['pin', 'kupon', 'nap', 'csepp', 'bicaj', 'level', 'csere', 'kosar', 'hir', 'raj'].map(id => { const im = new Image(), s = d.getElementById('fs-i-' + id); im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style="color:#000">' + (s ? s.innerHTML : '') + '</svg>'); return im; });
  const SZINEK = ['#FECF39', '#F5B4C7', '#B1DEFF', '#FECF39', '#D3DDBB'];
  const TALP = [[50, 140], [38, 136], [31, 124], [30, 106], [25, 86], [22, 64], [29, 47], [45, 39], [63, 40], [77, 51], [83, 70], [78, 92], [70, 110], [66, 126], [60, 136]];
  const UJJAK = [[73, 10, 11], [54, 4, 9], [39, 8, 8], [27, 16, 7], [18, 28, 6]];
  let W = 0, H = 0, pinek = [], te = null, csatl = false, lathato = false;
  function talpPontok(n) {
    const minta = [], P = TALP, m = P.length;
    for (let i = 0; i < m; i++) { const p0 = P[(i - 1 + m) % m], p1 = P[i], p2 = P[(i + 1) % m], p3 = P[(i + 2) % m];
      for (let t = 0; t < 1; t += 0.05) { const t2 = t * t, t3 = t2 * t; minta.push([0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3), 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]); } }
    const hs = [0]; for (let i = 1; i < minta.length; i++) hs.push(hs[i - 1] + Math.hypot(minta[i][0] - minta[i - 1][0], minta[i][1] - minta[i - 1][1]));
    const ossz = hs[hs.length - 1], out = []; let j = 0;
    for (let k = 0; k < n; k++) { const c = ossz * k / n; while (j < hs.length - 1 && hs[j + 1] < c) j++; out.push(minta[j]); }
    return out;
  }
  function lepték() { const s = H / 165, sx = Math.min(s * 1.55, W / 110); return { s: s, sx: sx, ox: W / 2 - 52 * sx, oy: H / 2 - 75 * s }; }
  function helyek() {
    const { s, sx, ox, oy } = lepték(), tp = talpPontok(30);
    const celok = tp.map(p => [ox + p[0] * sx, oy + p[1] * s, 13]).concat(UJJAK.map(u => [ox + u[0] * sx, oy + u[1] * s, Math.max(11, u[2] * s * 0.72)]));
    pinek.filter(p => !p.te).forEach((p, i) => { const c = celok[i % celok.length]; p.cx = c[0]; p.cy = c[1]; p.r = c[2]; });
    if (te) { te.cx = ox + 90 * sx; te.cy = oy + 2 * s; }
  }
  function uj(x, y, teVagy, i) { return { x: x, y: y, vx: 0, vy: 0, cx: x, cy: y, r: teVagy ? 18 : 13, f: Math.random() * 10, te: !!teVagy, ik: IKONOK[i % IKONOK.length], szin: teVagy ? '#FECF39' : SZINEK[i % SZINEK.length] }; }
  function meret() { const r = szin.getBoundingClientRect(); W = r.width; H = r.height; const dpr = Math.min(2, devicePixelRatio || 1); cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); helyek(); }
  meret(); for (let i = 0; i < 35; i++) pinek.push(uj(Math.random() * W, H + 20 + Math.random() * 80, false, i)); helyek();
  if (kevesMozgas()) pinek.forEach(p => { p.x = p.cx; p.y = p.cy; });
  addEventListener('resize', meret);
  new IntersectionObserver(es => es.forEach(e => lathato = e.isIntersecting)).observe(szin);
  function rajzol(dt, ts) {
    ctx.clearRect(0, 0, W, H);
    const t = ts / 1000, rm = kevesMozgas();
    for (const p of pinek) {
      if (!rm && dt) { const wx = Math.sin(t * 1.1 + p.f) * 2.5, wy = Math.cos(t * 1.4 + p.f) * 2.5, ax = (p.cx + wx - p.x) * 6 - p.vx * 3, ay = (p.cy + wy - p.y) * 6 - p.vy * 3; p.vx += ax * dt; p.vy += ay * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
      ctx.beginPath(); ctx.arc(p.x + 2, p.y + 2, p.r, 0, Math.PI * 2); ctx.fillStyle = '#000000'; ctx.fill();
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = p.szin; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#000000'; ctx.stroke();
      const ik = p.r * 1.15; if (p.ik.complete) ctx.drawImage(p.ik, p.x - ik / 2, p.y - ik / 2, ik, ik);
      if (p.te) { ctx.font = '700 13px "Open Sans", sans-serif'; ctx.fillStyle = '#FECF39'; ctx.textAlign = 'center'; ctx.fillText('Te', p.x, p.y + p.r + 16); }
    }
  }
  ciklusok.push((dt, ts) => { if (lathato) rajzol(dt, ts); });
  const gomb = $('.fs-csatlakoz', oldal), uzenet = $('.fs-raj-uzenet', oldal);
  if (uzenet) uzenet.setAttribute('aria-live', 'polite');
  if (gomb) gombbaAlakit(gomb, () => {
    if (csatl) { mer('letoltes_gomb', { hely: 'raj', platform: platform }); if (platform === 'android') location.href = playUtm('raj'); else if (platform === 'ios') location.href = iosUtm('raj'); else gorget($('#letoltes')); return; }
    csatl = true; mer('raj_csatlakozas', {});
    const br = gomb.getBoundingClientRect(), sr = szin.getBoundingClientRect();
    te = uj(br.left - sr.left + br.width / 2, br.top - sr.top, true, 0); te.ik = IKONOK[3]; pinek.push(te); helyek();
    if (kevesMozgas()) { te.x = te.cx; te.y = te.cy; }
    meh.arc('ujjongo'); meh.ugrik();
    if (uzenet) uzenet.textContent = 'Üdv a rajban! Egy lépéssel több a közös lábnyomban.';
    gomb.textContent = 'Töltsd le az appot';
  });
})();

/* =====================================================
   Kinek szól: B2C (lábnyom), B2G (polgármester), B2B (vállalkozás)
   ===================================================== */
(function () {
  const test = $('.fs-kviz-test', oldal), bub = $('.fs-buborek', oldal), hely = $('.fs-kviz-mehhely', oldal);
  if (!test || !bub || !hely) return;
  const helyKep = $('img', hely); if (helyKep) helyKep.remove();
  const host = d.createElement('div'); host.className = 'fs-meh'; host.setAttribute('aria-hidden', 'true'); hely.appendChild(host);
  bub.setAttribute('aria-live', 'polite');
  const km = new Meh(host, { arc: 'kivancsi', s: 1 });
  const REAK = [['ujjongo', 'Szuper, ez nagyon ökos!'], ['vidam', 'Jó úton jársz!'], ['meleg', 'Semmi gond, ebben tudunk segíteni.']];
  const UTAK = {
    b2c: { koszon: 'Szia! Segítek kideríteni, miben vagy már ökohős.', lab: 'Játékos előszűrés, nem a valódi kalkulátor.',
      kerdes: [
        { ter: 'Közlekedés', k: 'Hogyan jársz leggyakrabban?', v: [['Autóval', 'auto', 2], ['Tömegközlekedéssel', 'busz', 1], ['Biciklivel vagy gyalog', 'bicaj', 0]] },
        { ter: 'Étkezés', k: 'Milyen gyakran eszel húst?', v: [['Szinte minden nap', 'hus', 2], ['Hetente párszor', 'tal', 1], ['Ritkán vagy soha', 'level', 0]] },
        { ter: 'Ruhák', k: 'Mi lesz a megunt ruháiddal?', v: [['Kidobom', 'kuka', 2], ['Elajándékozom', 'ajandek', 1], ['Cserélem vagy javítom', 'csere', 0]] }],
      reakcio: v => REAK[v],
      eredmeny(vs) {
        const LEP = { 'Közlekedés': ['Nézz körül a közelben!', 'A Zöld térképen megmutatjuk a zöld helyeket és programokat gyalog- vagy bringatávon.'], 'Étkezés': ['Egyél szezonálisan!', 'Mi terem most? Szezonális alapanyagok és növényi receptek az appban.'], 'Ruhák': ['Cserélj, ne vegyél!', 'Csere-bere programok a Kaptárnaptárban, és kuponok zöld partnerektől.'] };
        const min = Math.min(...vs), max = Math.max(...vs), mind = max === 0;
        const eros = this.kerdes[vs.indexOf(min)].ter, lp = mind ? ['Gyűjts nektárt!', 'Minden ökos lépésedért nektár jár az appban, amit jutalmakra válthatsz.'] : LEP[this.kerdes[vs.lastIndexOf(max)].ter];
        return { arc: 'buszke', bub: mind ? 'Igazi ökohős vagy!' : 'Megvan, merre repülünk tovább!', cim: 'Ebben már ökohős vagy', kod: mind ? 'mind' : this.kerdes[vs.lastIndexOf(max)].ter,
          sorok: [['Erősséged', mind ? 'Mindhárom terület' : eros, ''], ['Következő lépés', lp[0], lp[1]]], kiemelt: 1, cta: 'Töltsd le az appot', letolt: true, kep: true, lab: 'A pontos számot az app kalkulátora adja.' };
      } },
    b2g: { koszon: 'Üdv! Már 15 önkormányzattal dolgozunk. Nézzük, mit tehetünk nálatok.', javaslat: true,
      kerdes: [
        { k: 'Mi a legfontosabb célotok?', v: [['A lakók szemléletformálása', 'hir', 'szemlelet'], ['A helyi zöld programok láthatósága', 'nap', 'lathato'], ['Közös önkéntes akció', 'csepp', 'akcio']] },
        { k: 'Hol érjük el a lakókat?', v: [['Az appban', 'lab', 'app'], ['Helyi rendezvényen', 'raj', 'esemeny'], ['Mindkettőn', 'cel', 'mind']] }],
      reakcio: () => ['figyelmes', 'Értem, ez jó irány.'],
      eredmeny(vs) {
        const CEL = { szemlelet: ['Lakossági zöld csomag', 'Helyi tippek és hírek a lakóknak a napi ökosságban, a lábnyomkalkulátorral együtt.'], lathato: ['A település a Zöld térképen', 'A zöld helyek a térképre, a programok a Kaptárnaptárba kerülnek.'], akcio: ['Közös kampány', 'Az Önkéntes vízadás mintájára, ahol 2025-ben 7 000 fa kapott inni: a lakók az appból jelentkeznek, a részvétel mérhető.'] };
        const HOL = { app: 'Az appban 25.000+ letöltő közül érjük el a helyieket.', esemeny: 'Helyi rendezvényre visszük a programjainkat, például Klímafreskót vagy csere-berét.', mind: 'Az appban és helyi rendezvényen is jelen vagyunk, így a kettő erősíti egymást.' };
        return { arc: 'vidam', bub: 'Ebből jó közös projekt lehet!', cim: 'A javaslatunk a településnek', kod: vs[0], telepulesek: true,
          sorok: [['Javaslat', CEL[vs[0]][0], CEL[vs[0]][1]], ['Elérés', 'Így érjük el a lakókat', HOL[vs[1]]]], kiemelt: 0, cta: 'Egyeztessünk', href: '/kapcsolat', lab: 'Szakmai partnerünk az Élhető Települések Országos Szövetsége.' };
      } },
    b2b: { koszon: 'Szia! Nézzük, hogyan találnak meg a zöld vásárlók.',
      kerdes: [
        { k: 'Milyen a vállalkozásod?', v: [['Zöld kisvállalkozás, bolt, szolgáltató', 'bolt', 'kkv'], ['Nagyvállalat', 'ceg', 'nagy']] },
        { k: 'Mi a legfontosabb célod?', v: [['Új vásárlók', 'kupon', 'vevo'], ['A munkatársak bevonása', 'raj', 'csapat'], ['Márkaépítés, ESG', 'cel', 'marka']] }],
      reakcio: () => ['figyelmes', 'Rendben, nézzük tovább!'],
      eredmeny(vs) {
        let r;
        if (vs[1] === 'vevo') r = ['Partnerprogram', 'Kerülj be a beeco appba: megjelenés, kuponfüzet és analitika. A Zümi csomagban már mindent megkapsz az első kuponhoz.', 'Kerülj fel az appba', '/szolgaltatas/partner'];
        else if (vs[1] === 'csapat') r = ['Zöld programok', 'Klímafreskó, ökos kvíz, workshopok és csere-bere a munkatársaknak.', 'Kérj ajánlatot', '/szolgaltatas/zold-esemeny-szervezes'];
        else r = ['Marketing és ESG', 'Közös kampány, mint az őszi CsicsergŐsz, és ESG-tanácsadás.', 'Beszéljünk', '/szolgaltatas/szolgaltatasaink'];
        if (vs[0] === 'kkv' && vs[1] !== 'vevo') r[1] += ' Kisvállalkozásként a partnerprogrammal is indulhatsz.';
        return { arc: 'ujjongo', bub: 'Ez nektek való!', cim: 'Ezzel indulnék', kod: vs.join('-'), sorok: [['Javaslat', r[0], r[1]], vs[1] === 'vevo' ? ['Mennyi idő', 'Három lépés', 'Jelentkezés, beállítás, élesítés.'] : ['Következő lépés', 'Írj nekünk', 'Elmondod, mit szeretnél, és összerakjuk a programot.']], kiemelt: 0, cta: r[2], href: r[3], lab: '' };
      } }
  };
  const KULCSOK = ['b2c', 'b2g', 'b2b'];
  let ut = 'b2c', lepes = 0, valaszok = [];
  const U = () => UTAK[ut];
  const labak = (n, kesz) => Array.from({ length: n }, (_, i) => '<svg class="' + (i < kesz ? 'fs-kesz' : '') + '" aria-hidden="true"><use href="#fs-i-lab"/></svg>').join('');
  const labjegy = () => U().javaslat ? '<span class="fs-javaslat-jel">Új ajánlat, jóváhagyásra vár</span> ' : '';
  function kerdes() {
    const q = U().kerdes[lepes], n = U().kerdes.length;
    test.innerHTML = '<div class="fs-kviz-halad">' + labak(n, lepes) + '<span>' + (lepes + 1) + '. kérdés a ' + n + '-ból</span></div><h3 tabindex="-1" class="fs-kviz-kerdes">' + q.k + '</h3><div class="fs-valaszok">' + q.v.map((v, i) => '<button type="button" class="fs-valasz" aria-pressed="false" data-i="' + i + '">' + ikon(v[1], 'fs-vik') + v[0] + '</button>').join('') + '</div>' +
      '<div class="fs-kviz-lab"><span>' + labjegy() + (U().lab || '') + '</span>' + (lepes ? '<button type="button" class="fs-kviz-vissza">Vissza</button>' : '') + '</div>';
    $$('.fs-valasz', test).forEach(b => b.addEventListener('click', () => valaszol(+b.dataset.i, b)));
    const vb = $('.fs-kviz-vissza', test); if (vb) vb.addEventListener('click', () => { lepes--; valaszok.pop(); km.arc('figyelmes'); bub.textContent = 'Rendben, nézzük újra.'; kerdes(); $('.fs-kviz-kerdes', test).focus(); });
  }
  function valaszol(i, b) {
    if (test.dataset.zar) return; test.dataset.zar = '1';
    $$('.fs-valasz', test).forEach(x => x.setAttribute('aria-pressed', x === b));
    const ert = U().kerdes[lepes].v[i][2]; valaszok[lepes] = ert;
    mer('kviz_valasz', { ut: ut, kerdes: lepes + 1, valasz: String(ert) });
    const r = U().reakcio(ert); km.arc(r[0]); bub.textContent = r[1]; if (r[0] === 'ujjongo') km.ugrik();
    setTimeout(() => { delete test.dataset.zar; lepes++; if (lepes < U().kerdes.length) { km.arc('figyelmes'); kerdes(); $('.fs-kviz-kerdes', test).focus(); } else eredmeny(); }, kevesMozgas() ? 250 : 900);
  }
  function eredmeny() {
    const e = U().eredmeny(valaszok), n = U().kerdes.length;
    mer('kviz_kesz', { ut: ut, eredmeny: e.kod });
    km.arc(e.arc); km.ugrik(); bub.textContent = e.bub;
    const kepSrc = (kepek[0] || {}).src || '';
    test.innerHTML = '<div class="fs-kviz-halad">' + labak(n, n) + '<span>Kész!</span></div>' +
      '<div class="fs-eredmeny' + (e.kep ? '' : ' fs-eredmeny--kep-nelkul') + '"><div><h3 tabindex="-1" class="fs-kviz-kerdes">' + e.cim + '</h3>' +
      e.sorok.map((s, i) => '<div class="fs-eredmeny-sor' + (i === e.kiemelt ? ' fs-eredmeny-sor--lepes' : '') + '"><div class="fs-cimke">' + s[0] + '</div><b>' + s[1] + '</b>' + (s[2] ? '<p>' + s[2] + '</p>' : '') + '</div>').join('') +
      (e.telepulesek ? '<div class="fs-telepulesek"><span class="fs-telepules">címer</span><span class="fs-telepules">címer</span><span class="fs-telepules">címer</span><span class="fs-telepules">címer</span><span class="fs-minta-jel">Ide jön 4–5 partnertelepülés címere, engedéllyel</span></div>' : '') +
      '<a class="fs-gomb fs-kviz-cta" href="' + (e.href || '#letoltes') + '">' + e.cta + '</a></div>' +
      (e.kep && kepSrc ? '<img src="' + kepSrc + '" alt="A beeco Lábnyomkalkulátor képernyője" width="140" height="252">' : '') + '</div>' +
      '<div class="fs-kviz-lab"><span>' + labjegy() + (e.lab || '') + '</span><button type="button" class="fs-kviz-ujra">Újrakezdem</button></div>';
    const cta = $('.fs-kviz-cta', test);
    if (e.letolt) okosLetoltes(cta, 'kviz'); else cta.addEventListener('click', () => mer('kviz_cta', { ut: ut, cta: e.cta }));
    $('.fs-kviz-ujra', test).addEventListener('click', () => { indul(); $('.fs-kviz-kerdes', test).focus(); });
    $('.fs-kviz-kerdes', test).focus({ preventScroll: true });
  }
  function indul() { lepes = 0; valaszok = []; km.arc('kivancsi'); bub.textContent = U().koszon; kerdes(); }
  const ug = $$('.fs-utgomb', oldal);
  const csoport = $('.fs-utvalaszto', oldal); if (csoport) { csoport.setAttribute('role', 'group'); csoport.setAttribute('aria-label', 'Ki vagy?'); }
  ug.forEach((b, i) => { b.setAttribute('aria-pressed', i === 0); gombbaAlakit(b, () => { ug.forEach(x => x.setAttribute('aria-pressed', x === b)); ut = KULCSOK[i] || 'b2c'; mer('ut_valasztas', { ut: ut }); indul(); km.ugrik(); }); });
  ciklusok.push(() => { const w = km.host.offsetWidth; if (w && km.w !== w) km.w = w; km.cel(km.w / 2, km.w / 2, 1); });
  km.w = km.host.offsetWidth || 150; km.hely(km.w / 2, km.w / 2, 1);
  indul();
})();

/* indulás */
frissit();
if (funkok[0]) { const p = relHely($('.fs-pin', funkok[0]), 0.9, 0.05); meh.hely(p[0], p[1] - 60, 0.5); erkezett = false; }
indit();
RM.addEventListener && RM.addEventListener('change', indit);
})();
