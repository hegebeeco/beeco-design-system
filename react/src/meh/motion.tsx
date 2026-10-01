import { Children, cloneElement, isValidElement, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../cx';

/** Csökkentett mozgás kérve? (rendszerbeállítás) */
export function useReducedMotion() {
  const [r, setR] = useState(() => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => { const m = matchMedia('(prefers-reduced-motion: reduce)'); const f = () => setR(m.matches); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, []);
  return r;
}

/** Szám-felpörgés: első megjelenéskor 600 ms alatt (ease-out), később érték-váltáskor azonnal (késés nélkül). Csökkentett mozgásnál azonnal. */
export function useCountUp(value: number, ms = 600) {
  const reduce = useReducedMotion();
  const first = useRef(true);
  // Csak az első pörgés alatt van saját állapot; utána mindig a valódi érték jön vissza, egy képkocka késés nélkül
  const [anim, setAnim] = useState<number | null>(reduce ? null : 0);
  useEffect(() => {
    if (reduce || !first.current) { setAnim(null); return; }
    first.current = false;
    const t0 = performance.now(); let raf = 0;
    const step = (t: number) => { const k = Math.min(1, (t - t0) / ms); setAnim(k < 1 ? value * (1 - Math.pow(1 - k, 3)) : null); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); setAnim(null); };
  }, [value, ms, reduce]);
  return anim ?? value;
}

/** Stagger: a gyerekek egymás után úsznak be (30 ms késés, legfeljebb 6-ig). Csak első megjelenéskor – szűrésnél ne használd újra. */
export function Stagger({ children, as: Tag = 'div', className }: { children: ReactNode; as?: 'div' | 'ul' | 'ol' | 'tbody'; className?: string }) {
  return (
    <Tag className={cx('bc-stagger', className)}>
      {Children.map(children, (c, i) => (isValidElement<{ style?: CSSProperties }>(c) ? cloneElement(c, { style: { ...(c.props.style ?? {}), ['--i' as string]: i } }) : c))}
    </Tag>
  );
}

/** Hatszög-konfetti (mérföldkő – ritkán!): 14 méz-hatszög a megadott elem közepéből, 600 ms, aztán eltűnik. */
export function celebrate(from?: Element | null) {
  if (typeof document === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const r = from?.getBoundingClientRect() ?? { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
  const box = document.createElement('div'); box.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('i'); p.className = 'bc-hexpiece';
    const a = (i / 14) * Math.PI * 2, d = 60 + (i % 3) * 30;
    p.style.left = `${r.left + r.width / 2}px`; p.style.top = `${r.top + r.height / 2}px`;
    p.style.setProperty('--dx', `${Math.cos(a) * d}px`); p.style.setProperty('--dy', `${Math.sin(a) * d - 30}px`); p.style.setProperty('--rot', `${(i % 2 ? 1 : -1) * 120}deg`);
    box.appendChild(p);
  }
  document.body.appendChild(box); setTimeout(() => box.remove(), 700);
}

/** Kíméletes „nem jó” rázás egy elemen (pl. hibás beküldésnél az űrlap), 240 ms. */
export function shake(el?: Element | null) {
  if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  el.classList.remove('bc-anim-shake'); void (el as HTMLElement).offsetWidth; el.classList.add('bc-anim-shake');
  setTimeout(() => el.classList.remove('bc-anim-shake'), 300);
}

/** Mézsejt-töltő: rövid töltéshez; 10 mp után megáll (a hívó ekkor írja ki a „toltes-hosszu” mondatot). */
export function HexLoader({ label = 'Töltöm' }: { label?: string }) {
  return <span className="bc-hexload" role="status" aria-label={label}><i /><i /><i /></span>;
}

/** Csíkos haladásjelző (0–1). A felirat mindig szöveggel is mondja (pl. „2,1/5 MB”). */
export function ProgressBar({ value, label, moving }: { value: number; label: string; moving?: boolean }) {
  const v = Math.max(0, Math.min(1, value));
  return (
    <div className={cx('bc-progress', moving && v < 1 && 'is-moving', v >= 1 && 'is-done')} role="progressbar" aria-label={label}
      aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v * 100)} style={{ ['--v' as string]: v }}>
      <span />
    </div>
  );
}
