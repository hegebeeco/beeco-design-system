/**
 * Trigger nélkül nyitott Radix Dialognál a Radix a (nem létező) triggerre adná vissza a fókuszt – elveszne.
 * Ez megjegyzi, mi volt fókuszban nyitáskor, és záráskor oda viszi vissza (ha az elem közben eltűnt: a tartalék elemre).
 */
export declare function useReturnFocus(open: boolean, fallback?: () => Element | null | undefined): (e: Event) => void;
