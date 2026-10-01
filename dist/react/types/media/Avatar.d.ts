export type AvatarProps = {
    /** A személy vagy cég neve – ebből a monogram és a kép alt-ja */
    name: string;
    src?: string | null;
    size?: 24 | 32 | 40 | 64;
    /** Cégnek lekerekített négyzet */
    shape?: 'circle' | 'square';
    /** Díszítő helyen (a név mellette ki van írva): üres alt, a képernyőolvasó átugorja */
    decorative?: boolean;
    className?: string;
};
/** Monogram: két szóból a két kezdőbetű (ékezettel: „Kovács Ádám” → „KÁ”), egy szóból az első (kettős) betű */
export declare function initials(name: string): string;
/** Avatar (atom): kép, ha van és betölt; különben monogram. Méretek: 24 / 32 / 40 / 64 px. */
export declare function Avatar({ name, src, size, shape, decorative, className }: AvatarProps): import("react").JSX.Element;
