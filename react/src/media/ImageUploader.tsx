import { useId, useRef, useState, type DragEvent, type ReactNode } from 'react';
import { cx } from '../cx';
import { Field } from '../field/Field';
import { FieldInput } from '../field/FieldInput';
import { formatHu } from '../inputs/number';
import { checkFiles, fileKey, typeNames, type Rejection, type UploadFn } from './files';
import { CropDialog, type UploadCrop } from './CropDialog';
import { Gallery } from './Gallery';
import type { GalleryImage } from './GalleryTile';
import { IcClose, IcPlus } from './icons';
import { UploadTile } from './UploadTile';
import { useUploads } from './useUploads';

export type ImageUploaderProps = {
  label: string;
  /** Súgó (ⓘ): mire kell a kép, hol jelenik meg az appban – kötelező */
  help: ReactNode;
  images: readonly GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  /** A projekt feltöltője: haladást jelez, megszakítható, a kész képet adja vissza (alt nélkül is lehet) */
  upload: UploadFn<GalleryImage>;
  /** Engedett típusok (MIME) – a tartalmat nézzük, nem a kiterjesztést. Alap: JPG, PNG, WebP */
  accept?: readonly string[];
  maxSizeMB?: number;
  maxCount?: number;
  ordering?: boolean;
  confirmDelete?: (img: GalleryImage) => boolean | Promise<boolean>;
  altHelp?: ReactNode;
  /** Mit tegyen, ha a fájl túl nagy (a projekt pontosíthatja) */
  sizeHint?: string;
  required?: boolean;
  disabled?: boolean;
  /** Csak nézhető: nincs feltöltés, menü, húzás */
  readOnly?: boolean;
  error?: string;
  /** Vágás feltöltés előtt, rögzített képaránnyal (Javaslat 07): minden fájlnál feljön a vágó-ablak */
  crop?: UploadCrop;
  /** false: a leírás (alt) nem szerkeszthető, és nincs „Leírás kell” jelzés – ha a backend nem tárolja (a projekt adja az alt-ot) */
  altEditable?: boolean;
};

/**
 * ImageUploader (organizmus, Javaslat 04 – 1A): a galéria-rácsba épülő „+ Kép” csempe.
 * Húzás-ejtés az egész rácsra, fájlválasztó, billentyűzet (a csempe egy <label>, benne a natív fájlmező).
 * A hibás fájl el sem indul; az ok és a teendő a mező alatt marad, amíg be nem zárod.
 */
