import { type ReactNode } from 'react';
import { type Audience, type AudienceField } from './audience';
export type AudienceEstimate = {
    /** Becsült létszám (a hívó számolja, pl. a szerver előnézeti hívásából); null = még nincs */
    count: number | null;
    loading?: boolean;
    /** Ha nem sikerült becsülni: rövid ok + teendő */
    error?: string;
};
export type AudienceBuilderProps = {
    fields: ReadonlyArray<AudienceField>;
    value: Audience;
    onChange: (value: Audience) => void;
    estimate?: AudienceEstimate;
    /** Legfeljebb ennyi feltétel (alap 10) */
    maxRules?: number;
    /** Minden hiba látsszon (pl. mentési kísérlet után); különben feltételenként az első kilépés után */
    showErrors?: boolean;
    /** Súgó: mire jó a célcsoport, mi történik, ha üres */
    help?: ReactNode;
    label?: string;
    disabled?: boolean;
    className?: string;
};
/**
 * AudienceBuilder (organizmus, Javaslat 06a/10): „ha … és/vagy …” szabálysorok (mező · feltétel · érték),
 * élő létszám-becslés (a hívó adja), üres és hibás szabály jelzése, legfeljebb maxRules feltétel (számlálóval).
 */
export declare function AudienceBuilder({ fields, value, onChange, estimate, maxRules, showErrors, label, help, disabled, className }: AudienceBuilderProps): import("react").JSX.Element;
