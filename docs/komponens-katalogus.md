# Komponens-katalógus

*GENERÁLT (`tools/katalogus.py`) a tényleges exportokból. Szabályok: `docs/komponensek.md`; élő tesztlapok: https://hegebeeco.github.io/beeco-design-system/*

## 01 – Űrlap (alap)
**Komponensek:** Button, Calendar, Checkbox, Combobox, DatePicker, DateRangePicker, Field, FormActions, FormSection, HelpButton, IconButton, NumberField, RadioGroup, SearchBox, SegmentedControl, SelectField, Switch, TagPicker, TextArea, TextField

**Segédek:** formatHu, formatHuDate, lengthRange, localToUtcIso, parseHu, parseHuDate, todayIso, utcToLocal

## 02 – Adat és grafikon
**Komponensek:** BarChart, BulkBar, ChartCard, ChartLegend, ChartTable, ColumnResizer, DataNote, DataState, DataTable, EmptyState, ExpandToggle, FilterBar, GroupedBarChart, HeatLegend, InfoCard + InfoGrid (adatlap, 1.22), LineChart, Pagination, SelectCell, SkeletonRows, SortHeader, Sparkline, StackedBarChart, StatTile

**Segédek:** createColumnHelper, formatNumberHu, matchText, niceTicks

## 03 – Rétegek és navigáció
**Komponensek:** Accordion, AppShell (`collapsible`, `account` – Javaslat 08), Breadcrumbs, ConfirmDialog, Drawer, DropdownMenu, Modal, ModalCancel, MoreIcon, NavTabs, PageHeader, RowActions, SectionSwitch (nagyválasztó, 1.21), TabCount, Tabs, Toaster, TooltipIconButton, TypeToConfirm

**Hookok:** useLayerClose, usePageTitle, useQueryParam

**Segédek:** notify

## 04 – Média és speciális
**Komponensek:** Avatar, CropDialog, FileImport, Gallery, HeatScale, ImageCropper, ImageUploader (`crop`, `altEditable` – Javaslat 07), ImportResult, Lightbox, MapLegend, MonthCalendar, OpeningHoursEditor, Progress, Stepper, VideoUpload

**Állandók:** KIND_LABEL, MARKER_ICON, MARKER_ICON_SELECTED, WEEK

**Segédek:** checkFiles, clusterHtml, clusterIcon, clusterTier, emptyWeek, eventsByDay, fileKey, heatGradient, initials, issuesToCsv, markerHtml, mbText, parseTime, sizePair, sniffType, stepsFrom, typeNames, validateHours

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
**Komponensek:** Dashboard, DetailActions, DetailPage, EditPage, ErrorSummary, ListPage, SablonFrame, ShellAccount (Javaslat 08)

**Hookok:** useDetailParam, useTemplateTitle

## Tesztlapok (34)
`adat-grafikon`, `adat-grafikon-szelso`, `adat-mutato`, `adat-szuro`, `adat-tabla`, `datum`, `kieg-celcsoport`, `kieg-ellenorzes`, `kieg-elonezet`, `kieg-elozmenyek`, `kieg-mezok`, `kieg-oldalak`, `kieg-osszefesules`, `kieg2-hely`, `kieg2-sorsolas`, `kieg2-video`, `media-import`, `media-kepek`, `media-naptar`, `media-terkep`, `meh`, `mezok`, `reteg-ablak`, `reteg-ertesites`, `reteg-menu`, `reteg-nav`, `reteg-vaz`, `sablon-iranyitopult`, `sablon-lista`, `sablon-reszletek`, `sablon-szerkeszto`, `szam`, `valaszto`, `vezerlok`
