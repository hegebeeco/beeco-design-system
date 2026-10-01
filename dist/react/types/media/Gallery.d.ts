import { type DragEvent, type ReactNode } from 'react';
import { type GalleryImage } from './GalleryTile';
export type GalleryProps = {
    /** A képek sorrendben; ha a sorrend be van kapcsolva, az ELSŐ a borító */
    images: readonly GalleryImage[];
    /** Változás (sorrend, borító, leírás, törlés) – nélküle a galéria csak nézhető */
    onChange?: (images: GalleryImage[]) => void;
    /** Borító + sorrend (húzás és menü). Alap: be. Ha az app nem használja a sorrendet: false */
    ordering?: boolean;
    /** Törlés előtt: a projekt saját megerősítése (true = törölhető). Ha nincs, a DS kérdez rá. */
    confirmDelete?: (img: GalleryImage) => boolean | Promise<boolean>;
    /** A képleírás súgójának szövege (mire kell, hol jelenik meg az appban) */
    altHelp?: ReactNode;
    /** false: a leírás (alt) csak olvasható – nincs menüpont és „Leírás kell” jelzés (ha a backend nem tárolja) */
    altEditable?: boolean;
    /** A lista neve képernyőolvasónak, pl. „Képek” */
    label?: string;
    /** További csempék a rács végén (a feltöltő ide teszi a töltődő képeket és a „+ Kép” csempét) */
    children?: ReactNode;
    className?: string;
    /** A rácsra húzott FÁJL (nem a saját csempe) – a feltöltő kezeli */
    onFileDrag?: {
        over: (e: DragEvent) => void;
        leave: (e: DragEvent) => void;
        drop: (e: DragEvent) => void;
    };
};
/** Gallery (organizmus, Javaslat 04 – 2A): rács, borító, sorrend húzással és menüből, szerkeszthető alt, törlés, nagyító. */
export declare function Gallery({ images, onChange, ordering, confirmDelete, altHelp, altEditable, label, children, className, onFileDrag }: GalleryProps): import("react").JSX.Element;
