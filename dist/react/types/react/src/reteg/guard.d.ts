/** A rétegen belüli „Mégse”/bezárás ugyanazon az őrön megy át, mint az Esc és a ✕. */
export declare const LayerCloseContext: import("react").Context<() => void>;
export declare const useLayerClose: () => () => void;
type GuardOptions = {
    onOpenChange: (open: boolean) => void;
    dirty?: boolean;
    busy?: boolean;
};
/**
 * Bezárás-őr ablakhoz és oldalpanelhez:
 * - folyamatban (busy) nem zár (Esc, ✕, kívül kattintás sem);
 * - el nem mentett változásnál (dirty) előbb megkérdezi: „Elveted a módosításokat?”.
 */
export declare function useCloseGuard({ onOpenChange, dirty, busy }: GuardOptions): {
    change: (next: boolean) => void;
    requestClose: () => void;
    discardDialog: import("react").JSX.Element;
};
export {};
