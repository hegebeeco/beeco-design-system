import { type ReactNode } from 'react';
export type StageDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** A színpad címe (h2 – a képernyőolvasó ezzel mutatja be) */
    title: ReactNode;
    /**
     * Bezárható-e most. Ha false (pl. sorsolás, animáció közben): az Esc és a ✕ nem zár, a ✕ tiltott.
     * A felhasználó nem akadhat bent: a projekt a folyamat végén állítsa vissza true-ra.
     */
    closable?: boolean;
    /** Élő bejelentés a képernyőolvasónak (role=status, udvarias): pl. „Sorsolás folyamatban…”, majd „1. nyertes: …” */
    announce?: string;
    /** Teljes képernyő (Fullscreen API) nyitáskor – ha a böngésző engedi; bezáráskor csak a saját kérését engedi el */
    fullscreen?: boolean;
    closeLabel?: string;
    className?: string;
    children?: ReactNode;
};
/**
 * StageDialog (organizmus, Javaslat 13/3): teljes képernyős bemutató-réteg (pl. sorsolás kivetítőn, eredményhirdetés).
 * Radix Dialog: fókuszcsapda, Esc, a háttér nem görög, a fókusz visszatér a nyitó elemre. A ✕ jobb felül, 44 px.
 * Folyamat közben a `closable={false}` zárja le; az `announce` élő régióban mondja a képernyőolvasónak, mi történik.
 * Mozgás a projekté – csökkentett mozgásnál a színpad maga nem animál.
 */
export declare function StageDialog({ open, onOpenChange, title, closable, announce, fullscreen, closeLabel, className, children }: StageDialogProps): import("react").JSX.Element;
