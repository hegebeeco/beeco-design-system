import * as DM from '@radix-ui/react-dropdown-menu';
import type { ReactElement, ReactNode } from 'react';
import { cx } from '../cx';

export type MenuItem = {
  label: string;
  /** Kiválasztás (Enter, Szóköz, kattintás). Ablakot nyitó elemnél a felirat végén „…”: „Törlés…” */
  onSelect?: () => void;
  icon?: ReactNode;
  /** Veszélyes elem: piros, és a menü aljára, elválasztva kerül (RowActions ezt magától rendezi) */
  danger?: boolean;
  disabled?: boolean;
  /** Miért tiltott (pl. „Ehhez admin jogosultság kell”) – a felirat alatt látszik */
  disabledReason?: string;
  /** Billentyűparancs felirata, pl. „Ctrl+D” (csak kiírás) */
  shortcut?: string;
  /** Almenü */
  items?: MenuEntry[];
};
export type MenuEntry = MenuItem | 'separator' | { group: string };

export type DropdownMenuProps = {
  /** A nyitó gomb (Button vagy IconButton) – a Radix erre teszi az aria-expanded-et */
  trigger: ReactElement;
  items: MenuEntry[];
  /** A menü neve a képernyőolvasónak, ha a nyitó gomb nem mondja el (pl. „Műveletek: Méhes Kávézó”) */
  label?: string;
  align?: 'start' | 'end';
  /** Fejléc a menü tetején (pl. profil-menüben név + szerep) */
  header?: ReactNode;
};

/**
 * DropdownMenu (molekula, Javaslat 03 – 5A): profil-menü és sor-műveletek.
 * Radix: nyilak, Home/End, kezdőbetűs ugrás, Esc (fókusz vissza a gombra), almenü → nyíllal, a képernyő alján felfelé nyílik.
 */
export function DropdownMenu({ trigger, items, label, align = 'end', header }: DropdownMenuProps) {
  return (
    <DM.Root>
      <DM.Trigger asChild>{trigger}</DM.Trigger>
      <DM.Portal>
        <DM.Content className="bc-menu" align={align} sideOffset={6} collisionPadding={16} loop aria-label={label}>
          {header && <div className="bc-menu-header">{header}</div>}
          <Entries items={items} />
        </DM.Content>
      </DM.Portal>
    </DM.Root>
  );
}

function Entries({ items }: { items: MenuEntry[] }) {
  return (
    <>
      {items.map((it, i) => {
        if (it === 'separator') return <DM.Separator key={`s${i}`} className="bc-menu-sep" />;
        if ('group' in it) return <DM.Label key={`g${i}`} className="bc-menu-label">{it.group}</DM.Label>;
        if (it.items) {
          return (
            <DM.Sub key={it.label}>
              <DM.SubTrigger className="bc-menu-item" disabled={it.disabled}>
                {it.icon && <span className="bc-menu-icon" aria-hidden="true">{it.icon}</span>}
                <span className="bc-menu-text">{it.label}</span>
                <span className="bc-menu-right" aria-hidden="true">›</span>
              </DM.SubTrigger>
              <DM.Portal>
                <DM.SubContent className="bc-menu" sideOffset={4} collisionPadding={16} loop><Entries items={it.items} /></DM.SubContent>
              </DM.Portal>
            </DM.Sub>
          );
        }
        return (
          <DM.Item key={it.label} className={cx('bc-menu-item', it.danger && 'is-danger')} disabled={it.disabled} onSelect={it.onSelect}>
            {it.icon && <span className="bc-menu-icon" aria-hidden="true">{it.icon}</span>}
            <span className="bc-menu-text">
              {it.label}
              {it.disabled && it.disabledReason && <small className="bc-menu-reason">{it.disabledReason}</small>}
            </span>
            {it.shortcut && <kbd className="bc-menu-right">{it.shortcut}</kbd>}
          </DM.Item>
        );
      })}
    </>
  );
}
