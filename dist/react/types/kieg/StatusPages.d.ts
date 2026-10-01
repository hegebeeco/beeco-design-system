import { type ReactNode } from 'react';
export type StatusKind = 'szerverhiba' | 'nem-talalhato' | 'nincs-jogosultsag' | 'munkamenet-lejart' | 'offline';
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
export declare function StatusPage({ kind, action, secondary, sima, extra, className }: StatusPageProps): import("react").JSX.Element;
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
export declare function ErrorPage({ onRetry, retrying, homeHref, errorId, action, className }: ErrorPageProps): import("react").JSX.Element;
export type NotFoundPageProps = {
    homeHref?: string;
    action?: ReactNode;
    className?: string;
};
/** NotFoundPage (404): a kacsintó méh; kezdőlap + vissza az előző oldalra. */
export declare function NotFoundPage({ homeHref, action, className }: NotFoundPageProps): import("react").JSX.Element;
export type ForbiddenPageProps = {
    homeHref?: string;
    onRequestAccess?: () => void;
    requested?: boolean;
    action?: ReactNode;
    className?: string;
};
/** ForbiddenPage (403): a gondolkodó méh (nem szid); kezdőlap + opcionális „Hozzáférés kérése”. */
export declare function ForbiddenPage({ homeHref, onRequestAccess, requested, action, className }: ForbiddenPageProps): import("react").JSX.Element;
export type SessionExpiredProps = {
    onLogin?: () => void;
    loginHref?: string;
    action?: ReactNode;
    className?: string;
};
/** SessionExpired: a pihenő méh; „Belépés újra” – a hívó gondoskodik róla, hogy ugyanoda térjen vissza. */
export declare function SessionExpired({ onLogin, loginHref, action, className }: SessionExpiredProps): import("react").JSX.Element;
export type OfflinePageProps = {
    onRetry?: () => void;
    retrying?: boolean;
    className?: string;
};
/** OfflinePage: egész oldalas „nincs hálózat” (amikor semmi nem tölthető be); a gondolkodó méh. */
export declare function OfflinePage({ onRetry, retrying, className }: OfflinePageProps): import("react").JSX.Element;
