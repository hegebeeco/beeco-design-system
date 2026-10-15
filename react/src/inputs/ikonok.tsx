/**
 * A termékbőr közös piktogramjai (atom, Kristóf szabálya 2026-10-01): vonalas, 24-es rács, currentColor, díszítő (aria-hidden).
 * A jelentést a gomb neve viszi: szöveges gombnál a felirat, csak-piktogramos gombnál a TooltipIconButton `label`-je.
 * Mentés · törlés · új · info · szerkesztés · megnyitás · bezárás – a kompakt helyeken ezek állhatnak szöveg nélkül.
 */
const S = { viewBox: '0 0 24 24', width: 20, height: 20, fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };

export const IcSave = () => <svg {...S}><path d="M5 4h11l3 3v13H5z" /><path d="M8 4v5h7V4M8 20v-6h8v6" /></svg>;
export const IcTrash = () => <svg {...S}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" /></svg>;
export const IcNew = () => <svg {...S}><path d="M12 5v14M5 12h14" /></svg>;
export const IcInfo = () => <svg {...S}><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5v.5" /></svg>;
export const IcEdit = () => <svg {...S}><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="M13 7l4 4" /></svg>;
export const IcOpen = () => <svg {...S}><path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" /><circle cx="12" cy="12" r="3" /></svg>;
export const IcX = () => <svg {...S}><path d="M6 6l12 12M18 6L6 18" /></svg>;
export const IcOk = () => <svg {...S}><path d="M5 12.5l4.5 4.5L19 7" /></svg>;
// Javaslat 20 (2026-10-05): nyíl-piktogramok – lépésenkénti űrlap „Vissza” / „Tovább”, lapozás, előző / következő
export const IcLeft = () => <svg {...S}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>;
export const IcRight = () => <svg {...S}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
// Javaslat 27 (2026-10-15): a mobil appal közös ikonkészlet 32 új tagja – az SVG-párjuk: termek/ikonok/*.svg (tests/check-ikonok.js őrzi az egyezést)
export const IcBell = () => <svg {...S}><path d="M6 17v-6a6 6 0 0 1 12 0v6l1.5 2h-15z" /><path d="M10 21.5h4" /></svg>;
export const IcBookmark = () => <svg {...S}><path d="M6 4h12v16l-6-4.5L6 20z" /></svg>;
export const IcCalendar = () => <svg {...S}><rect x="3.5" y="5" width="17" height="15.5" rx="2.2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>;
export const IcCamera = () => <svg {...S}><path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" /><circle cx="12" cy="13" r="3.5" /></svg>;
export const IcChevronDown = () => <svg {...S}><path d="M5 9l7 7 7-7" /></svg>;
export const IcChevronLeft = () => <svg {...S}><path d="M15 5l-7 7 7 7" /></svg>;
export const IcChevronRight = () => <svg {...S}><path d="M9 5l7 7-7 7" /></svg>;
export const IcChevronUp = () => <svg {...S}><path d="M5 15l7-7 7 7" /></svg>;
export const IcClear = () => <svg {...S}><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></svg>;
export const IcClock = () => <svg {...S}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>;
export const IcError = () => <svg {...S}><circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 16.5v.5" /></svg>;
export const IcExternalLink = () => <svg {...S}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>;
export const IcEyeOff = () => <svg {...S}><path d="M8.2 6C9.3 5.4 10.6 5 12 5C18 5 21.5 12 21.5 12C21.5 12 20.4 14.2 18.3 16.2M15.8 18C14.7 18.6 13.4 19 12 19C6 19 2.5 12 2.5 12C2.5 12 3.6 9.8 5.7 7.8M9.9 9.9a3 3 0 0 0 4.2 4.2M4 4l16 16" /></svg>;
export const IcFavorite = () => <svg {...S}><path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z" /></svg>;
export const IcFilter = () => <svg {...S}><path d="M3.5 5h17l-6.5 8v6l-4-2v-4z" /></svg>;
export const IcImage = () => <svg {...S}><rect x="3.5" y="4.5" width="17" height="15" rx="2" /><circle cx="16" cy="9.5" r=".5" /><path d="M3.8 17.5 9 12l4 4.2 2.3-2.3 4.7 4.6" /></svg>;
export const IcLocation = () => <svg {...S}><path d="M12 21s6.5-6.2 6.5-11A6.5 6.5 0 0 0 5.5 10c0 4.8 6.5 11 6.5 11Z" /><circle cx="12" cy="10" r="2.4" /></svg>;
export const IcMail = () => <svg {...S}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 7.5l8.5 6 8.5-6" /></svg>;
export const IcMap = () => <svg {...S}><path d="M3.5 6.5 9 4.5l6 2 5.5-2v13l-5.5 2-6-2-5.5 2v-13Z" /><path d="M9 4.5v13M15 6.5v13" /></svg>;
export const IcMenu = () => <svg {...S}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
export const IcMore = () => <svg {...S}><path d="M5 12h.01M12 12h.01M19 12h.01" strokeWidth="3.6" /></svg>;
export const IcPhone = () => <svg {...S}><path d="M5 4h3.5l1.8 4.5-2.3 1.5a12 12 0 0 0 5.5 5.5l1.5-2.3 4.5 1.8V19a1.5 1.5 0 0 1-1.5 1.5C10.7 20.5 3.5 13.3 3.5 5.5A1.5 1.5 0 0 1 5 4z" /></svg>;
export const IcRefresh = () => <svg {...S}><path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" /><path d="M18.5 3.2v4.3h-4.3" /></svg>;
export const IcSearch = () => <svg {...S}><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>;
export const IcSettings = () => <svg {...S}><path d="M9.9 5.0 L10.5 2.5 L13.5 2.5 L14.1 5.0 L15.4 5.6 L17.6 4.2 L19.8 6.4 L18.4 8.6 L19.0 9.9 L21.5 10.5 L21.5 13.5 L19.0 14.1 L18.4 15.4 L19.8 17.6 L17.6 19.8 L15.4 18.4 L14.1 19.0 L13.5 21.5 L10.5 21.5 L9.9 19.0 L8.6 18.4 L6.4 19.8 L4.2 17.6 L5.6 15.4 L5.0 14.1 L2.5 13.5 L2.5 10.5 L5.0 9.9 L5.6 8.6 L4.2 6.4 L6.4 4.2 L8.6 5.6Z" /><circle cx="12" cy="12" r="3" /></svg>;
export const IcShare = () => <svg {...S}><path d="M7 10.5H5.5a1 1 0 0 0-1 1V20a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-8.5a1 1 0 0 0-1-1H17" /><path d="M12 15V3.5M8 7.5l4-4 4 4" /></svg>;
export const IcSort = () => <svg {...S}><path d="M8 19V5M4 9l4-4 4 4M16 5v14M12 15l4 4 4-4" /></svg>;
export const IcStar = () => <svg {...S}><path d="m12 2.8 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.6l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8L12 2.8Z" /></svg>;
export const IcUpload = () => <svg {...S}><path d="M12 16V4M7 9l5-5 5 5M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4" /></svg>;
export const IcUser = () => <svg {...S}><circle cx="12" cy="8" r="4" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></svg>;
export const IcWarning = () => <svg {...S}><path d="M12 4L2.8 20h18.4z" /><path d="M12 10v4.5M12 17.3v.2" /></svg>;
export const IcWeb = () => <svg {...S}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 2.7 4.5 5.7 4.5 9s-1.5 6.3-4.5 9c-3-2.7-4.5-5.7-4.5-9S9 5.7 12 3z" /></svg>;
