import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { cx } from '../cx';
import { IcRight } from '../inputs/ikonok';
import { formatHuDate } from '../pickers/date';
import { EmptyState } from '../adat/EmptyState';
import { defaultLink, type RenderLink } from '../reteg/NavTabs';

export type UtvonalAllapot = 'kesz' | 'most' | 'jon' | 'kihagyva';

export type UtvonalSzakasz = {
  /** Egyedi kulcs (React key) */
  kulcs: string;
  /** A szakasz neve, pl. „Rajba sorolás” */
  cim: string;
  allapot: UtvonalAllapot;
  /** Mikor lett kész – ISO dátum („2026-10-01” vagy teljes ISO időpont); a teljes nézet „Kész · 2026. 10. 01.”-ként írja ki */
  datum?: string;
  /** Egy mondat a szakaszról (a teljes nézetben minden szakasznál, a tömörben a mostaninál) */
  leiras?: ReactNode;
};

/** Az EGYETLEN következő lépés: egy mondat + egy fő gomb (href → link, onClick → gomb) */
export type UtvonalLepes = {
  szoveg: ReactNode;
  /** A gomb felirata, pl. „Válassz feladatot” */
  cta: string;
  href?: string;
  onClick?: () => void;
};

export type UtvonalSegito = { nev: string; szerep: string; href?: string };

export type UtvonalHatarido = {
  /** Hátralévő órák; negatív = ennyi órája lejárt */
  ora: number;
  /** Mire vonatkozik, pl. „Rajba sorolás” → „Rajba sorolás: még 30 óra” */
  cimke?: string;
  /** Felülírja a késés jelzését (alap: ora < 0) */
  kesik?: boolean;
};

export type UtvonalLabels = {
  /** Képernyőolvasó-szöveg a tömör térképen (a szín mellett) */
  allapot: Record<UtvonalAllapot, string>;
  /** Látható jelvény a teljes nézetben */
  jelveny: Record<UtvonalAllapot, string>;
  mostItt: (sorszam: number, osszes: number) => string;
  gorgetheto: string;
  keszCim: string;
  keszSzoveg: string;
  uresCim: string;
  uresSzoveg: string;
  nincsSegito: string;
  kesesSegitovel: string;
  kesesSegitoNelkul: string;
  ido: (ora: number) => string;
};

/** Hátralévő idő magyarul: „még 30 óra”, „még 3 nap”, „5 órája lejárt”, „2 napja lejárt” */
export function hataridoSzoveg(ora: number): string {
  if (ora < 0) {
    const k = Math.max(1, Math.round(-ora));
    return k >= 48 ? `${Math.floor(k / 24)} napja lejárt` : `${k} órája lejárt`;
  }
  if (ora >= 48) return `még ${Math.floor(ora / 24)} nap`;
  if (ora < 1) return 'még kevesebb mint 1 óra';
  return `még ${Math.floor(ora)} óra`;
}

export const UTVONAL_LABELS_HU: UtvonalLabels = {
  allapot: { kesz: 'kész', most: 'most itt tartasz', jon: 'ezután jön', kihagyva: 'kihagyva' },
  jelveny: { kesz: 'Kész', most: 'Most itt tartasz', jon: 'Ezután jön', kihagyva: 'Kihagyva' },
  mostItt: (n, m) => `Most itt tartasz · ${n}. szakasz (összesen ${m})`,
  gorgetheto: 'vízszintesen görgethető',
  keszCim: 'Végigértél az úton',
  keszSzoveg: 'Minden szakasz kész. Szép munka!',
  uresCim: 'Még nincs kijelölt út',
  uresSzoveg: 'Amint elindul, itt látod a szakaszokat és a következő lépést.',
  nincsSegito: 'Segítőt még keresünk neked – hamarosan jelentkezik.',
  kesesSegitovel: 'Nincs baj – írj nyugodtan a segítődnek.',
  kesesSegitoNelkul: 'Nincs baj – folytasd, amikor tudod.',
  ido: hataridoSzoveg,
};

