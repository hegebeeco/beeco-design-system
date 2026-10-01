export type SparklineProps = {
    values: Array<number | null>;
    /** Ha önállóan áll (nem StatTile-ban), a képernyőolvasónak – alapból díszítés (a szám mellette áll) */
    label?: string;
    className?: string;
};
/** Sparkline (atom): irány tengely nélkül, a StatTile száma mellett – soha egyedül. Hiány = szakadás; az utolsó pont kiemelve. */
export declare function Sparkline({ values, label, className }: SparklineProps): import("react").JSX.Element | null;
