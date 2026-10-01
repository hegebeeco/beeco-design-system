import { useEffect, useState } from 'react';
import { cx } from '../cx';

export type AvatarProps = {
  /** A személy vagy cég neve – ebből a monogram és a kép alt-ja */
  name: string;
  src?: string | null;
  size?: 24 | 32 | 40 | 64;
  /** Cégnek lekerekített négyzet */
  shape?: 'circle' | 'square';
  /** Díszítő helyen (a név mellette ki van írva): üres alt, a képernyőolvasó átugorja */
  decorative?: boolean;
  className?: string;
};

// Magyar kettős/hármas betűk: „Zsófia” → „Zs”, „Dzsenifer” → „Dzs”
const DIGRAPH = /^(dzs|cs|dz|gy|ly|ny|sz|ty|zs)/i;
const firstLetter = (w: string) => { const m = w.match(DIGRAPH); return m ? m[0][0].toUpperCase() + m[0].slice(1).toLowerCase() : w.charAt(0).toUpperCase(); };

/** Monogram: két szóból a két kezdőbetű (ékezettel: „Kovács Ádám” → „KÁ”), egy szóból az első (kettős) betű */
export function initials(name: string) {
  const words = name.trim().split(/\s+/).filter((w) => /\p{L}/u.test(w));
  if (!words.length) return '?';
  if (words.length === 1) return firstLetter(words[0]);
  return words[0].charAt(0).toUpperCase() + words[words.length - 1].charAt(0).toUpperCase();
}

/** Avatar (atom): kép, ha van és betölt; különben monogram. Méretek: 24 / 32 / 40 / 64 px. */
export function Avatar({ name, src, size = 40, shape = 'circle', decorative = false, className }: AvatarProps) {
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [src]);
  const showImg = src && !broken;
  return (
    <span className={cx('bc-avatar', `is-${size}`, shape === 'square' && 'is-square', className)}
      role={showImg || decorative ? undefined : 'img'} aria-label={showImg || decorative ? undefined : name} aria-hidden={decorative && !showImg ? true : undefined}>
      {showImg ? <img src={src} alt={decorative ? '' : name} onError={() => setBroken(true)} /> : <span aria-hidden="true">{initials(name)}</span>}
    </span>
  );
}
