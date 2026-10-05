import { useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../cx';
import { Button } from '../inputs/Button';
import { SearchBox } from '../inputs/SearchBox';
import { Modal } from './Modal';

/** Egy találat: azonosító, név (ebben emeljük ki a keresett szót), rövid kiegészítés (típus, hely), piktogram. */
export type CommandItem = {
  id: string;
  label: string;
  /** Rövid kiegészítés a sor jobb oldalán (pl. „Partner”, „Budapest”) */
  description?: string;
  /** Díszítő piktogram a név előtt (a jelentést a név és a csoport viszi) */
  icon?: ReactNode;
  disabled?: boolean;
  /** A projekt saját adata (pl. az útvonal) – az onSelect visszakapja */
  data?: unknown;
};
/** Találat-csoport: címe látszik és a képernyőolvasó is mondja (pl. „Partnerek”, „Legutóbb megnyitott”). Üres csoport nem jelenik meg. */
export type CommandGroup = { id: string; label: string; items: readonly CommandItem[] };

export type CommandPaletteLabels = {
  title: string; search: string; placeholder: string; results: string; loading: string; retry: string;
  count: (n: number) => string; tipMove: string; tipOpen: string; tipClose: string;
};
export const COMMAND_PALETTE_LABELS_HU: CommandPaletteLabels = {
  title: 'Keresés', search: 'Keresés', placeholder: 'Keresés…', results: 'Találatok', loading: 'Keresem…', retry: 'Újrapróbálás',
  count: (n) => (n ? `${n} találat` : 'Nincs találat'), tipMove: 'léptetés', tipOpen: 'megnyitás', tipClose: 'bezárás',
};

export type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** A keresett szöveg (vezérelt) – a projekt ebből keres (késleltetve, a saját végpontjain) */
  query: string;
  onQueryChange: (query: string) => void;
  /** A találatok csoportokban; üres mezőnél pl. a legutóbb megnyitottak */
  groups: readonly CommandGroup[];
  /** Kiválasztás (Enter / kattintás). newTab: ⌘/Ctrl + Enter vagy ⌘/Ctrl + kattintás – ilyenkor az ablak nyitva marad. */
  onSelect: (item: CommandItem, opts: { newTab: boolean }) => void;
  /** Rövid leírás a cím alatt (a képernyőolvasó is felolvassa) */
  description?: ReactNode;
  /** loading: „Keresem…” (az előző találatok maradnak) · error: hibasáv újrapróbálással · alap: ready */
  status?: 'ready' | 'loading' | 'error';
  /** A hiba szövege a következő lépéssel; részleges hibánál is (a többi csoport látszik) */
  error?: ReactNode;
  onRetry?: () => void;
  /** Ennyi karakter alatt nem keresünk – ilyenkor a hint látszik (és a groups, ha van, pl. legutóbbiak) */
  minChars?: number;
  /** Tipp üres / túl rövid keresésnél (pl. „Írj legalább 2 betűt.”) */
  hint?: ReactNode;
  /** Nincs találat – alap: „Nincs találat erre: „…”. Próbálj rövidebb szót.” */
  emptyText?: (query: string) => ReactNode;
  /** ⌘K / Ctrl+K bárhonnan nyitja (és zárja) – alap: igen */
  hotkey?: boolean;
  /** A keresett szó kiemelése a nevekben – alap: igen */
  highlight?: boolean;
  /** A billentyű-tippsor az alján (érintőképernyőn rejtve) – alap: igen */
  tips?: boolean;
  /** Feliratok (pl. angolul) – ami hiányzik, az magyar marad */
  labels?: Partial<CommandPaletteLabels>;
  className?: string;
};

const isMac = () => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent);
/** A paletta billentyűparancsának felirata az eszköz szerint: „⌘K” (Mac) vagy „Ctrl+K” */
export const commandHotkeyLabel = () => (isMac() ? '⌘K' : 'Ctrl+K');

