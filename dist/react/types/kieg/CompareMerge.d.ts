import { type ReactNode } from 'react';
import { type MergeFieldDef, type MergeRecord } from './merge';
export type CompareMergeProps = {
    /** Az összefésülendő rekordok (2 vagy több) */
    records: MergeRecord[];
    fields: MergeFieldDef[];
    /** Mezőnként melyik rekord értéke maradjon: { name: 'poi-1204' } */
    choices: Record<string, string>;
    onChoicesChange: (choices: Record<string, string>) => void;
    /** Melyik rekord marad meg (azonosító, kapcsolatok) – ha megadod, ezt is választani kell */
    survivor?: string;
    onSurvivorChange?: (id: string) => void;
    /** Az összefésülés; ígéretnél a gomb pörög, hiba esetén az ablak kiírja és újrapróbálható */
    onMerge: (result: Record<string, unknown>, choices: Record<string, string>) => void | Promise<void>;
    /** A megerősítő ablak következmény-mondata */
    consequence?: ReactNode;
    className?: string;
};
/**
 * CompareMerge (organizmus, Javaslat 06a/11): rekordok egymás mellett, mezőnként rádiós választás, eltérések kiemelve
 * (szöveggel is: „eltér”), javaslat a kitöltött értékekre, élő eredmény-előnézet, megerősítés.
 */
export declare function CompareMerge({ records, fields, choices, onChoicesChange, survivor, onSurvivorChange, onMerge, consequence, className }: CompareMergeProps): import("react").JSX.Element;
