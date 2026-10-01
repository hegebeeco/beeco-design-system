/** A média-csomag vonalas ikonjai (currentColor, díszítő – a jelentést mindig szöveg is viszi). */
const S = { viewBox: '0 0 24 24', width: 20, height: 20, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };

export const IcPlus = () => <svg {...S}><path d="M12 5v14M5 12h14" /></svg>;
export const IcClose = () => <svg {...S}><path d="M6 6l12 12M18 6L6 18" /></svg>;
export const IcDots = () => <svg {...S}><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></svg>;
export const IcLeft = () => <svg {...S}><path d="M15 5l-7 7 7 7" /></svg>;
export const IcRight = () => <svg {...S}><path d="M9 5l7 7-7 7" /></svg>;
export const IcRetry = () => <svg {...S}><path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4" /></svg>;
export const IcWarn = () => <svg {...S}><path d="M12 4l9 16H3z" /><path d="M12 10v4M12 17v.5" /></svg>;
export const IcCheck = () => <svg {...S}><path d="M5 12.5l4.5 4.5L19 7" /></svg>;
export const IcCopy = () => <svg {...S}><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" /></svg>;
export const IcDownload = () => <svg {...S}><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>;
export const IcFile = () => <svg {...S}><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4" /></svg>;
