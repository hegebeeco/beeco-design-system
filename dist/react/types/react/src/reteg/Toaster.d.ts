export type ToasterProps = {
    /** A régió neve a képernyőolvasónak */
    label?: string;
};
/**
 * Toaster (molekula, Javaslat 03 – 8A): egyszer az alkalmazás gyökerében. Hívás: notify.success('Kupon mentve.', { action }).
 * Asztalon jobb fent, telefonon (≤ 600 px) lent középen. Siker/info/figyelmeztetés 5 mp, hiba marad (bezárás gombbal).
 * Rámutatásra és fókuszra megáll. Képernyőolvasó: hiba role="alert" (assertive), a többi role="status" (polite).
 * Mezőhiba (pl. túl nagy kép) NEM ide való – a mező alá.
 */
export declare function Toaster({ label }: ToasterProps): import("react").JSX.Element;
