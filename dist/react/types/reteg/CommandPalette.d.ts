import { type ReactNode } from 'react';
/** Egy találat: azonosító, név (ebben emeljük ki a keresett szót), rövid kiegészítés (típus, hely), piktogram. */
export type CommandItem = {
    id: string;
    label: string;
    /** Rövid kiegészítés a sor jobb oldalán (pl. „Partner”, „Budapest”) */
    description?: string;
    /** Díszítő piktogram a név előtt (a jelentést a név és a csoport viszi) */
    icon?: ReactNode;
    disabled?: boolean;
    /** A projekt saját adata (pl. az útvonal) – az onSelect visszakapja */
    data?: unknown;
};
/** Találat-csoport: címe látszik és a képernyőolvasó is mondja (pl. „Partnerek”, „Legutóbb megnyitott”). Üres csoport nem jelenik meg. */
export type CommandGroup = {
    id: string;
    label: string;
    items: readonly CommandItem[];
};
export type CommandPaletteLabels = {
    title: string;
    search: string;
    placeholder: string;
    results: string;
    loading: string;
    retry: string;
    count: (n: number) => string;
    tipMove: string;
    tipOpen: string;
    tipClose: string;
};
export declare const COMMAND_PALETTE_LABELS_HU: CommandPaletteLabels;
export type CommandPaletteProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** A keresett szöveg (vezérelt) – a projekt ebből keres (késleltetve, a saját végpontjain) */
    query: string;
    onQueryChange: (query: string) => void;
    /** A találatok csoportokban; üres mezőnél pl. a legutóbb megnyitottak */
    groups: readonly CommandGroup[];
    /** Kiválasztás (Enter / kattintás). newTab: ⌘/Ctrl + Enter vagy ⌘/Ctrl + kattintás – ilyenkor az ablak nyitva marad. */
    onSelect: (item: CommandItem, opts: {
        newTab: boolean;
    }) => void;
    /** Rövid leírás a cím alatt (a képernyőolvasó is felolvassa) */
    description?: ReactNode;
    /** loading: „Keresem…” (az előző találatok maradnak) · error: hibasáv újrapróbálással · alap: ready */
    status?: 'ready' | 'loading' | 'error';
    /** A hiba szövege a következő lépéssel; részleges hibánál is (a többi csoport látszik) */
    error?: ReactNode;
    onRetry?: () => void;
    /** Ennyi karakter alatt nem keresünk – ilyenkor a hint látszik (és a groups, ha van, pl. legutóbbiak) */
    minChars?: number;
    /** Tipp üres / túl rövid keresésnél (pl. „Írj legalább 2 betűt.”) */
    hint?: ReactNode;
    /** Nincs találat – alap: „Nincs találat erre: „…”. Próbálj rövidebb szót.” */
    emptyText?: (query: string) => ReactNode;
    /** ⌘K / Ctrl+K bárhonnan nyitja (és zárja) – alap: igen */
    hotkey?: boolean;
    /** A keresett szó kiemelése a nevekben – alap: igen */
    highlight?: boolean;
    /** A billentyű-tippsor az alján (érintőképernyőn rejtve) – alap: igen */
    tips?: boolean;
    /** Feliratok (pl. angolul) – ami hiányzik, az magyar marad */
    labels?: Partial<CommandPaletteLabels>;
    className?: string;
};
/** A paletta billentyűparancsának felirata az eszköz szerint: „⌘K” (Mac) vagy „Ctrl+K” */
export declare const commandHotkeyLabel: () => "⌘K" | "Ctrl+K";
/** ⌘K / Ctrl+K figyelése az egész oldalon (Alt/Shift nélkül). A paletta hotkey-e ezt használja; saját gombhoz is jó. */
export declare function useCommandHotkey(onHotkey: () => void, enabled?: boolean): void;
/**
 * CommandPalette (organizmus, Javaslat 20): ⌘K / Ctrl+K kereső-paletta – DS Modal (Radix Dialog: fókuszcsapda, Esc,
 * visszatérő fókusz) + SearchBox + csoportosított találatlista. WAI-ARIA combobox/listbox minta: a fókusz a mezőben marad,
 * a kiemelt sort az aria-activedescendant mondja. ↑/↓ léptet (körbe), Enter megnyit
 * (⌘/Ctrl+Enter új lapon), Ctrl/⌘+Home/End az első/utolsó találat, Esc zár. A keresést a projekt végzi (query → groups).
 */
export declare function CommandPalette({ open, onOpenChange, query, onQueryChange, groups, onSelect, description, status, error, onRetry, minChars, hint, emptyText, hotkey, highlight, tips, labels, className, }: CommandPaletteProps): import("react").JSX.Element;
