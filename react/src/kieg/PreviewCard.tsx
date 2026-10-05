import { useCallback, useState, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../cx';
import { Clamp, CutContext, type CutReport } from './Clamp';

export type PartnerPreview = { variant: 'partner'; name?: string; category?: string; address?: string; description?: string; imageUrl?: string };
export type CouponPreview = {
  variant: 'kupon'; partnerName?: string; title?: string; discount?: string; validUntil?: string; description?: string; imageUrl?: string;
  /** Javaslat 20: alcím (a kártyán 1 sor), részletek-nézet adatai, kiemelés */
  subtitle?: string; terms?: string; code?: string; price?: string; buttonText?: string; featured?: boolean;
  /**
   * Javaslat 21: az érvényesség-sor a kártyán. Alap: igen (üresen „Érvényesség helye” helykitöltővel); false = nincs sor
   * (pl. kuponsablon, aminek nincs saját érvényessége) – a részletek nézetben sem.
   */
  validity?: boolean;
  /** Javaslat 21: a leírás (feltételek) sora a kártyán. Alap: igen (üresen helykitöltővel); false = nincs sor (a részletekben sem) */
  descriptionRow?: boolean;
};
export type NotificationPreview = { variant: 'ertesites'; title?: string; body?: string; buttonText?: string; imageUrl?: string; /** Javaslat 20: részletek nézetben „Kiküldés: …” */ sendAt?: string };
/** Javaslat 20 – edukációs tartalom (cikk, videó, tipp) */
export type EducationPreview = {
  variant: 'edukacio'; title?: string; /** A kártya rövid szövege; ha üres, a leírás eleje látszik */ cardText?: string; description?: string;
  contentType?: string; topic?: string; partnerName?: string; source?: string; /** Naphoz kötött tartalom napja, pl. „április 22.” */ day?: string; imageUrl?: string;
};
/** Javaslat 20 – esemény. Az időpontokat a projekt formázza (a néző idejében) */
export type EventPreview = {
  variant: 'esemeny'; name?: string; start?: string; end?: string; location?: string; fee?: string; category?: string;
  organizers?: string; description?: string; featured?: boolean; imageUrl?: string;
};
export type PreviewData = PartnerPreview | CouponPreview | NotificationPreview | EducationPreview | EventPreview;
/** card = a lista kártyája (levágással) · detail = a részletek oldal (teljes szöveg, a telefonon belül görget) */
export type PreviewView = 'card' | 'detail';

export type PreviewCardProps = PreviewData & {
  /** A keret felirata – alapból „Így látszik az appban” */
  caption?: string;
  /** Javaslat 20: kártya (alap) vagy részletek nézet */
  view?: PreviewView;
  /** Javaslat 20: a kép aránya (szélesség / magasság), pl. 4 / 3 vagy '4 / 3' – alap 16:9 */
  aspect?: number | string;
  /** A kép helye, ha nincs kép – alap „Nincs kép” (pl. „Nincs kép – alapkép”) */
  emptyImageText?: string;
  /**
   * Javaslat 21: a levágás-jelzés a keret alatt („A leírás levágódik: …” / „Minden szöveg kifér”). Alap: igen; false = nincs jelzés
   * (pl. ha a projekt saját figyelőben mondja el) – a levágott szöveg szaggatott jelölése a kártyán marad.
   */
  notes?: boolean;
  className?: string;
};

const Img = ({ src, empty }: { src?: string; empty: string }) => (src
  ? <img className="bc-pv-img" src={src} alt="" loading="lazy" />
  : <div className="bc-pv-img is-empty"><span>{empty}</span></div>);

const has = (v?: string) => Boolean(v && v.trim());

/** Részletek nézet: a teljes szöveg (a sortörések megmaradnak); üresen halvány helykitöltő */
function Full({ as: Tag = 'p', className, placeholder, children }: { as?: 'p' | 'h3'; className?: string; placeholder: string; children?: string }) {
  return has(children)
    ? <Tag className={cx('bc-pv-full', className)}>{children!.trim()}</Tag>
    : <Tag className={cx('bc-clamp is-placeholder', className)}>{placeholder}</Tag>;
}

/** Részletek nézet adatsora: csak a kitöltött sorok */
function Rows({ rows }: { rows: Array<[string, ReactNode]> }) {
  const shown = rows.filter(([, v]) => v !== undefined && v !== null && v !== '' && !(typeof v === 'string' && !v.trim()));
  if (!shown.length) return null;
  return <dl className="bc-pv-rows">{shown.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>;
}

const Featured = ({ on }: { on?: boolean }) => (on ? <span className="bc-badge is-tag bc-pv-featured">Kiemelt</span> : null);

type V = { detail: boolean; empty: string };

function Partner(p: PartnerPreview & V) {
  return (
    <article className="bc-pv-card">
      <Img src={p.imageUrl} empty={p.empty} />
      <div className="bc-pv-body">
        {p.detail ? <Full as="h3" placeholder="Partner neve" className="bc-pv-title">{p.name}</Full>
          : <Clamp k="name" label="A partner neve" lines={1} as="h3" placeholder="Partner neve" className="bc-pv-title">{p.name}</Clamp>}
        {p.category && <span className="bc-badge is-accent bc-pv-badge">{p.category}</span>}
        {p.detail ? <Full placeholder="Cím helye" className="bc-pv-meta">{p.address}</Full>
          : <Clamp k="address" label="Az utcacím" lines={1} placeholder="Cím helye" className="bc-pv-meta">{p.address}</Clamp>}
        {p.detail ? <Full placeholder="Itt jelenik meg a leírás." className="bc-pv-text">{p.description}</Full>
          : <Clamp k="description" label="A leírás" lines={3} placeholder="Rövid leírás helye" className="bc-pv-text">{p.description}</Clamp>}
      </div>
    </article>
  );
}

function Coupon(p: CouponPreview & V) {
  const media = <div className="bc-pv-media"><Img src={p.imageUrl} empty={p.empty} />{p.discount && <span className="bc-pv-discount">{p.discount}</span>}<Featured on={p.featured} /></div>;
  if (p.detail) {
    return (
      <article className="bc-pv-card">
        {media}
        <div className="bc-pv-body">
          <Full placeholder="Partner neve" className="bc-pv-meta">{p.partnerName}</Full>
          <Full as="h3" placeholder="Kupon neve" className="bc-pv-title">{p.title}</Full>
          {has(p.subtitle) && <p className="bc-pv-text bc-pv-full">{p.subtitle!.trim()}</p>}
          {p.descriptionRow !== false && <Full placeholder="Itt jelenik meg a leírás." className="bc-pv-text">{p.description}</Full>}
          <Rows rows={[['Érvényes', p.validity === false ? undefined : p.validUntil], ['Tudnivalók', p.terms], ['Kuponkód', p.code], ['Ár', p.price]]} />
          {has(p.buttonText) && <span className="bc-btn is-sm is-block bc-pv-btn">{p.buttonText!.trim()}</span>}
        </div>
      </article>
    );
  }
  return (
    <article className="bc-pv-card">
      {media}
      <div className="bc-pv-body">
        <Clamp k="partner" label="A partner neve" lines={1} placeholder="Partner neve" className="bc-pv-meta">{p.partnerName}</Clamp>
        <Clamp k="title" label="A kupon neve" lines={2} as="h3" placeholder="Kupon neve" className="bc-pv-title">{p.title}</Clamp>
        {has(p.subtitle) && <Clamp k="subtitle" label="Az alcím" lines={1} placeholder="" className="bc-pv-text">{p.subtitle}</Clamp>}
        {p.descriptionRow !== false && <Clamp k="description" label="A feltételek" lines={2} placeholder="Feltételek helye" className="bc-pv-text">{p.description}</Clamp>}
        {p.validity !== false && <p className="bc-pv-meta">{p.validUntil ? `Érvényes: ${p.validUntil}` : 'Érvényesség helye'}</p>}
        {has(p.price) && <p className="bc-pv-meta">{p.price}</p>}
      </div>
    </article>
  );
}

function Notification(p: NotificationPreview & V) {
  const btn = p.buttonText !== undefined && (p.detail
    ? (has(p.buttonText) && <span className="bc-btn is-sm is-block bc-pv-btn">{p.buttonText!.trim()}</span>)
    : (
      <span className="bc-btn is-sm is-block bc-pv-btn">
        <Clamp k="button" label="A gomb felirata" lines={1} as="span" placeholder="Gomb felirata">{p.buttonText}</Clamp>
      </span>
    ));
  return (
    <article className="bc-pv-card is-message">
      {p.imageUrl !== undefined && <Img src={p.imageUrl || undefined} empty={p.empty} />}
      <div className="bc-pv-body">
        {p.detail ? <Full as="h3" placeholder="Az értesítés címe" className="bc-pv-title">{p.title}</Full>
          : <Clamp k="title" label="A cím" lines={2} as="h3" placeholder="Az értesítés címe" className="bc-pv-title">{p.title}</Clamp>}
        {p.detail ? <Full placeholder="Az üzenet szövege" className="bc-pv-text">{p.body}</Full>
          : <Clamp k="body" label="Az üzenet" lines={4} placeholder="Az üzenet szövege" className="bc-pv-text">{p.body}</Clamp>}
        {btn}
        {p.detail && has(p.sendAt) && <p className="bc-pv-meta">Kiküldés: {p.sendAt}</p>}
      </div>
    </article>
  );
}

function Education(p: EducationPreview & V) {
  const meta = [p.topic, p.partnerName].filter(has).join(' · ');
  if (p.detail) {
    return (
      <article className="bc-pv-card">
        <Img src={p.imageUrl} empty={p.empty} />
        <div className="bc-pv-body">
          {(has(p.contentType) || has(p.topic)) && (
            <span className="bc-pv-tags">
              {has(p.contentType) && <span className="bc-badge is-tag">{p.contentType}</span>}
              {has(p.topic) && <span className="bc-badge is-tag">{p.topic}</span>}
            </span>
          )}
          <Full as="h3" placeholder="A tartalom címe" className="bc-pv-title">{p.title}</Full>
          {has(p.day) && <p className="bc-pv-meta">A naptárban: {p.day}</p>}
          <Full placeholder="Itt jelenik meg a leírás." className="bc-pv-text">{p.description}</Full>
          <Rows rows={[['Forrás', p.source], ['Partner', p.partnerName]]} />
        </div>
      </article>
    );
  }
  return (
    <article className="bc-pv-card">
      <Img src={p.imageUrl} empty={p.empty} />
      <div className="bc-pv-body">
        {has(p.contentType) && <span className="bc-badge is-tag bc-pv-badge">{p.contentType}</span>}
        <Clamp k="title" label="A cím" lines={2} as="h3" placeholder="A tartalom címe" className="bc-pv-title">{p.title}</Clamp>
        <Clamp k="cardText" label="A kártyaszöveg" lines={3} placeholder="Kártyaszöveg helye" className="bc-pv-text">{has(p.cardText) ? p.cardText : p.description}</Clamp>
        {meta && <Clamp k="meta" label="A témakör és a partner" lines={1} placeholder="" className="bc-pv-meta">{meta}</Clamp>}
      </div>
    </article>
  );
}

function Event(p: EventPreview & V) {
  const media = <div className="bc-pv-media"><Img src={p.imageUrl} empty={p.empty} /><Featured on={p.featured} /></div>;
  if (p.detail) {
    return (
      <article className="bc-pv-card">
        {media}
        <div className="bc-pv-body">
          {has(p.category) && <span className="bc-badge is-tag bc-pv-badge">{p.category}</span>}
          <Full as="h3" placeholder="Az esemény neve" className="bc-pv-title">{p.name}</Full>
          <Rows rows={[['Kezdés', p.start || '–'], ['Befejezés', p.end || '–'], ['Helyszín', p.location || '–'], ['Részvétel', p.fee], ['Szervező', p.organizers]]} />
          <Full placeholder="Itt jelenik meg a leírás." className="bc-pv-text">{p.description}</Full>
        </div>
      </article>
    );
  }
  return (
    <article className="bc-pv-card">
      {media}
      <div className="bc-pv-body">
        <p className={cx('bc-pv-meta', !has(p.start) && 'bc-clamp is-placeholder')}>{has(p.start) ? p.start : 'Kezdés helye'}</p>
        <Clamp k="name" label="Az esemény neve" lines={2} as="h3" placeholder="Az esemény neve" className="bc-pv-title">{p.name}</Clamp>
        <Clamp k="location" label="A helyszín" lines={1} placeholder="Helyszín helye" className="bc-pv-meta">{p.location}</Clamp>
        {has(p.fee) && <span className="bc-badge is-tag bc-pv-badge">{p.fee}</span>}
      </div>
    </article>
  );
}

type Cut = { label: string; lines: number };
const VIEW_NAME: Record<PreviewView, string> = { card: 'kártya', detail: 'részletek' };
/** A görgethető részletek-régió neve: a tartalom címe (így egy oldalon több előnézet is megkülönböztethető) */
const regionName = (d: PreviewData) => {
  const t = 'title' in d ? d.title : 'name' in d ? d.name : undefined;
  return t && t.trim() ? t.trim() : 'Előnézet';
};

/**
 * PreviewCard (organizmus, Javaslat 06a/9 + 20): élő előnézet telefonkeretben, az app (termékbőr) vonalában –
 * partner, kupon, értesítés, edukáció vagy esemény; kártya vagy részletek nézet. A szövegek a hívótól jönnek; ami a kártyán
 * levágódna, azt MÉRI és kiírja („A leírás levágódik: 3 sor fér el”), a levágott rész szaggatott jelölést kap.
 * Részletek nézetben a teljes szöveg látszik, a telefon képernyője görget (billentyűzettel is).
 */
export function PreviewCard({ caption = 'Így látszik az appban', className, view = 'card', aspect, emptyImageText = 'Nincs kép', notes = true, ...data }: PreviewCardProps) {
  const [cuts, setCuts] = useState<Record<string, Cut>>({});
  const report = useCallback<CutReport>((key, label, lines, cut) => {
    setCuts((prev) => {
      if (Boolean(prev[key]) === cut) return prev;
      const next = { ...prev };
      if (cut) next[key] = { label, lines }; else delete next[key];
      return next;
    });
  }, []);
  const detail = view === 'detail';
  const list = Object.entries(cuts);
  const v: V = { detail, empty: emptyImageText };
  let body: ReactNode;
  if (data.variant === 'partner') body = <Partner {...data} {...v} />;
  else if (data.variant === 'kupon') body = <Coupon {...data} {...v} />;
  else if (data.variant === 'edukacio') body = <Education {...data} {...v} />;
  else if (data.variant === 'esemeny') body = <Event {...data} {...v} />;
  else body = <Notification {...data} {...v} />;
  const style = aspect !== undefined ? ({ ['--pv-aspect' as string]: String(aspect) } as CSSProperties) : undefined;

  return (
    <figure className={cx('bc-preview', className)} data-variant={data.variant} data-view={view} style={style}>
      <div className="bc-pv-phone" aria-label={`${caption} (előnézet${detail ? ', részletek' : ''})`} role="group">
        <div className="bc-pv-notch" aria-hidden="true" />
        <div className={cx('bc-pv-screen', detail && 'is-scroll')} tabIndex={detail ? 0 : undefined}
          role={detail ? 'region' : undefined} aria-label={detail ? `${regionName(data)} – ${VIEW_NAME[view]}, görgethető` : undefined}>
          <CutContext.Provider value={report}>{body}</CutContext.Provider>
        </div>
      </div>
      <figcaption className="bc-pv-caption">
        <span>{caption}</span>
        {notes && <span className="bc-pv-notes" role="status">
          {detail ? <span className="bc-badge is-muted">Részletek: a teljes szöveg látszik</span>
            : list.length === 0
              ? <span className="bc-badge is-success">Minden szöveg kifér</span>
              : list.map(([k, c]) => (
                <span key={k} className="bc-badge is-warning" data-cut={k}>{c.label} levágódik: {c.lines === 1 ? '1 sor' : `${c.lines} sor`} fér el</span>
              ))}
        </span>}
      </figcaption>
    </figure>
  );
}
