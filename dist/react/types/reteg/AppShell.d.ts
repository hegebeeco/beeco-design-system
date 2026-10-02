import { type ReactNode } from 'react';
import { type RenderLink } from './NavTabs';
import { type Evszak } from '../marka/evszak';
export type NavItem = {
    href: string;
    label: string;
    icon?: ReactNode;
    current?: boolean;
};
export type NavGroup = {
    label?: string;
    items: NavItem[];
};
/** A váz saját feliratai (képernyőolvasó és súgó-buborék). Alapból magyarul; kétnyelvű appban i18n-ből add meg. */
export type AppShellLabels = {
    openMenu: string;
    closeMenu: string;
    menuTitle: string;
    expand: string;
    collapse: string;
};
export declare const APP_SHELL_LABELS_HU: AppShellLabels;
export type AppShellProps = {
    /** Márka a sáv tetején: <a className="bc-brand" href="/">logó + <span className="bc-brand-text">admin</span></a> */
    brand: ReactNode;
    /** Kis márka (pl. csak a méhecske) a becsukott sávba és a keskeny fejlécbe; ha nincs, a brand jelenik meg kicsiben */
    brandCompact?: ReactNode;
    nav: NavGroup[];
    /** A fejléc jobb oldala. Ha nincs, asztalon NINCS fejléc – a tartalom az oldal tetejéig ér (Javaslat 08) */
    topbar?: ReactNode;
    /** A sáv alja: a felhasználó (ShellAccount) – a fiókban (☰) is ott van */
    account?: ReactNode;
    /** Asztalon becsukható a sáv (csak ikonok); az állapotot az eszköz megjegyzi (Javaslat 08) */
    collapsible?: boolean;
    /** A megjegyzés kulcsa (több app ugyanazon a gépen) */
    collapseKey?: string;
    /** Router-független link (React Router <Link>, Next <Link>); alapból <a> */
    renderLink?: RenderLink;
    /** Az ugrólink szövege */
    skipLabel?: string;
    navLabel?: string;
    /** A váz gombjainak feliratai (pl. angolul) – ami hiányzik, az magyar marad */
    labels?: Partial<AppShellLabels>;
    /** Díszítő háttér a tartalomrész mögött (Javaslat 10): 'honeycomb' = méhsejt-minta a méz színéből */
    pattern?: 'honeycomb';
    /** Évszakos díszítés a mintán (Javaslat 11): 'auto' = a mai dátum szerint, vagy egy adott évszak; alapból nincs */
    season?: 'auto' | Evszak;
    children: ReactNode;
};
/**
 * AppShell (sablon, Javaslat 03 – 9A + 08): oldalsáv + tartalom, a bc-shell CSS-re építve.
 * Asztalon a sáv becsukható (csak ikonok; a felirat a képernyőolvasónak és rámutatáskor megmarad), alján a felhasználó.
 * 900 px alatt a sáv behúzható fiók (☰): Radix Dialog – fókuszcsapda, Esc, háttér; linkre koppintva bezár, a fókusz visszaáll a ☰-re.
 * Az első Tab-ra „Ugrás a tartalomra” ugrólink jelenik meg. Az oldal címe a tartalom tetején van (PageHeader).
 */
export declare function AppShell({ brand, brandCompact, nav, topbar, account, collapsible, collapseKey, renderLink, skipLabel, navLabel, labels, pattern, season, children }: AppShellProps): import("react").JSX.Element;
