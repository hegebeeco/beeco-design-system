import * as Menu from '@radix-ui/react-dropdown-menu';
import type { DragEvent } from 'react';
import { cx } from '../cx';
import { IcDots, IcWarn } from './icons';

export type GalleryImage = {
  id: string;
  src: string;
  /** Képleírás (alt) – kötelező; üresen a csempe jelzi, hogy hiányzik */
  alt: string;
};

export type TileAction = 'open' | 'cover' | 'back' | 'forward' | 'alt' | 'delete';

type Props = {
  img: GalleryImage;
  index: number;
  count: number;
  /** Borító + sorrend bekapcsolva */
  ordering: boolean;
  editable: boolean;
  dragging: boolean;
  dropTarget: boolean;
  onAction: (a: TileAction) => void;
  onDragStart: (e: DragEvent) => void;
  onDragEnd: () => void;
  onDragOver: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
};

/**
 * Egy galéria-csempe: a kép gomb (nagyítót nyit), sarokban „Borító” jelvény és ⋯ menü.
 * A menü a húzás billentyűzetes és érintéses párja: Előre / Hátra / Legyen a borító.
 */
export function GalleryTile({ img, index, count, ordering, editable, dragging, dropTarget, onAction, onDragStart, onDragEnd, onDragOver, onDrop }: Props) {
  const name = img.alt || `${index + 1}. kép (nincs leírása)`;
  const canMove = ordering && editable;
  return (
    <li data-tile={img.id} className={cx('bc-tile', dragging && 'is-dragging', dropTarget && 'is-drop')} draggable={canMove}
      onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver} onDrop={onDrop}>
      <button type="button" className="bc-tile-open" onClick={() => onAction('open')} aria-label={`Nagyítás: ${name}${ordering && index === 0 ? ' (borító)' : ''}`}>
        <img src={img.src} alt="" draggable={false} loading="lazy" decoding="async" />
      </button>
      {ordering && index === 0 && <span className="bc-badge is-accent bc-tile-cover">Borító</span>}
      {!img.alt && <span className="bc-badge is-warning bc-tile-noalt"><IcWarn />Leírás kell</span>}
      {editable && (
        <Menu.Root modal={false}>
          <Menu.Trigger className="bc-icon-btn bc-tile-menu" aria-label={`Műveletek: ${name}`}><IcDots /></Menu.Trigger>
          <Menu.Portal>
            <Menu.Content className="bc-gmenu" align="end" sideOffset={4} collisionPadding={12}>
              <Menu.Item className="bc-gmenu-item" onSelect={() => onAction('open')}>Megnyitás</Menu.Item>
              {canMove && <Menu.Item className="bc-gmenu-item" disabled={index === 0} onSelect={() => onAction('cover')}>Legyen a borító</Menu.Item>}
              {canMove && <Menu.Item className="bc-gmenu-item" disabled={index === 0} onSelect={() => onAction('back')}>Előre (balra)</Menu.Item>}
              {canMove && <Menu.Item className="bc-gmenu-item" disabled={index === count - 1} onSelect={() => onAction('forward')}>Hátra (jobbra)</Menu.Item>}
              <Menu.Item className="bc-gmenu-item" onSelect={() => onAction('alt')}>{img.alt ? 'Leírás (alt) szerkesztése…' : 'Leírás (alt) megadása…'}</Menu.Item>
              <Menu.Separator className="bc-gmenu-sep" />
              <Menu.Item className="bc-gmenu-item is-danger" onSelect={() => onAction('delete')}>Törlés…</Menu.Item>
            </Menu.Content>
          </Menu.Portal>
        </Menu.Root>
      )}
    </li>
  );
}
