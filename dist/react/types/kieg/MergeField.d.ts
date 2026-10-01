import { type MergeFieldDef, type MergeRecord } from './merge';
type Props = {
    field: MergeFieldDef;
    records: MergeRecord[];
    chosen?: string;
    onChoose: (recordId: string) => void;
    /** Kötelező mező üres értékét választották */
    error?: string;
};
/** Egy eltérő mező: rádiócsoport, rekordonként egy kártya-opció (a nyilak a rádiók között léptetnek). */
export declare function MergeFieldChoice({ field, records, chosen, onChoose, error }: Props): import("react").JSX.Element;
export {};
