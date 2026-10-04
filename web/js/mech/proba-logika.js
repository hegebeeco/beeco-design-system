// ============================================================
//  MECHANIKA 5 – ÜGYESSÉGI PRÓBA (időzítés): a logika (Nem gáz a pedál: „Kerüld ki a kátyút!”, „Érd el a buszt!”)
//
//  Egy sávon jobbra-balra jár egy jelző (háromszög-hullám: 0 → 1 → 0 egy kör alatt); a sáv egy része a célzóna.
//  A játékos akkor koppint, amikor a jelző a zónában van. Ha `korok` kör alatt sem koppint, a próba nem sikerült –
//  nincs végtelen várakozás. A zóna helye ismételhető véletlen (rnd), hogy a mentés és a teszt ugyanazt adja.
//  A sikeres és a sikertelen kimenet hatása a játéké (játékérték); a próba csak annyit mond: sikerült-e.
//  Tiszta logika → tests/check-mech.js.
// ============================================================
(function(root){
  // a jelző helye 0…1 között t ms-nál, kor ms-os oda-vissza úttal
  const pos = (t, kor) => { const f = ((t / kor) % 1 + 1) % 1; return f < 0.5 ? f * 2 : 2 - f * 2; };

  // o: { zona (0,15–0,4: a zóna szélessége), sebesseg (1 = alap), korMs (egy kör ideje sebesseg = 1-nél), korok, tol (a zóna
  //      eleje, ha a játék adja), rnd (ismételhető véletlen), lassit (pl. 1,8 a „Kevesebb mozgás” mellett) }
  function create(o = {}){
    const szel = Math.max(0.1, Math.min(0.5, o.zona ?? 0.25)), rnd = o.rnd || Math.random;
    const kor = (o.korMs ?? 1500) * (o.lassit || 1) / (o.sebesseg || 1), korok = o.korok ?? 3;
    const tol = o.tol ?? (0.12 + rnd() * (0.76 - szel));
    return { tol, szel, kor, korok,
      pos:(t) => pos(t, kor),
      talal:(p) => p >= tol && p <= tol + szel,
      lejart:(t) => t > kor * korok };
  }
  const MechProba = Object.assign(root.MechProba || {}, { create, pos });
  if(typeof module !== 'undefined' && module.exports) module.exports = MechProba; else root.MechProba = MechProba;
})(typeof window !== 'undefined' ? window : this);
