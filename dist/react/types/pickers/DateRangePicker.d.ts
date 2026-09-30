import { type FieldProps } from '../field/Field';
export type DateRange = {
    start: string | null;
    end: string | null;
};
export type DateRangePickerProps = FieldProps & {
    value: DateRange;
    onChange: (r: DateRange) => void;
    min?: string;
    max?: string;
};
/** DateRangePicker (molekula, 2A időszak): első kattintás = kezdet, második = vég; fordított sorrendnél megcseréli és szól. */
export declare function DateRangePicker({ value, onChange, min, max, range, notice, ...field }: DateRangePickerProps): import("react").JSX.Element;