export type UtvonalProps = {
  szakaszok: readonly UtvonalSzakasz[];
  /** A szakaszlista neve képernyőolvasónak, pl. „Az út szakaszai” */
  cimke: string;
  /** Egy következő lépés, egy fő gombbal (a komponensben ez az egyetlen fő gomb) */
  kovetkezo?: UtvonalLepes;
  /** Ki segít; `null` = még nincs (kíméletes szöveg), elhagyva = nem jelenik meg */
  segito?: UtvonalSegito | null;
  hatarido?: UtvonalHatarido;
  /** Tömör: vízszintes térkép (irányítópultra); alap: függőleges idővonal (teljes oldalra) */
  tomor?: boolean;
  /** A szakaszcímek (és a tömör nézet mostani címe) címszintje – alap 3 */
  cimSzint?: 2 | 3 | 4;
  /** Router-link (React Router, Next) a gombhoz és a segítő nevéhez; alap <a> */
  renderLink?: RenderLink;
  /** Saját feliratok (pl. angol partner-app) – alap: magyar */
  labels?: Partial<UtvonalLabels>;
  /** A mostani szakasz kiegészítése (pl. Progress, előkészület-jelvények) – a következő lépés fölött */
  children?: ReactNode;
  className?: string;
};

const isoNap = (d?: string) => (d && /^\d{4}-\d{2}-\d{2}/.test(d) ? formatHuDate(d.slice(0, 10)) : d ?? '');

const JelIkon = ({ allapot, n }: { allapot: UtvonalAllapot; n: number }) =>
  allapot === 'kesz' ? <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
    : allapot === 'kihagyva' ? <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><path d="M7 12h10" /></svg>
      : <>{n}</>;

/**
 * Utvonal (organizmus, jóváhagyva 2026-10-07 – a Kaptár „Az utad” jelöltje): egy út szakaszai + EGY következő lépés,
 * a segítővel és a határidővel. Két nézet: `tomor` – vízszintes térkép a saját dobozában görgetve, a mostani szakasz középen
 * (irányítópult); alap – függőleges idővonal (mögötted dátummal, most, ami jön). Az állapotot szöveg is mondja, nem csak szín;
 * a lista <ol>, a mostani szakasz aria-current="step". Üres, végigért, késő határidő és hiányzó segítő állapota beépített.
 */
