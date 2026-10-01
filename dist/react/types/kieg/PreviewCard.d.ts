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
};
export type NotificationPreview = {
    variant: 'ertesites';
    title?: string;
    body?: string;
    buttonText?: string;
    imageUrl?: string;
};
export type PreviewData = PartnerPreview | CouponPreview | NotificationPreview;
export type PreviewCardProps = PreviewData & {
    /** A keret felirata – alapból „Így látszik az appban” */
    caption?: string;
    className?: string;
};
/**
 * PreviewCard (organizmus, Javaslat 06a/9): élő előnézet telefonkeretben, az app (termékbőr) vonalában –
 * partner, kupon vagy értesítés. A szövegek a hívótól jönnek; ami az appban levágódna, azt MÉRI és kiírja
 * („A leírás levágódik: 3 sor fér el”), a levágott rész szaggatott jelölést kap.
 */
export declare function PreviewCard({ caption, className, ...data }: PreviewCardProps): import("react").JSX.Element;
