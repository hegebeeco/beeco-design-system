import { type ReactNode } from 'react';
import { type FormError } from './ErrorSummary';
import { type TemplateHeadProps } from './Frame';
export type EditContext = {
    /** A mező hibája (a FormError name-je szerint) – add át a mező error propjának */
    errorOf: (name: string) => string | undefined;
    submitting: boolean;
};
export type EditPageProps = TemplateHeadProps & {
    status?: 'ready' | 'loading' | 'error' | 'forbidden';
    what?: string;
    error?: string;
    onRetry?: () => void;
    /** Van mentetlen változás (a hívó számolja: jelenlegi ≠ betöltött) – az őr és a „Nem mentett változások” jelzés ebből dolgozik */
    dirty: boolean;
    /** Beküldés előtti ellenőrzés – üres lista = rendben. Sikertelen beküldés után minden rajzoláskor újrafut (a javított hiba eltűnik). */
    validate?: () => FormError[];
    /** Mentés. Hibát dobhat (→ általános hiba), vagy szerveroldali mezőhibákat adhat vissza (→ hibaösszesítő). */
    onSubmit: () => void | FormError[] | Promise<void | FormError[]>;
    /** Mégse: az őrön át (mentetlen változásnál előbb kérdez) – vagy cancelHref link */
    onCancel?: () => void;
    cancelHref?: string;
    submitLabel?: string;
    cancelLabel?: string;
    /** Értesítés sikeres mentés után */
    successMessage?: string;
    /** Mentés után a gombsorban méhecske-pillanat ('mentve') – alap: igen */
    savedMoment?: boolean;
    /** Élő előnézet (pl. PreviewCard) – széles helyen jobb oldalt, telefonon az űrlap alatt */
    preview?: ReactNode;
    previewLabel?: string;
    /** A szakaszok (FormSection) – vagy függvény, ami megkapja a hibákat */
    children: ReactNode | ((ctx: EditContext) => ReactNode);
};
/**
 * EditPage (sablon, Javaslat 06c/16): oldalfej · hibaösszesítő · szakaszok · ragadós gombsor (Mégse / Mentés) · előnézet-oszlop.
 * Mentetlen változásnál a Mégse, a linkek és a böngésző bezárása előtt kérdez (kieg useUnsavedChanges).
 * Sikertelen beküldés: összesítő felül, fókusz rá, kíméletes rázás. Siker: értesítés + mentve-pipa + 'mentve' pillanat.
 */
export declare function EditPage(p: EditPageProps): import("react").JSX.Element;
