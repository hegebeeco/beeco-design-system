import { type ClipboardEvent, type FormEvent } from 'react';
/**
 * Élő karakterszámláló + beillesztés-levágás jelzése szöveges mezőkhöz.
 * Vezérelt és nem vezérelt (react-hook-form register) módban is működik: a DOM-értéket olvassa.
 */
export declare function useLengthCounter<T extends HTMLInputElement | HTMLTextAreaElement>(maxLength?: number): {
    ref: import("react").RefObject<T | null>;
    len: number;
    notice: string | undefined;
    onInput: (e: FormEvent<T>) => void;
    onPaste: (e: ClipboardEvent<T>) => void;
};
