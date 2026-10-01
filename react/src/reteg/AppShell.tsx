import * as Dialog from '@radix-ui/react-dialog';
import { Fragment, useState, type ReactNode } from 'react';
import { IconButton } from '../inputs/Button';
import { cx } from '../cx';
import { useMedia } from './layer';
import { useReturnFocus } from './focus';
import { defaultLink, type RenderLink } from './NavTabs';
import { CloseIcon } from './Modal';

export type NavItem = { href: string; label: string; icon?: ReactNode; current?: boolean };
export type NavGroup = { label?: string; items: NavItem[] };

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

const NARROW = '(max-width: 900px)';

/**
 * AppShell (sablon, Javaslat 03 – 9A): oldalsáv + vékony fejléc + tartalom, a bc-shell CSS-re építve.
 * 900 px alatt az oldalsáv behúzható fiók (☰): Radix Dialog – fókuszcsapda, Esc, háttér; linkre koppintva bezár,
 * a fókusz visszaáll a ☰-re. Az első Tab-ra „Ugrás a tartalomra” ugrólink jelenik meg.
 * Az oldal címe NEM a fejlécben van, hanem a tartalom tetején (PageHeader).
 */
export function AppShell({ brand, nav, topbar, renderLink = defaultLink, skipLabel = 'Ugrás a tartalomra', navLabel = 'Fő navigáció', children }: AppShellProps) {
  const narrow = useMedia(NARROW);
  const [open, setOpen] = useState(false);
  const focus = useReturnFocus();

  const links = (onPick?: () => void) => (
    <>
      {brand}
      {nav.map((g, gi) => (
        <Fragment key={gi}>
          {g.label && <p className="bc-nav-group" id={`bc-nav-g${gi}`}>{g.label}</p>}
          <ul className="bc-nav-list" aria-labelledby={g.label ? `bc-nav-g${gi}` : undefined}>
            {g.items.map((it) => (
              <li key={it.href}>
                {renderLink({ href: it.href, className: 'bc-nav-link', 'aria-current': it.current ? 'page' : undefined, onClick: onPick,
                  children: <>{it.icon && <span className="bc-nav-icon" aria-hidden="true">{it.icon}</span>}<span className="bc-nav-text">{it.label}</span></> })}
              </li>
            ))}
          </ul>
        </Fragment>
      ))}
    </>
  );

  return (
    <div className="bc-shell">
      <a className="bc-skip" href="#bc-content">{skipLabel}</a>
      {!narrow && <nav className="bc-sidebar" aria-label={navLabel}>{links()}</nav>}
      {narrow && (
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="bc-scrim is-nav" />
            <Dialog.Content className="bc-sidebar is-open" aria-describedby={undefined}
              onOpenAutoFocus={focus.remember} onCloseAutoFocus={focus.restore}>
              <div className="bc-nav-head">
                <Dialog.Title className="bc-sr">Menü</Dialog.Title>
                <IconButton aria-label="Menü bezárása" onClick={() => setOpen(false)}><CloseIcon /></IconButton>
              </div>
              <nav aria-label={navLabel}>{links(() => setOpen(false))}</nav>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
      <div className="bc-main">
        <header className={cx('bc-topbar', 'bc-topbar-thin')}>
          {narrow && (
            <IconButton aria-label="Menü megnyitása" aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            </IconButton>
          )}
          <div className="bc-topbar-end">{topbar}</div>
        </header>
        <main className="bc-content" id="bc-content" tabIndex={-1}>{children}</main>
      </div>
    </div>
  );
}
