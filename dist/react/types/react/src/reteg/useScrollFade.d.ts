/**
 * Vízszintesen görgethető sor (fülek) halványuló széle: a burok data-fade-start / data-fade-end jelzést kap,
 * ha arra van még tartalom. A kijelölt elem (selector) magától a látható részbe gördül.
 */
export declare function useScrollFade<T extends HTMLElement>(selected: string, dep: unknown): import("react").RefObject<T | null>;
