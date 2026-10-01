# Javaslat 07 – Képfeltöltés: vágás feltöltés előtt, csak olvasható leírás

*Állapot: **jóváhagyva** · készítette: Claude · dátum: 2026-10-01*

## 1. Igény
- Hol kell: admin → Partner új / szerkesztés (logó 1:1, háttérképek 4:3); később POI, esemény, kupon, napi tény képei.
- Mit old meg: a kép már a feltöltéskor a megjelenés arányára van vágva, és a galéria nem kér olyan adatot (alt), amit a backend nem tud elmenteni.
- Ma helyette: `ImageUploadDropzone` + `ImageCropperModal` (admin, saját stílus), `PartnerImageGallery`.

## 2. Mire épül
- DS: `ImageUploader`, `Gallery`, `GalleryTile`, `ImageCropper` (04 – 3A), `Modal` (03), `Button`.
- Szint: organizmus (`CropDialog`), a meglévők kiegészítése.

## 3. Változatok
| | A (választott) | B |
|---|---|---|
| Leírás (alt) | `altEditable={false}`: a projekt adja az alt-ot (pl. „<Partner> logója”), nincs menüpont és „Leírás kell” jelzés | A backend kap alt-mezőt (Bence), addig a régi feltöltő marad |
| Vágás | `crop={{ aspect, aspectLabel, why }}` az ImageUploaderben: fájlonként feljön a vágó-ablak, utána indul a feltöltés | Csak az adminban: a projekt feltöltő-függvénye nyitja a vágót |

## 4. Állapotok
Vágó-ablak: töltés (a kép dekódolása), „Kivágás és feltöltés” csak kész kivágásnál aktív, kihagyás (a többi fájl megy tovább), hiba (a kivágás nem sikerült – a mező alatt).
A várakozó fájlok beleszámítanak a darab-határba („3/4 kép”).

## 5. Szélső esetek (tesztlap: `media-kepek`)
- Két fájl egyszerre → sorban kérdez („1/2”, „2/2”); kihagyás → „Kihagytad: …” jelzés.
- Kicsi kép → a vágó „homályos lehet” jelzése (`minOutputWidth`).
- Ugyanaz a fájl kétszer → az EREDETI fájl kulcsa alapján ismeri fel (a kivágott fájl új).
- PNG és WebP formátum marad, minden más JPG (0,9 minőség).

## 6. API
```tsx
<ImageUploader … crop={{ aspect: 1, aspectLabel: '1:1', why: 'A logó négyzetes keretben jelenik meg.', minOutputWidth: 400 }} altEditable={false} />
<Gallery … altEditable={false} />
import { CropDialog, cropToFile, type UploadCrop } from '@beeco/design-system/react';
```

## Döntés
Kristóf, 2026-10-01: **A** mindkettőben („Csak olvasható alt” · „DS: vágás az uploaderben”). Ha a backend később tárolja az alt-ot, `altEditable` visszakapcsolható.
