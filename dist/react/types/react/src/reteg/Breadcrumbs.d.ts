import { type RenderLink } from './NavTabs';
/** Egy szint. href nélkül nem link (pl. nincs jogosultság a szülőhöz). Az utolsó a mostani oldal. */
export type Crumb = {
    label: string;
    href?: string;
};
export type BreadcrumbsProps = {
    items: Crumb[];
    renderLink?: RenderLink;
    /** Ennyi szint fölött a középsők „…” mögé kerülnek (alap: 4) */
    maxVisible?: number;
    label?: string;
};
/**
 * Breadcrumbs / morzsamenü (molekula, Javaslat 03 – 7A): a cím fölött, nav + rendezett lista, a mostani oldal aria-current="page".
 * 4+ szintnél a középsők egy „…” gomb mögé kerülnek; telefonon csak a szülő marad: „‹ Sablonok”.
 * Hosszú név: egy sorban levágva, a teljes név title-ben.
 */
export declare function Breadcrumbs({ items, renderLink, maxVisible, label }: BreadcrumbsProps): import("react").JSX.Element;
