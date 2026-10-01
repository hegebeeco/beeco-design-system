import { type ReactNode } from 'react';
import { type RenderLink } from './NavTabs';
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
export type AppShellProps = {
    /** Márka a sáv tetején: <a className="bc-brand" href="/">logó + „beeco admin”</a> */
    brand: ReactNode;
    nav: NavGroup[];
    /** A fejléc jobb oldala (pl. profil-menü) */
    topbar?: ReactNode;
    /** Router-független link (React Router <Link>, Next <Link>); alapból <a> */
    renderLink?: RenderLink;
    /** Az ugrólink szövege */
    skipLabel?: string;
    navLabel?: string;
    children: ReactNode;
};
/**
 * AppShell (sablon, Javaslat 03 – 9A): oldalsáv + vékony fejléc + tartalom, a bc-shell CSS-re építve.
 * 900 px alatt az oldalsáv behúzható fiók (☰): Radix Dialog – fókuszcsapda, Esc, háttér; linkre koppintva bezár,
 * a fókusz visszaáll a ☰-re. Az első Tab-ra „Ugrás a tartalomra” ugrólink jelenik meg.
 * Az oldal címe NEM a fejlécben van, hanem a tartalom tetején (PageHeader).
 */
export declare function AppShell({ brand, nav, topbar, renderLink, skipLabel, navLabel, children }: AppShellProps): import("react").JSX.Element;
