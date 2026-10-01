import { useId, type ReactNode } from 'react';
import { cx } from '../cx';
import { usePageTitle } from '../reteg/PageHeader';
import type { Crumb } from '../reteg/Breadcrumbs';
import type { RenderLink } from '../reteg/NavTabs';

/** Minden oldalsablon közös fej-props-a (a PageHeader-be kerülnek). */
export type TemplateHeadProps = {
  /** Az oldal címe – az oldal egyetlen h1-e */
  title: ReactNode;
  /** Egy mondat az oldalról */
  description?: ReactNode;
  /** Morzsamenü – a mostani oldal az utolsó */
  breadcrumbs?: Crumb[];
  /** Router-független link (React Router / Next <Link>) – alapból <a> */
  renderLink?: RenderLink;
  /** A böngészőfül címe (alap: a title, ha szöveg); utótag: docTitleSuffix (alap „beeco admin”) */
  docTitle?: string;
  docTitleSuffix?: string;
  /**
   * Önálló oldal (nincs AppShell): a sablon maga ad <main>-t és „Ugrás a tartalomra” ugrólinket.
   * AppShell-en belül hagyd ki – ott a <main> és az ugrólink már megvan (egy oldalon egy <main>).
   */
  standalone?: boolean;
  skipLabel?: string;
  className?: string;
};

type FrameProps = Pick<TemplateHeadProps, 'standalone' | 'skipLabel' | 'className'> & {
  kind: 'lista' | 'reszletek' | 'szerkeszto' | 'iranyitopult';
  busy?: boolean;
  children: ReactNode;
};

/** A sablonok közös burka: konténer-lekérdezéses rács (a szélességét méri, nem a képernyőét – oldalsávval is jól tördel). */
export function SablonFrame({ kind, standalone, skipLabel = 'Ugrás a tartalomra', className, busy, children }: FrameProps) {
  const id = `bc-sablon-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;
  const body = <div className={cx('bc-sablon', `is-${kind}`, className)} data-sablon={kind} aria-busy={busy || undefined}>{children}</div>;
  if (!standalone) return body;
  return (
    <>
      <a className="bc-skip" href={`#${id}`}>{skipLabel}</a>
      <main id={id} className="bc-sablon-main" tabIndex={-1}>{body}</main>
    </>
  );
}

/** A böngészőfül címe a sablon címéből; töltés közben csak az utótag. */
export function useTemplateTitle(title: ReactNode, docTitle?: string, suffix?: string, loading?: boolean) {
  const text = docTitle ?? (typeof title === 'string' ? title : null);
  usePageTitle(loading ? null : text, suffix);
}
