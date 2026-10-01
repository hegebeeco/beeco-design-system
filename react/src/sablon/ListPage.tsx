import { useCallback, type ReactNode } from 'react';
import { Button } from '../inputs/Button';
import { DataState } from '../adat/DataState';
import { BeeMoment } from '../meh/BeeMoment';
import { Drawer } from '../reteg/Drawer';
import { PageHeader } from '../reteg/PageHeader';
import { useQueryParam } from '../reteg/useQueryParam';
import { SablonFrame, useTemplateTitle, type TemplateHeadProps } from './Frame';

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
export function ListPage(p: ListPageProps) {
  const { title, description, breadcrumbs, renderLink, primaryAction, actions, filters, status = 'ready', what = 'a listát', detail } = p;
  useTemplateTitle(title, p.docTitle, p.docTitleSuffix);
  const showFilters = filters && status !== 'empty' && status !== 'forbidden';
  const head = (actions || primaryAction) ? <>{actions}{primaryAction}</> : undefined;

  let body: ReactNode;
  if (status === 'empty') {
    body = <div className="bc-card bc-sablon-state"><BeeMoment pillanat="ures" sima={p.emptyText} action={p.emptyAction} /></div>;
  } else if (status === 'no-results') {
    body = (
      <div className="bc-card bc-sablon-state">
        <BeeMoment pillanat="nincs-talalat"
          action={p.onClearFilters && <Button variant="secondary" onClick={p.onClearFilters}>Szűrők törlése</Button>} />
      </div>
    );
  } else {
    body = (
      <DataState status={status} what={what} error={p.error} onRetry={p.onRetry} retrying={p.retrying} skeleton={p.skeleton}>
        {p.children}
      </DataState>
    );
  }

  return (
    <SablonFrame kind="lista" standalone={p.standalone} skipLabel={p.skipLabel} className={p.className} busy={status === 'loading'}>
      <PageHeader title={title} description={description} breadcrumbs={breadcrumbs} renderLink={renderLink} actions={head} />
      {showFilters && <div className="bc-sablon-filters">{filters}</div>}
      <div className="bc-sablon-list">{body}</div>
      {detail && (
        <Drawer open={detail.open} onOpenChange={(o) => { if (!o) detail.onClose(); }} title={detail.title} description={detail.description}
          footer={detail.footer} size={detail.size} dirty={detail.dirty} busy={detail.busy}>
          {detail.children}
        </Drawer>
      )}
    </SablonFrame>
  );
}

/**
 * A részletek-panel saját URL-je: ?reszlet=<id>. Megnyitás → új history-bejegyzés, így a böngésző Vissza gombja bezárja,
 * a link megosztható. React Routerrel ugyanez a useSearchParams-szal.
 */
export function useDetailParam(name = 'reszlet') {
  const [id, set] = useQueryParam(name);
  const open = useCallback((next: string) => set(next), [set]);
  const close = useCallback(() => set(null), [set]);
  return { id, open, close };
}
