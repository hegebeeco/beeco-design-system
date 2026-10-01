import { type ReactNode } from 'react';
/** Van-e hálózat (navigator.onLine + online/offline események). Szerveren (SSR) igaznak veszi. */
export declare function useOnline(): boolean;
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
export declare function OfflineBanner({ online, pending, saveText, onRetry, bee, backMs, className }: OfflineBannerProps): import("react").JSX.Element;
