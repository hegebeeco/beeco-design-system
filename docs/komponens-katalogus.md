# Komponens-katalógus

*GENERÁLT (`tools/katalogus.py`) a tényleges exportokból. Szabályok: `docs/komponensek.md`; élő tesztlapok: https://hegebeeco.github.io/beeco-design-system/*

## 01 – Űrlap (alap)
**Komponensek:** Button, Calendar, Checkbox, CheckboxInput, Combobox, DatePicker, DateRangePicker, DraftNotice, Field, FieldInput, FormActions, FormSection, HelpButton, IcEdit, IcInfo, IcNew, IcOk, IcOpen, IcSave, IcTrash, IcX, IconButton, NumberField, RadioGroup, ScheduleField, SearchBox, SegmentedControl, SelectField, Switch, TagPicker, TextArea, TextField

**Hookok:** useDraft, useFieldContext

**Segédek:** formatHu, formatHuDate, lengthRange, localToUtcIso, parseHu, parseHuDate, scheduleIssues, todayIso, utcToLocal

## 02 – Adat és grafikon
**Komponensek:** BarChart, BulkBar, ChartCard, ChartLegend, ChartTable, ColumnResizer, DataNote, DataState, DataTable, EmptyState, ExpandToggle, FilterBar, GroupedBarChart, HeatLegend, InfoCard, InfoGrid, LineChart, Pagination, SelectCell, SkeletonRows, SortHeader, Sparkline, StackedBarChart, StatTile, StatusBadge

**Segédek:** createColumnHelper, formatNumberHu, matchText, niceTicks

## 03 – Rétegek és navigáció
**Komponensek:** Accordion, AppShell, Breadcrumbs, ConfirmDialog, Drawer, DropdownMenu, Modal, ModalCancel, MoreIcon, NavTabs, PageHeader, RowActions, SectionSwitch, StageDialog, TabCount, Tabs, Toaster, TooltipIconButton, TypeToConfirm

**Hookok:** useLayerClose, usePageTitle, useQueryParam

**Állandók:** APP_SHELL_LABELS_HU

**Segédek:** notify

## 04 – Média és speciális
**Komponensek:** Avatar, CropDialog, FileImport, Gallery, HeatScale, ImageCropper, ImageUploader, ImportResult, Lightbox, MapLegend, MapPanel, MonthCalendar, OpeningHoursEditor, Progress, Stepper, VideoUpload

**Állandók:** KIND_LABEL, MARKER_ICON, MARKER_ICON_SELECTED, WEEK

**Segédek:** checkFiles, clusterHtml, clusterIcon, clusterTier, cropToFile, emptyWeek, eventsByDay, fileKey, heatGradient, initials, issuesToCsv, markerHtml, mbText, parseTime, sizePair, sniffType, stepsFrom, typeNames, validateHours

## 05 – Méhecske, mozgás, szöveg
**Komponensek:** Bee, BeeMoment, BeeSprite, HexLoader, ProgressBar, Stagger

**Hookok:** useCountUp, useReducedMotion

**Segédek:** celebrate, pillanatok, say, shake, szerepek

## 06a – Kiegészítők
**Komponensek:** AudienceBuilder, CompareMerge, CopyButton, DownloadButton, ErrorPage, ForbiddenPage, NotFoundPage, OfflineBanner, OfflinePage, PhoneField, PreviewCard, RangeSlider, ReviewQueue, SessionExpired, Slider, StatusPage, Timeline, UnsavedChangesDialog, UnsavedChangesGuard

**Hookok:** useOnline, useUnsavedChanges

**Segédek:** audienceProblems, copyText, describeAudience, formatBytes, formatHuPhone, formatNational, groupByDay, mergedValues, newRule, parsePhone, phoneInfo, toE164

## 06b – Helyválasztó, sorsolás, videó
**Komponensek:** AddressSearch, LocationPicker, MiniMap, PrizeDrawReveal, VideoEmbed, VideoPlayer, VideoPreview

**Hookok:** useGeolocation

**Állandók:** HU_BOUNDS, HU_CENTER, LAT_RANGE, LNG_RANGE, REVEAL_STEPS, REVEAL_TOTAL_MS, VIDEO_URL_MSG

**Segédek:** accuracyText, cryptoIndex, formatLatLng, inHungary, looksSwapped, parseVideoUrl, roundLatLng, validLatLng

## 06c – Oldalsablonok
**Komponensek:** Dashboard, DetailActions, DetailPage, EditPage, ErrorSummary, ListPage, SablonFrame, ShellAccount

**Hookok:** useDetailParam, useListState, useTemplateTitle

**Segédek:** clampPage, listStatus

## Tesztlapok (37)
`adat-grafikon`, `adat-grafikon-szelso`, `adat-mutato`, `adat-szuro`, `adat-tabla`, `datum`, `kieg-celcsoport`, `kieg-ellenorzes`, `kieg-elonezet`, `kieg-elozmenyek`, `kieg-mezok`, `kieg-oldalak`, `kieg-osszefesules`, `kieg2-hely`, `kieg2-sorsolas`, `kieg2-video`, `kieg3-mukodes`, `media-import`, `media-kepek`, `media-naptar`, `media-terkep`, `meh`, `mezok`, `reteg-ablak`, `reteg-ertesites`, `reteg-menu`, `reteg-nav`, `reteg-vaz`, `reteg-vaz-felirat`, `sablon-iranyitopult`, `sablon-lista`, `sablon-reszletek`, `sablon-szerkeszto`, `szam`, `tema`, `valaszto`, `vezerlok`
