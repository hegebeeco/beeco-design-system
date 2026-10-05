import { type ReactNode } from 'react';
import { type FormError } from './ErrorSummary';
import { type TemplateHeadProps } from './Frame';
export type EditContext = {
    /** A mező hibája (a FormError name-je szerint) – add át a mező error propjának */
    errorOf: (name: string) => string | undefined;
    submitting: boolean;
    /** Lépés-módban (steps) a mostani lépés azonosítója – ennek a mezőit rajzold ki */
    step?: string;
};
/** Egy lépés (Javaslat 20): azonosító, cím, rövid leírás és a lépés mezőinek neve (a FormError name-jei szerint) */
export type EditStep = {
    id: string;
    title: string;
    description?: ReactNode;
    fields: readonly string[];
};
export type EditStepsConfig = {
    /** A lépések sorrendben (legalább kettő) */
    items: readonly EditStep[];
    /** A lépésjelző neve képernyőolvasónak, pl. „Az új POI felvételének lépései” */
    label: string;
    /** Kitöltve induló űrlap (pl. másolás, szerkesztés): a jelző kezdettől minden lépésre kattintható */
    allReachable?: boolean;
    /** Lépésváltáskor (pl. analitika, URL) */
    onStepChange?: (id: string) => void;
    backLabel?: string;
    nextLabel?: string;
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
    /** A mentés gomb piktogramja – alap: mentés; létrehozásnál pl. <IcNew /> (Kristóf szabálya: szöveges gombon is legyen piktogram) */
    submitIcon?: ReactNode;
    cancelLabel?: string;
    /** Értesítés sikeres mentés után */
    successMessage?: string;
    /** Mentés után a gombsorban méhecske-pillanat ('mentve') – alap: igen */
    savedMoment?: boolean;
    /** Élő előnézet (pl. PreviewCard) – széles helyen jobb oldalt, telefonon az űrlap alatt */
    preview?: ReactNode;
    previewLabel?: string;
    /**
     * Piszkozat (Javaslat 13/7): a módosított űrlap az eszközön megmarad; újranyitáskor felajánljuk a visszaállítást,
     * sikeres mentés után törlődik. key: űrlap + rekord (pl. „esemeny:126”); onRestore: az értékek visszatöltése (dirty marad).
     */
    draft?: {
        key: string | null;
        values: unknown;
        onRestore: (values: never) => void;
    };
    /**
     * Javaslat 20 – lépés-mód: egyszerre egy lépés látszik, felül a kattintható lépésjelző, a gombsorban Vissza / Tovább és az
     * utolsó lépésen a Mentés. A „Tovább” csak a lépés mezőit ellenőrzi (a validate eredménye a lépés fields-ére szűrve); a hibaösszesítő
     * linkje a megfelelő lépésre vált; mentéskor a korábbi lépés hibájára odaugrik. A children függvény ctx.step-je a mostani lépés.
     */
    steps?: EditStepsConfig;
    /** Javaslat 20 – ⌘S / Ctrl+S menti az űrlapot (lépés-módban csak az utolsó lépésen; előtte a „Tovább”-ra figyelmeztet) */
    saveShortcut?: boolean;
    /** A szakaszok (FormSection) – vagy függvény, ami megkapja a hibákat */
    children: ReactNode | ((ctx: EditContext) => ReactNode);
};
/**
 * EditPage (sablon, Javaslat 06c/16): oldalfej · hibaösszesítő · szakaszok · ragadós gombsor (Mégse / Mentés) · előnézet-oszlop.
 * Javaslat 20: lépés-mód (steps: Vissza / Tovább, lépésenkénti ellenőrzés) és ⌘S / Ctrl+S mentés (saveShortcut).
 * Mentetlen változásnál a Mégse, a linkek és a böngésző bezárása előtt kérdez (kieg useUnsavedChanges).
 * Sikertelen beküldés: összesítő felül, fókusz rá, kíméletes rázás. Siker: értesítés + mentve-pipa + 'mentve' pillanat.
 */
export declare function EditPage(p: EditPageProps): import("react").JSX.Element;