export function Utvonal({ szakaszok, cimke, kovetkezo, segito, hatarido, tomor, cimSzint = 3, renderLink = defaultLink, labels, children, className }: UtvonalProps) {
  const L = { ...UTVONAL_LABELS_HU, ...labels };
  const H = `h${cimSzint}` as 'h3';
  const mostIdx = szakaszok.findIndex((s) => s.allapot === 'most');
  // Egy út egyszerre egy helyen tart: a második „most” már „jon”-ként jelenik meg
  const allapotOf = (s: UtvonalSzakasz, i: number): UtvonalAllapot => (s.allapot === 'most' && i !== mostIdx ? 'jon' : s.allapot);
  const mind = szakaszok.length > 0 && szakaszok.every((s) => s.allapot === 'kesz' || s.allapot === 'kihagyva');
  const most = mostIdx >= 0 ? szakaszok[mostIdx] : undefined;

  const terkep = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = terkep.current;
    if (!el) return;
    const kozepre = () => {
      const cur = el.querySelector<HTMLElement>('[aria-current="step"]');
      if (!cur || el.scrollWidth <= el.clientWidth) return;
      // A doboz position: relative → az offsetLeft hozzá képest számít; azonnal (nem görgetési animációval)
      el.scrollLeft = cur.offsetLeft - el.clientWidth / 2 + cur.offsetWidth / 2;
    };
    kozepre();
    // A betűk (Lalezar, Open Sans) később töltődhetnek be, és a doboz mérete is változhat:
    // ilyenkor újra középre igazítunk. Görgetésre nem fut, így a felhasználót nem rángatja.
    let elo = true;
    document.fonts?.ready.then(() => { if (elo) kozepre(); });
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => kozepre()) : null;
    ro?.observe(el);
    if (el.firstElementChild) ro?.observe(el.firstElementChild);
    return () => { elo = false; ro?.disconnect(); };
  }, [szakaszok, tomor]);

  const cta = kovetkezo && (() => {
    const tart = <>{kovetkezo.cta}<IcRight /></>;
    return kovetkezo.href
      ? renderLink({ href: kovetkezo.href, className: 'bc-btn is-wrap', onClick: kovetkezo.onClick, children: tart })
      : <button type="button" className="bc-btn is-wrap" onClick={kovetkezo.onClick}>{tart}</button>;
  })();

  const kesik = hatarido ? (hatarido.kesik ?? hatarido.ora < 0) : false;
  const meta = (segito !== undefined || hatarido) && (
    <div className="bc-ut-meta">
      {segito ? (
        <p className="bc-ut-segito">{segito.szerep}:{' '}
          {segito.href ? renderLink({ href: segito.href, className: 'bc-ut-segito-link', children: segito.nev }) : <b>{segito.nev}</b>}
        </p>
      ) : segito === null ? <p className="bc-ut-segito is-missing">{L.nincsSegito}</p> : null}
      {hatarido && (
        <span className={cx('bc-badge', kesik ? 'is-warning' : 'is-info')}>
          {hatarido.cimke ? `${hatarido.cimke}: ` : ''}{L.ido(hatarido.ora)}
        </span>
      )}
      {kesik && <p className="bc-ut-nyugi">{segito ? L.kesesSegitovel : L.kesesSegitoNelkul}</p>}
    </div>
  );

  const lepes = (children || kovetkezo || meta) && (
    <>
      {children && <div className="bc-ut-extra">{children}</div>}
      {kovetkezo && (
        <div className="bc-ut-next">
          <p className="bc-ut-next-text">{kovetkezo.szoveg}</p>
          {cta}
        </div>
      )}
      {meta}
    </>
  );

  if (!szakaszok.length) {
    return (
      <div className={cx('bc-ut', tomor && 'is-tomor', 'is-empty', className)}>
        <EmptyState compact title={L.uresCim} action={cta}>{L.uresSzoveg}</EmptyState>
        {meta}
      </div>
    );
  }

  const keszPanel = mind && (
    <div className="bc-ut-done" role="status">
      <p className="bc-ut-done-title">{L.keszCim}</p>
      <p className="bc-ut-done-text">{L.keszSzoveg}</p>
    </div>
  );

  if (tomor) {
    return (
      <div className={cx('bc-ut', 'is-tomor', className)}>
        <div ref={terkep} className="bc-ut-map" role="region" aria-label={`${cimke} – ${L.gorgetheto}`} tabIndex={0}>
          <ol className="bc-steps bc-ut-steps" aria-label={cimke}>
            {szakaszok.map((s, i) => {
              const a = allapotOf(s, i);
              return (
                <li key={s.kulcs} className={`is-${a === 'kesz' ? 'done' : a === 'most' ? 'current' : a === 'jon' ? 'todo' : 'skipped'}`}
                  aria-current={a === 'most' ? 'step' : undefined}>
                  <b aria-hidden="true"><JelIkon allapot={a} n={i + 1} /></b>
                  <span className="bc-ut-step-label" title={s.cim}>{s.cim}</span>
                  <span className="bc-sr"> – {L.allapot[a]}</span>
                </li>
              );
            })}
          </ol>
        </div>
        {most ? (
          <div className="bc-ut-now bc-anim-rise">
            <div>
              <p className="bc-ut-kicker">{L.mostItt(mostIdx + 1, szakaszok.length)}</p>
              <H className="bc-ut-now-title">{most.cim}</H>
              {most.leiras && <p className="bc-ut-desc">{most.leiras}</p>}
            </div>
            {lepes}
          </div>
        ) : (
          <>{keszPanel}{lepes && <div className="bc-ut-now bc-anim-rise">{lepes}</div>}</>
        )}
      </div>
    );
  }

  return (
    <div className={cx('bc-ut', className)}>
      <ol className="bc-ut-list" aria-label={cimke}>
        {szakaszok.map((s, i) => {
          const a = allapotOf(s, i);
          const d = a === 'kesz' ? isoNap(s.datum) : '';
          return (
            <li key={s.kulcs} className={`bc-ut-item is-${a}`} aria-current={a === 'most' ? 'step' : undefined}>
              <span className="bc-ut-mark" aria-hidden="true"><JelIkon allapot={a} n={i + 1} /></span>
              <div className="bc-ut-body">
                <div className="bc-ut-head">
                  <H className="bc-ut-title">{s.cim}</H>
                  <span className={cx('bc-badge', a === 'kesz' ? 'is-success' : a === 'most' ? 'is-accent' : 'is-muted')}>
                    {d ? `${L.jelveny.kesz} · ${d}` : L.jelveny[a]}
                  </span>
                </div>
                {s.leiras && <p className="bc-ut-desc">{s.leiras}</p>}
                {a === 'most' && lepes && <div className="bc-ut-now bc-anim-rise">{lepes}</div>}
              </div>
            </li>
          );
        })}
      </ol>
      {!most && (keszPanel || lepes) && <div className="bc-ut-after">{keszPanel}{lepes && <div className="bc-ut-now bc-anim-rise">{lepes}</div>}</div>}
    </div>
  );
}
