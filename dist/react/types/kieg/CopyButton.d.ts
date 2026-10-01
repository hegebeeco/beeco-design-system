export type CopyButtonProps = {
    /** Amit a vágólapra teszünk */
    value: string;
    /** Mit másol (a képernyőolvasó és a felirat ezt mondja): „kuponkód”, „partner-azonosító”, „link” */
    what: string;
    /** button = „Másolás” felirattal (alap) · icon = 44×44 ikongomb (táblázatsorban) */
    variant?: 'button' | 'icon';
    /** Az érték is látsszon a gomb előtt (pl. kuponkód kódbetűvel) */
    showValue?: boolean;
    disabled?: boolean;
    className?: string;
};
/** Vágólapra írás: modern API, ha nem megy (nem biztonságos oldal, régi WebView), a régi execCommand-módszer */
export declare function copyText(text: string): Promise<boolean>;
/**
 * CopyButton (atom, Javaslat 06a/2): másol + „Másolva” pipa (05: mentve-pipa) + képernyőolvasó-bejelentés.
 * Ha a böngésző nem enged másolni: kijelölt, csak olvasható mező jelenik meg az értékkel – kézzel másolható.
 */
export declare function CopyButton({ value, what, variant, showValue, disabled, className }: CopyButtonProps): import("react").JSX.Element;
