/* Csicsergősz kampányoldal – útvonal-jelző (Levi-változat). Asztali nézetben (≥768 px) a jobb szélen kacskaringós
   szaggatott vonal, rajta a madár: görgetéskor repdesve halad, megállva a szekcióhoz illő pózba vált.
   Az állomások horgonylinkek (billentyűzettel is elérhetők). Kell hozzá: cs-illusztracio.js (window.CSI). */
(function () {
  var d = document, w = window;
  if (!w.matchMedia || !matchMedia('(min-width: 768px)').matches || !w.CSI) return;
  var csend = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  var ALLOMAS = [
    ['.dia_kek_ov.cs', 'Kezdés', 'alap'],
    ['#miert', 'Miért fontos', 'alap'],
    ['.dia_green_ov.cs', 'Mit tehetsz', 'alap'],
    ['.dia_kek.cs:not(#fotofal):not(#download)', 'Gondoskodás', 'eszeget'],
    ['#HOWTO', 'Megfigyelés és album', 'alap'],
    ['#fotofal', 'Közösség', 'setalgat'],
    ['.dia_green_ov.cs_feher', 'Partnerek', 'alap'],
    ['#segits', 'Csatlakozás', 'alap'],
    ['#gyik', 'Kérdések', 'alap'],
    ['#download', 'Letöltés', 'csicsereg']
  ].map(function (a) { return { el: d.querySelector(a[0]), nev: a[1], poz: a[2] }; }).filter(function (a) { return a.el; });
  if (ALLOMAS.length < 3) return;

  var SZ = 64, FENT = 92, LENT = 28, HUROK = [0.27, 0.68];
  var doboz = d.createElement('nav'); doboz.className = 'cs-utvonal'; doboz.setAttribute('aria-label', 'Hol tartasz az oldalon');
  var svg = d.createElementNS(NS, 'svg'); svg.setAttribute('class', 'cs-utvonal_svg'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
  var alap = d.createElementNS(NS, 'path'); alap.setAttribute('class', 'cs-utvonal_alap');
  var bejart = d.createElementNS(NS, 'path'); bejart.setAttribute('class', 'cs-utvonal_bejart');
  svg.appendChild(alap); svg.appendChild(bejart); doboz.appendChild(svg);
  var madarDoboz = d.createElement('div'); madarDoboz.className = 'cs-utvonal_madar';
  var madar = CSI.madar('alap'); madarDoboz.appendChild(madar); doboz.appendChild(madarDoboz);
  var linkek = ALLOMAS.map(function (a, i) {
    var l = d.createElement('a'); l.className = 'cs-utvonal_pont'; l.href = '#'; l.setAttribute('aria-label', 'Ugrás: ' + a.nev);
    l.innerHTML = '<span class="cs-utvonal_cimke">' + a.nev + '</span>';
    l.addEventListener('click', function (e) { e.preventDefault(); a.el.scrollIntoView({ behavior: csend ? 'auto' : 'smooth', block: 'start' }); });
    doboz.appendChild(l); return l;
  });
  d.body.appendChild(doboz);

  var hossz = 0, allomasHossz = [], tetok = [], H = 0, cel = 0, most = 0, utolso = 0, raf = 0, allTimer = 0, akt = -1;
  function epit() {
    H = innerHeight - FENT - LENT; svg.setAttribute('viewBox', '0 0 ' + SZ + ' ' + H); svg.style.height = H + 'px';
    var p = [], cx = SZ / 2, n = 260;
    for (var k = 0; k <= n; k++) {
      var t = k / n, y = t * H, x = cx + Math.sin(t * Math.PI * 5.2) * 11;
      p.push([x, y]);
      HUROK.forEach(function (h) { if (Math.abs(t - h) < 0.5 / n) { var r = 11; for (var a = 0; a <= 28; a++) { var f = a / 28 * Math.PI * 2; p.push([x + r - r * Math.cos(f), y - r * Math.sin(f)]); } } });
    }
    var dd = 'M' + p.map(function (q) { return q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join(' L');
    alap.setAttribute('d', dd); bejart.setAttribute('d', dd);
    hossz = alap.getTotalLength();
    var mintak = [], lep_ = hossz / 600; for (var L = 0; L <= hossz; L += lep_) mintak.push([L, alap.getPointAtLength(L).y]);
    allomasHossz = ALLOMAS.map(function (a, i) { var cy = H * i / (ALLOMAS.length - 1), best = mintak[0]; mintak.forEach(function (m) { if (Math.abs(m[1] - cy) < Math.abs(best[1] - cy) || (Math.abs(m[1] - cy) === Math.abs(best[1] - cy) && m[0] < best[0])) best = m; }); return best[0]; });
    allomasHossz.forEach(function (L, i) { var q = alap.getPointAtLength(L); linkek[i].style.transform = 'translate(' + (q.x - 22) + 'px,' + (q.y + FENT - 22) + 'px)'; });
    tetok = ALLOMAS.map(function (a) { return a.el.getBoundingClientRect().top + scrollY; });
    celSzamol(); most = cel; rajzol();
  }
  function celSzamol() {
    var v = scrollY + innerHeight * 0.35, i = 0;
    while (i < tetok.length - 1 && v >= tetok[i + 1]) i++;
    var kov = i < tetok.length - 1 ? tetok[i + 1] : d.documentElement.scrollHeight, f = Math.max(0, Math.min(1, (v - tetok[i]) / Math.max(1, kov - tetok[i])));
    if (i === tetok.length - 1) f = 0;
    cel = allomasHossz[i] + f * ((allomasHossz[i + 1] || allomasHossz[i]) - allomasHossz[i]);
    if (i !== akt) { if (akt >= 0) { linkek[akt].removeAttribute('aria-current'); } akt = i; linkek[i].setAttribute('aria-current', 'step'); }
  }
  function rajzol() {
    var q = alap.getPointAtLength(most), q2 = alap.getPointAtLength(Math.min(hossz, most + 2));
    madarDoboz.style.transform = 'translate(' + (q.x - 22) + 'px,' + (q.y + FENT - 40) + 'px) scaleX(' + (q2.x < q.x ? -1 : 1) + ')';
    bejart.style.strokeDasharray = most + ' ' + hossz;
    linkek.forEach(function (l, i) { l.classList.toggle('cs-bejart', allomasHossz[i] <= most + 1); });
  }
  function lep() {
    raf = 0; var kul = cel - most;
    most = csend || Math.abs(kul) < 0.5 ? cel : most + kul * 0.16;
    rajzol();
    if (most !== cel) raf = requestAnimationFrame(lep);
    else { clearTimeout(allTimer); allTimer = setTimeout(function () { CSI.poz(madar, ALLOMAS[akt].poz); }, 400); }
  }
  w.addEventListener('scroll', function () {
    celSzamol(); if (!csend) CSI.poz(madar, 'repdes'); clearTimeout(allTimer);
    if (!raf) raf = requestAnimationFrame(lep);
  }, { passive: true });
  var rt; w.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(epit, 150); });
  w.addEventListener('load', epit);
  epit(); allTimer = setTimeout(function () { CSI.poz(madar, ALLOMAS[akt].poz); }, 400);
})();
