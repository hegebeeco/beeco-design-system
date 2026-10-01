import type { ReactNode } from 'react';
import { cx } from '../cx';
import { DataState } from '../adat/DataState';
import { PageHeader } from '../reteg/PageHeader';
import { Tabs, type TabItem } from '../reteg/Tabs';
import { DetailActions, type DetailAction } from './DetailActions';
import { SablonFrame, useTemplateTitle, type TemplateHeadProps } from './Frame';

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
export function DetailPage(p: DetailPageProps) {
  const { title, description, breadcrumbs, renderLink, status = 'ready', actions, summary, tabs, side } = p;
  const loading = status === 'loading';
  useTemplateTitle(title, p.docTitle, p.docTitleSuffix, loading);
  const subject = p.subject ?? (typeof title === 'string' ? title : 'elem');
  const head = status === 'ready' && actions?.length ? <DetailActions actions={actions} subject={subject} /> : undefined;

  return (
    <SablonFrame kind="reszletek" standalone={p.standalone} skipLabel={p.skipLabel} className={p.className} busy={loading}>
      <PageHeader title={title} description={status === 'ready' ? description : undefined} breadcrumbs={breadcrumbs} renderLink={renderLink}
        actions={head} loading={loading} />
      <DataState status={status} what={p.what ?? 'az adatokat'} error={p.error} onRetry={p.onRetry}
        skeleton={<div className="bc-sablon-skel"><span className="bc-skeleton" /><span className="bc-skeleton" /><span className="bc-skeleton" /></div>}>
        <div className={cx('bc-sablon-cols', Boolean(side) && 'has-side')}>
          <div className="bc-sablon-primary">
            {summary && <section className="bc-card bc-sablon-summary-block" aria-label="Összegzés">{summary}</section>}
            {tabs && tabs.length > 0 && (
              <Tabs items={tabs} label={p.tabsLabel ?? `${subject} részei`} value={p.tab} onValueChange={p.onTabChange} />
            )}
            {p.children}
          </div>
          {side && <aside className="bc-sablon-side" aria-label={p.sideLabel ?? 'Adatok és tevékenység'}>{side}</aside>}
        </div>
      </DataState>
    </SablonFrame>
  );
}
