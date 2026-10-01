import { type ReactNode } from 'react';
export type ConfirmDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Kérdés, a tárggyal: „Törlöd a kupon-sablont?” */
    title: string;
    /** A következmény: mi történik még (mi törlődik vele, kiket érint). */
    children?: ReactNode;
    /** A gomb felirata az ige („Törlés”, „Közzététel”) – soha nem „Igen/OK”. */
    confirmLabel: string;
    cancelLabel?: string;
    /** Veszélyes (visszafordíthatatlan) művelet: piros gomb */
    danger?: boolean;
    /**
     * A művelet. Ha ígéretet ad vissza: közben a gomb pörög, a Mégse és az Esc nem zár;
     * siker → bezár; hiba → az ablakban marad, és kiírja a hibát (újrapróbálható).
     */
    onConfirm: () => void | Promise<void>;
    /** Pl. TypeToConfirm: amíg nem egyezik, a gomb tiltott */
    confirmDisabled?: boolean;
    /** Hibaszöveg a dobott hibából (alap: az Error üzenete + „Próbáld újra.”) */
    errorText?: (error: unknown) => string;
    /** Hova kerüljön a fókusz nyitáskor (alap: a Mégse gombra – véletlen Enter nem töröl) */
    initialFocus?: 'cancel' | (() => HTMLElement | null);
    /** Kiegészítő tartalom a következmény alatt (pl. begépelős mező) */
    extra?: ReactNode;
    /** sm 420 px (alap) · md 560 px (pl. hosszú gombfelirat, begépelős mező) */
    size?: 'sm' | 'md';
    className?: string;
};
/**
 * ConfirmDialog (organizmus, Javaslat 03 – 1A): megerősítés csak visszafordíthatatlan vagy másokat érintő műveletnél.
 * Minta: WAI-ARIA alertdialog – kívül kattintás nem zár, Esc igen (ha nem folyamatban), a fókusz a Mégse gombon indul.
 */
export declare function ConfirmDialog({ open, onOpenChange, title, children, confirmLabel, cancelLabel, danger, onConfirm, confirmDisabled, errorText, initialFocus, extra, size, className, }: ConfirmDialogProps): import("react").JSX.Element;
