import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../cx';
import { Button } from '../inputs/Button';
import { BeeMoment } from '../meh/BeeMoment';
import { say } from '../meh/say';

/** Van-e hálózat (navigator.onLine + online/offline események). Szerveren (SSR) igaznak veszi. */
export function useOnline() {
  const [on, setOn] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));
  useEffect(() => {
    const up = () => setOn(true), down = () => setOn(false);
    window.addEventListener('online', up); window.addEventListener('offline', down);
    setOn(navigator.onLine);
    return () => { window.removeEventListener('online', up); window.removeEventListener('offline', down); };
  }, []);
  return on;
}

export type OfflineBannerProps = {
  /** Kívülről megadott állapot (pl. a saját API-hívások hibája alapján); alapból a böngésző jelzése */
  online?: boolean;
  /** Hány módosítás vár mentésre (a hívó számolja) – ha van, kiírjuk */
  pending?: number;
  /** Mi történik a mentéssel – alapból a szövegkészlet mondata („Amint visszajön a kapcsolat, mentjük.”) */
  saveText?: ReactNode;
  /** „Újrapróbálás” gomb (pl. a sor azonnali újraküldése) */
  onRetry?: () => void;
  /** Ha az oldalon már van méhecske, kapcsold ki (képernyőnként legfeljebb egy) */
  bee?: boolean;
  /** Visszatéréskor ennyi ideig látszik a „Újra van kapcsolat” sáv (ms) */
  backMs?: number;
  className?: string;
};

/**
 * OfflineBanner (molekula, Javaslat 06a/6): az oldal tetejére tapadó sáv, ha nincs hálózat –
 * „Nincs térerő a kaptárban.” (05 offline pillanat) + mi lesz a mentéssel. Visszatéréskor rövid „Újra van kapcsolat”, aztán eltűnik.
 */
export function OfflineBanner({ online, pending = 0, saveText, onRetry, bee = true, backMs = 2500, className }: OfflineBannerProps) {
  const browser = useOnline();
  const on = online ?? browser;
  const [back, setBack] = useState(false);
  const was = useRef(on);
  useEffect(() => {
    if (on && !was.current) {
      setBack(true);
      const t = window.setTimeout(() => setBack(false), backMs);
      was.current = on;
      return () => window.clearTimeout(t);
    }
    if (!on) setBack(false);
    was.current = on;
  }, [on, backMs]);

  const sima = saveText ?? say('offline').sima;
  const waiting = pending > 0 ? `${pending} módosítás vár mentésre.` : null;
  return (
    <div className={cx('bc-offline', className)} role="status" data-state={on ? (back ? 'back' : 'online') : 'offline'}>
      {!on && (
        <div className="bc-alert is-warning bc-offline-bar">
          {bee
            ? <BeeMoment pillanat="offline" inline sima={<>{sima} {waiting}</>} />
            : <p><strong>Nincs internetkapcsolat.</strong> {sima} {waiting}</p>}
          {onRetry && <Button variant="secondary" size="sm" onClick={onRetry}>Újrapróbálás</Button>}
        </div>
      )}
      {on && back && (
        <div className="bc-alert is-success bc-offline-bar bc-anim-rise">
          <p><strong>Újra van kapcsolat.</strong> {pending > 0 ? 'Mentjük a várakozó módosításokat.' : 'Minden a helyén.'}</p>
        </div>
      )}
    </div>
  );
}
