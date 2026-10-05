/**
 * Nyomtatható oldal (Javaslat 20): amíg a komponens látszik, a <html> `bc-print-page` osztályt kap – nyomtatáskor (és PDF-be
 * mentéskor) a keret (oldalsáv, felső sáv, ugrólink, értesítések), a vezérlők (súgógombok, az eszközsor vezérlői – a szövege
 * marad, Javaslat 21 –, oldalfej-gombok, `.bc-print-hide`) rejtve, a `.bc-print-show` csak papíron látszik, a kártyák nem törnek ketté (bc-sablon.css). A lap MINDIG világos témában megy a papírra:
 * a beforeprint előtt a téma világosra vált, az afterprint után visszaáll (sötét módban a világos betű fehér lapon olvashatatlan).
 */
export declare function usePrintFrame(enabled?: boolean): void;
