import { forwardRef, useRef, useState, type InputHTMLAttributes } from 'react';
import { mergeRefs } from './mergeRefs';

export type SearchBoxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value'> & {
  /** Mit keres – a képernyőolvasónak (a keresőmezőnek nincs látható címkéje: engedélyezett kivétel, docs/komponensek.md 3/A) */
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  /** Késleltetés (ms) a gépelés után, mielőtt az onSearch lefut – lista-szűrésnél ne kérdezzen minden billentyűre */
  debounce?: number;
  onSearch?: (value: string) => void;
};

/** SearchBox (molekula): nagyító + törlés gomb; Esc törli; késleltetett keresés. */
export const SearchBox = forwardRef<HTMLInputElement, SearchBoxProps>(function SearchBox(
  { label, value, onChange, debounce = 250, onSearch, placeholder, className, ...rest }, ref) {
  const [inner, setInner] = useState(value ?? '');
  const v = value ?? inner;
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const local = useRef<HTMLInputElement | null>(null);
  const set = (next: string) => {
    if (value === undefined) setInner(next);
    onChange?.(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onSearch?.(next.trim()), debounce);
  };
  return (
    <div className={['bc-search', className].filter(Boolean).join(' ')} role="search">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
      <input ref={mergeRefs(ref, local)} type="search" className="bc-input" aria-label={label} placeholder={placeholder ?? label} value={v}
        onChange={(e) => set(e.target.value)} onKeyDown={(e) => { if (e.key === 'Escape' && v) { e.preventDefault(); set(''); } }} {...rest} />
      {v && (
        <button type="button" className="bc-icon-btn" aria-label="Keresés törlése" onClick={() => { set(''); local.current?.focus(); }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      )}
    </div>
  );
});
