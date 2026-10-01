import { type FieldProps } from '../field/Field';
export type DatePickerProps = FieldProps & {
    /** 'YYYY-MM-DD' (helyi nap) vagy null */
    value: string | null;
    onChange: (iso: string | null) => void;
    min?: string;
    max?: string;
    /** Időpont is (HH:mm) – külön mező a nap mellett */
    time?: {
        value: string | null;
        onChange: (hhmm: string | null) => void;
        label?: string;
    };
};
/** Tartomány szövege a határokból: „2026. 10. 01. után”, „2026. 10. 01. – 2026. 12. 31.” */
export declare const dateRangeText: (min?: string, max?: string) => string;
/** DatePicker (molekula, Javaslat 01 – 2A): gépelhető mező + lenyíló naptár (+ időpont). Tartományon kívüli nap nem választható. */
export declare function DatePicker({ value, onChange, min, max, time, range, notice, ...field }: DatePickerProps): import("react").JSX.Element;
