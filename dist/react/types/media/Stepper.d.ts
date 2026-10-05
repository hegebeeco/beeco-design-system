export type StepState = 'todo' | 'current' | 'done' | 'error';
export type Step = {
    id: string;
    label: string;
    state: StepState;
    /** Javaslat 20: választható-e (onSelect mellett). Alap: a kész és a hibás lépés – a mostani soha. */
    reachable?: boolean;
};
export type StepperProps = {
    /** Mit mutat (képernyőolvasónak), pl. „Videófeltöltés lépései” */
    label: string;
    steps: readonly Step[];
    /**
     * Javaslat 20 – kattintható lépésjelző: a bejárt (reachable) lépés gomb, erre a lépésre vált. A látható pirula mérete nem
     * változik, az érintési felület 44 px. Nélküle a jelző csak mutat (mint eddig).
     */
    onSelect?: (index: number, step: Step) => void;
    className?: string;
};
/**
 * Stepper (molekula): lépésjelző – fájl → feltöltés → feldolgozás → kész.
 * Az állapotot a jel (szám / pipa / ×) ÉS a képernyőolvasó-szöveg is mondja, nem csak a szín.
 * onSelect-tel kattintható (Javaslat 20): a bejárt lépés gomb, a mostani aria-current="step".
 */
export declare function Stepper({ label, steps, onSelect, className }: StepperProps): import("react").JSX.Element;
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
