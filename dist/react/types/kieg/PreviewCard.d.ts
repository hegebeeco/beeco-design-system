export type PartnerPreview = {
    variant: 'partner';
    name?: string;
    category?: string;
    address?: string;
    description?: string;
    imageUrl?: string;
};
export type CouponPreview = {
    variant: 'kupon';
    partnerName?: string;
    title?: string;
    discount?: string;
    validUntil?: string;
    description?: string;
    imageUrl?: string;
    /** Javaslat 20: alcím (a kártyán 1 sor), részletek-nézet adatai, kiemelés */
    subtitle?: string;
    terms?: string;
    code?: string;
    price?: string;
    buttonText?: string;
    featured?: boolean;
};
export type NotificationPreview = {
    variant: 'ertesites';
    title?: string;
    body?: string;
    buttonText?: string;
    imageUrl?: string; /** Javaslat 20: részletek nézetben „Kiküldés: …” */
    sendAt?: string;
};
/** Javaslat 20 – edukációs tartalom (cikk, videó, tipp) */
export type EducationPreview = {
    variant: 'edukacio';
    title?: string; /** A kártya rövid szövege; ha üres, a leírás eleje látszik */
    cardText?: string;
    description?: string;
    contentType?: string;
    topic?: string;
    partnerName?: string;
    source?: string; /** Naphoz kötött tartalom napja, pl. „április 22.” */
    day?: string;
    imageUrl?: string;
};
/** Javaslat 20 – esemény. Az időpontokat a projekt formázza (a néző idejében) */
export type EventPreview = {
    variant: 'esemeny';
    name?: string;
    start?: string;
    end?: string;
    location?: string;
    fee?: string;
    category?: string;
    organizers?: string;
    description?: string;
    featured?: boolean;
    imageUrl?: string;
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
    className?: string;
};
/**
 * PreviewCard (organizmus, Javaslat 06a/9 + 20): élő előnézet telefonkeretben, az app (termékbőr) vonalában –
 * partner, kupon, értesítés, edukáció vagy esemény; kártya vagy részletek nézet. A szövegek a hívótól jönnek; ami a kártyán
 * levágódna, azt MÉRI és kiírja („A leírás levágódik: 3 sor fér el”), a levágott rész szaggatott jelölést kap.
 * Részletek nézetben a teljes szöveg látszik, a telefon képernyője görget (billentyűzettel is).
 */
export declare function PreviewCard({ caption, className, view, aspect, emptyImageText, ...data }: PreviewCardProps): import("react").JSX.Element;
