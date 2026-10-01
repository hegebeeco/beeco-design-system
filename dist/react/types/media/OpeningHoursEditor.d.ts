import { type ReactNode } from 'react';
import { type OpeningHours } from './openingHours';
export type OpeningHoursEditorProps = {
    label?: string;
    /** Súgó (ⓘ): mire kell, hol látszik az appban – kötelező */
    help: ReactNode;
    value: OpeningHours;
    onChange: (value: OpeningHours) => void;
    disabled?: boolean;
    readOnly?: boolean;
};
/**
 * OpeningHoursEditor (organizmus, Javaslat 04 – 8A): soronként egy nap – kapcsoló (nyitva/zárva), nyitás–zárás, „Hétfő másolása a hétköznapokra”.
 * Ellenőrzés: a zárás a nyitás után legyen (legkésőbb 24:00); hiba a sor alatt, a következő lépéssel. Ma napi egy sáv, éjfél utáni zárás nélkül.
 */
export declare function OpeningHoursEditor({ label, help, value, onChange, disabled, readOnly }: OpeningHoursEditorProps): import("react").JSX.Element;
