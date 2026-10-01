import { useEffect, type ReactNode } from 'react';
import { Breadcrumbs, type Crumb } from './Breadcrumbs';
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
export function PageHeader({ title, description, breadcrumbs, actions, loading, renderLink, breadcrumbsLabel }: PageHeaderProps) {
  return (
    <header className="bc-page-header bc-page-head">
      <div className="bc-page-head-text">
        {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} renderLink={renderLink} label={breadcrumbsLabel} />}
        {loading
          ? <h1 aria-busy="true"><span className="bc-skeleton bc-title-skeleton" /><span className="bc-sr">Töltöm…</span></h1>
          : <h1>{title}</h1>}
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="bc-row">{actions}</div>}
    </header>
  );
}

/**
 * A böngészőfül címe: „Méhes Kávézó – beeco admin”. Cím nélkül (töltés közben) csak az utótag.
 * Leváláskor visszaállítja az előzőt.
 */
export function usePageTitle(title: string | null | undefined, suffix = 'beeco admin') {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} – ${suffix}` : suffix;
    return () => { document.title = prev; };
  }, [title, suffix]);
}
