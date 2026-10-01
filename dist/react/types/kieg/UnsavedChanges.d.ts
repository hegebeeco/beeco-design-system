import { type ReactNode } from 'react';
export type UnsavedChangesDialogProps = {
    open: boolean;
    /** „Maradok” / Esc: vissza a szerkesztéshez */
    onStay: () => void;
    /** „Elvetés és továbblépés” */
    onLeave: () => void;
    /** Ha van: „Mentés és továbblépés” – ígéretet adhat; közben a gomb pörög, hiba esetén az ablak marad és kiírja */
    onSave?: () => void | Promise<void>;
    title?: string;
    children?: ReactNode;
};
/**
 * UnsavedChangesDialog (molekula, Javaslat 06a/5): kíméletes kérdés, szóvicc nélkül.
 * A fókusz a „Maradok” gombon indul – véletlen Enter nem dob el semmit.
 */
export declare function UnsavedChangesDialog({ open, onStay, onLeave, onSave, title, children }: UnsavedChangesDialogProps): import("react").JSX.Element;
export type UseUnsavedChangesOptions = {
    onSave?: () => void | Promise<void>;
    title?: string;
    text?: ReactNode;
};
/**
 * useUnsavedChanges(dirty) – útválasztó-független őr:
 * - amíg dirty, a böngésző bezárás/frissítés előtt rákérdez (beforeunload);
 * - confirm(tovább) a saját navigációhoz: ha nincs változás, azonnal továbblép, különben előbb kérdez;
 * - dialog: ezt tedd ki az oldalra.
 */
export declare function useUnsavedChanges(dirty: boolean, opts?: UseUnsavedChangesOptions): {
    confirm: (proceed: () => void) => void;
    dialog: import("react").JSX.Element;
    asking: boolean;
};
export type UnsavedChangesGuardProps = UseUnsavedChangesOptions & {
    dirty: boolean;
    /** A linkekre kattintást is elkapja (alap: igen). Kivétel: új lap, letöltés, #horgony, data-unsaved-ignore. */
    interceptLinks?: boolean;
};
/**
 * UnsavedChangesGuard (molekula, Javaslat 06a/5): tedd a szerkesztő oldalra – bezárás, frissítés és linkre kattintás
 * előtt kérdez. Útválasztó-független: a linket a döntés után „újrakattintja”, így a router (vagy a böngésző) viszi tovább.
 */
export declare function UnsavedChangesGuard({ dirty, interceptLinks, ...opts }: UnsavedChangesGuardProps): import("react").JSX.Element;
