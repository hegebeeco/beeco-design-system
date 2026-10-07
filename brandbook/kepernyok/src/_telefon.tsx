// MOBIL APP – ikonikus képernyők közös telefonkerete (brand book, Javaslat 22).
// Az app elrendezése és feliratai a Flutter-forrásból (beeco_MOBILE_APP/mobile-app, 2026-10-07); a kinézet a DS tokenjeivel – a DS-átállás utáni célállapot.
// Az alsó navigáció, az alsó lap, a lebegő gomb és a kuponjegy NEM DS-elem (Javaslat 23 – jóváhagyásra vár): itt a képernyő saját kpm- CSS-e rajzolja, tokenekből.
import { createRoot } from 'react-dom/client';
import { StrictMode, useEffect, type ReactNode } from 'react';

export const ik = (d: string, cls = 'bb-ic') => <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;
export const P = {
  home: 'M3 11l9-7 9 7v9H5v-9z', terkep: 'M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11zM12 7.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z',
  kupon: 'M3 8h18v3a2 2 0 000 4v3H3v-3a2 2 0 000-4V8zM9 14l6-5', naptar: 'M4 6h16v14H4zM4 10h16M8 3v5M16 3v5',
  profil: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0', kereses: 'M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-4-4',
  retegek: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5', hely: 'M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v4M12 18v4M2 12h4M18 12h4', menu: 'M4 7h16M4 12h16M4 17h16',
  vissza: 'M15 5l-7 7 7 7', jobbra: 'M9 5l7 7-7 7', x: 'M6 6l12 12M18 6L6 18', szuro: 'M4 6h16M7 12h10M10 18h4', plusz: 'M12 5v14M5 12h14',
  bolt: 'M4 10h16l-2-5H6zM6 10v9h12v-9', etel: 'M7 3v8M5 3v4a2 2 0 004 0V3M17 3c-2 2-2 6 0 8v10', viz: 'M12 3c4 5 6 8 6 11a6 6 0 01-12 0c0-3 2-6 6-11z',
  fa: 'M12 3c4 3 6 7 3 10H9C6 10 8 6 12 3zM12 13v8', ujra: 'M6 7h12l-1 14H7zM4 7h16M10 4h4', utvonal: 'M5 19l4-14 4 8 4-4 2 10', szivek: 'M12 20s-7-4.5-7-10a4 4 0 017-2 4 4 0 017 2c0 5.5-7 10-7 10z',
  csillag: 'M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8-4.2-4.1 5.9-.9z', ajandek: 'M4 10h16v10H4zM12 10v10M3 7h18v3H3zM12 7c-2-4-6-3-4 0M12 7c2-4 6-3 4 0',
  harang: 'M6 16V11a6 6 0 0112 0v5l2 2H4zM10 20h4', info: 'M12 8h.01M11 12h1v5h1M12 3a9 9 0 100 18 9 9 0 000-18z', lab: 'M8 4c2 0 3 2 3 5s-1 5-3 5-3-2-3-5 1-5 3-5zM16 10c2 0 3 2 3 4s-1 4-3 4-3-2-3-4 1-4 3-4z',
  kaptar: 'M12 3l8 4.5v9L12 21l-8-4.5v-9z', level: 'M4 6h16v12H4zM4 7l8 6 8-6', korona: 'M4 18h16M5 16L4 7l5 4 3-6 3 6 5-4-1 9z', megoszt: 'M4 12v8h16v-8M12 3v13M7 8l5-5 5 5',
};

export type Fül = 'Főoldal' | 'Térkép' | 'Kupon' | 'Naptár' | 'Profil';
const FULEK: Array<[Fül, string]> = [['Főoldal', P.home], ['Térkép', P.terkep], ['Kupon', P.kupon], ['Naptár', P.naptar], ['Profil', P.profil]];

/** Alsó navigáció (az app saját mintája – Javaslat 23): ikon + felirat, az aktív fül méz kitöltéssel, félkövér felirattal és aria-current-tel */
export function AlsoNav({ aktiv, ds }: { aktiv: Fül; ds?: number }) {
  return (
    <nav className="kpm-nav bb-poz" aria-label="Alsó menü" data-ds={ds}>
      {FULEK.map(([nev, d]) => <a key={nev} href="#" aria-current={nev === aktiv ? 'page' : undefined}>{ik(d, 'kpm-nav-ic')}<span>{nev}</span></a>)}
    </nav>
  );
}

/** A brand book DS-jelölései: a DS-elemekre utólag kerül data-ds (a jelölés-gomb mutatja) */
function Jelolo({ jelek }: { jelek: Array<[string, number]> }) {
  useEffect(() => { const t = setTimeout(() => jelek.forEach(([sel, n]) => { const el = document.querySelector(sel); if (el) { el.setAttribute('data-ds', String(n)); el.classList.add('bb-poz'); } }), 300); return () => clearTimeout(t); }, [jelek]);
  return null;
}

/** Telefonképernyő: felső biztonsági sáv, görgethető tartalom, alsó navigáció. A tartalom a valódi DS React-komponensekből épül. */
export function telefon({ cim, aktiv, navDs, fej, tartalom, ratet, jelek = [], gorgo = true }: {
  cim: string; aktiv: Fül; navDs?: number; fej?: ReactNode; tartalom: ReactNode; ratet?: ReactNode; jelek?: Array<[string, number]>; gorgo?: boolean;
}) {
  document.title = `Mobil app – ${cim} – beeco Brand Book`;
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <div className="kpm-ernyo">
        {fej}
        <main className={gorgo ? 'kpm-tartalom' : 'kpm-tartalom is-fix'} tabIndex={gorgo ? 0 : undefined} aria-label={cim}>{tartalom}</main>
        {ratet}
        <AlsoNav aktiv={aktiv} ds={navDs} />
        <Jelolo jelek={jelek} />
      </div>
    </StrictMode>,
  );
}

/** Képernyő-fejléc (app bar): vissza / cím / művelet – ikongombok 44 px-esek */
export function Fejlec({ cim, bal, jobb, ds }: { cim: string; bal?: ReactNode; jobb?: ReactNode; ds?: number }) {
  return (
    <header className="kpm-fej bb-poz" data-ds={ds}>
      <span className="kpm-fej-hely">{bal}</span>
      <h1 className="kpm-fej-cim">{cim}</h1>
      <span className="kpm-fej-hely">{jobb}</span>
    </header>
  );
}
