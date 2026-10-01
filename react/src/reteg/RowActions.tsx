import type { ReactNode } from 'react';
import { IconButton } from '../inputs/Button';
import { DropdownMenu, type MenuEntry } from './DropdownMenu';
import { TooltipIconButton } from './Tooltip';

export type RowAction = {
  label: string;
  /** Ikon a soron belüli gombhoz (a menüben is megjelenik) */
  icon: ReactNode;
  onSelect: () => void;
  /** Veszélyes (törlés): mindig a menü aljára kerül, elválasztva, pirossal */
  danger?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  /** Ez a fő művelet (3+ műveletnél ez marad látható). Alap: az első nem veszélyes. */
  primary?: boolean;
};

export type RowActionsProps = {
  actions: RowAction[];
  /** A sor neve – a „⋯” gomb így szól: „További műveletek: Méhes Kávézó” */
  rowLabel: string;
};

/**
 * RowActions (molekula, Javaslat 03 – 5A) – a sorvégi műveletek szabálya egy helyen:
 * ≤ 2 művelet → ikongombok (felirattal); 3+ → a fő művelet látszik, a többi a „⋯” menüben, a törlés alul, elválasztva.
 */
export function RowActions({ actions, rowLabel }: RowActionsProps) {
  const inline = (a: RowAction) => (
    <TooltipIconButton key={a.label} label={a.label} danger={a.danger} disabled={a.disabled}
      title={a.disabled ? a.disabledReason : undefined} onClick={a.onSelect}>{a.icon}</TooltipIconButton>
  );
  if (actions.length <= 2) return <div className="bc-row-actions">{actions.map(inline)}</div>;

  const main = actions.find((a) => a.primary) ?? actions.find((a) => !a.danger) ?? actions[0];
  const rest = actions.filter((a) => a !== main);
  const safe = rest.filter((a) => !a.danger), risky = rest.filter((a) => a.danger);
  const entry = (a: RowAction): MenuEntry => ({ label: a.label, icon: a.icon, onSelect: a.onSelect, danger: a.danger, disabled: a.disabled, disabledReason: a.disabledReason });
  const items: MenuEntry[] = [...safe.map(entry), ...(safe.length && risky.length ? ['separator' as const] : []), ...risky.map(entry)];

  return (
    <div className="bc-row-actions">
      {inline(main)}
      <DropdownMenu items={items} label={`Műveletek: ${rowLabel}`}
        trigger={<IconButton aria-label={`További műveletek: ${rowLabel}`}><MoreIcon /></IconButton>} />
    </div>
  );
}

export function MoreIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg>;
}
