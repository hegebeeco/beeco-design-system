import { forwardRef } from 'react';
import { cx } from '../cx';
import { Bee } from '../meh/Bee';
import { HexLoader } from '../meh/motion';
import { REVEAL_STEPS, type DrawParticipant } from './draw';

/**
 * A pörgetés színpada (06b/14): a méhsejt-sor celláit sorban megtölti a méz, közben a szalagon lassulva váltják egymást a nevek.
 * A nevek itt csak látvány – a nyertest a sorsoló adja. Képernyőolvasó csak a végeredményt hallja (a szalag aria-hidden).
 */
export function DrawSpinner({ step, name, waiting }: { step: number; name: string; waiting: boolean }) {
  return (
    <div className="bc-draw-stage" aria-hidden="true">
      <Bee szerep="futar" size="s" buzz={false} className="bc-draw-runner" />
      <div className="bc-draw-comb">{REVEAL_STEPS.map((_, i) => <i key={i} className={cx(i <= step && 'is-on')} />)}</div>
      <p className="bc-draw-ticker" key={step}>{waiting ? <HexLoader label="Még sorsolunk" /> : name}</p>
    </div>
  );
}

export type WinnerCardProps = { winner: DrawParticipant; prize: string; test: boolean; attempt: number; animate: boolean };

/** A nyertes kártyája: Bajnok méh + pecsét-megjelenés (egyszer) + a nyeremény. Szóvicc csak a méhes címben, sima jelentéssel. */
export const WinnerCard = forwardRef<HTMLHeadingElement, WinnerCardProps>(function WinnerCard({ winner, prize, test, attempt, animate }, ref) {
  return (
    <div className={cx('bc-draw-winner', animate && 'bc-anim-stamp')} data-winner={winner.id}>
      <Bee szerep="bajnok" size="m" buzz={animate} />
      <div className="bc-draw-winner-body">
        <p className="bc-draw-kicker">{attempt > 1 ? `Új nyertes – ${attempt}. húzás` : <>Zümm, megvan! <span>Kisorsoltuk a nyertest.</span></>}</p>
        <h3 className="bc-draw-name" ref={ref} tabIndex={-1}>{winner.name}</h3>
        {winner.detail && <p className="bc-draw-detail">{winner.detail}</p>}
        <p className="bc-draw-prize">Nyeremény: {prize}</p>
        {test && <p className="bc-badge is-warning bc-draw-test">Teszt-sorsolás – nem éles eredmény</p>}
      </div>
    </div>
  );
});
