/**
 * Egy URL-paraméter állapotként (router nélkül is), pl. az oldalpanel saját URL-je: ?reszlet=123.
 * Beállítás → új history-bejegyzés (a böngésző Vissza gombja bezárja a panelt); null → visszalép / törli.
 * React Routerrel inkább a useSearchParams-t használd – az API ugyanilyen alakú.
 */
export declare function useQueryParam(name: string): [string | null, (value: string | null) => void];
