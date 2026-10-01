import { Fragment, type ReactNode } from 'react';
import { useScrollFade } from './useScrollFade';
import { TabCount } from './Tabs';

/** Router-független link: a projekt a saját <Link>-jét adja (React Router, Next), alapból <a>. */
export type LinkRenderProps = { href: string; className?: string; 'aria-current'?: 'page'; onClick?: () => void; children: ReactNode };
export type RenderLink = (props: LinkRenderProps) => ReactNode;
export const defaultLink: RenderLink = ({ href, ...p }) => <a href={href} {...p} />;

export type NavTabItem = { href: string; label: string; count?: number; current?: boolean };

export type NavTabsProps = {
  items: NavTabItem[];
  /** A navigáció neve, pl. „Naptár nézetei” */
  label: string;
  renderLink?: RenderLink;
};

/**
 * NavTabs (molekula, Javaslat 03 – 6A): ugyanaz a kinézet, mint a Tabs, de linkek – útvonalat váltanak.
 * A mostani oldal aria-current="page" (nem role="tab": a képernyőolvasó linkként olvassa, Tab-bal léptethető).
 */
export function NavTabs({ items, label, renderLink = defaultLink }: NavTabsProps) {
  const cur = items.findIndex((i) => i.current);
  const wrap = useScrollFade<HTMLDivElement>('[aria-current="page"]', cur);
  return (
    <nav aria-label={label}>
      <div className="bc-tabs-wrap" ref={wrap}>
        <div className="bc-tabs">
          {items.map((it) => (
            <Fragment key={it.href}>
              {renderLink({ href: it.href, className: 'bc-tab', 'aria-current': it.current ? 'page' : undefined,
                children: <><span className="bc-tab-text" title={it.label.length > 28 ? it.label : undefined}>{it.label}</span>{it.count !== undefined && <TabCount n={it.count} />}</> })}
            </Fragment>
          ))}
        </div>
      </div>
    </nav>
  );
}
