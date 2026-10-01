import { type ReactNode } from 'react';
export type KiegDialogProps = {
    open: boolean;
    /** Esc vagy a biztonságos gomb: marad minden, ahogy volt */
    onCancel: () => void;
    title: string;
    children?: ReactNode;
    /** A gombsor; a biztonságos gombon legyen data-autofocus (oda kerül a fókusz – véletlen Enter nem dob el semmit) */
    actions: ReactNode;
    className?: string;
};
/**
 * Megerősítő ablak natív <dialog>-gal (bc-modal): a böngésző adja a fókuszcsapdát és az Esc-et, a háttér inert.
 * A 06a-csomag belső eleme (a 03-as réteg-csomagtól független). Bezáráskor a fókusz oda tér vissza, ahonnan jött.
 * Kívül kattintás nem zár (alertdialog-minta).
 */
export declare function KiegDialog({ open, onCancel, title, children, actions, className }: KiegDialogProps): import("react").JSX.Element;
