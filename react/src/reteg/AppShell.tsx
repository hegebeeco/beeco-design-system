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

/** A váz saját feliratai (képernyőolvasó és súgó-buborék). Alapból magyarul; kétnyelvű appban i18n-ből add meg. */
export type AppShellLabels = { openMenu: string; closeMenu: string; menuTitle: string; expand: string; collapse: string };
export const APP_SHELL_LABELS_HU: AppShellLabels = {
  openMenu: 'Menü megnyitása', closeMenu: 'Menü bezárása', menuTitle: 'Menü', expand: 'Menü kinyitása', collapse: 'Menü becsukása',
};

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
  children: ReactNode;
};

const NARROW = '(max-width: 900px)';
const KEY = (k: string) => `bc-shell:${k}`;
const readCollapsed = (k: string) => { try { return localStorage.getItem(KEY(k)) === '1'; } catch { return false; } };

const Chevron = ({ left }: { left: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={left ? 'M14 6l-6 6 6 6' : 'M10 6l6 6-6 6'} /><path d={left ? 'M20 4v16' : 'M4 4v16'} />
  </svg>
);

/**
 * AppShell (sablon, Javaslat 03 – 9A + 08): oldalsáv + tartalom, a bc-shell CSS-re építve.
 * Asztalon a sáv becsukható (csak ikonok; a felirat a képernyőolvasónak és rámutatáskor megmarad), alján a felhasználó.
 * 900 px alatt a sáv behúzható fiók (☰): Radix Dialog – fókuszcsapda, Esc, háttér; linkre koppintva bezár, a fókusz visszaáll a ☰-re.
 * Az első Tab-ra „Ugrás a tartalomra” ugrólink jelenik meg. Az oldal címe a tartalom tetején van (PageHeader).
 */
export function AppShell({ brand, brandCompact, nav, topbar, account, collapsible = false, collapseKey = 'nav', renderLink = defaultLink,
  skipLabel = 'Ugrás a tartalomra', navLabel = 'Fő navigáció', labels, pattern, children }: AppShellProps) {
  const l = { ...APP_SHELL_LABELS_HU, ...labels };
  const narrow = useMedia(NARROW);
  const [open, setOpen] = useState(false);
  const [collapsedPref, setCollapsedPref] = useState(() => collapsible && readCollapsed(collapseKey));
  const collapsed = collapsible && !narrow && collapsedPref;
  const focus = useReturnFocus();

  const toggle = () => {
    const v = !collapsedPref;
    setCollapsedPref(v);
    try { localStorage.setItem(KEY(collapseKey), v ? '1' : '0'); } catch { /* privát mód: nem jegyezzük meg */ }
  };

  const links = (onPick?: () => void) =>
    nav.map((g, gi) => (
      <Fragment key={gi}>
        {g.label && <p className="bc-nav-group" id={`bc-nav-g${gi}`}>{g.label}</p>}
        <ul className="bc-nav-list" aria-labelledby={g.label ? `bc-nav-g${gi}` : undefined}>
          {g.items.map((it) => (
            <li key={it.href} title={collapsed ? it.label : undefined}>
              {renderLink({ href: it.href, className: 'bc-nav-link', 'aria-current': it.current ? 'page' : undefined, onClick: onPick,
                children: <>{it.icon && <span className="bc-nav-icon" aria-hidden="true">{it.icon}</span>}<span className="bc-nav-text">{it.label}</span></> })}
            </li>
          ))}
        </ul>
      </Fragment>
    ));

  const hasHeader = narrow || Boolean(topbar);
  return (
    <div className={cx('bc-shell', collapsed && 'is-collapsed', !hasHeader && 'no-topbar')}>
      <a className="bc-skip" href="#bc-content">{skipLabel}</a>
      {!narrow && (
        <nav className="bc-sidebar" aria-label={navLabel}>
          <div className="bc-sidebar-head">
            {collapsed && brandCompact ? brandCompact : brand}
            {collapsible && (
              <IconButton className="bc-sidebar-toggle" aria-label={collapsed ? l.expand : l.collapse} aria-expanded={!collapsed} onClick={toggle}>
                <Chevron left={!collapsed} />
              </IconButton>
            )}
          </div>
          <div className="bc-sidebar-links">{links()}</div>
          {account && <div className="bc-sidebar-foot">{account}</div>}
        </nav>
      )}
      {narrow && (
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="bc-scrim is-nav" />
            <Dialog.Content className="bc-sidebar is-open" aria-describedby={undefined}
              onOpenAutoFocus={focus.remember} onCloseAutoFocus={focus.restore}>
              <div className="bc-nav-head">
                <Dialog.Title className="bc-sr">{l.menuTitle}</Dialog.Title>
                <IconButton aria-label={l.closeMenu} onClick={() => setOpen(false)}><CloseIcon /></IconButton>
              </div>
              <nav aria-label={navLabel} className="bc-sidebar-links">{brand}{links(() => setOpen(false))}</nav>
              {account && <div className="bc-sidebar-foot">{account}</div>}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
      <div className={cx('bc-main', pattern === 'honeycomb' && 'bc-honeycomb')}>
        {hasHeader && (
          <header className={cx('bc-topbar', 'bc-topbar-thin')}>
            {narrow && (
              <IconButton aria-label={l.openMenu} aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
              </IconButton>
            )}
            {narrow && !topbar && <div className="bc-topbar-brand">{brandCompact ?? brand}</div>}
            <div className="bc-topbar-end">{topbar}</div>
          </header>
        )}
        <main className="bc-content" id="bc-content" tabIndex={-1}>{children}</main>
      </div>
    </div>
  );
}
