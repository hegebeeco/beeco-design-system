import { type ReactNode } from 'react';
export type CropArea = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export type AspectPreset = {
    label: string;
    value: number;
};
export type ImageCropperProps = {
    /** A kép (objectURL vagy URL) */
    src: string;
    /** Választható képarányok; ha csak egy van (a projekt rögzíti), a választó nem látszik */
    aspects?: readonly AspectPreset[];
    minZoom?: number;
    maxZoom?: number;
    /** A kivágott terület (a kép eredeti képpontjaiban) – minden mozdulat végén */
    onCrop: (area: CropArea, info: {
        zoom: number;
        aspect: AspectPreset;
    }) => void;
    /** Ha a kivágás ennél keskenyebb (px), figyelmeztet: „a kép homályos lehet” */
    minOutputWidth?: number;
    /** Súgó a nagyítás csúszkához (mire kell a kép) */
    zoomHelp?: ReactNode;
    /** Súgó a képarányhoz */
    aspectHelp?: ReactNode;
};
/**
 * ImageCropper (organizmus, Javaslat 04 – 3A): a react-easy-crop DS-burokban.
 * Húzás és csípés (érintés), görgő; billentyűzet: a keret a nyilakkal mozog, + / − nagyít; csúszka súgóval és tartománnyal; „Alaphelyzet”.
 */
export declare function ImageCropper({ src, aspects, minZoom, maxZoom, onCrop, minOutputWidth, zoomHelp, aspectHelp }: ImageCropperProps): import("react").JSX.Element;
