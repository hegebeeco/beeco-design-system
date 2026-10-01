import type { ReactNode } from 'react';
import { type TabItem } from '../reteg/Tabs';
import { type DetailAction } from './DetailActions';
import { type TemplateHeadProps } from './Frame';
export type DetailPageProps = TemplateHeadProps & {
    status?: 'ready' | 'loading' | 'error' | 'forbidden';
    /** Mit töltünk, tárgyesetben: „a partner adatait” */
    what?: string;
    error?: string;
    onRetry?: () => void;
    /** Az elem neve szövegként (a „⋯” gomb és a menü neve) – alap: a title, ha szöveg */
    subject?: string;
    /** Műveletek: a fő látszik, a többi „⋯” menüben, a törlés alul → megerősítés */
    actions?: DetailAction[];
    /** Összegző blokk a fülek fölött (állapot, fő adatok) */
    summary?: ReactNode;
    /** Szakaszok fülekben – vezérelhető (pl. ?tab= az URL-ben) */
    tabs?: TabItem[];
    tabsLabel?: string;
    tab?: string;
    onTabChange?: (value: string) => void;
    /** Fülek nélküli tartalom (vagy a fülek alatt) */
    children?: ReactNode;
    /** Oldalsó oszlop: meta-adatok, tevékenység (Timeline) – telefonon a tartalom alá kerül */
    side?: ReactNode;
    sideLabel?: string;
};
/**
 * DetailPage (sablon, Javaslat 06c/16): oldalfej műveletekkel · összegzés · fülek · oldalsó oszlop.
 * Az oldalsó oszlop a DOM-ban a tartalom után jön, így a billentyűzet-sorrend és a telefonos egymás alá rendeződés ugyanaz.
 */
export declare function DetailPage(p: DetailPageProps): import("react").JSX.Element;
