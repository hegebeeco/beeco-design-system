import { type ReactNode } from 'react';
export type ModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Az ablak címe (kötelező – a képernyőolvasó ezzel mutatja be) */
    title: ReactNode;
    /** Rövid leírás a cím alatt (a képernyőolvasó is felolvassa) */
    description?: ReactNode;
    /** sm 420 px · md 560 px (alap) · wide 880 px; telefonon teljes szélesség */
    size?: 'sm' | 'md' | 'wide';
    /** A gombsor (jobbra igazítva). A „Mégse”: <ModalCancel /> – ugyanazon az őrön megy át, mint az Esc. */
    footer?: ReactNode;
    /** Folyamatban (pl. mentés): Esc, ✕ és kívül kattintás nem zár */
    busy?: boolean;
    /** El nem mentett változás: bezárás előtt megkérdezi, elveted-e */
    dirty?: boolean;
    /** Nyitáskor ide kerül a fókusz (alap: a törzs első mezője/gombja, ha nincs: a ✕) */
    initialFocus?: () => HTMLElement | null;
    closeLabel?: string;
    className?: string;
    children?: ReactNode;
};
/**
 * Modal (organizmus, Javaslat 03 – 1): felugró ablak fejjel, görgethető törzzsel és álló gombsorral.
 * Radix Dialog: portál, fókuszcsapda, Esc, a háttér nem görög, a fókusz visszatér a nyitó elemre.
 * Mikor ablak? Egy kérdés, egy döntés, rövid űrlap. Elem megnézése a lista mellett → Drawer; hosszú űrlap → külön oldal.
 */
export declare function Modal({ open, onOpenChange, title, description, size, footer, busy, dirty, initialFocus, closeLabel, className, children }: ModalProps): import("react").JSX.Element;
/** „Mégse” gomb ablakba és oldalpanelbe: a bezárás-őrön át zár (folyamatban tiltott, mentetlennél kérdez). */
export declare function ModalCancel({ children, disabled }: {
    children?: ReactNode;
    disabled?: boolean;
}): import("react").JSX.Element;
export declare function CloseIcon(): import("react").JSX.Element;
