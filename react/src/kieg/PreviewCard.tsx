import { useCallback, useState, type ReactNode } from 'react';
import { cx } from '../cx';
import { Clamp, CutContext, type CutReport } from './Clamp';

export type PartnerPreview = { variant: 'partner'; name?: string; category?: string; address?: string; description?: string; imageUrl?: string };
export type CouponPreview = { variant: 'kupon'; partnerName?: string; title?: string; discount?: string; validUntil?: string; description?: string; imageUrl?: string };
export type NotificationPreview = { variant: 'ertesites'; title?: string; body?: string; buttonText?: string; imageUrl?: string };
export type PreviewData = PartnerPreview | CouponPreview | NotificationPreview;

export type PreviewCardProps = PreviewData & {
  /** A keret felirata – alapból „Így látszik az appban” */
  caption?: string;
  className?: string;
};

const Img = ({ src }: { src?: string }) => (src
  ? <img className="bc-pv-img" src={src} alt="" loading="lazy" />
  : <div className="bc-pv-img is-empty"><span>Nincs kép</span></div>);

function Partner(p: PartnerPreview) {
  return (
    <article className="bc-pv-card">
      <Img src={p.imageUrl} />
      <div className="bc-pv-body">
        <Clamp k="name" label="A partner neve" lines={1} as="h3" placeholder="Partner neve" className="bc-pv-title">{p.name}</Clamp>
        {p.category && <span className="bc-badge is-accent bc-pv-badge">{p.category}</span>}
        <Clamp k="address" label="Az utcacím" lines={1} placeholder="Cím helye" className="bc-pv-meta">{p.address}</Clamp>
        <Clamp k="description" label="A leírás" lines={3} placeholder="Rövid leírás helye" className="bc-pv-text">{p.description}</Clamp>
      </div>
    </article>
  );
}

function Coupon(p: CouponPreview) {
  return (
    <article className="bc-pv-card">
      <div className="bc-pv-media"><Img src={p.imageUrl} />{p.discount && <span className="bc-pv-discount">{p.discount}</span>}</div>
      <div className="bc-pv-body">
        <Clamp k="partner" label="A partner neve" lines={1} placeholder="Partner neve" className="bc-pv-meta">{p.partnerName}</Clamp>
        <Clamp k="title" label="A kupon neve" lines={2} as="h3" placeholder="Kupon neve" className="bc-pv-title">{p.title}</Clamp>
        <Clamp k="description" label="A feltételek" lines={2} placeholder="Feltételek helye" className="bc-pv-text">{p.description}</Clamp>
        <p className="bc-pv-meta">{p.validUntil ? `Érvényes: ${p.validUntil}` : 'Érvényesség helye'}</p>
      </div>
    </article>
  );
}

function Notification(p: NotificationPreview) {
  return (
    <article className="bc-pv-card is-message">
      {p.imageUrl !== undefined && <Img src={p.imageUrl || undefined} />}
      <div className="bc-pv-body">
        <Clamp k="title" label="A cím" lines={2} as="h3" placeholder="Az értesítés címe" className="bc-pv-title">{p.title}</Clamp>
        <Clamp k="body" label="Az üzenet" lines={4} placeholder="Az üzenet szövege" className="bc-pv-text">{p.body}</Clamp>
        {p.buttonText !== undefined && (
          <span className="bc-btn is-sm is-block bc-pv-btn">
            <Clamp k="button" label="A gomb felirata" lines={1} as="span" placeholder="Gomb felirata">{p.buttonText}</Clamp>
          </span>
        )}
      </div>
    </article>
  );
}

type Cut = { label: string; lines: number };

/**
 * PreviewCard (organizmus, Javaslat 06a/9): élő előnézet telefonkeretben, az app (termékbőr) vonalában –
 * partner, kupon vagy értesítés. A szövegek a hívótól jönnek; ami az appban levágódna, azt MÉRI és kiírja
 * („A leírás levágódik: 3 sor fér el”), a levágott rész szaggatott jelölést kap.
 */
export function PreviewCard({ caption = 'Így látszik az appban', className, ...data }: PreviewCardProps) {
  const [cuts, setCuts] = useState<Record<string, Cut>>({});
  const report = useCallback<CutReport>((key, label, lines, cut) => {
    setCuts((prev) => {
      if (Boolean(prev[key]) === cut) return prev;
      const next = { ...prev };
      if (cut) next[key] = { label, lines }; else delete next[key];
      return next;
    });
  }, []);
  const list = Object.entries(cuts);
  let body: ReactNode;
  if (data.variant === 'partner') body = <Partner {...data} />;
  else if (data.variant === 'kupon') body = <Coupon {...data} />;
  else body = <Notification {...data} />;

  return (
    <figure className={cx('bc-preview', className)} data-variant={data.variant}>
      <div className="bc-pv-phone" aria-label={`${caption} (előnézet)`} role="group">
        <div className="bc-pv-notch" aria-hidden="true" />
        <div className="bc-pv-screen">
          <CutContext.Provider value={report}>{body}</CutContext.Provider>
        </div>
      </div>
      <figcaption className="bc-pv-caption">
        <span>{caption}</span>
        <span className="bc-pv-notes" role="status">
          {list.length === 0
            ? <span className="bc-badge is-success">Minden szöveg kifér</span>
            : list.map(([k, c]) => (
              <span key={k} className="bc-badge is-warning" data-cut={k}>{c.label} levágódik: {c.lines === 1 ? '1 sor' : `${c.lines} sor`} fér el</span>
            ))}
        </span>
      </figcaption>
    </figure>
  );
}
