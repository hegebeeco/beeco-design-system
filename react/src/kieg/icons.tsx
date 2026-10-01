// A 06a-csomag saját, díszítő ikonjai (24×24, currentColor, 2 px vonal) – a felirat vagy az aria-label beszél helyettük
const P = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };

export const CopyIcon = () => <svg {...P}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h8" /></svg>;
export const CheckIcon = () => <svg {...P} strokeWidth={3}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
export const DownloadIcon = () => <svg {...P}><path d="M12 4v11M7 10.5l5 5 5-5M5 20h14" /></svg>;
export const RetryIcon = () => <svg {...P}><path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6" /></svg>;
export const CloseIcon = () => <svg {...P}><path d="M6 6l12 12M18 6L6 18" /></svg>;
export const PlusIcon = () => <svg {...P}><path d="M12 5v14M5 12h14" /></svg>;
export const ChevronIcon = ({ open }: { open?: boolean }) => <svg {...P} style={{ transform: open ? 'rotate(180deg)' : undefined }}><path d="M6 9l6 6 6-6" /></svg>;
export const UndoIcon = () => <svg {...P}><path d="M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3" /></svg>;
