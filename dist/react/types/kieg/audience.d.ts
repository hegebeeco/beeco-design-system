/** Célcsoport-szabályok – tiszta logika (típusok, feltételek, ellenőrzés, összefoglaló mondat). */
export type AudienceFieldType = 'select' | 'number' | 'text';
export type AudienceField = {
    key: string;
    /** „Város”, „Életkor” */
    label: string;
    type: AudienceFieldType;
    /** Mit jelent ez a mező, honnan jön az adat (a súgóba kerül) */
    help: string;
    options?: ReadonlyArray<{
        value: string;
        label: string;
    }>;
    min?: number;
    max?: number;
    unit?: string;
    decimals?: number;
    maxLength?: number;
};
export type AudienceOp = 'eq' | 'neq' | 'gte' | 'lte' | 'contains';
export type AudienceRule = {
    id: string;
    field: string;
    op: AudienceOp;
    value: string | number | null;
};
export type Audience = {
    join: 'and' | 'or';
    rules: AudienceRule[];
};
export declare const OPS: Record<AudienceFieldType, ReadonlyArray<{
    value: AudienceOp;
    label: string;
}>>;
/** Új, üres feltétel (egyedi azonosítóval) */
export declare const newRule: () => AudienceRule;
/** Mi a baj a feltétellel (a hiba megmondja a teendőt); undefined = rendben */
export declare function ruleProblem(r: AudienceRule, fields: ReadonlyArray<AudienceField>): string | undefined;
export declare function audienceProblems(a: Audience, fields: ReadonlyArray<AudienceField>): Record<string, string>;
/** Egy mondatban: „Város: Budapest ÉS Életkor legalább 18 év” – a hibás feltételek kimaradnak */
export declare function describeAudience(a: Audience, fields: ReadonlyArray<AudienceField>): string;
