import type { ReactNode } from 'react';
export type AccordionItem = {
    value: string;
    title: ReactNode;
    content: ReactNode;
    disabled?: boolean;
};
type Common = {
    items: AccordionItem[];
    /** A fejlécek címszintje (az oldal címrendjéhez igazítva) */
    headingLevel?: 2 | 3 | 4;
};
export type AccordionProps = (Common & {
    type?: 'single';
    defaultValue?: string;
    value?: string;
    onValueChange?: (v: string) => void;
}) | (Common & {
    type: 'multiple';
    defaultValue?: string[];
    value?: string[];
    onValueChange?: (v: string[]) => void;
});
/**
 * Accordion / lenyitható (molekula, Javaslat 03 – 10): pl. partner-adatlap szakaszai, „Hogyan olvasd?”.
 * Radix: Enter/Szóköz nyit-zár, nyilak a fejlécek között, aria-expanded + aria-controls.
 * single: egyszerre egy nyitva (újra kattintva bezárható) · multiple: több is nyitva lehet.
 */
export declare function Accordion(props: AccordionProps): import("react").JSX.Element;
export {};
