import { type ReactNode } from 'react';
import { type RenderLink } from './NavTabs';
export type SectionSwitchItem = {
    href: string;
    label: string;
    icon?: ReactNode;
    current?: boolean;
};
export type SectionSwitchProps = {
    items: SectionSwitchItem[];
    /** A navigáció neve, pl. „Naptár részei” */
    label: string;
    renderLink?: RenderLink;
    className?: string;
};
/**
 * SectionSwitch – nagyválasztó (molekula): egy szakasz 2–5 fő nézete közti váltó az oldal tetején, középen, a cím fölött.
 * A SegmentedControl kinézete nagyban, de linkek (útvonalat vált): a mostani aria-current="page".
 * Telefonon rácsba tördel (2 oszlop), nem görget vízszintesen.
 */
export declare function SectionSwitch({ items, label, renderLink, className }: SectionSwitchProps): import("react").JSX.Element;
