import { useId, type ReactNode } from 'react';
import { cx } from '../cx';
import { TextArea } from '../inputs/TextArea';

export type Jelzes = 'zold' | 'sarga' | 'piros';
export type Irany = 'elore' | 'helyben' | 'hatra';

/** A kártya értéke (vezérelt): jelzés, irány és a szabad szövegek (mező-kulcs → szöveg) */
export type JelzoErtek = {
  jelzes?: Jelzes | null;
  irany?: Irany | null;
  szovegek?: Readonly<Record<string, string>>;
};

/** Egy rövid szöveges mező (pl. „Mi megy jól?”) – a súgó kötelező (3/A) */
export type JelzoSzovegMezo = { kulcs: string; cimke: string; sugo: ReactNode; max?: number };

export type JelzoKartyaLabels = {
  jelzesKerdes: string;
  iranyKerdes: string;
  jelzesek: Record<Jelzes, { cim: string; leiras: string }>;
  iranyok: Record<Irany, string>;
  szovegCim: string;
  kotelezo: string;
};

export const JELZO_KARTYA_LABELS_HU: JelzoKartyaLabels = {
  jelzesKerdes: 'Hogy áll most?',
  iranyKerdes: 'Merre tart?',
  jelzesek: {
    zold: { cim: 'Zöld', leiras: 'Jól megy' },
    sarga: { cim: 'Sárga', leiras: 'Döcög, van mit javítani' },
    piros: { cim: 'Piros', leiras: 'Elakadt, segítség kell' },
  },
  iranyok: { elore: 'Előre megy', helyben: 'Helyben áll', hatra: 'Hátrafelé csúszik' },
  szovegCim: 'Mondanál pár szót? (nem kötelező, név nélkül)',
  kotelezo: 'kötelező',
};

/** A Team-Health-Check három alapkérdése – a Kaptár szövegei; a `szovegMezok` prop felülírja */
export const JELZO_SZOVEG_MEZOK_HU: readonly JelzoSzovegMezo[] = [
  { kulcs: 'jo', cimke: 'Mi megy jól?', sugo: 'Egy-két mondat arról, ami ezen a területen működik. Név nélkül jelenik meg.', max: 280 },
  { kulcs: 'akadaly', cimke: 'Mi akadályoz?', sugo: 'Mi lassít vagy nehezít? Konkrét példa sokat segít. Név nélkül jelenik meg.', max: 280 },
  { kulcs: 'vallalas', cimke: 'Ezt tenném meg', sugo: 'Egy apró lépés, amit te magad meg tudsz tenni. A vezetők látják, név nélkül.', max: 280 },
];

const JELZESEK: readonly Jelzes[] = ['zold', 'sarga', 'piros'];
const IRANYOK: readonly Irany[] = ['elore', 'helyben', 'hatra'];
const TONE: Record<Jelzes, string> = { zold: 'is-zold', sarga: 'is-sarga', piros: 'is-piros' };

const S = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
/** A jelzések piktogramja – a szín mellett MINDIG alak és szöveg is (nem csak szín) */
export const JELZES_IKON: Record<Jelzes, ReactNode> = {
  zold: <svg {...S}><circle cx="12" cy="12" r="9" /><path d="M8 12.5l3 3 5-6" /></svg>,
  sarga: <svg {...S}><path d="M12 3.5L2.8 19.5h18.4z" /><path d="M12 10v4M12 16.8v.2" /></svg>,
  piros: <svg {...S}><path d="M8.2 3h7.6L21 8.2v7.6L15.8 21H8.2L3 15.8V8.2z" /><path d="M9 9l6 6M15 9l-6 6" /></svg>,
};
export const IRANY_IKON: Record<Irany, ReactNode> = {
  elore: <svg {...S}><path d="M7 17L17 7M9 7h8v8" /></svg>,
  helyben: <svg {...S}><path d="M4 12h16M14 6l6 6-6 6" /></svg>,
  hatra: <svg {...S}><path d="M7 7l10 10M17 9v8H9" /></svg>,
};

export type JelzoKartyaProps = {
  /** A terület neve (a kártya címe) */
  cim: string;
  /** Egy mondat a területről */
  leiras?: ReactNode;
  /** A cím szintje – alap 3 */
  cimSzint?: 2 | 3 | 4;
  ertek: JelzoErtek;
  onValtozas: (uj: JelzoErtek) => void;
  /** Irány-kérdés (előre / helyben / hátra) – alap: igen */
  irany?: boolean;
  /** Szabad szöveges mezők (lenyitható részben) – alap: a 3 Kaptár-kérdés; `false` = nincs */
  szovegMezok?: readonly JelzoSzovegMezo[] | false;
  /** A szöveges rész nyitva induljon (alap: csak ha már van benne szöveg) */
  szovegNyitva?: boolean;
  /** Hiba a jelzésnél, pl. „Válassz egy színt – ez kell a kerékhez.” */
  hiba?: string;
  /** A jelzés kötelező (a csoport neve mellett jelölve) */
  kotelezo?: boolean;
  disabled?: boolean;
  labels?: Partial<JelzoKartyaLabels>;
  className?: string;
};

