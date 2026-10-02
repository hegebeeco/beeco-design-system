import { type ReactNode } from 'react';
import { type TemplateHeadProps } from './Frame';
/** ready · loading · empty (még nincs egy elem sem) · no-results (a szűrésre nincs találat) · error · forbidden */
export type ListStatus = 'ready' | 'loading' | 'empty' | 'no-results' | 'error' | 'forbidden';
/** A lista melletti részletek-panel (Drawer) – saját URL-lel: useDetailParam() */
export type ListDetail = {
    open: boolean;
    onClose: () => void;
    title: ReactNode;
    description?: ReactNode;
    /** Pl. „Teljes oldal” link + „Szerkesztés” */
    footer?: ReactNode;
    size?: 'md' | 'wide';
    /** Rövid szerkesztésnél: bezárás előtt kérdez */
    dirty?: boolean;
    busy?: boolean;
    children: ReactNode;
};
export type ListPageProps = TemplateHeadProps & {
    /** Az oldal fő művelete (egy méz gomb): „Új partner” */
    primaryAction?: ReactNode;
    /** Másodlagos műveletek a fő előtt (Export, Importálás) – secondary gombok */
    actions?: ReactNode;
    /** A szűrősáv (FilterBar) – „empty” és „forbidden” állapotban rejtve (nincs mit szűrni) */
    filters?: ReactNode;
    status?: ListStatus;
    /** Mit listázunk, tárgyesetben: „a partnereket” (töltés- és hibaszöveg) */
    what?: string;
    error?: string;
    onRetry?: () => void;
    retrying?: boolean;
    /** Töltés közben (pl. csontváz-táblázat) – alapból pörgő + szöveg */
    skeleton?: ReactNode;
    /** Üres lista: a sima mondat a méhecske alatt (alap: a szövegkészletből) és egy teendő (secondary gomb – a fő gomb a fejlécben van) */
    emptyText?: string;
    /** „Nincs találat” állapot magyarázata (alap: a méhecske keresési tippje). Kereső nélküli listán add meg (pl. „Ebben a hónapban nincs …”). (1.28) */
    noResultsText?: string;
    emptyAction?: ReactNode;
    /** Nincs találat: „Szűrők törlése” gomb */
    onClearFilters?: () => void;
    /** A lista: DataTable vagy kártyák */
    children?: ReactNode;
    detail?: ListDetail;
};
/**
 * ListPage (sablon, Javaslat 06c/16): oldalfej + szűrősáv + táblázat/kártyák + állapotok + részletek-panel.
 * Üres és „nincs találat” állapotban egy méhecske-pillanat (BeeMoment 'ures' / 'nincs-talalat') – képernyőnként legfeljebb egy.
 */
export declare function ListPage(p: ListPageProps): import("react").JSX.Element;
/**
 * A részletek-panel saját URL-je: ?reszlet=<id>. Megnyitás → új history-bejegyzés, így a böngésző Vissza gombja bezárja,
 * a link megosztható. React Routerrel ugyanez a useSearchParams-szal.
 */
export declare function useDetailParam(name?: string): {
    id: string | null;
    open: (next: string) => void;
    close: () => void;
};
