import type { DragEvent } from 'react';
export type GalleryImage = {
    id: string;
    src: string;
    /** Képleírás (alt) – kötelező; üresen a csempe jelzi, hogy hiányzik */
    alt: string;
};
export type TileAction = 'open' | 'cover' | 'back' | 'forward' | 'alt' | 'delete';
type Props = {
    img: GalleryImage;
    index: number;
    count: number;
    /** Borító + sorrend bekapcsolva */
    ordering: boolean;
    editable: boolean;
    /** false: a leírás csak olvasható (nincs menüpont, nincs „Leírás kell”) */
    altEditable?: boolean;
    dragging: boolean;
    dropTarget: boolean;
    onAction: (a: TileAction) => void;
    onDragStart: (e: DragEvent) => void;
    onDragEnd: () => void;
    onDragOver: (e: DragEvent) => void;
    onDrop: (e: DragEvent) => void;
};
/**
 * Egy galéria-csempe: a kép gomb (nagyítót nyit), sarokban „Borító” jelvény és ⋯ menü.
 * A menü a húzás billentyűzetes és érintéses párja: Előre / Hátra / Legyen a borító.
 */
export declare function GalleryTile({ img, index, count, ordering, editable, altEditable, dragging, dropTarget, onAction, onDragStart, onDragEnd, onDragOver, onDrop }: Props): import("react").JSX.Element;
export {};