export function ImageUploader({ label, help, images, onChange, upload, accept = ['image/jpeg', 'image/png', 'image/webp'], maxSizeMB = 5, maxCount = 10,
  ordering, confirmDelete, altHelp, sizeHint = 'Kicsinyítsd le, pl. 2000 px szélesre, és próbáld újra.', required, disabled, readOnly, error, crop, altEditable = true }: ImageUploaderProps) {
  const [rejected, setRejected] = useState<Rejection[]>([]);
  const [note, setNote] = useState<string>();
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const rejId = useId();
  const latest = useRef(images); latest.current = images;
  // Melyik kép melyik fájlból jött (ugyanaz a fájl kétszer ne kerüljön fel, amíg a képe fent van)
  const fromFile = useRef(new Map<string, string>());
  // Vágásnál a feltöltött fájl új: az EREDETI kulcsát jegyezzük meg (ugyanaz a kép kétszer így is kiderül)
  const origKey = useRef(new WeakMap<File, string>());
  // A vágásra váró fájlok sora (az első van az ablakban)
  const [queue, setQueue] = useState<{ files: File[]; total: number }>({ files: [], total: 0 });
  const up = useUploads(upload,
    (img, file) => { fromFile.current.set(img.id, origKey.current.get(file) ?? fileKey(file)); const next = [...latest.current, img]; latest.current = next; onChange(next); },
    (f) => setNote(`Megszakítottad: ${f.name}. Ha mégis kell, válaszd ki újra.`));

  const used = images.length + up.items.length + queue.files.length;
  const full = used >= maxCount;
  const locked = disabled || readOnly;
  const failed = up.items.filter((i) => i.status === 'error');
  const noAlt = altEditable ? images.filter((i) => !i.alt).length : 0;

  const add = async (list: FileList | null) => {
    if (!list || locked) return;
    setNote(undefined);
    const r = await checkFiles([...list], { accept, maxSizeMB, room: maxCount - used, max: maxCount, known: new Set([...up.keys, ...images.flatMap((i) => fromFile.current.get(i.id) ?? [])]), sizeHint, unit: 'kép',
      typeHint: `Mentsd el ${typeNames(accept).split(', ')[0]}-ként (pl. a telefonon: Megosztás → Mentés képként), és töltsd fel újra.` });
    setRejected(r.rejected);
    if (!r.ok.length) return;
    if (crop) setQueue((q) => ({ files: [...q.files, ...r.ok], total: q.total + r.ok.length }));
    else up.start(r.ok);
  };
  const next = () => setQueue((q) => (q.files.length <= 1 ? { files: [], total: 0 } : { ...q, files: q.files.slice(1) }));
  const cropped = (f: File) => { const o = queue.files[0]; if (o) origKey.current.set(f, fileKey(o)); up.start([f]); next(); };
  const skipped = (f: File) => { setNote(`Kihagytad: ${f.name}. Ha mégis kell, válaszd ki újra.`); next(); };
  const fileDrag = {
    over: (e: DragEvent) => { if (locked || !e.dataTransfer.types.includes('Files')) return; e.preventDefault(); e.dataTransfer.dropEffect = full ? 'none' : 'copy'; setOver(true); },
    leave: (e: DragEvent) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver(false); },
    drop: (e: DragEvent) => { if (locked) return; e.preventDefault(); setOver(false); void add(e.dataTransfer.files); },
  };

  return (
    <div className={cx('bc-upload', over && 'is-over', locked && 'is-locked')}>
      <Field label={label} help={help} required={required} disabled={disabled} error={error}
        range={`${typeNames(accept)} · legfeljebb ${formatHu(maxSizeMB, 1)} MB/kép · legfeljebb ${maxCount} kép`}
        count={{ value: used, max: maxCount, unit: 'kép' }}>
        <FieldInput>
          {(f) => (
            <Gallery images={images} onChange={readOnly || disabled ? undefined : onChange} ordering={ordering} confirmDelete={confirmDelete} altHelp={altHelp} altEditable={altEditable} label={label} onFileDrag={fileDrag}>
              {up.items.map((it) => <UploadTile key={it.id} item={it} onCancel={() => up.cancel(it.id)} onRetry={() => up.retry(it.id)} />)}
              {!readOnly && (
                <li className={cx('bc-tile is-add', (full || disabled) && 'is-disabled', used === 0 && 'is-empty')}>
                  <label>
                    <input ref={input} id={f.id} type="file" className="bc-upload-input" multiple accept={accept.join(',')} disabled={full || disabled}
                      aria-describedby={[f.describedBy, rejected.length || failed.length ? rejId : ''].filter(Boolean).join(' ') || undefined}
                      aria-invalid={f.invalid || rejected.length > 0 || undefined} required={required && images.length === 0}
                      onChange={(e) => { void add(e.currentTarget.files); e.currentTarget.value = ''; /* ugyanaz a fájl újra választható */ }} />
                    <IcPlus />
                    <span className="bc-tile-add-t">{full ? 'Tele' : 'Kép'}</span>
                    <span className="bc-tile-add-s">{full ? `${maxCount}/${maxCount} – törölj egyet, ha újat tennél fel` : used === 0 ? 'Húzd ide a képeket, vagy koppints' : 'húzd ide vagy válaszd ki'}</span>
                  </label>
                </li>
              )}
            </Gallery>
          )}
        </FieldInput>
      </Field>
      {(rejected.length > 0 || failed.length > 0) && (
        <div className="bc-upload-errors" id={rejId}>
          <ul role="alert">
            {rejected.map((r, i) => <li key={`r${i}`}><b>{r.file}</b> – {r.reason}. {r.next}</li>)}
            {failed.map((it) => <li key={it.id}><b>{it.file.name}</b> – {it.error} A csempén az „Újra” gombbal folytathatod.</li>)}
          </ul>
          {rejected.length > 0 && <button type="button" className="bc-icon-btn" aria-label="Üzenetek bezárása" onClick={() => setRejected([])}><IcClose /></button>}
        </div>
      )}
      {note && <p className="bc-notice" role="status">{note}</p>}
      {crop && <CropDialog file={queue.files[0] ?? null} crop={crop} position={queue.total > 1 ? `${queue.total - queue.files.length + 1}/${queue.total}` : undefined}
        onDone={cropped} onSkip={skipped} />}
      {noAlt > 0 && !readOnly && <p className="bc-upload-alt" role="status">{noAlt} képnek még nincs leírása – a csempe ⋯ menüjében add meg („Leírás”).</p>}
    </div>
  );
}
