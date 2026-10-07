import { useEffect, useId, useRef, useState, type FormEvent, type PointerEvent as RPointerEvent, type ReactNode } from 'react';
import { cx } from '../cx';
import { Button } from '../inputs/Button';
import { TextArea } from '../inputs/TextArea';
import { CheckboxInput } from '../inputs/Choice';
import { IcEdit, IcNew, IcSave, IcTrash, IcX } from '../inputs/ikonok';
import { TooltipIconButton } from '../reteg/Tooltip';

/** Egy zóna (oszlop) a vásznon */
export type RetroZona = { kulcs: string; cim: string; kerdes?: string; ikon?: ReactNode };

/** Egy cetli. `sajat` = a nézőé (szerkesztheti, mozgathatja, törölheti); a moderátor bárkiét kezelheti. */
export type RetroCetli = {
  id: string;
  zona: string;
  szoveg: string;
  /** Név nélkül – a szerző nem jelenik meg */
  anonim?: boolean;
  szerzo?: string;
  sajat?: boolean;
};

export type RetroKeret = { cim: string; leiras: string; zonak: readonly RetroZona[] };

const S = { viewBox: '0 0 24 24', width: 20, height: 20, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
const IKON = {
  szel: <svg {...S}><path d="M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h7" /></svg>,
  horgony: <svg {...S}><circle cx="12" cy="5" r="2" /><path d="M12 7v14M8 11h8M5 14a7 7 0 0 0 14 0" /></svg>,
  sziklak: <svg {...S}><path d="M2 20l6-11 4 6 3-4 7 9z" /></svg>,
  sziget: <svg {...S}><path d="M6 21V4M6 4h11l-2.5 4L17 12H6" /></svg>,
};

/** Kész keretek (a Kaptár retró-keretei): vitorlás (4 zóna), 4L, Start–Stop–Folytasd */
export const RETRO_KERETEK: Readonly<Record<'vitorlas' | '4l' | 'ssc', RetroKeret>> = {
  vitorlas: {
    cim: 'Vitorlás',
    leiras: 'Mi visz előre, mi tart vissza, mire figyeljünk, és hova tartunk.',
    zonak: [
      { kulcs: 'szel', cim: 'Szél', kerdes: 'Mi visz előre?', ikon: IKON.szel },
      { kulcs: 'horgony', cim: 'Horgony', kerdes: 'Mi tart vissza?', ikon: IKON.horgony },
      { kulcs: 'sziklak', cim: 'Sziklák', kerdes: 'Milyen kockázatot látsz?', ikon: IKON.sziklak },
      { kulcs: 'sziget', cim: 'Sziget', kerdes: 'Hova tartunk?', ikon: IKON.sziget },
    ],
  },
  '4l': {
    cim: '4L',
    leiras: 'Gyors, aszinkron kör négy kérdéssel.',
    zonak: [
      { kulcs: 'tetszett', cim: 'Tetszett', kerdes: 'Mi tetszett?' },
      { kulcs: 'tanultunk', cim: 'Tanultunk', kerdes: 'Mit tanultunk?' },
      { kulcs: 'hianyzott', cim: 'Hiányzott', kerdes: 'Mi hiányzott?' },
      { kulcs: 'vagytunk', cim: 'Vágytunk', kerdes: 'Mire vágytunk?' },
    ],
  },
  ssc: {
    cim: 'Start–Stop–Folytasd',
    leiras: 'Mit kezdjünk el, mit hagyjunk abba, mit folytassunk.',
    zonak: [
      { kulcs: 'start', cim: 'Start', kerdes: 'Mit kezdjünk el?' },
      { kulcs: 'stop', cim: 'Stop', kerdes: 'Mit hagyjunk abba?' },
      { kulcs: 'folytat', cim: 'Folytasd', kerdes: 'Mit folytassunk?' },
    ],
  },
};

export type RetroVaszonLabels = {
  ujCetli: string;
  ujCetliMezo: (zona: string) => string;
  ujSugo: string;
  anonim: string;
  felteszem: string;
  megse: string;
  mentes: string;
  szerkesztes: (szoveg: string) => string;
  szerkesztesMezo: string;
  torles: (szoveg: string) => string;
  athelyezes: (szoveg: string) => string;
  huzas: string;
  nevNelkul: string;
  ismeretlen: string;
  tied: string;
  ures: string;
  csakOlvashato: string;
  betoltes: string;
  athelyezve: (zona: string) => string;
  db: (n: number) => string;
  hibaUres: string;
};

export const RETRO_VASZON_LABELS_HU: RetroVaszonLabels = {
  ujCetli: 'Cetli ide',
  ujCetliMezo: (zona) => `Új cetli – ${zona}`,
  ujSugo: 'Egy gondolat, röviden. Ha bejelölöd a „Név nélkül”-t, a neved nem jelenik meg.',
  anonim: 'Név nélkül',
  felteszem: 'Felteszem',
  megse: 'Mégse',
  mentes: 'Mentés',
  szerkesztes: (s) => `Cetli szerkesztése: ${s}`,
  szerkesztesMezo: 'Cetli szövege',
  torles: (s) => `Cetli törlése: ${s}`,
  athelyezes: (s) => `Áthelyezés másik zónába: ${s}`,
  huzas: 'Húzd át egy másik zónába',
  nevNelkul: 'Név nélkül',
  ismeretlen: 'Ismeretlen',
  tied: 'a tiéd',
  ures: 'Még üres.',
  csakOlvashato: 'Csak olvasható – a retró lezárult, a cetlik már nem változnak.',
  betoltes: 'Betöltöm a cetliket…',
  athelyezve: (z) => `Áthelyezve ide: ${z}`,
  db: (n) => `${n} cetli`,
  hibaUres: 'Írj legalább egy szót a cetlire.',
};

export type RetroVaszonProps = {
  /** A zónák (pl. `RETRO_KERETEK.vitorlas.zonak`) */
  zonak: readonly RetroZona[];
  cetlik: readonly RetroCetli[];
  /** Új cetli; `false` (vagy Promise<false>) = nem sikerült, az űrlap nyitva marad a szöveggel */
  onUj?: (zona: string, szoveg: string, anonim: boolean) => void | boolean | Promise<void | boolean>;
  /** Áthelyezés (húzás vagy a cetli „Áthelyezés” választója) */
  onMozgat?: (id: string, zona: string) => void;
  onSzerkeszt?: (id: string, szoveg: string) => void;
  onTorol?: (id: string) => void;
  /** Moderátor: bárki cetlijét mozgathatja, szerkesztheti, törölheti */
  moderator?: boolean;
  /** Lezárt retró: semmi nem változtatható */
  csakOlvashato?: boolean;
  tolt?: boolean;
  /** Egy cetli legfeljebb ennyi karakter – alap 280 */
  maxHossz?: number;
  /** A zónacímek szintje – alap 3 */
  cimSzint?: 2 | 3 | 4;
  /** Kivetítő-mód: nagyobb betű */
  nagy?: boolean;
  labels?: Partial<RetroVaszonLabels>;
  className?: string;
};

type Huzas = { id: string; x0: number; y0: number; dx: number; dy: number; aktiv: boolean; cel: string | null };

/**
 * RetroVaszon (organizmus, jóváhagyva 2026-10-07 – a Kaptár retró-jelöltje): zónák cetlikkel (vitorlás, 4L, Start–Stop–Folytasd
 * vagy saját). Zónánként „Cetli ide” (név nélkül is), a saját cetli szerkeszthető és törölhető; áthelyezés húzással (egér ÉS
 * érintés – pointer-események) és billentyűzettel (a cetli „Áthelyezés” választója); az áthelyezést élő régió mondja be.
 * Üres, töltés és csak olvasható állapot; keskeny képernyőn a zónák egymás alá kerülnek.
 */
export function RetroVaszon({
  zonak, cetlik, onUj, onMozgat, onSzerkeszt, onTorol, moderator, csakOlvashato, tolt, maxHossz = 280, cimSzint = 3, nagy, labels, className,
}: RetroVaszonProps) {
  const L = { ...RETRO_VASZON_LABELS_HU, ...labels };
  const id = useId();
  const H = `h${cimSzint}` as 'h3';
  const [nyitott, setNyitott] = useState<string | null>(null);
  const [uj, setUj] = useState('');
  const [anonim, setAnonim] = useState(false);
  const [hiba, setHiba] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [szerk, setSzerk] = useState<{ id: string; szoveg: string } | null>(null);
  const [bemond, setBemond] = useState('');
  const [huz, setHuz] = useState<Huzas | null>(null);
  const huzRef = useRef<Huzas | null>(null);
  const zonaNev = (k: string) => zonak.find((z) => z.kulcs === k)?.cim ?? k;
  const kezelheto = (c: RetroCetli) => !csakOlvashato && !tolt && Boolean(c.sajat || moderator);

  const mozgat = (cid: string, zona: string) => {
    onMozgat?.(cid, zona);
    setBemond(L.athelyezve(zonaNev(zona)));
  };

  // Húzás közben Esc = mégse
  useEffect(() => {
    if (!huz?.aktiv) return;
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') { huzRef.current = null; setHuz(null); } };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [huz?.aktiv]);

  const huzKezd = (e: RPointerEvent<HTMLElement>, cid: string) => {
    if (e.button !== 0 || !onMozgat) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    huzRef.current = { id: cid, x0: e.clientX, y0: e.clientY, dx: 0, dy: 0, aktiv: false, cel: null };
  };
  const huzMozog = (e: RPointerEvent<HTMLElement>) => {
    const h = huzRef.current;
    if (!h) return;
    const dx = e.clientX - h.x0, dy = e.clientY - h.y0;
    const aktiv = h.aktiv || Math.hypot(dx, dy) > 4;
    if (!aktiv) return;
    const alatt = document.elementsFromPoint(e.clientX, e.clientY).find((el) => el instanceof HTMLElement && el.dataset.retroZona && el.closest(`[data-retro="${id}"]`)) as HTMLElement | undefined;
    const kov = { ...h, dx, dy, aktiv, cel: alatt?.dataset.retroZona ?? null };
    huzRef.current = kov;
    setHuz(kov);
  };
  const huzVege = () => {
    const h = huzRef.current;
    huzRef.current = null;
    setHuz(null);
    if (!h?.aktiv || !h.cel) return;
    const c = cetlik.find((x) => x.id === h.id);
    if (c && c.zona !== h.cel) mozgat(h.id, h.cel);
  };

  const kuld = async (e: FormEvent, zona: string) => {
    e.preventDefault();
    if (!uj.trim()) { setHiba(L.hibaUres); return; }
    setBusy(true);
    const ok = await onUj?.(zona, uj.trim(), anonim);
    setBusy(false);
    if (ok === false) return;
    setUj(''); setAnonim(false); setHiba(undefined); setNyitott(null);
  };
  const nyit = (zona: string) => { setNyitott(zona); setUj(''); setHiba(undefined); setAnonim(false); };

  const irhato = !csakOlvashato && !tolt && Boolean(onUj);

  return (
    <div className={cx('bc-retro', nagy && 'is-nagy', csakOlvashato && 'is-readonly', huz?.aktiv && 'is-huzas', className)} data-retro={id} aria-busy={tolt || undefined}>
      {csakOlvashato && <p className="bc-retro-zarva" role="note">{L.csakOlvashato}</p>}
      {tolt && <p className="bc-sr" role="status">{L.betoltes}</p>}
      <p className="bc-sr" role="status" aria-live="polite">{bemond}</p>
      <div className={cx('bc-retro-zonak', zonak.length === 3 && 'is-harom')}>
        {zonak.map((z) => {
          const itt = cetlik.filter((c) => c.zona === z.kulcs);
          const zid = `${id}-z-${z.kulcs}`;
          return (
            <div key={z.kulcs} role="group" className={cx('bc-retro-zona', huz?.aktiv && huz.cel === z.kulcs && 'is-cel')} aria-labelledby={zid} data-retro-zona={z.kulcs}>
              <div className="bc-retro-zona-fej">
                <H id={zid} className="bc-retro-zona-cim">
                  {z.ikon && <span className="bc-retro-zona-ikon">{z.ikon}</span>}
                  {z.cim}
                  <span className="bc-retro-db"><span aria-hidden="true">{itt.length}</span><span className="bc-sr">{L.db(itt.length)}</span></span>
                </H>
                {z.kerdes && <p className="bc-retro-kerdes">{z.kerdes}</p>}
              </div>

              {tolt ? (
                <div className="bc-retro-cetlik" aria-hidden="true">
                  <span className="bc-skeleton bc-retro-skel" /><span className="bc-skeleton bc-retro-skel is-rovid" />
                </div>
              ) : itt.length > 0 ? (
                <ul className="bc-retro-cetlik">
                  {itt.map((c) => {
                    const k = kezelheto(c);
                    const h = huz?.id === c.id && huz.aktiv ? huz : null;
                    const szerkeszt = szerk?.id === c.id;
                    return (
                      <li key={c.id} className={cx('bc-retro-cetli', c.sajat && 'is-sajat', h && 'is-huzott')}
                        style={h ? { transform: `translate(${h.dx}px, ${h.dy}px) rotate(-1.5deg)` } : undefined} data-cetli={c.id}>
                        {szerkeszt ? (
                          <form className="bc-retro-urlap" onSubmit={(e) => { e.preventDefault(); if (szerk.szoveg.trim()) { onSzerkeszt?.(c.id, szerk.szoveg.trim()); setSzerk(null); } }}
                            onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); setSzerk(null); } }}>
                            <TextArea label={L.szerkesztesMezo} help={L.ujSugo} rows={3} maxLength={maxHossz} autoFocus value={szerk.szoveg}
                              error={szerk.szoveg.trim() ? undefined : L.hibaUres} onChange={(e) => setSzerk({ id: c.id, szoveg: e.target.value })} />
                            <div className="bc-retro-gombok">
                              <Button type="submit" icon={<IcSave />} disabled={!szerk.szoveg.trim()}>{L.mentes}</Button>
                              <Button variant="ghost" icon={<IcX />} onClick={() => setSzerk(null)}>{L.megse}</Button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <div className="bc-retro-cetli-test">
                              {k && onMozgat && (
                                <span className="bc-retro-fogo" title={L.huzas} aria-hidden="true"
                                  onPointerDown={(e) => huzKezd(e, c.id)} onPointerMove={huzMozog} onPointerUp={huzVege} onPointerCancel={() => { huzRef.current = null; setHuz(null); }}>
                                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><circle cx="9" cy="6" r="1.6" /><circle cx="15" cy="6" r="1.6" /><circle cx="9" cy="12" r="1.6" /><circle cx="15" cy="12" r="1.6" /><circle cx="9" cy="18" r="1.6" /><circle cx="15" cy="18" r="1.6" /></svg>
                                </span>
                              )}
                              <p className="bc-retro-szoveg">{c.szoveg}</p>
                            </div>
                            <div className="bc-retro-cetli-lab">
                              <span className="bc-retro-szerzo">{c.anonim ? L.nevNelkul : (c.szerzo ?? L.ismeretlen)}{c.sajat ? ` · ${L.tied}` : ''}</span>
                              {k && !nagy && (
                                <span className="bc-retro-muveletek">
                                  {onMozgat && (
                                    <>
                                      <label className="bc-sr" htmlFor={`${id}-m-${c.id}`}>{L.athelyezes(c.szoveg)}</label>
                                      <select id={`${id}-m-${c.id}`} className="bc-select bc-retro-mozgat" value={c.zona} onChange={(e) => mozgat(c.id, e.target.value)}>
                                        {zonak.map((zz) => <option key={zz.kulcs} value={zz.kulcs}>{zz.cim}</option>)}
                                      </select>
                                    </>
                                  )}
                                  {onSzerkeszt && (
                                    <TooltipIconButton label={L.szerkesztes(c.szoveg)} onClick={() => setSzerk({ id: c.id, szoveg: c.szoveg })}><IcEdit /></TooltipIconButton>
                                  )}
                                  {onTorol && (
                                    <TooltipIconButton label={L.torles(c.szoveg)} danger onClick={() => onTorol(c.id)}><IcTrash /></TooltipIconButton>
                                  )}
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="bc-retro-ures">{L.ures}</p>
              )}

              {irhato && !nagy && (nyitott === z.kulcs ? (
                <form className="bc-retro-urlap" onSubmit={(e) => kuld(e, z.kulcs)}
                  onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); setNyitott(null); } }}>
                  <TextArea label={L.ujCetliMezo(z.cim)} help={L.ujSugo} rows={3} maxLength={maxHossz} autoFocus value={uj} error={hiba}
                    onChange={(e) => { setUj(e.target.value); if (hiba && e.target.value.trim()) setHiba(undefined); }} />
                  <label className="bc-check bc-retro-anonim">
                    <CheckboxInput checked={anonim} onChange={(e) => setAnonim(e.target.checked)} />
                    {L.anonim}
                  </label>
                  <div className="bc-retro-gombok">
                    <Button type="submit" icon={<IcNew />} busy={busy}>{L.felteszem}</Button>
                    <Button variant="ghost" icon={<IcX />} onClick={() => setNyitott(null)}>{L.megse}</Button>
                  </div>
                </form>
              ) : (
                <Button variant="secondary" className="bc-retro-uj" icon={<IcNew />} onClick={() => nyit(z.kulcs)}
                  aria-label={`${L.ujCetli}: ${z.cim}`}>{L.ujCetli}</Button>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
