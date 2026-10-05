/**
 * Az AppShell menüállapota a keret belsejéből (Javaslat 20: nyilvános projekt-hook, `useShellNav()`).
 * - closeNav: a telefonos fiók bezárása (pl. a ShellAccount menüpontjaiból, vagy a fiókban álló kereső-gombból). Ha egy
 *   menüpont ablakot nyit, a nyitva maradó, modális fiók a fókuszt magánál tartaná – az új ablakba nem lehetne írni (1.34.1).
 * - openNav: a telefonos fiók megnyitása (pl. saját fejléc-gombból).
 * - navOpen: nyitva van-e a telefonos fiók · narrow: keskeny nézet (fiókos menü, 900 px alatt) · collapsed: becsukott oldalsáv.
 * - inShell: AppShell-en belül vagyunk-e.
 * Keret nélkül (tesztlap, önálló használat) a függvények nem csinálnak semmit, az állapotok hamisak.
 */
export type ShellNavState = {
    closeNav: () => void;
    openNav: () => void;
    navOpen: boolean;
    narrow: boolean;
    collapsed: boolean;
    inShell: boolean;
};
export declare const ShellNavContext: import("react").Context<ShellNavState>;
export declare const useShellNav: () => ShellNavState;
