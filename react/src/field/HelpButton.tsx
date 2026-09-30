import * as Popover from '@radix-ui/react-popover';
import type { ReactNode } from 'react';

export type HelpButtonProps = {
  /** Mire vonatkozik (a képernyőolvasó ezt mondja: „Súgó: <label>”) */
  label: string;
  /** Mit és miért kell megadni – rövid, tegeződő szöveg, ha lehet példával */
  children: ReactNode;
};

/**
 * Súgó gomb (ⓘ) – kattintásra/koppintásra nyíló buborék (érintésen is működik, ezért nem tooltip).
 * Esc-re és kívül kattintásra zár, a fókusz visszakerül a gombra (Radix Popover).
 */
export function HelpButton({ label, children }: HelpButtonProps) {
  return (
    <Popover.Root>
      <Popover.Trigger className="bc-help-btn" aria-label={`Súgó: ${label}`} type="button">
        <span aria-hidden="true">i</span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="bc-pop" side="top" align="start" sideOffset={6} collisionPadding={16}>
          <strong className="bc-pop-title">{label}</strong>
          {typeof children === 'string' ? <p>{children}</p> : children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
