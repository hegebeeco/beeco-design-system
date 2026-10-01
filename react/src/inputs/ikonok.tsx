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
