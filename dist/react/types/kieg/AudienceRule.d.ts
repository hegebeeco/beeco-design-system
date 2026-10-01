import { type AudienceField, type AudienceRule } from './audience';
type Props = {
    rule: AudienceRule;
    n: number;
    fields: ReadonlyArray<AudienceField>;
    onChange: (r: AudienceRule) => void;
    onRemove: () => void;
    onBlur: () => void;
    error?: string;
    disabled?: boolean;
};
/** Egy szabálysor: mező · feltétel · érték · törlés. A mező váltásakor a feltétel és az érték alapra áll. */
export declare function AudienceRuleRow({ rule, n, fields, onChange, onRemove, onBlur, error, disabled }: Props): import("react").JSX.Element;
export {};
