import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../cx';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** primary = méz fő gomb (képernyőnként egy) · secondary · ghost · danger */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
  /** Folyamatban: a felirat helyén pörgő, a gomb nem nyomható (dupla beküldés ellen) */
  busy?: boolean;
  /** Kész: rövid „mentve-pipa” (Javaslat 05) – a hívó ~1,5 mp után visszaállítja */
  done?: boolean;
  icon?: ReactNode;
};

/** Button (atom) – a DS .bc-btn React-változata. Alapból type="button" (nem küld be véletlenül űrlapot). */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', block, busy, done, icon, className, children, type = 'button', disabled, ...rest }, ref) {
  return (
    <button ref={ref} type={type} disabled={disabled} aria-busy={busy || undefined}
      aria-disabled={busy || undefined} onClickCapture={busy ? (e) => e.preventDefault() : undefined}
      className={cx('bc-btn', variant !== 'primary' && `is-${variant}`, size !== 'md' && `is-${size}`, block && 'is-block', className)} {...rest}>
      {done ? <span className="bc-anim-tick" aria-hidden="true">✓</span> : icon}
      {children}
      {done && <span className="bc-sr" role="status">Kész</span>}
    </button>
  );
});

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Kötelező: a képernyőolvasó ezt mondja (az ikon önmagában nem beszél) */
  'aria-label': string;
  danger?: boolean;
  children: ReactNode;
};

/** IconButton (atom) – 44×44 px, kötelező aria-label. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { danger, className, type = 'button', children, ...rest }, ref) {
  return (
    <button ref={ref} type={type} className={cx('bc-icon-btn', danger && 'is-danger', className)} {...rest}>
      {children}
    </button>
  );
});
