import { type ReactNode } from 'react';
export type ReviewDecision = {
    type: 'approve' | 'reject' | 'skip';
    reason?: string;
};
export type ReviewQueueProps<T> = {
    items: ReadonlyArray<T>;
    getId: (item: T) => string;
    /** Az elem címe (fejléc és bejelentés): „Zöld Sarok Bolt” */
    getTitle: (item: T) => string;
    /** Az elem nagyban – a hívó rajzolja (adatok, kép, hiba-okok) */
    render: (item: T) => ReactNode;
    /** A döntés mentése; ígéretnél a gombok várnak, hiba esetén az elem marad és újrapróbálható */
    onDecide: (item: T, decision: ReviewDecision) => void | Promise<void>;
    /** Visszavonás (az utolsó döntés) – ha nincs, nincs visszavonás gomb */
    onUndo?: (item: T, decision: ReviewDecision) => void | Promise<void>;
    /** Gyakori elutasítási okok */
    reasons?: ReadonlyArray<string>;
    label?: string;
    className?: string;
};
/**
 * ReviewQueue (organizmus, Javaslat 06a/12): egy elem nagyban, jóváhagy (J) / elutasít indokkal (E) / kihagy (K),
 * haladás „12/40”, visszavonás. A billentyűk akkor élnek, ha a fókusz a sorban van (vagy sehol, és ez az első sor),
 * nem mezőbe gépelsz, és nincs nyitott ablak.
 */
export declare function ReviewQueue<T>({ items, getId, getTitle, render, onDecide, onUndo, reasons, label, className }: ReviewQueueProps<T>): import("react").JSX.Element;
