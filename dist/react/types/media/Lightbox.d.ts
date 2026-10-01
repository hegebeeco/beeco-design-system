import type { GalleryImage } from './GalleryTile';
export type LightboxProps = {
    images: readonly GalleryImage[];
    /** A megnyitott kép indexe; null = zárva */
    index: number | null;
    onIndexChange: (index: number | null) => void;
    /** Hova menjen a fókusz záráskor, ha a nyitó elem már nincs meg (pl. menüből nyitották) */
    returnFocus?: () => Element | null | undefined;
};
/**
 * Lightbox (organizmus): nagyító sötét háttérrel. ← → billentyű (és telefonon húzás) lapoz, Esc zár,
 * „3/12” számláló, alul a képleírás. Fókuszcsapda és a fókusz visszaállítása a Radix Dialogé.
 */
export declare function Lightbox({ images, index, onIndexChange, returnFocus }: LightboxProps): import("react").JSX.Element;
