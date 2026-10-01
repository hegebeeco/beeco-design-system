import { type VideoSource } from './videoUrl';
import { type CaptionTrack } from './VideoPlayer';
type Embeddable = Extract<VideoSource, {
    kind: 'youtube' | 'vimeo';
}>;
export type VideoEmbedProps = {
    source: Embeddable;
    title: string;
    className?: string;
};
/**
 * Beágyazott videó KATTINTÁSRA (06b/15, adatvédelem): kattintás előtt egyetlen kérés sem megy a YouTube/Vimeo felé
 * (előnézeti kép sem – az is harmadik féltől jönne). Kattintás után a lejátszó betölt, és elindul.
 */
export declare function VideoEmbed({ source, title, className }: VideoEmbedProps): import("react").JSX.Element;
export type VideoPreviewProps = {
    url: string;
    title: string;
    poster?: string;
    captions?: ReadonlyArray<CaptionTrack>;
    className?: string;
};
/**
 * VideoPreview (06b/15): egy beírt/beillesztett link előnézete – saját fájl → VideoPlayer, YouTube/Vimeo → kattintásra betöltő
 * beágyazás, üres → útmutatás, hibás/nem támogatott → mi a baj és mi a teendő.
 */
export declare function VideoPreview({ url, title, poster, captions, className }: VideoPreviewProps): import("react").JSX.Element;
export {};
