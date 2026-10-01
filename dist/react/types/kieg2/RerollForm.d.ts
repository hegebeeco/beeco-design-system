export type RerollFormProps = {
    /** Ki volt az előző nyertes (a kérdésben megnevezzük) */
    previous: string;
    minLength: number;
    maxLength?: number;
    onConfirm: (reason: string) => void;
    onCancel: () => void;
};
/**
 * Újrasorsolás indoklása (06b/14): az ok kötelező, mert a jegyzőkönyvbe kerül (onReroll naplózza).
 * Szóvicc itt nincs – ez döntés, nem ünnep (Javaslat 05: 4A).
 */
export declare function RerollForm({ previous, minLength, maxLength, onConfirm, onCancel }: RerollFormProps): import("react").JSX.Element;
