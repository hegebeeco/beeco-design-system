import { type RefObject } from 'react';
/** Egy mezőhiba: a mező name-je (ezzel találjuk meg), a címkéje (a listában) és a hiba a következő lépéssel. */
export type FormError = {
    name: string;
    message: string;
    label?: string;
};
type Props = {
    errors: FormError[];
    general?: string;
    form: RefObject<HTMLFormElement | null>;
};
/** A mező megkeresése name (vagy id) alapján az űrlapban. */
export declare function findField(form: HTMLFormElement | null, name: string): HTMLElement | null;
/**
 * Hibaösszesítő (GOV.UK-minta): sikertelen beküldéskor az űrlap tetején, ide kerül a fókusz.
 * Minden hiba link: a mezőre ugrik és oda teszi a fókuszt (görgetés középre – a ragadós fejléc nem takarja).
 */
export declare const ErrorSummary: import("react").ForwardRefExoticComponent<Props & import("react").RefAttributes<HTMLDivElement>>;
/**
 * Linkre kattintás elkapása, amíg van mentetlen változás (a kieg UnsavedChangesGuard mintája, de a hívó saját confirm-jével –
 * így a „Mégse” gomb és a linkek ugyanazt az egy őrt használják, és elvetés után a böngésző sem kérdez rá még egyszer).
 */
export declare function useLinkGuard(dirty: boolean, confirm: (proceed: () => void) => void): void;
export {};
