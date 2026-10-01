import { useId, type ReactNode } from 'react';
import { cx } from '../cx';
import { Button } from '../inputs/Button';
import { BeeMoment } from '../meh/BeeMoment';
import { CopyButton } from './CopyButton';

export type StatusKind = 'szerverhiba' | 'nem-talalhato' | 'nincs-jogosultsag' | 'munkamenet-lejart' | 'offline';

// A sima cím (h1) – a szóvicc csak a méh mellett, a cím mindig egyenesen mondja, mi történt
const HEAD: Record<StatusKind, string> = {
  'szerverhiba': 'Hiba történt nálunk',
  'nem-talalhato': '404 · Nincs ilyen oldal',
  'nincs-jogosultsag': '403 · Nincs jogosultságod',
  'munkamenet-lejart': 'Lejárt a munkamenet',
  'offline': 'Nincs internetkapcsolat',
};

export type StatusPageProps = {
  kind: StatusKind;
  /** A fő teendő (gomb vagy a router linkje) – minden oldalnak van egy */
  action?: ReactNode;
  /** Másodlagos teendő */
  secondary?: ReactNode;
  /** Saját sima mondat a szövegkészlet helyett (pl. konkrétabb ok) */
  sima?: ReactNode;
  /** Kiegészítés a teendők alatt (pl. hibakód) */
  extra?: ReactNode;
  className?: string;
};

/** StatusPage (sablon, Javaslat 06a/7): közös váz – sima h1 · BeeMoment (05 pillanat) · teendők. */
export function StatusPage({ kind, action, secondary, sima, extra, className }: StatusPageProps) {
  const id = useId();
  return (
    <section className={cx('bc-status-page', className)} aria-labelledby={id} data-kind={kind}>
      <h1 id={id} className="bc-status-h">{HEAD[kind]}</h1>
      <BeeMoment pillanat={kind} valtozat={0} sima={sima} live={kind === 'szerverhiba' ? 'alert' : undefined}
        action={(action || secondary) && <div className="bc-row bc-status-actions">{action}{secondary}</div>} />
      {extra && <div className="bc-status-extra">{extra}</div>}
    </section>
  );
}

const Home = ({ href, label = 'Vissza a kezdőlapra', primary }: { href: string; label?: string; primary?: boolean }) =>
  <a className={cx('bc-btn', !primary && 'is-secondary')} href={href}>{label}</a>;

export type ErrorPageProps = {
  /** „Újrapróbálás” – ha nincs, nem jelenik meg */
  onRetry?: () => void;
  retrying?: boolean;
  homeHref?: string;
  /** A naplóbeli hibakód: megjelenik másolható formában („add meg, ha írsz nekünk”) */
  errorId?: string;
  action?: ReactNode;
  className?: string;
};

/** ErrorPage: szerverhiba – a szomorú méh CSAK itt (a mi hibánk), újrapróbálás + másolható hibakód. */
export function ErrorPage({ onRetry, retrying, homeHref = '/', errorId, action, className }: ErrorPageProps) {
  return (
    <StatusPage kind="szerverhiba" className={className}
      action={action ?? (onRetry ? <Button busy={retrying} onClick={onRetry}>Újrapróbálás</Button> : <Home href={homeHref} primary />)}
      secondary={onRetry && !action ? <Home href={homeHref} /> : undefined}
      extra={errorId && (
        <p className="bc-status-code">Hibakód: <CopyButton value={errorId} what="hibakód" showValue /> – add meg, ha írsz nekünk.</p>
      )} />
  );
}

export type NotFoundPageProps = { homeHref?: string; action?: ReactNode; className?: string };

/** NotFoundPage (404): a kacsintó méh; kezdőlap + vissza az előző oldalra. */
export function NotFoundPage({ homeHref = '/', action, className }: NotFoundPageProps) {
  return (
    <StatusPage kind="nem-talalhato" className={className} action={action ?? <Home href={homeHref} primary label="Irány a kezdőlap" />}
      secondary={<Button variant="secondary" onClick={() => history.back()}>Vissza az előző oldalra</Button>} />
  );
}

export type ForbiddenPageProps = { homeHref?: string; onRequestAccess?: () => void; requested?: boolean; action?: ReactNode; className?: string };

/** ForbiddenPage (403): a gondolkodó méh (nem szid); kezdőlap + opcionális „Hozzáférés kérése”. */
export function ForbiddenPage({ homeHref = '/', onRequestAccess, requested, action, className }: ForbiddenPageProps) {
  return (
    <StatusPage kind="nincs-jogosultsag" className={className} action={action ?? <Home href={homeHref} primary={!onRequestAccess} />}
      secondary={onRequestAccess && <Button disabled={requested} onClick={onRequestAccess}>{requested ? 'Kérés elküldve' : 'Hozzáférés kérése'}</Button>} />
  );
}

export type SessionExpiredProps = { onLogin?: () => void; loginHref?: string; action?: ReactNode; className?: string };

/** SessionExpired: a pihenő méh; „Belépés újra” – a hívó gondoskodik róla, hogy ugyanoda térjen vissza. */
export function SessionExpired({ onLogin, loginHref = '/login', action, className }: SessionExpiredProps) {
  return (
    <StatusPage kind="munkamenet-lejart" className={className}
      action={action ?? (onLogin ? <Button onClick={onLogin}>Belépés újra</Button> : <a className="bc-btn" href={loginHref}>Belépés újra</a>)} />
  );
}

export type OfflinePageProps = { onRetry?: () => void; retrying?: boolean; className?: string };

/** OfflinePage: egész oldalas „nincs hálózat” (amikor semmi nem tölthető be); a gondolkodó méh. */
export function OfflinePage({ onRetry, retrying, className }: OfflinePageProps) {
  return <StatusPage kind="offline" className={className} action={onRetry && <Button busy={retrying} onClick={onRetry}>Újrapróbálás</Button>} />;
}
