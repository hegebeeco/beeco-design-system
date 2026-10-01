/** Feliratsáv (WebVTT) */
export type CaptionTrack = {
    src: string;
    srclang: string;
    label: string;
    default?: boolean;
};
export type VideoPlayerProps = {
    /** A videó címe – a lejátszó akadálymentes neve (kötelező) */
    title: string;
    /** Videófájl címe. Amíg nincs (pl. aláírt link készül), a lejátszó töltést mutat. */
    src?: string;
    poster?: string;
    captions?: ReadonlyArray<CaptionTrack>;
    /** Ha nincs felirat, szóljon-e a lejátszó alatt (szerkesztőfelületen hasznos; alap: igen) */
    warnNoCaptions?: boolean;
    onError?: (code: number) => void;
    className?: string;
};
/**
 * VideoPlayer (organizmus, Javaslat 06b/15): natív <video> a böngésző saját vezérlőivel + poszter, feliratsávok,
 * billentyűk (Szóköz/K lejátszás–szünet, ←/→ 5 mp, M némítás), töltés és hiba állapot újrapróbálással.
 */
export declare function VideoPlayer({ title, src, poster, captions, warnNoCaptions, onError, className }: VideoPlayerProps): import("react").JSX.Element;
