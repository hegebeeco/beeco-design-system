type Props = {
    /** Gyakori okok (rádió); ha nincs, csak a szabad szöveg */
    reasons?: ReadonlyArray<string>;
    busy?: boolean;
    onSubmit: (reason: string) => void;
    onCancel: () => void;
};
/**
 * Elutasítás indokkal (a ReviewQueue része): gyakori ok VAGY legalább 10 karakteres saját indoklás kötelező.
 * Ctrl/⌘+Enter elküldi, Esc visszalép; nyitáskor a fókusz az első választásra kerül.
 */
export declare function ReviewReject({ reasons, busy, onSubmit, onCancel }: Props): import("react").JSX.Element;
export {};
