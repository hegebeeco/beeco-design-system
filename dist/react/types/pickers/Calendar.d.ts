export type CalendarProps = {
    /** Kijelölt nap(ok): egy nap, vagy időszak két vége */
    selected: {
        start: string | null;
        end?: string | null;
    };
    onPick: (iso: string) => void;
    min?: string;
    max?: string;
};
/** Havi naptár (rács, role="grid"): nyilak = nap/hét, PageUp/Down = hónap, Home/End = hét eleje/vége, Enter = választ. */
export declare function Calendar({ selected, onPick, min, max }: CalendarProps): import("react").JSX.Element;
