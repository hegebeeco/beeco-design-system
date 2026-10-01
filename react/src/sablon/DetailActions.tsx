import { useState, type ReactNode } from 'react';
import { Button, IconButton } from '../inputs/Button';
import { ConfirmDialog } from '../reteg/ConfirmDialog';
import { DropdownMenu, type MenuEntry } from '../reteg/DropdownMenu';
import { MoreIcon } from '../reteg/RowActions';

export type DetailAction = {
  label: string;
  icon?: ReactNode;
  /** A művelet; megerősítésnél ígéretet adhat – közben a gomb pörög, hiba esetén az ablak nyitva marad */
  onSelect: () => void | Promise<void>;
  /** Ez marad látható (alap: az első nem veszélyes) – a többi a „⋯” menübe kerül */
  primary?: boolean;
  /** Veszélyes (törlés): a menü aljára kerül, elválasztva, pirossal */
  danger?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  /** Visszafordíthatatlan műveletnél: előbb megerősítő ablak (a következménnyel) */
  confirm?: { title: string; body?: ReactNode; confirmLabel: string };
};

/**
 * Az oldal műveletei a RowActions szabálya szerint, oldalfejbe méretezve:
 * a fő művelet felirattal látszik, a többi a „⋯” menüben, a veszélyes alul; megerősítés ConfirmDialoggal.
 */
export function DetailActions({ actions, subject }: { actions: DetailAction[]; subject: string }) {
  const [pending, setPending] = useState<DetailAction | null>(null);
  const [open, setOpen] = useState(false);
  const run = (a: DetailAction) => {
    if (a.confirm) { setPending(a); setOpen(true); return; }
    void a.onSelect();
  };
  const main = actions.find((a) => a.primary) ?? actions.find((a) => !a.danger);
  const rest = actions.filter((a) => a !== main);
  const safe = rest.filter((a) => !a.danger), risky = rest.filter((a) => a.danger);
  // Ablakot nyitó menüpont felirata „…”-ra végződik (DropdownMenu szabálya)
  const entry = (a: DetailAction): MenuEntry => ({
    label: a.confirm && !a.label.endsWith('…') ? `${a.label}…` : a.label, icon: a.icon, danger: a.danger,
    disabled: a.disabled, disabledReason: a.disabledReason, onSelect: () => run(a),
  });
  const items: MenuEntry[] = [...safe.map(entry), ...(safe.length && risky.length ? ['separator' as const] : []), ...risky.map(entry)];

  return (
    <>
      {main && (
        <Button variant={main.danger ? 'danger' : 'primary'} icon={main.icon} disabled={main.disabled}
          title={main.disabled ? main.disabledReason : undefined} onClick={() => run(main)}>{main.label}</Button>
      )}
      {items.length > 0 && (
        <DropdownMenu items={items} label={`Műveletek: ${subject}`}
          trigger={<IconButton aria-label={`További műveletek: ${subject}`}><MoreIcon /></IconButton>} />
      )}
      {pending?.confirm && (
        <ConfirmDialog open={open} onOpenChange={setOpen} title={pending.confirm.title} confirmLabel={pending.confirm.confirmLabel}
          danger={pending.danger} onConfirm={pending.onSelect}>{pending.confirm.body}</ConfirmDialog>
      )}
    </>
  );
}
