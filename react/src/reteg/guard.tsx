import { createContext, useContext, useState } from 'react';
import { ConfirmDialog } from './ConfirmDialog';

/** A rétegen belüli „Mégse”/bezárás ugyanazon az őrön megy át, mint az Esc és a ✕. */
export const LayerCloseContext = createContext<() => void>(() => undefined);
export const useLayerClose = () => useContext(LayerCloseContext);

type GuardOptions = { onOpenChange: (open: boolean) => void; dirty?: boolean; busy?: boolean };

/**
 * Bezárás-őr ablakhoz és oldalpanelhez:
 * - folyamatban (busy) nem zár (Esc, ✕, kívül kattintás sem);
 * - el nem mentett változásnál (dirty) előbb megkérdezi: „Elveted a módosításokat?”.
 */
export function useCloseGuard({ onOpenChange, dirty, busy }: GuardOptions) {
  const [asking, setAsking] = useState(false);
  const change = (next: boolean) => {
    if (next) { onOpenChange(true); return; }
    if (busy) return;
    if (dirty) { setAsking(true); return; }
    onOpenChange(false);
  };
  const discardDialog = (
    <ConfirmDialog open={asking} onOpenChange={setAsking} title="Elveted a módosításokat?" danger
      confirmLabel="Elvetés" cancelLabel="Folytatom a szerkesztést" onConfirm={() => onOpenChange(false)}>
      A mentetlen módosításaid elvesznek. Ha meg akarod tartani őket, folytasd a szerkesztést, és mentsd el.
    </ConfirmDialog>
  );
  return { change, requestClose: () => change(false), discardDialog };
}
