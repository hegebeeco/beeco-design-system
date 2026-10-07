import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../cx';
import { fmt } from '../adat/format';
import { useWidth } from '../adat/useWidth';
import { EmptyState } from '../adat/EmptyState';
import { Marker } from '../adat/chart/marks';
import { SegmentedControl } from '../inputs/SegmentedControl';
import { cimkeIgazitas, cimkeTordeles, radarPoligon, radarPont, tengelySzog } from './geometria';

/** Egy tengely (terület) – a kerék egy küllője */
export type KerekTengely = {
  /** Egyedi kulcs; a sorozatok `ertekek`-je erre hivatkozik, az `onValaszt` ezt adja vissza */
  kulcs: string;
  /** Teljes név – a listában és a táblázatban egészben, a rajzon tördelve (legfeljebb 3 sor, utána „…”) */
  nev: string;
};

/** Egy adatsor: tengely-kulcs → érték (0–max); null vagy hiányzó kulcs = nincs adat (NEM nulla – a rajzon kimarad) */
export type KerekSorozat = {
  kulcs: string;
  /** A sorozat neve a jelmagyarázatban és a táblázat fejlécében, pl. „2026. október” */
  nev: string;
  ertekek: Readonly<Record<string, number | null | undefined>>;
};

/** Opcionális jelzés egy értékhez (pl. lámpa-szín) – a táblázat „Jelzés” oszlopa; mindig szöveggel, nem csak színnel */
export type KerekJelzes = { tone: 'success' | 'warning' | 'danger' | 'info'; szoveg: string } | null;

export type KerekNezet = 'kerek' | 'tablazat';

export type KerekRadarLabels = {
  nezet: string;
  kerek: string;
  tablazat: string;
  jelmagyarazat: string;
  /** A rajz alatti skála-magyarázat */
  skala: (max: number) => string;
  /** A tengely-lista neve (képernyőolvasónak) */
  lista: string;
  terulet: string;
  valtozas: string;
  jelzes: string;
  nincsAdat: string;
  /** Változás, ha az előző sorozatban nincs adat */
  uj: string;
  /** A tengelycímke-gomb neve: „Csapatmunka: 7,5, előző 6, változás +1,5” */
  tengelyNev: (nev: string, ertek: string, elozo?: string, valtozas?: string) => string;
  tablaFelirat: (cim: string, max: number) => string;
  keves: string;
  sok: string;
  uresCim: string;
  uresSzoveg: string;
  betoltes: string;
};

export const KEREK_RADAR_LABELS_HU: KerekRadarLabels = {
  nezet: 'Nézet',
  kerek: 'Kerék',
  tablazat: 'Táblázat',
  jelmagyarazat: 'Jelmagyarázat',
  skala: (max) => `Skála: 0–${fmt(max)} (középen 0, a külső gyűrű ${fmt(max)})`,
  lista: 'Területek – válassz a részletekhez',
  terulet: 'Terület',
  valtozas: 'Változás',
  jelzes: 'Jelzés',
  nincsAdat: 'nincs adat',
  uj: 'új',
  tengelyNev: (nev, ertek, elozo, valtozas) => [`${nev}: ${ertek}`, elozo !== undefined ? `előző ${elozo}` : '', valtozas ? `változás ${valtozas}` : ''].filter(Boolean).join(', '),
  tablaFelirat: (cim, max) => `${cim} – értékek 0–${fmt(max)} között`,
  keves: 'A kerékhez legalább 3 terület kell – addig táblázatban látod.',
  sok: '12-nél több terület a keréken már olvashatatlan – táblázatban látod.',
  uresCim: 'Még nincs adat',
  uresSzoveg: 'Amint lesznek értékek, itt látod a kereket.',
  betoltes: 'Betöltöm a kereket…',
};

