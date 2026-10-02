/**
 * Az AppShell telefonos fiókjának bezárása a keret belsejéből (pl. a ShellAccount menüpontjaiból). Ha egy menüpont ablakot
 * nyit, a nyitva maradó, modális fiók a fókuszt magánál tartaná – az új ablakba nem lehetne írni (1.34.1, PARTNERAPP e2e).
 * Keret nélkül (tesztlap, önálló használat) nem csinál semmit.
 */
export declare const ShellNavContext: import("react").Context<{
    closeNav: () => void;
}>;
export declare const useShellNav: () => {
    closeNav: () => void;
};
