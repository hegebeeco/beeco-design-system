/** A Field által a benne lévő mezőnek átadott azonosítók és állapot (aria-összekötés). */
export type FieldCtx = {
    id: string;
    describedBy: string | undefined;
    invalid: boolean;
    required: boolean;
    disabled: boolean;
};
export declare const FieldContext: import("react").Context<FieldCtx | null>;
export declare const useFieldContext: () => FieldCtx | null;
