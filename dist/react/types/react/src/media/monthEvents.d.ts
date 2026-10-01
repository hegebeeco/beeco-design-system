/** A naptár tartalomfajtái – a szín SZEREPBŐL jön: esemény = info, speciális nap = warning, oktatás = success */
export type CalKind = 'event' | 'special' | 'education';
export declare const KIND_ROLE: Record<CalKind, 'info' | 'warning' | 'success'>;
export declare const KIND_LABEL: Record<CalKind, string>;
export type CalEvent = {
    id: string;
    title: string;
    kind: CalKind;
    /** Kezdő nap 'YYYY-MM-DD' (helyi nap) */
    date: string;
    /** Utolsó nap, ha több napos (a hónap határán át is) */
    end?: string;
    /** Évente ismétlődő (pl. világnap) – bármelyik évben ugyanazon a napon */
    yearly?: boolean;
};
/** Nap → a napra eső tartalmak, fajta szerint rendezve (speciális nap elöl) */
export declare function eventsByDay(events: readonly CalEvent[], days: readonly string[], hidden: ReadonlySet<CalKind>): Map<string, CalEvent[]>;
/** „október 1., szerda” */
export declare const dayTitle: (iso: string) => string;
