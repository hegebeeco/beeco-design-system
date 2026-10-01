import { type ConfirmDialogProps } from './ConfirmDialog';
export type TypeToConfirmProps = Omit<ConfirmDialogProps, 'confirmDisabled' | 'extra' | 'initialFocus' | 'danger'> & {
    /** Tömeges törlés: a darabszámot kell begépelni (a név tömegesen értelmetlen) */
    count?: number;
    /** Egyetlen elem: a nevét kell begépelni (kis-nagybetű, ékezet és dupla szóköz nem számít) */
    name?: string;
    /** A mező címkéje, pl. „Írd be a törlendő POI-k számát” */
    prompt?: string;
    /** A hatásvizsgálat (mi törlődik még) töltődik – addig a gomb tiltott */
    impactLoading?: boolean;
    /** A hatásvizsgálat nem töltött be – a gomb tiltott, „Újrapróbálás” */
    impactError?: string;
    onRetry?: () => void;
};
/**
 * TypeToConfirm (organizmus, Javaslat 03 – 2A): veszélyes tömeges vagy másokat érintő végleges törlés.
 * Mikor? 10-nél több elem végleges törlése, vagy ami másokat is érint. Egy elem sima törlésére a ConfirmDialog elég.
 * A gomb addig tiltott, amíg a begépelt érték nem egyezik; a fókusz a mezőn indul (a gomb úgyis tiltott).
 */
export declare function TypeToConfirm({ count, name, prompt, impactLoading, impactError, onRetry, open, onOpenChange, ...rest }: TypeToConfirmProps): import("react").JSX.Element;
