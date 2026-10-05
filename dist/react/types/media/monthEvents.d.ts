import type { ReactNode } from 'react';
/** A naptár beépített tartalomfajtái – a szín SZEREPBŐL jön: esemény = info, speciális nap = warning, oktatás = success */
export type CalKind = 'event' | 'special' | 'education';
export declare const KIND_ROLE: Record<CalKind, 'info' | 'warning' | 'success'>;
export declare const KIND_LABEL: Record<CalKind, string>;
/** A beépített fajták a jelmagyarázat sorrendjében */
export declare const CAL_KINDS: readonly CalKind[];
/** Javaslat 20: egy fajta színe – csak szerep (méz nincs: az a kijelölésé) */
export type CalTone = 'info' | 'warning' | 'success' | 'danger' | 'neutral';
/**
 * Javaslat 20 – a projekt saját tartalomfajtája (pl. „Kupon-időzítés”): címke + szerepszín + piktogram. A fajtát a bal csík,
 * a szín, a piktogram ÉS a jelmagyarázat felirata is mondja – nem csak a szín. A beépített fajták is felülírhatók vele.
 */
export type CalKindDef = {
    label: string;
    tone?: CalTone;
    icon?: ReactNode;
};
export type CalEvent<K extends string = CalKind> = {
    id: string;
    title: string;
    kind: K;
    /** Kezdő nap 'YYYY-MM-DD' (helyi nap) */
    date: string;
    /** Utolsó nap, ha több napos (a hónap határán át is) */
    end?: string;
    /** Évente ismétlődő (pl. világnap) – bármelyik évben ugyanazon a napon */
    yearly?: boolean;
};
/** A fajta szerepszíne: a projekt definíciója, különben a beépített szerep, különben semleges */
export declare function kindTone<K extends string>(k: K, defs?: Partial<Record<K, CalKindDef>>): CalTone;
/** A fajta neve: labels → a projekt definíciója → beépített név → maga a kulcs */
export declare function kindLabel<K extends string>(k: K, labels?: Partial<Record<K, string>>, defs?: Partial<Record<K, CalKindDef>>): string;
/** Nap → a napra eső tartalmak, fajta szerint rendezve (speciális nap elöl, a saját fajták a `order` sorrendjében a végén) */
export declare function eventsByDay<K extends string = CalKind>(events: readonly CalEvent<K>[], days: readonly string[], hidden: ReadonlySet<K>, order?: readonly K[]): Map<string, CalEvent<K>[]>;
/** „október 1., szerda” */
export declare const dayTitle: (iso: string) => string;
