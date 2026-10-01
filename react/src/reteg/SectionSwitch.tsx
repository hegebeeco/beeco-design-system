import { Fragment, type ReactNode } from 'react';
import { defaultLink, type RenderLink } from './NavTabs';

export type SectionSwitchItem = { href: string; label: string; icon?: ReactNode; current?: boolean };

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
export function SectionSwitch({ items, label, renderLink = defaultLink, className }: SectionSwitchProps) {
  return (
    <nav aria-label={label} className={['bc-secsw-wrap', className].filter(Boolean).join(' ')}>
      <div className="bc-secsw" style={{ ['--bc-secsw-n' as string]: items.length }}>
        {items.map((it) => (
          <Fragment key={it.href}>
            {renderLink({ href: it.href, className: 'bc-secsw-item', 'aria-current': it.current ? 'page' : undefined,
              children: <>{it.icon && <span className="bc-secsw-ic" aria-hidden="true">{it.icon}</span>}<span>{it.label}</span></> })}
          </Fragment>
        ))}
      </div>
    </nav>
  );
}
