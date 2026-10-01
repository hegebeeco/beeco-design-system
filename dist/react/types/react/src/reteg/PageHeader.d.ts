import { type ReactNode } from 'react';
import { type Crumb } from './Breadcrumbs';
import type { RenderLink } from './NavTabs';
export type PageHeaderProps = {
    /** Az oldal címe (részletoldalon az elem neve: „Méhes Kávézó”) */
    title: ReactNode;
    /** Egy mondat az oldalról (nem kötelező) */
    description?: ReactNode;
    /** Morzsamenü – a mostani oldal az utolsó */
    breadcrumbs?: Crumb[];
    /** Az oldal fő műveletei (legfeljebb 2 gomb; a harmadiktól „⋯” menü – DropdownMenu) */
    actions?: ReactNode;
    /** Az elem még töltődik: a cím helyén csontváz */
    loading?: boolean;
    renderLink?: RenderLink;
    /** A morzsamenü neve (alap: „Hol vagy”) */
    breadcrumbsLabel?: string;
};
/**
 * PageHeader (organizmus, Javaslat 03 – 7A): cím, hely és fő művelet egy blokkban, a tartalom tetején (a fejléc vékony marad).
 * A böngészőfül címéhez: usePageTitle(title).
 */
export declare function PageHeader({ title, description, breadcrumbs, actions, loading, renderLink, breadcrumbsLabel }: PageHeaderProps): import("react").JSX.Element;
/**
 * A böngészőfül címe: „Méhes Kávézó – beeco admin”. Cím nélkül (töltés közben) csak az utótag.
 * Leváláskor visszaállítja az előzőt.
 */
export declare function usePageTitle(title: string | null | undefined, suffix?: string): void;
