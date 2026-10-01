import { useRef, useState, type DragEvent, type ReactNode } from 'react';
import { cx } from '../cx';
import { AltDialog, DeleteDialog } from './GalleryDialogs';
import { GalleryTile, type GalleryImage, type TileAction } from './GalleryTile';
import { Lightbox } from './Lightbox';

export type GalleryProps = {
  /** A képek sorrendben; ha a sorrend be van kapcsolva, az ELSŐ a borító */
  images: readonly GalleryImage[];
  /** Változás (sorrend, borító, leírás, törlés) – nélküle a galéria csak nézhető */
  onChange?: (images: GalleryImage[]) => void;
  /** Borító + sorrend (húzás és menü). Alap: be. Ha az app nem használja a sorrendet: false */
  ordering?: boolean;
  /** Törlés előtt: a projekt saját megerősítése (true = törölhető). Ha nincs, a DS kérdez rá. */
  confirmDelete?: (img: GalleryImage) => boolean | Promise<boolean>;
  /** A képleírás súgójának szövege (mire kell, hol jelenik meg az appban) */
  altHelp?: ReactNode;
  /** A lista neve képernyőolvasónak, pl. „Képek” */
  label?: string;
  /** További csempék a rács végén (a feltöltő ide teszi a töltődő képeket és a „+ Kép” csempét) */
  children?: ReactNode;
  className?: string;
  /** A rácsra húzott FÁJL (nem a saját csempe) – a feltöltő kezeli */
  onFileDrag?: { over: (e: DragEvent) => void; leave: (e: DragEvent) => void; drop: (e: DragEvent) => void };
};

const MIME = 'application/x-bc-gallery';

/** Gallery (organizmus, Javaslat 04 – 2A): rács, borító, sorrend húzással és menüből, szerkeszthető alt, törlés, nagyító. */
export function Gallery({ images, onChange, ordering = true, confirmDelete, altHelp, label = 'Képek', children, className, onFileDrag }: GalleryProps) {
  const [zoom, setZoom] = useState<number | null>(null);
  const [altFor, setAltFor] = useState<GalleryImage | null>(null);
  const [delFor, setDelFor] = useState<GalleryImage | null>(null);
  const [drag, setDrag] = useState<{ from: number; over: number | null } | null>(null);
  const [said, setSaid] = useState('');
  const editable = Boolean(onChange);
  const root = useRef<HTMLDivElement>(null);
  // A művelet csempéjének ⋯ gombja – a menüből nyitott ablak bezárása után ide tér vissza a fókusz
  const opener = useRef<string | null>(null);
  const trigger = () => (opener.current && root.current?.querySelector(`[data-tile="${opener.current}"] .bc-tile-menu`)) || root.current?.querySelector('.bc-tile-menu, .bc-tile-open, input');

  const move = (from: number, to: number) => {
    if (!onChange || from === to || to < 0 || to >= images.length) return;
    const next = [...images]; const [x] = next.splice(from, 1); next.splice(to, 0, x);
    onChange(next);
    setSaid(`Áthelyezve: ${x.alt || 'kép'} – ${to + 1}. hely a ${images.length}-ből${to === 0 ? ', ez most a borító' : ''}.`);
  };
  const remove = async (img: GalleryImage) => {
    if (confirmDelete && !(await confirmDelete(img))) return;
    onChange?.(images.filter((x) => x.id !== img.id));
    setSaid(`Törölve: ${img.alt || 'kép'}. ${images.length - 1} kép maradt.`);
  };
  const act = (i: number) => (a: TileAction) => {
    const img = images[i];
    opener.current = img.id;
    if (a === 'open') setZoom(i);
    else if (a === 'cover') move(i, 0);
    else if (a === 'back') move(i, i - 1);
    else if (a === 'forward') move(i, i + 1);
    else if (a === 'alt') setAltFor(img);
    // A projekt saját megerősítése, ha van; különben a DS ablaka kérdez
    else if (a === 'delete') { if (confirmDelete) void remove(img); else setDelFor(img); }
  };

  // Húzás: saját csempe → sorrend; kívülről jövő fájl → a feltöltőé
  const own = (e: DragEvent) => e.dataTransfer.types.includes(MIME);
  const tileDrag = (i: number) => ({
    onDragStart: (e: DragEvent) => { e.dataTransfer.setData(MIME, String(i)); e.dataTransfer.effectAllowed = 'move'; setDrag({ from: i, over: null }); },
    onDragEnd: () => setDrag(null),
    onDragOver: (e: DragEvent) => { if (!own(e) || !drag) return; e.preventDefault(); e.stopPropagation(); if (drag.over !== i) setDrag({ ...drag, over: i }); },
    onDrop: (e: DragEvent) => { if (!own(e) || !drag) return; e.preventDefault(); e.stopPropagation(); move(drag.from, i); setDrag(null); },
  });

  return (
    <div ref={root} className={cx('bc-gallery', className)}
      onDragOver={(e) => { if (!own(e)) onFileDrag?.over(e); }} onDragLeave={(e) => onFileDrag?.leave(e)} onDrop={(e) => { if (!own(e)) onFileDrag?.drop(e); }}>
      <ul className="bc-gallery-grid" aria-label={`${label}: ${images.length} kép`}>
        {images.map((img, i) => (
          <GalleryTile key={img.id} img={img} index={i} count={images.length} ordering={ordering} editable={editable}
            dragging={drag?.from === i} dropTarget={drag?.over === i && drag.from !== i} onAction={act(i)} {...tileDrag(i)} />
        ))}
        {children}
      </ul>
      {images.length === 0 && !children && <p className="bc-gallery-empty">Még nincs kép ebben a galériában.</p>}
      <p className="bc-sr" role="status" aria-live="polite">{said}</p>
      <Lightbox images={images} index={zoom} onIndexChange={setZoom} returnFocus={trigger} />
      <AltDialog fallback={trigger} img={altFor} help={altHelp} onClose={() => setAltFor(null)}
        onSave={(alt) => { if (altFor) { onChange?.(images.map((x) => (x.id === altFor.id ? { ...x, alt } : x))); setSaid('A leírást elmentettem.'); } }} />
      <DeleteDialog fallback={trigger} img={delFor} onClose={() => setDelFor(null)} onConfirm={() => { if (delFor) void remove(delFor); }} />
    </div>
  );
}
