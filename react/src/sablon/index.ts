// 06c – oldalsablonok (Javaslat 06/16, jóváhagyva 2026-10-01): csak meglévő DS-elemekből épülnek, üzleti adat nélkül
export { SablonFrame, useTemplateTitle, type TemplateHeadProps } from './Frame';
export { ListPage, useDetailParam, type ListPageProps, type ListStatus, type ListDetail } from './ListPage';
export { DetailPage, type DetailPageProps } from './DetailPage';
export { DetailActions, type DetailAction } from './DetailActions';
export { EditPage, type EditPageProps, type EditContext, type EditStep, type EditStepsConfig } from './EditPage';
export { ErrorSummary, type FormError } from './ErrorSummary';
export { Dashboard, type DashboardProps, type DashboardStat } from './Dashboard';
export { ShellAccount, type ShellAccountProps } from './ShellAccount';
export { useListState, listStatus, clampPage, type ListState, type ListStateAdapter, type ListStateOptions, type ListStatusInput } from './listState';
// Javaslat 20: nyomtatható oldal (keret rejtve, papíron mindig világos) – a Dashboard printable-je is ezt használja
export { usePrintFrame } from './print';
