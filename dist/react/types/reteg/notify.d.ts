export type ToastKind = 'success' | 'error' | 'info' | 'warning';
export type ToastAction = {
    label: string;
    onClick: () => void;
};
export type ToastOptions = {
    /** Pl. { label: 'Visszavonás', onClick: undo } – visszafordítható műveletnél megerősítés helyett */
    action?: ToastAction;
    /** Ennyi ms után tűnik el (alap 5000; hibánál soha – Infinity) */
    duration?: number;
};
export type Toast = {
    id: string;
    kind: ToastKind;
    message: string;
    action?: ToastAction;
    count: number;
    leaving?: boolean;
};
export declare const subscribe: (l: () => void) => () => void;
export declare const getToasts: () => Toast[];
/** Bezárás (id nélkül: mind) */
export declare function dismiss(id?: string): void;
/** Rámutatás / fókusz: minden visszaszámlálás megáll, utána folytatódik (a maradék idővel) */
export declare function pauseToasts(on: boolean): void;
export declare const notify: {
    success: (message: string, opts?: ToastOptions) => string;
    error: (message: string, opts?: ToastOptions) => string;
    info: (message: string, opts?: ToastOptions) => string;
    warning: (message: string, opts?: ToastOptions) => string;
    dismiss: typeof dismiss;
};
