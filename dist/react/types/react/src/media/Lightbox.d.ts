import type { GalleryImage } from './GalleryTile';
export type LightboxProps = {
    images: readonly GalleryImage[];
    /** A megnyitott kép indexe; null = zárva */
    index: number | null;
    onIndexChange: (index: number | null) => void;
};
/**
 * Lightbox (organizmus): nagyító sötét háttérrel. ← → billentyű (és telefonon húzás) lapoz, Esc zár,
 * „3/12” számláló, alul a képleírás. Fókuszcsapda és a fókusz visszaállítása a Radix Dialogé.
 */
export declare function Lightbox({ images, index, onIndexChange }: LightboxProps): import("react").JSX.Element;
