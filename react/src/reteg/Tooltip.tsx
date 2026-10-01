import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { forwardRef, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { IconButton } from '../inputs/Button';

// Utolsó Tab-billentyű ideje: a tooltip csak akkor nyílik fókuszra, ha a felhasználó MAGA lépett oda Tab-bal
// (programozott fókusz-visszaadásra – pl. egy panel bezárása után – nem; különben egymásra halmozódnak és elnyelik az Esc-et)
let lastTab = 0;
if (typeof document !== 'undefined') document.addEventListener('keydown', (e) => { if (e.key === 'Tab') lastTab = Date.now(); }, true);

export type TooltipIconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> & {
  /** A gomb neve: ez az aria-label ÉS a felirat (pl. „Szerkesztés”) – soha nem hordoz egyedi információt */
  label: string;
  /** Az ikon (svg) */
  children: ReactNode;
  danger?: boolean;
  side?: 'top' | 'bottom' | 'left' | 'right';
};

/**
 * Tooltip (atom, Javaslat 03 – 4): CSAK ikongomb feliratára. Egérrel 500 ms rámutatás után, billentyűzettel fókuszra jelenik meg;
 * érintésen nem (ott a gomb neve a képernyőolvasónak szól). Magyarázatra, példára a súgó (ⓘ, HelpButton) való.
 */
export const TooltipIconButton = forwardRef<HTMLButtonElement, TooltipIconButtonProps>(function TooltipIconButton(
  { label, children, side = 'top', onBlur, onClick, onKeyDown, onPointerDown, ...rest }, ref) {
  // Vezérelt: elhagyásra, kattintásra, Enter/Szóközre bezár (különben a visszaadott fókusz nyitva hagyta, és egymásra halmozódtak).
  // Csak valódi billentyűzetes fókuszra (:focus-visible) vagy egeres rámutatásra nyílik.
  const [open, setOpen] = useState(false);
  const pointer = useRef(false);
  const hover = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  return (
    <TooltipPrimitive.Provider delayDuration={500} skipDelayDuration={300}>
      <TooltipPrimitive.Root open={open} onOpenChange={(o) => { if (!o) setOpen(false); }}>
        {/* aria-describedby kikapcsolva: a felirat ugyanaz, mint a név – ne olvassa fel kétszer */}
        <TooltipPrimitive.Trigger asChild aria-describedby={undefined}>
          <IconButton ref={ref} aria-label={label} {...rest}
            onPointerDown={(e) => { pointer.current = true; clearTimeout(hover.current); setOpen(false); onPointerDown?.(e); }}
            onPointerEnter={(e) => { if (e.pointerType === 'mouse') { clearTimeout(hover.current); hover.current = setTimeout(() => setOpen(true), 500); } }}
            onPointerLeave={() => { pointer.current = false; clearTimeout(hover.current); setOpen(false); }}
            onFocus={() => { if (!pointer.current && Date.now() - lastTab < 300) setOpen(true); }}
            onBlur={(e) => { setOpen(false); pointer.current = false; onBlur?.(e); }}
            onClick={(e) => { setOpen(false); onClick?.(e); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') setOpen(false); onKeyDown?.(e); }}>{children}</IconButton>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content className="bc-tooltip" side={side} sideOffset={6} collisionPadding={8} aria-hidden="true">
            {label}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
});
