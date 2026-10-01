import { type ReactNode } from 'react';
/** Csökkentett mozgás kérve? (rendszerbeállítás) */
export declare function useReducedMotion(): boolean;
/** Szám-felpörgés: első megjelenéskor 600 ms alatt (ease-out), később érték-váltáskor azonnal (késés nélkül). Csökkentett mozgásnál azonnal. */
export declare function useCountUp(value: number, ms?: number): number;
/** Stagger: a gyerekek egymás után úsznak be (30 ms késés, legfeljebb 6-ig). Csak első megjelenéskor – szűrésnél ne használd újra. */
export declare function Stagger({ children, as: Tag, className }: {
    children: ReactNode;
    as?: 'div' | 'ul' | 'ol' | 'tbody';
    className?: string;
}): import("react").JSX.Element;
/** Hatszög-konfetti (mérföldkő – ritkán!): 14 méz-hatszög a megadott elem közepéből, 600 ms, aztán eltűnik. */
export declare function celebrate(from?: Element | null): void;
/** Kíméletes „nem jó” rázás egy elemen (pl. hibás beküldésnél az űrlap), 240 ms. */
export declare function shake(el?: Element | null): void;
/** Mézsejt-töltő: rövid töltéshez; 10 mp után megáll (a hívó ekkor írja ki a „toltes-hosszu” mondatot). */
export declare function HexLoader({ label }: {
    label?: string;
}): import("react").JSX.Element;
/** Csíkos haladásjelző (0–1). A felirat mindig szöveggel is mondja (pl. „2,1/5 MB”). */
export declare function ProgressBar({ value, label, moving }: {
    value: number;
    label: string;
    moving?: boolean;
}): import("react").JSX.Element;
