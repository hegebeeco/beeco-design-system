import { type DrawParticipant } from './draw';
/**
 * A pörgetés színpada (06b/14): a méhsejt-sor celláit sorban megtölti a méz, közben a szalagon lassulva váltják egymást a nevek.
 * A nevek itt csak látvány – a nyertest a sorsoló adja. Képernyőolvasó csak a végeredményt hallja (a szalag aria-hidden).
 */
export declare function DrawSpinner({ step, name, waiting }: {
    step: number;
    name: string;
    waiting: boolean;
}): import("react").JSX.Element;
export type WinnerCardProps = {
    winner: DrawParticipant;
    prize: string;
    test: boolean;
    attempt: number;
    animate: boolean;
};
/** A nyertes kártyája: Bajnok méh + pecsét-megjelenés (egyszer) + a nyeremény. Szóvicc csak a méhes címben, sima jelentéssel. */
export declare const WinnerCard: import("react").ForwardRefExoticComponent<WinnerCardProps & import("react").RefAttributes<HTMLHeadingElement>>;
