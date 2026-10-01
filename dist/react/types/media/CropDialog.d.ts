import { type CropArea } from './ImageCropper';
/** Vágás a feltöltés előtt (ImageUploader `crop`): egy rögzített képarány, a projekt nevezi meg */
export type UploadCrop = {
    /** Képarány, pl. 1 (logó) vagy 4 / 3 (háttérkép) */
    aspect: number;
    /** A képarány neve a felületen: „1:1”, „4:3” */
    aspectLabel: string;
    /** Mire kell ez a kivágás – az ablak leírásában: „A logó kör alakú keretben jelenik meg az appban.” */
    why?: string;
    /** Ha a kivágás ennél keskenyebb (px), figyelmeztet */
    minOutputWidth?: number;
};
/** A kivágott terület új fájlként (a név marad; PNG és WebP marad, minden más JPG) */
export declare function cropToFile(file: File, src: string, area: CropArea): Promise<File>;
type Props = {
    /** A soron következő fájl (null = zárva) */
    file: File | null;
    crop: UploadCrop;
    /** Hányadik a sorban: „2/3” – több fájl egyszerre */
    position?: string;
    onDone: (cropped: File) => void;
    onSkip: (file: File) => void;
};
/** CropDialog (organizmus, Javaslat 07): a feltöltő vágó-ablaka. Mégse = ez a kép kimarad, a többi megy tovább. */
export declare function CropDialog({ file, crop, position, onDone, onSkip }: Props): import("react").JSX.Element;
export {};
