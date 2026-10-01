import { type ReactNode } from 'react';
import type { GalleryImage } from './GalleryTile';
export declare const ALT_MAX = 150;
export declare const ALT_HELP = "Mondd el egy mondatban, mi l\u00E1tszik a k\u00E9pen \u2013 ezt olvassa fel a k\u00E9perny\u0151olvas\u00F3, \u00E9s ez jelenik meg, ha a k\u00E9p nem t\u00F6lt be. Pl. \u201EA k\u00E1v\u00E9z\u00F3 terasza ny\u00E1ron, vir\u00E1gl\u00E1d\u00E1kkal\u201D. Ne a f\u00E1jlnevet \u00EDrd.";
/** Képleírás (alt) szerkesztése – kötelező, 3–150 karakter; üresen nem menthető */
export declare function AltDialog({ img, help, onSave, onClose, fallback }: {
    img: GalleryImage | null;
    help?: ReactNode;
    onSave: (alt: string) => void;
    onClose: () => void;
    fallback?: () => Element | null | undefined;
}): import("react").JSX.Element;
/** Törlés megerősítése – a kép kicsiben látszik, hogy biztosan a jót töröld */
export declare function DeleteDialog({ img, onConfirm, onClose, fallback }: {
    img: GalleryImage | null;
    onConfirm: () => void;
    onClose: () => void;
    fallback?: () => Element | null | undefined;
}): import("react").JSX.Element;
