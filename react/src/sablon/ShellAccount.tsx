import type { ReactNode } from 'react';
import { Avatar } from '../media/Avatar';
import { DropdownMenu, type MenuEntry } from '../reteg/DropdownMenu';

export type ShellAccountProps = {
  /** A belépett felhasználó neve; ha null, még töltődik („Betöltés…”) */
  name: string | null;
  /** Második sor: szerep vagy e-mail (pl. „admin”) */
  detail?: ReactNode;
  /** Profilkép URL – ha nincs, monogram */
  avatarSrc?: string;
  /** A menü elemei, legalább a kijelentkezés: { label: 'Kijelentkezés', onSelect } */
  items: MenuEntry[];
};

/**
 * ShellAccount (molekula, Javaslat 08): a felhasználó az AppShell oldalsávjának alján – avatar, név, szerep, menü (kijelentkezés).
 * Becsukott sávban csak az avatar látszik; a gomb neve a képernyőolvasónak ilyenkor is a teljes név.
 */
export function ShellAccount({ name, detail, avatarSrc, items }: ShellAccountProps) {
  const nev = name ?? 'Betöltés…';
  return (
    <DropdownMenu
      label={`Felhasználói menü: ${nev}`}
      align="start"
      header={<><strong>{nev}</strong>{detail && <span className="bc-muted">{detail}</span>}</>}
      trigger={
        <button type="button" className="bc-account" aria-label={`Felhasználói menü: ${nev}`} title={nev}>
          <Avatar name={name ?? '?'} src={avatarSrc} size={32} decorative />
          <span className="bc-account-text">
            <span className="bc-account-name">{nev}</span>
            {detail && <span className="bc-account-detail">{detail}</span>}
          </span>
          <svg className="bc-account-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M8 10l4-4 4 4M8 14l4 4 4-4" /></svg>
        </button>
      }
      items={items}
    />
  );
}
