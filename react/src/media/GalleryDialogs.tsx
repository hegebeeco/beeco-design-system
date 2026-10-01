import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Button } from '../inputs/Button';
import { TextField } from '../inputs/TextField';
import type { GalleryImage } from './GalleryTile';
import { useReturnFocus } from './useReturnFocus';

/** Kis ablak a galéria műveleteihez (Radix Dialog + a DS bc-scrim/bc-modal kinézete) */
function Small({ open, onClose, title, children, foot, fallback }: { open: boolean; onClose: () => void; title: string; children: ReactNode; foot: ReactNode; fallback?: () => Element | null | undefined }) {
  const back = useReturnFocus(open, fallback);
  return (
    <Dialog.Root open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="bc-scrim">
          <Dialog.Content className="bc-modal" aria-describedby={undefined} onCloseAutoFocus={back}>
            <div className="bc-modal-head"><Dialog.Title>{title}</Dialog.Title></div>
            <div className="bc-modal-body">{children}</div>
            <div className="bc-modal-foot">{foot}</div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export const ALT_MAX = 150;
export const ALT_HELP = 'Mondd el egy mondatban, mi látszik a képen – ezt olvassa fel a képernyőolvasó, és ez jelenik meg, ha a kép nem tölt be. Pl. „A kávézó terasza nyáron, virágládákkal”. Ne a fájlnevet írd.';

/** Képleírás (alt) szerkesztése – kötelező, 3–150 karakter; üresen nem menthető */
export function AltDialog({ img, help = ALT_HELP, onSave, onClose, fallback }: { img: GalleryImage | null; help?: ReactNode; onSave: (alt: string) => void; onClose: () => void; fallback?: () => Element | null | undefined }) {
  const [text, setText] = useState('');
  const [err, setErr] = useState<string>();
  useEffect(() => { setText(img?.alt ?? ''); setErr(undefined); }, [img]);
  const save = (e: FormEvent) => {
    e.preventDefault();
    const t = text.trim().replace(/\s+/g, ' ');
    if (t.length < 3) { setErr(t ? `Legalább 3 karakter kell – most ${t.length}.` : 'A leírás kötelező – írd le egy mondatban, mi látszik a képen.'); return; }
    onSave(t); onClose();
  };
  return (
    <Small open={!!img} onClose={onClose} title="Képleírás (alt)" fallback={fallback}
      foot={<><Button variant="secondary" onClick={onClose}>Mégse</Button><Button type="submit" form="bc-alt-form">Mentés</Button></>}>
      <form id="bc-alt-form" onSubmit={save} noValidate>
        {img && <img className="bc-alt-thumb" src={img.src} alt="" />}
        <TextField label="Mi látszik a képen?" help={help} required minLength={3} maxLength={ALT_MAX} value={text}
          onChange={(e) => { setText(e.target.value); setErr(undefined); }} error={err} autoFocus />
      </form>
    </Small>
  );
}

/** Törlés megerősítése – a kép kicsiben látszik, hogy biztosan a jót töröld */
export function DeleteDialog({ img, onConfirm, onClose, fallback }: { img: GalleryImage | null; onConfirm: () => void; onClose: () => void; fallback?: () => Element | null | undefined }) {
  return (
    <Small open={!!img} onClose={onClose} title="Törlöd ezt a képet?" fallback={fallback}
      foot={<><Button variant="secondary" onClick={onClose} autoFocus>Mégse</Button><Button variant="danger" onClick={() => { onConfirm(); onClose(); }}>Törlés</Button></>}>
      {img && <img className="bc-alt-thumb" src={img.src} alt="" />}
      <p>{img?.alt ? `„${img.alt}”` : 'A leírás nélküli kép'} lekerül a galériából. Ha kell, később újra feltöltheted.</p>
    </Small>
  );
}
