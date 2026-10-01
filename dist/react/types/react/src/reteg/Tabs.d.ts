import { type ReactNode } from 'react';
export type TabItem = {
    value: string;
    label: string;
    /** Számláló a fülön, pl. „Hibák 3” (a képernyőolvasó is mondja) */
    count?: number;
    disabled?: boolean;
    content: ReactNode;
};
export type TabsProps = {
    items: TabItem[];
    /** A fülsor neve a képernyőolvasónak, pl. „Analitika nézetei” */
    label: string;
    /** Vezérelt mód (pl. ?tab= az URL-ben) */
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
};
/** Számláló-jelvény a fül feliratán */
export declare function TabCount({ n }: {
    n: number;
}): import("react").JSX.Element;
/**
 * Tabs (molekula, Javaslat 03 – 6A): panelváltó ugyanazon az oldalon. Nyilak, Home/End (Radix, automatikus aktiválás).
 * Telefonon a sor görgethető, a széle halványul, a kijelölt fül a látható részbe gördül. Fülváltást nem animálunk.
 * Útvonalat váltó fülsorhoz a NavTabs kell (linkek, aria-current).
 */
export declare function Tabs({ items, label, value, defaultValue, onValueChange }: TabsProps): import("react").JSX.Element;
