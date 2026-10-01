import type { ReactNode } from 'react';
import { cx } from '../cx';
import { Bee } from './Bee';
import { say, type Pillanat, type Szerep } from './say';

export type BeeMomentProps = {
  /** A pillanat a szövegkészletből (a szöveg és a méh innen jön) … */
  pillanat?: Pillanat;
  /** … vagy saját szöveg (ilyenkor a méh szerepét is meg kell adni) */
  poen?: string;
  sima?: ReactNode;
  szerep?: Szerep;
  /** Egy teendő (gomb vagy link) */
  action?: ReactNode;
  /** Sorban (kártyában, sávban) vagy középre (üres állapot, egész oldal) */
  inline?: boolean;
  /** Fix változat a teszteléshez */
  valtozat?: number;
  /** status = siker/töltés (udvarias bejelentés), alert = hiba */
  live?: 'status' | 'alert';
  className?: string;
};

/**
 * BeeMoment (molekula, Javaslat 05): méh + szóvicc-cím + sima mondat + egy teendő.
 * Az üres, siker, töltés, hiba, 404, munkamenet és offline állapotok közös kerete. Képernyőnként legfeljebb egy.
 */
export function BeeMoment({ pillanat, poen, sima, szerep, action, inline, valtozat, live, className }: BeeMomentProps) {
  const m = pillanat ? say(pillanat, valtozat) : null;
  const title = poen ?? m?.poen;
  const text = sima ?? m?.sima;
  const who = szerep ?? m?.meh ?? 'piheno';
  return (
    <div className={cx('bc-moment', inline && 'is-inline', className)} role={live} data-pillanat={pillanat}>
      <Bee szerep={who} size={inline ? 's' : 'm'} />
      {title && <p className="bc-moment-title">{title}</p>}
      {text && <p className="bc-moment-text">{text}</p>}
      {action && <div className="bc-moment-action">{action}</div>}
    </div>
  );
}