export type KerekRadarProps = {
  /** A tengelyek (területek) sorrendben, felülről az óramutató járásával – 3–12 ajánlott */
  tengelyek: readonly KerekTengely[];
  /** 1–2 sorozat: az első a mostani (kitöltött sokszög), a második az összevetés (szaggatott vonal), pl. előző hónap */
  sorozatok: readonly KerekSorozat[];
  /** A grafikon neve (képernyőolvasónak, a táblázat felirata), pl. „Csapat-kerék, 2026. október” */
  cim: string;
  /** A kijelölt tengely kulcsa (vezérelt) */
  kijelolt?: string | null;
  /** Tengely választása (kattintás a címkére / a listára, Enter, Szóköz) – nélküle a kerék csak megjelenít */
  onValaszt?: (kulcs: string) => void;
  /** A skála felső határa – alap 10 */
  max?: number;
  /** Tizedesjegyek a feliratokban – alap 1 */
  tizedes?: number;
  /** Jelzés-oszlop a táblázatban (pl. érték → zöld/sárga/piros) */
  jelzes?: (ertek: number | null) => KerekJelzes;
  /** Kezdő nézet (nem vezérelt) vagy vezérelt nézet az `onNezet`-tel */
  nezet?: KerekNezet;
  onNezet?: (n: KerekNezet) => void;
  /** A rajz melletti tengely-lista (érték, változás) – alap: igen */
  lista?: boolean;
  /** Betöltés */
  tolt?: boolean;
  /** Az üres állapot teendője (pl. „Kitöltöm” gomb) */
  uresTeendo?: ReactNode;
  labels?: Partial<KerekRadarLabels>;
  className?: string;
};

const LH = 16; // egy címkesor magassága, px
const CH_S = 8.3; // egy betű becsült szélessége (fs-s, 14 px), px
const CH_XS = 7.1; // (fs-xs, 12 px)

const vanSzam = (v: unknown): v is number => typeof v === 'number' && !Number.isNaN(v);

/**
 * KerekRadar (organizmus, jóváhagyva 2026-10-07 – a Kaptár „Beeco-kerék” jelöltje): interaktív radar 3–12 tengellyel,
 * 1–2 egymásra vetített sorozattal (most vs. előző), 0–max skálán. A rajz valódi pixelben készül (a felirat sosem torzul),
 * a tengelycímkék gombok (egy Tab-megálló, nyilakkal léptethető, Enter/Szóköz választ), a kijelölt tengely kiemelve.
 * A szín sosem egyedül hordoz jelentést: a két sorozat alakja is más (kitöltött ● / szaggatott ■), és ugyanaz az adat
 * listában és táblázatban is ott van (3/B). Hiányzó érték = „nincs adat”, nem nulla. Üres és töltés állapot beépített.
 */