/**
 * JelzoKartya (organizmus, jóváhagyva 2026-10-07 – a Kaptár Team-Health-Check jelöltje): egy terület szavazókártyája.
 * Három nagy választás (zöld / sárga / piros) – mindegyiknél piktogram + szöveg, nem csak szín –, irány (előre / helyben / hátra)
 * és legfeljebb néhány rövid, nem kötelező szöveg. Vezérelt (`ertek`, `onValtozas`). Natív rádiócsoportok: egy Tab-megálló,
 * nyilakkal léptethető; 44 px; hiba szövegesen, `aria-invalid` + `aria-describedby`; tiltott állapot.
 */
export function JelzoKartya({
  cim, leiras, cimSzint = 3, ertek, onValtozas, irany = true, szovegMezok = JELZO_SZOVEG_MEZOK_HU, szovegNyitva, hiba, kotelezo, disabled, labels, className,
}: JelzoKartyaProps) {
  const L = { ...JELZO_KARTYA_LABELS_HU, ...labels, jelzesek: { ...JELZO_KARTYA_LABELS_HU.jelzesek, ...labels?.jelzesek }, iranyok: { ...JELZO_KARTYA_LABELS_HU.iranyok, ...labels?.iranyok } };
  const id = useId();
  const H = `h${cimSzint}` as 'h3';
  const szovegek = ertek.szovegek ?? {};
  const vanSzoveg = Object.values(szovegek).some((s) => s && s.trim());
  const set = (uj: Partial<JelzoErtek>) => onValtozas({ ...ertek, ...uj });

  return (
    <div role="group" className={cx('bc-jelzo', disabled && 'is-disabled', hiba && 'is-error', className)} aria-labelledby={`${id}-cim`}>
      <div className="bc-jelzo-fej">
        <H id={`${id}-cim`} className="bc-jelzo-cim">{cim}</H>
        {leiras && <p className="bc-jelzo-leiras">{leiras}</p>}
      </div>

      <fieldset className="bc-jelzo-csoport" disabled={disabled} aria-invalid={hiba ? true : undefined} aria-describedby={hiba ? `${id}-hiba` : undefined}>
        <legend className="bc-jelzo-kerdes">
          {L.jelzesKerdes}{kotelezo && <span className="is-req" aria-hidden="true">*</span>}{kotelezo && <span className="bc-sr"> ({L.kotelezo})</span>}
        </legend>
        <div className="bc-jelzo-opciok">
          {JELZESEK.map((j) => (
            <label key={j} className={cx('bc-jelzo-opcio', 'is-nagy', TONE[j])}>
              <input type="radio" className="bc-jelzo-radio" name={`${id}-jelzes`} value={j} checked={ertek.jelzes === j}
                required={kotelezo} onChange={() => set({ jelzes: j })} />
              <span className="bc-jelzo-ikon">{JELZES_IKON[j]}</span>
              <span className="bc-jelzo-szoveg">
                <span className="bc-jelzo-opcio-cim">{L.jelzesek[j].cim}</span>
                <span className="bc-jelzo-opcio-leiras">{L.jelzesek[j].leiras}</span>
              </span>
            </label>
          ))}
        </div>
        {hiba && <p className="bc-error" id={`${id}-hiba`} role="alert">{hiba}</p>}
      </fieldset>

      {irany && (
        <fieldset className="bc-jelzo-csoport" disabled={disabled}>
          <legend className="bc-jelzo-kerdes">{L.iranyKerdes}</legend>
          <div className="bc-jelzo-opciok is-irany">
            {IRANYOK.map((i) => (
              <label key={i} className="bc-jelzo-opcio is-irany">
                <input type="radio" className="bc-jelzo-radio" name={`${id}-irany`} value={i} checked={ertek.irany === i} onChange={() => set({ irany: i })} />
                <span className="bc-jelzo-ikon">{IRANY_IKON[i]}</span>
                <span className="bc-jelzo-opcio-cim">{L.iranyok[i]}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {szovegMezok && szovegMezok.length > 0 && (
        <details className="bc-jelzo-reszlet" open={szovegNyitva ?? vanSzoveg}>
          <summary className="bc-jelzo-osszegzes">{L.szovegCim}</summary>
          <div className="bc-jelzo-mezok">
            {szovegMezok.map((m) => (
              <TextArea key={m.kulcs} label={m.cimke} help={m.sugo} rows={2} maxLength={m.max ?? 280} disabled={disabled}
                value={szovegek[m.kulcs] ?? ''} onChange={(e) => set({ szovegek: { ...szovegek, [m.kulcs]: e.target.value } })} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