/** ⌘K / Ctrl+K figyelése az egész oldalon (Alt/Shift nélkül). A paletta hotkey-e ezt használja; saját gombhoz is jó. */
export function useCommandHotkey(onHotkey: () => void, enabled = true) {
  const cb = useRef(onHotkey);
  useEffect(() => { cb.current = onHotkey; });
  useEffect(() => {
    if (!enabled) return;
    const h = (e: globalThis.KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey || e.isComposing || e.key.toLowerCase() !== 'k') return;
      e.preventDefault();
      cb.current();
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [enabled]);
}

/** A név a keresett szó kiemelésével (kis-/nagybetű nem számít); a szöveg szövegként marad (nincs HTML). */
function Marked({ text, q }: { text: string; q: string }) {
  const n = q.trim().toLocaleLowerCase('hu');
  if (!n) return <>{text}</>;
  const low = text.toLocaleLowerCase('hu');
  if (low.length !== text.length) return <>{text}</>;
  const out: ReactNode[] = [];
  let i = 0;
  for (let at = low.indexOf(n); at >= 0 && out.length < 20; at = low.indexOf(n, i)) {
    if (at > i) out.push(text.slice(i, at));
    out.push(<mark key={at}>{text.slice(at, at + n.length)}</mark>);
    i = at + n.length;
  }
  out.push(text.slice(i));
  return <>{out}</>;
}

/**
 * CommandPalette (organizmus, Javaslat 20): ⌘K / Ctrl+K kereső-paletta – DS Modal (Radix Dialog: fókuszcsapda, Esc,
 * visszatérő fókusz) + SearchBox + csoportosított találatlista. WAI-ARIA combobox/listbox minta: a fókusz a mezőben marad,
 * a kiemelt sort az aria-activedescendant mondja. ↑/↓ léptet (körbe), Enter megnyit
 * (⌘/Ctrl+Enter új lapon), Ctrl/⌘+Home/End az első/utolsó találat, Esc zár. A keresést a projekt végzi (query → groups).
 */
export function CommandPalette({
  open, onOpenChange, query, onQueryChange, groups, onSelect, description, status = 'ready', error, onRetry, minChars = 0, hint, emptyText,
  hotkey = true, highlight = true, tips = true, labels, className,
}: CommandPaletteProps) {
  const l = { ...COMMAND_PALETTE_LABELS_HU, ...labels };
  const listId = useId();
  const input = useRef<HTMLInputElement>(null);
  const [active, setActive] = useState(0);
  const toggle = useRef(() => {});
  toggle.current = () => onOpenChange(!open);
  useCommandHotkey(() => toggle.current(), hotkey);

  const q = query.trim();
  const short = q.length < minChars;
  const shown = groups.filter((g) => g.items.length > 0);
  const items = shown.flatMap((g) => g.items);
  const enabled = items.map((it, i) => (it.disabled ? -1 : i)).filter((i) => i >= 0);
  const act = enabled.length ? (enabled.includes(active) ? active : enabled[0]) : -1;
  const optId = (i: number) => `${listId}-o${i}`;
  const itemsKey = items.map((it) => it.id).join('|');

  // Bezáráskor tiszta lap; új találatlistánál az első választható sor a kiemelt
  useEffect(() => { if (!open) setActive(0); }, [open]);
  useEffect(() => { setActive(enabled[0] ?? 0); }, [itemsKey]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (act >= 0) document.getElementById(optId(act))?.scrollIntoView?.({ block: 'nearest' }); }, [act]); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (it: CommandItem | undefined, newTab: boolean) => {
    if (!it || it.disabled) return;
    if (!newTab) onOpenChange(false);
    onSelect(it, { newTab });
  };
  const step = (d: 1 | -1) => {
    if (!enabled.length) return;
    const at = Math.max(0, enabled.indexOf(act));
    setActive(enabled[(at + d + enabled.length) % enabled.length]);
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); step(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); step(-1); }
    else if ((e.key === 'Home' || e.key === 'End') && (e.ctrlKey || e.metaKey) && enabled.length) { e.preventDefault(); setActive(e.key === 'Home' ? enabled[0] : enabled[enabled.length - 1]); }
    else if (e.key === 'Enter') { e.preventDefault(); if (act >= 0) pick(items[act], e.metaKey || e.ctrlKey); }
  };

  const loading = status === 'loading' && !short;
  const failed = status === 'error' && !short;
  const live = short ? (items.length ? l.count(items.length) : '') : loading ? l.loading : l.count(items.length);
  let n = 0;
  return (
    <Modal open={open} onOpenChange={onOpenChange} title={l.title} description={description} className={cx('bc-cmdk', className)} initialFocus={() => input.current}>
      <SearchBox ref={input} label={l.search} placeholder={l.placeholder} value={query} onChange={onQueryChange} autoComplete="off" spellCheck={false}
        role="combobox" aria-autocomplete="list" aria-expanded={items.length > 0} aria-controls={listId}
        aria-activedescendant={act >= 0 ? optId(act) : undefined} onKeyDown={onKey} />
      <p className="bc-sr" role="status" aria-live="polite">{live}</p>

      <div className="bc-cmdk-list" role="listbox" id={listId} aria-label={l.results} aria-busy={loading || undefined}>
        {shown.map((g) => (
          <div key={g.id} role="group" aria-labelledby={`${listId}-g-${g.id}`} className="bc-cmdk-group">
            <div role="presentation" id={`${listId}-g-${g.id}`} className="bc-cmdk-group-title">{g.label}</div>
            {g.items.map((it) => {
              const i = n++;
              return (
                <div key={it.id} id={optId(i)} role="option" aria-selected={i === act} aria-disabled={it.disabled || undefined} data-active={i === act}
                  className="bc-option bc-cmdk-item"
                  onMouseDown={(e) => e.preventDefault()} onMouseMove={() => { if (i !== act && !it.disabled) setActive(i); }}
                  onClick={(e: MouseEvent) => pick(it, e.metaKey || e.ctrlKey)}>
                  {it.icon && <span className="bc-cmdk-icon" aria-hidden="true">{it.icon}</span>}
                  <span className="bc-cmdk-label">{highlight && !short ? <Marked text={it.label} q={q} /> : it.label}</span>
                  {it.description && <span className="bc-cmdk-desc">{it.description}</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {short && hint && <p className="bc-cmdk-note">{hint}</p>}
      {loading && !items.length && <p className="bc-cmdk-note"><span className="bc-spinner" aria-hidden="true" /> {l.loading}</p>}
      {!short && !loading && !failed && !items.length && (
        <p className="bc-cmdk-note">{emptyText ? emptyText(q) : <>Nincs találat erre: „{q}”. Próbálj rövidebb szót.</>}</p>
      )}
      {failed && (
        <div className="bc-cmdk-note bc-cmdk-error" role="alert">
          <span>{error ?? 'Nem sikerült keresni – próbáld újra pár másodperc múlva.'}</span>
          {onRetry && <Button variant="secondary" size="sm" onClick={onRetry}>{l.retry}</Button>}
        </div>
      )}
      {tips && (
        <p className="bc-cmdk-tips">
          <kbd className="bc-kbd">↑</kbd> <kbd className="bc-kbd">↓</kbd> {l.tipMove} · <kbd className="bc-kbd">Enter</kbd> {l.tipOpen} · <kbd className="bc-kbd">Esc</kbd> {l.tipClose}
        </p>
      )}
    </Modal>
  );
}
