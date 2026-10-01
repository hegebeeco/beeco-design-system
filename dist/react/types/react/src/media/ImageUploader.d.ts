import { type ReactNode } from 'react';
import { type UploadFn } from './files';
import type { GalleryImage } from './GalleryTile';
export type ImageUploaderProps = {
    label: string;
    /** Súgó (ⓘ): mire kell a kép, hol jelenik meg az appban – kötelező */
    help: ReactNode;
    images: readonly GalleryImage[];
    onChange: (images: GalleryImage[]) => void;
    /** A projekt feltöltője: haladást jelez, megszakítható, a kész képet adja vissza (alt nélkül is lehet) */
    upload: UploadFn<GalleryImage>;
    /** Engedett típusok (MIME) – a tartalmat nézzük, nem a kiterjesztést. Alap: JPG, PNG, WebP */
    accept?: readonly string[];
    maxSizeMB?: number;
    maxCount?: number;
    ordering?: boolean;
    confirmDelete?: (img: GalleryImage) => boolean | Promise<boolean>;
    altHelp?: ReactNode;
    /** Mit tegyen, ha a fájl túl nagy (a projekt pontosíthatja) */
    sizeHint?: string;
    required?: boolean;
    disabled?: boolean;
    /** Csak nézhető: nincs feltöltés, menü, húzás */
    readOnly?: boolean;
    error?: string;
};
/**
 * ImageUploader (organizmus, Javaslat 04 – 1A): a galéria-rácsba épülő „+ Kép” csempe.
 * Húzás-ejtés az egész rácsra, fájlválasztó, billentyűzet (a csempe egy <label>, benne a natív fájlmező).
 * A hibás fájl el sem indul; az ok és a teendő a mező alatt marad, amíg be nem zárod.
 */
export declare function ImageUploader({ label, help, images, onChange, upload, accept, maxSizeMB, maxCount, ordering, confirmDelete, altHelp, sizeHint, required, disabled, readOnly, error }: ImageUploaderProps): import("react").JSX.Element;
