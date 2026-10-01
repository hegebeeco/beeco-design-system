import { cx } from '../cx';
import type { Szerep } from './say';

export type BeeProps = {
  /** Melyik szereplő (tokens/hangnem.json → szerepek). A mérges méh nem létezik a termékbőrben. */
  szerep: Szerep;
  size?: 's' | 'm' | 'l';
  /** Megjelenéskor egyszer zümmög (3 × 180 ms) */
  buzz?: boolean;
  /** Ha a méh mond valamit, amit a szöveg NEM mond el, adj neki nevet; alapból díszítő (a mondat beszél) */
  label?: string;
  className?: string;
};

/** Bee (atom, Javaslat 05): a meglévő márka-méhecskék szerep szerint. Díszítő, ha nincs label. */
export function Bee({ szerep, size = 'm', buzz = true, label, className }: BeeProps) {
  return (
    <span data-szerep={szerep} className={cx('bc-bee', size !== 'm' && `is-${size}`, buzz && 'is-buzz', className)}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })} />
  );
}