export function KerekRadar({
  tengelyek, sorozatok, cim, kijelolt = null, onValaszt, max = 10, tizedes = 1, jelzes, nezet, onNezet, lista = true, tolt, uresTeendo, labels, className,
}: KerekRadarProps) {
  const L = { ...KEREK_RADAR_LABELS_HU, ...labels };
  const [sajatNezet, setSajatNezet] = useState<KerekNezet>(nezet ?? 'kerek');
  const aktNezet = onNezet ? (nezet ?? 'kerek') : sajatNezet;
  const setNezet = (n: KerekNezet) => { if (onNezet) onNezet(n); else setSajatNezet(n); };
  const box = useRef<HTMLDivElement>(null);
  const mert = useWidth(box);
  // Rejtett (táblázat) nézetben a mérés 0 – a rajz az utolsó valódi szélességgel marad meg, így visszaváltáskor azonnal látszik
  const utolso = useRef(0);
  if (mert > 0) utolso.current = mert;
  const W = utolso.current;
  const cimkek = useRef<Array<SVGGElement | null>>([]);
  const [fokusz, setFokusz] = useState(0);

  const sor = sorozatok.slice(0, 2);
  const n = tengelyek.length;
  const ertek = (s: KerekSorozat | undefined, k: string) => { const v = s?.ertekek[k]; return vanSzam(v) ? v : null; };
  const most = sor[0];
  const elozo = sor[1];
  const szam = (v: number | null) => (v === null ? L.nincsAdat : fmt(v, tizedes));
  const delta = (k: string): { v: number | null; szoveg: string } | null => {
    if (!elozo) return null;
    const a = ertek(most, k), b = ertek(elozo, k);
    if (a === null) return { v: null, szoveg: '–' };
    if (b === null) return { v: null, szoveg: L.uj };
    const d = Math.round((a - b) * 10 ** tizedes) / 10 ** tizedes;
    return { v: d, szoveg: d === 0 ? '±0' : `${d > 0 ? '+' : '−'}${fmt(Math.abs(d), tizedes)}` };
  };
  const ures = !n || !sor.some((s) => tengelyek.some((t) => ertek(s, t.kulcs) !== null));
  const csakTabla = n > 0 && (n < 3 || n > 12);
  const mutat: KerekNezet = csakTabla ? 'tablazat' : aktNezet;
  const valaszthato = Boolean(onValaszt);

  const Delta = ({ k }: { k: string }) => {
    const d = delta(k);
    if (!d) return null;
    return <span className={cx('bc-kerek-delta', d.v !== null && d.v > 0 && 'is-fel', d.v !== null && d.v < 0 && 'is-le')}>{d.szoveg}</span>;
  };

  if (tolt) {
    return (
      <div className={cx('bc-kerek', className)} aria-busy="true">
        <div className="bc-state" role="status"><span className="bc-spinner" aria-hidden="true" /> {L.betoltes}</div>
      </div>
    );
  }
  if (ures) {
    return (
      <div className={cx('bc-kerek', 'is-empty', className)}>
        <EmptyState compact title={L.uresCim} action={uresTeendo}>{L.uresSzoveg}</EmptyState>
      </div>
    );
  }

  // ---------- Rajz: valódi pixelben ----------
  const keskeny = W < 400;
  const CH = keskeny ? CH_XS : CH_S;
  const oldal = Math.round(Math.min(136, Math.max(keskeny ? 70 : 96, W * 0.24)));
  const R = Math.max(52, Math.min(170, W / 2 - oldal - 8));
  const pad = 3 * LH + LH + 10; // felső/alsó címke: 3 névsor + értéksor
  const H = Math.round(2 * R + 2 * pad);
  const cxp = W / 2, cyp = H / 2;
  const opts = { cx: cxp, cy: cyp, r: R, max };
  const gyuruk = [0.25, 0.5, 0.75, 1];

  const onCimkeKey = (e: KeyboardEvent, i: number) => {
    const lep = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    let uj: number | null = lep ? (i + lep + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : null;
    if (uj !== null) { e.preventDefault(); setFokusz(uj); cimkek.current[uj]?.focus(); return; }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onValaszt?.(tengelyek[i].kulcs); }
  };
  const tabStop = Math.max(0, kijelolt ? tengelyek.findIndex((t) => t.kulcs === kijelolt) : fokusz);

  const rajz = W > 0 && (
    <svg className={cx('bc-kerek-svg', keskeny && 'is-keskeny')} width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="group" aria-label={cim}>
      <g aria-hidden="true">
        {gyuruk.map((g) => (
          <polygon key={g} className={cx('bc-kerek-gyuru', g === 1 && 'is-kulso')} points={radarPoligon(Array(n).fill(g * max), opts)} />
        ))}
        {tengelyek.map((t, i) => {
          const p = radarPont(i, n, max, opts);
          return <line key={t.kulcs} className={cx('bc-kerek-kullo', t.kulcs === kijelolt && 'is-on')} x1={cxp} y1={cyp} x2={p.x} y2={p.y} />;
        })}
        {sor.map((s, si) => {
          const ert = tengelyek.map((t) => ertek(s, t.kulcs));
          const db = ert.filter((v) => v !== null).length;
          const pts = radarPoligon(ert, opts);
          return (
            <g key={s.kulcs} className={cx('bc-kerek-sor', `bc-s${si + 1}`, si === 1 && 'is-osszevet')}>
              {db >= 3 && <polygon className="bc-kerek-terulet-under" points={pts} />}
              {db >= 3 && <polygon className="bc-kerek-terulet" points={pts} />}
              {db === 2 && <polyline className="bc-kerek-terulet" points={pts} />}
              {ert.map((v, i) => {
                if (v === null) return null;
                const p = radarPont(i, n, v, opts);
                return <Marker key={tengelyek[i].kulcs} x={p.x} y={p.y} i={si} r={tengelyek[i].kulcs === kijelolt ? 6.5 : 4.5} />;
              })}
            </g>
          );
        })}
      </g>
      {tengelyek.map((t, i) => {
        const igaz = cimkeIgazitas(i, n);
        const szog = tengelySzog(i, n);
        const p = radarPont(i, n, max, { ...opts, r: R + 12 });
        const fent = Math.sin(szog) < -0.5 && igaz === 'middle';
        const lent = Math.sin(szog) > 0.5 && igaz === 'middle';
        const szel = igaz === 'middle' ? Math.min(2 * oldal, W - 16) : oldal - 6;
        const sorok = cimkeTordeles(t.nev, szel / CH, 3);
        const v = ertek(most, t.kulcs);
        const ertekSor = szam(v);
        const h = sorok.length * LH + LH;
        const y0 = fent ? p.y - 2 - h : lent ? p.y + 2 : p.y - h / 2;
        const sz = Math.max(...sorok.map((s) => s.length), ertekSor.length) * CH + 10;
        const rw = Math.max(48, sz), rh = Math.max(48, h + 6);
        const rx = igaz === 'start' ? p.x - 5 : igaz === 'end' ? p.x - rw + 5 : p.x - rw / 2;
        const ry = y0 + h / 2 - rh / 2;
        const on = t.kulcs === kijelolt;
        const d = delta(t.kulcs);
        const nev = L.tengelyNev(t.nev, ertekSor, elozo ? szam(ertek(elozo, t.kulcs)) : undefined, d?.szoveg);
        const int = valaszthato ? {
          role: 'button', tabIndex: i === tabStop ? 0 : -1, 'aria-pressed': on, 'aria-label': nev,
          onClick: () => onValaszt?.(t.kulcs), onKeyDown: (e: KeyboardEvent) => onCimkeKey(e, i), onFocus: () => setFokusz(i),
        } : { 'aria-label': nev, role: 'img' };
        return (
          <g key={t.kulcs} ref={(el) => { cimkek.current[i] = el; }} className={cx('bc-kerek-cimke', on && 'is-on', valaszthato && 'is-valaszthato')} {...int}>
            <rect className="bc-kerek-cimke-hatter" x={rx} y={ry} width={rw} height={rh} rx={6} />
            <text textAnchor={igaz} aria-hidden="true">
              {sorok.map((s, k) => <tspan key={k} className="bc-kerek-cimke-nev" x={p.x} y={y0 + 12 + k * LH}>{s}</tspan>)}
              <tspan className={cx('bc-kerek-cimke-ertek', v === null && 'is-nincs')} x={p.x} y={y0 + 12 + sorok.length * LH}>{ertekSor}</tspan>
            </text>
          </g>
        );
      })}
    </svg>
  );

  const tablazat = (
    <div className="bc-table-wrap bc-kerek-tabla" tabIndex={0} role="region" aria-label={L.tablaFelirat(cim, max)}>
      <table className="bc-table is-dense">
        <caption className="bc-sr">{L.tablaFelirat(cim, max)}</caption>
        <thead>
          <tr>
            <th scope="col">{L.terulet}</th>
            {sor.map((s) => <th key={s.kulcs} scope="col" className="is-num">{s.nev}</th>)}
            {elozo && <th scope="col" className="is-num">{L.valtozas}</th>}
            {jelzes && <th scope="col">{L.jelzes}</th>}
          </tr>
        </thead>
        <tbody>
          {tengelyek.map((t) => {
            const j = jelzes?.(ertek(most, t.kulcs));
            return (
              <tr key={t.kulcs} aria-current={t.kulcs === kijelolt ? 'true' : undefined} className={cx(t.kulcs === kijelolt && 'is-selected')}>
                <th scope="row">
                  {valaszthato
                    ? <button type="button" className="bc-kerek-sorgomb" aria-pressed={t.kulcs === kijelolt} onClick={() => onValaszt?.(t.kulcs)}>{t.nev}</button>
                    : t.nev}
                </th>
                {sor.map((s) => { const v = ertek(s, t.kulcs); return <td key={s.kulcs} className="is-num">{v === null ? <span className="bc-muted">{L.nincsAdat}</span> : fmt(v, tizedes)}</td>; })}
                {elozo && <td className="is-num"><Delta k={t.kulcs} /></td>}
                {jelzes && <td>{j ? <span className={cx('bc-badge', `is-${j.tone}`)}>{j.szoveg}</span> : <span className="bc-muted">{L.nincsAdat}</span>}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className={cx('bc-kerek', className)}>
      <div className="bc-kerek-fej">
        {!csakTabla && (
          <SegmentedControl label={L.nezet} value={mutat} onChange={setNezet}
            items={[{ value: 'kerek', label: L.kerek }, { value: 'tablazat', label: L.tablazat }]} />
        )}
        <ul className="bc-legend bc-kerek-jelmagyarazat" aria-label={L.jelmagyarazat}>
          {sor.map((s, si) => (
            <li key={s.kulcs}>
              <svg className="bc-swatch" viewBox="0 0 24 16" width="24" height="16" aria-hidden="true">
                <g className={cx('bc-kerek-sor', `bc-s${si + 1}`, si === 1 && 'is-osszevet')}>
                  {si === 0 ? <rect className="bc-kerek-terulet" x="2" y="2" width="20" height="12" rx="2" /> : <path className="bc-kerek-terulet" d="M1 8H23" />}
                  <Marker x={12} y={8} i={si} r={4} />
                </g>
              </svg>
              {s.nev}
            </li>
          ))}
        </ul>
      </div>
      {csakTabla && <p className="bc-kerek-megj">{n < 3 ? L.keves : L.sok}</p>}
      {/* A rajz doboza mindig a DOM-ban marad (csak rejtve) – így a szélességmérés (ResizeObserver) nézetváltás után is él */}
      {!csakTabla && (
        <div className={cx('bc-kerek-test', !lista && 'is-lista-nelkul')} hidden={mutat !== 'kerek'}>
          <figure className="bc-kerek-abra bc-chart">
            <div ref={box} className="bc-kerek-rajz">{rajz}</div>
            <figcaption className="bc-chart-note">{L.skala(max)}</figcaption>
          </figure>
          {lista && (
            <ul className="bc-kerek-lista" aria-label={L.lista}>
              {tengelyek.map((t) => {
                const on = t.kulcs === kijelolt;
                const tart = (
                  <>
                    <span className="bc-kerek-lista-nev">{t.nev}</span>
                    <span className="bc-kerek-lista-szam">
                      <span className={cx(ertek(most, t.kulcs) === null && 'is-nincs')}>{szam(ertek(most, t.kulcs))}</span>
                      <Delta k={t.kulcs} />
                    </span>
                  </>
                );
                return (
                  <li key={t.kulcs}>
                    {valaszthato
                      ? <button type="button" className={cx('bc-kerek-lista-elem', on && 'is-on')} aria-pressed={on} onClick={() => onValaszt?.(t.kulcs)}>{tart}</button>
                      : <div className="bc-kerek-lista-elem">{tart}</div>}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
      {mutat === 'tablazat' && tablazat}
    </div>
  );
}
