import type { ReactNode } from 'react';
/** FormSection (organizmus): cím + rövid leírás + mezőrács egy kártyán; hosszú űrlap tagolására. */
export declare function FormSection({ title, description, children, className }: {
    title: string;
    description?: ReactNode;
    children: ReactNode;
    className?: string;
}): import("react").JSX.Element;
/** FormActions (molekula): a jobb oldalon a fő művelet, előtte a mégse; telefonon egymás alatt, teljes szélességben. */
export declare function FormActions({ children, className }: {
    children: ReactNode;
    className?: string;
}): import("react").JSX.Element;
