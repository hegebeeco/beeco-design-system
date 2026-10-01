export type StepState = 'todo' | 'current' | 'done' | 'error';
export type Step = {
    id: string;
    label: string;
    state: StepState;
};
export type StepperProps = {
    /** Mit mutat (képernyőolvasónak), pl. „Videófeltöltés lépései” */
    label: string;
    steps: readonly Step[];
    className?: string;
};
/**
 * Stepper (molekula): lépésjelző – fájl → feltöltés → feldolgozás → kész.
 * Az állapotot a jel (szám / pipa / ×) ÉS a képernyőolvasó-szöveg is mondja, nem csak a szín.
 */
export declare function Stepper({ label, steps, className }: StepperProps): import("react").JSX.Element;
/** Lépések állapota egy aktuális lépés-indexből (+ opcionális hiba azon a lépésen) */
export declare function stepsFrom(labels: readonly {
    id: string;
    label: string;
}[], current: number, failed?: boolean): Step[];
export type ProgressProps = {
    value: number;
    max: number;
    label: string;
    valueText?: string;
    className?: string;
};
/** Haladásjelző sáv (role="progressbar"); a szöveges állapotot (pl. „2,1/5 MB”) a hívó írja mellé. */
export declare function Progress({ value, max, label, valueText, className }: ProgressProps): import("react").JSX.Element;
