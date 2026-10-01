import { type DrawParticipant, type DrawRecord } from './draw';
export type PrizeDrawRevealProps = {
    /** A nyeremény neve, pl. „2 db mozijegy” */
    prize: string;
    participants: ReadonlyArray<DrawParticipant>;
    /**
     * A projekt sorsolója (éleshez kötelező: szerveroldali, naplózott). Megkapja a húzható résztvevőket, visszaadja a nyertest.
     * Ha nincs megadva, a DS a böngésző kriptográfiai véletlenjével húz, és jól láthatóan „teszt-sorsolás”-nak jelöli.
     */
    draw?: (pool: ReadonlyArray<DrawParticipant>) => DrawParticipant | Promise<DrawParticipant>;
    /** Minden húzás után (első és újra) – mentsd a jegyzőkönyvbe */
    onDrawn?: (record: DrawRecord) => void;
    /** Újrasorsolás kérésekor, a húzás ELŐTT – az indokot naplózd */
    onReroll?: (r: {
        previous: DrawParticipant;
        reason: string;
    }) => void;
    /** Újrasorsolásnál a korábbi nyertesek kimaradnak (alap: igen) */
    excludePrevious?: boolean;
    /** Az újrasorsolás indokának legkisebb hossza (alap: 5 karakter) */
    minReasonLength?: number;
    /** A résztvevők még töltődnek */
    loading?: boolean;
    className?: string;
};
/**
 * PrizeDrawReveal (organizmus, Javaslat 06b/14): résztvevők száma → „Sorsolás” → rövid felfedés (≤ 2,5 s, csökkentett mozgásnál
 * azonnal) → nyertes Bajnok méhvel és hatszög-konfettivel → „Újrasorsolás” csak indokkal. A DS nem sorsol üzleti adatot,
 * ha a projekt ad sorsolót; nélküle teszt-sorsolás.
 */
export declare function PrizeDrawReveal({ prize, participants, draw, onDrawn, onReroll, excludePrevious, minReasonLength, loading, className }: PrizeDrawRevealProps): import("react").JSX.Element;
