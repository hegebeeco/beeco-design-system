import * as Dialog from '@radix-ui/react-dialog';
import { useRef, type KeyboardEvent, type PointerEvent } from 'react';
import { IcClose, IcLeft, IcRight } from './icons';
import type { GalleryImage } from './GalleryTile';
import { useReturnFocus } from './useReturnFocus';

export type LightboxProps = {
  images: readonly GalleryImage[];
  /** A megnyitott kép indexe; null = zárva */
  index: number | null;
  onIndexChange: (index: number | null) => void;
  /** Hova menjen a fókusz záráskor, ha a nyitó elem már nincs meg (pl. menüből nyitották) */
  returnFocus?: () => Element | null | undefined;
};

/**
 * Lightbox (organizmus): nagyító sötét háttérrel. ← → billentyű (és telefonon húzás) lapoz, Esc zár,
 * „3/12” számláló, alul a képleírás. Fókuszcsapda és a fókusz visszaállítása a Radix Dialogé.
 */
export function Lightbox({ images, index, onIndexChange, returnFocus }: LightboxProps) {
  const open = index !== null && images.length > 0;
  const i = Math.min(index ?? 0, Math.max(0, images.length - 1));
  const img = images[i];
  const go = (d: number) => onIndexChange((i + d + images.length) % images.length);
  const startX = useRef<number | null>(null);
  const back = useReturnFocus(open, returnFocus);

  const onKey = (e: KeyboardEvent) => {
    if (images.length < 2) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  };
  // Húzás (érintés): 40 px fölötti vízszintes mozdulat lapoz
  const onDown = (e: PointerEvent) => { startX.current = e.clientX; };
  const onUp = (e: PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current; startX.current = null;
    if (Math.abs(dx) > 40 && images.length > 1) go(dx < 0 ? 1 : -1);
  };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => { if (!o) onIndexChange(null); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="bc-lightbox-scrim" />
        <Dialog.Content className="bc-lightbox" onKeyDown={onKey} aria-describedby={undefined} onCloseAutoFocus={back}>
          <div className="bc-lightbox-top">
            <span className="bc-lightbox-pill" aria-live="polite" data-lightbox-count>{i + 1}/{images.length}</span>
            <Dialog.Title className="bc-sr">Kép nagyítva: {img?.alt || 'nincs leírása'}</Dialog.Title>
            <Dialog.Close className="bc-icon-btn bc-lightbox-btn" aria-label="Bezárás (Esc)"><IcClose /></Dialog.Close>
          </div>
          <div className="bc-lightbox-mid">
            {images.length > 1 && <button type="button" className="bc-icon-btn bc-lightbox-btn" aria-label="Előző kép (←)" onClick={() => go(-1)}><IcLeft /></button>}
            <div className="bc-lightbox-stage" onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={() => { startX.current = null; }}>
              {img && <img key={img.id} src={img.src} alt={img.alt} draggable={false} />}
            </div>
            {images.length > 1 && <button type="button" className="bc-icon-btn bc-lightbox-btn" aria-label="Következő kép (→)" onClick={() => go(1)}><IcRight /></button>}
          </div>
          <p className="bc-lightbox-cap">{img?.alt || <em>Ennek a képnek még nincs leírása.</em>}</p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
