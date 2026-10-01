import { useEffect, useState } from 'react';
import { Button } from '../inputs/Button';
import { Modal } from '../reteg/Modal';
import { ImageCropper, type CropArea } from './ImageCropper';

/** Vágás a feltöltés előtt (ImageUploader `crop`): egy rögzített képarány, a projekt nevezi meg */
export type UploadCrop = {
  /** Képarány, pl. 1 (logó) vagy 4 / 3 (háttérkép) */
  aspect: number;
  /** A képarány neve a felületen: „1:1”, „4:3” */
  aspectLabel: string;
  /** Mire kell ez a kivágás – az ablak leírásában: „A logó kör alakú keretben jelenik meg az appban.” */
  why?: string;
  /** Ha a kivágás ennél keskenyebb (px), figyelmeztet */
  minOutputWidth?: number;
};

const KIMENET: Record<string, string> = { 'image/png': 'image/png', 'image/webp': 'image/webp' };

/** A kivágott terület új fájlként (a név marad; PNG és WebP marad, minden más JPG) */
export async function cropToFile(file: File, src: string, area: CropArea): Promise<File> {
  const img = new Image();
  img.src = src;
  await img.decode();
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(area.width));
  c.height = Math.max(1, Math.round(area.height));
  c.getContext('2d')!.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, c.width, c.height);
  const type = KIMENET[file.type] ?? 'image/jpeg';
  const blob = await new Promise<Blob | null>((ok) => c.toBlob(ok, type, 0.9));
  if (!blob) throw new Error('A kivágás nem sikerült – próbáld újra, vagy válassz másik képet.');
  return new File([blob], file.name, { type, lastModified: Date.now() });
}

type Props = {
  /** A soron következő fájl (null = zárva) */
  file: File | null;
  crop: UploadCrop;
  /** Hányadik a sorban: „2/3” – több fájl egyszerre */
  position?: string;
  onDone: (cropped: File) => void;
  onSkip: (file: File) => void;
};

/** CropDialog (organizmus, Javaslat 07): a feltöltő vágó-ablaka. Mégse = ez a kép kimarad, a többi megy tovább. */
export function CropDialog({ file, crop, position, onDone, onSkip }: Props) {
  const [src, setSrc] = useState<string | null>(null);
  const [area, setArea] = useState<CropArea | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string>();

  useEffect(() => {
    if (!file) { setSrc(null); return; }
    const u = URL.createObjectURL(file);
    setSrc(u); setArea(null); setErr(undefined);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  const kesz = async () => {
    if (!file || !src || !area) return;
    setBusy(true);
    try { onDone(await cropToFile(file, src, area)); } catch (e) { setErr(e instanceof Error ? e.message : 'A kivágás nem sikerült.'); } finally { setBusy(false); }
  };

  return (
    <Modal open={file !== null} onOpenChange={(o) => { if (!o && file && !busy) onSkip(file); }} size="wide" busy={busy}
      title={`Kép kivágása (${crop.aspectLabel})${position ? ` – ${position}` : ''}`}
      description={<>{file?.name}{crop.why ? ` · ${crop.why}` : ''}</>}
      footer={
        <>
          <Button variant="secondary" onClick={() => file && onSkip(file)} disabled={busy}>Ezt kihagyom</Button>
          <Button onClick={() => void kesz()} busy={busy} disabled={!area}>Kivágás és feltöltés</Button>
        </>
      }>
      {src && <ImageCropper src={src} aspects={[{ label: crop.aspectLabel, value: crop.aspect }]} minOutputWidth={crop.minOutputWidth} onCrop={(a) => setArea(a)} />}
      {err && <p className="bc-error" role="alert">{err}</p>}
    </Modal>
  );
}
