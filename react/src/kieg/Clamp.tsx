import { createContext, useContext, useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../cx';

/** A PreviewCard gyűjti, melyik szöveg vágódik le (név → hány sor fér el, levágva-e) */
export type CutReport = (key: string, label: string, lines: number, cut: boolean) => void;
export const CutContext = createContext<CutReport>(() => undefined);

type Props = {
  /** Azonosító és emberi név a jelzéshez: „title” / „A cím” */
  k: string;
  label: string;
  /** Hány sor fér el az appban (1 = egysoros, „…”-tal) */
  lines: number;
  as?: 'p' | 'h3' | 'span';
  /** Ha üres: ez a halvány helykitöltő látszik („Cím helye”) */
  placeholder: string;
  className?: string;
  children?: ReactNode;
};

/**
 * Clamp: annyi sor, amennyi az appban elfér; a levágást MÉRI (nem karakterszámból becsüli),
 * és jelenti a PreviewCard-nak – szélesség-változáskor (ResizeObserver) és szövegváltáskor újramér.
 */
export function Clamp({ k, label, lines, as: Tag = 'p', placeholder, className, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const report = useContext(CutContext);
  const empty = children === undefined || children === null || (typeof children === 'string' && !children.trim());
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      // Egy sor: szélességre mér; több sor: legalább fél sornyi rejtett magasság (a betű „kilógó” ékezete nem számít)
      const lh = parseFloat(getComputedStyle(el).lineHeight) || 16;
      const cut = !empty && (lines === 1 ? el.scrollWidth > el.clientWidth + 1 : el.scrollHeight - el.clientHeight > lh / 2);
      el.toggleAttribute('data-cut', cut); // a levágott szöveg szaggatott jelölést kap (CSS)
      report(k, label, lines, cut);
    };
    measure();
    // A betűtípus később töltődhet be (a doboz mérete nem változik, a szöveg hossza igen) – akkor is mérünk
    let live = true;
    document.fonts?.ready.then(() => live && measure());
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    return () => { live = false; ro?.disconnect(); };
  }, [children, lines, empty, k, label, report]);
  // Eltűnéskor (pl. a változat cseréjénél) a jelzés is megszűnik
  useEffect(() => () => report(k, label, lines, false), [k, label, lines, report]);
  const style = { ['--lines' as string]: lines } as CSSProperties;
  return (
    <Tag ref={ref as never} className={cx('bc-clamp', lines === 1 && 'is-one', empty && 'is-placeholder', className)} style={style} data-clamp={k}>
      {empty ? placeholder : children}
    </Tag>
  );
}
