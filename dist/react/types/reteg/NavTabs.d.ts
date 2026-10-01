import { type ReactNode } from 'react';
/** Router-független link: a projekt a saját <Link>-jét adja (React Router, Next), alapból <a>. */
export type LinkRenderProps = {
    href: string;
    className?: string;
    'aria-current'?: 'page';
    onClick?: () => void;
    children: ReactNode;
};
export type RenderLink = (props: LinkRenderProps) => ReactNode;
export declare const defaultLink: RenderLink;
export type NavTabItem = {
    href: string;
    label: string;
    count?: number;
    current?: boolean;
};
export type NavTabsProps = {
    items: NavTabItem[];
    /** A navigáció neve, pl. „Naptár nézetei” */
    label: string;
    renderLink?: RenderLink;
};
/**
 * NavTabs (molekula, Javaslat 03 – 6A): ugyanaz a kinézet, mint a Tabs, de linkek – útvonalat váltanak.
 * A mostani oldal aria-current="page" (nem role="tab": a képernyőolvasó linkként olvassa, Tab-bal léptethető).
 */
export declare function NavTabs({ items, label, renderLink }: NavTabsProps): import("react").JSX.Element;
