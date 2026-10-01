import { type LatLng } from './geo';
/**
 * Tartalék mini-térkép (06b/13): ha a projekt nem ad térképet (renderMap), ez mutatja, nagyjából hol a pont.
 * Statikus SVG, hálózati kérés nélkül: Magyarország vázlatos körvonala + tű. Díszítő-tájékoztató, nem kattintható.
 */
export declare function MiniMap({ point }: {
    point: LatLng | null;
}): import("react").JSX.Element;
