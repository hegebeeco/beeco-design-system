import * as T from '@radix-ui/react-tabs';
import { useState, type ReactNode } from 'react';
import { useScrollFade } from './useScrollFade';

export type TabItem = {
  value: string;
  label: string;
  /** Számláló a fülön, pl. „Hibák 3” (a képernyőolvasó is mondja) */
  count?: number;
  disabled?: boolean;
  content: ReactNode;
};

export type TabsProps = {
  items: TabItem[];
  /** A fülsor neve a képernyőolvasónak, pl. „Analitika nézetei” */
  label: string;
  /** Vezérelt mód (pl. ?tab= az URL-ben) */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

/** Számláló-jelvény a fül feliratán */
export function TabCount({ n }: { n: number }) {
  return <><span className="bc-sr"> ({n})</span><span className="bc-tab-count" aria-hidden="true">{n}</span></>;
}

/**
 * Tabs (molekula, Javaslat 03 – 6A): panelváltó ugyanazon az oldalon. Nyilak, Home/End (Radix, automatikus aktiválás).
 * Telefonon a sor görgethető, a széle halványul, a kijelölt fül a látható részbe gördül. Fülváltást nem animálunk.
 * Útvonalat váltó fülsorhoz a NavTabs kell (linkek, aria-current).
 */
export function Tabs({ items, label, value, defaultValue, onValueChange }: TabsProps) {
  const [inner, setInner] = useState(defaultValue ?? items.find((i) => !i.disabled)?.value ?? '');
  const current = value ?? inner;
  const wrap = useScrollFade<HTMLDivElement>('[aria-selected="true"]', current);
  return (
    <T.Root className="bc-tabs-root" value={current} onValueChange={(v) => { setInner(v); onValueChange?.(v); }}>
      <div className="bc-tabs-wrap" ref={wrap}>
        <T.List className="bc-tabs" aria-label={label}>
          {items.map((it) => (
            <T.Trigger key={it.value} value={it.value} disabled={it.disabled} className="bc-tab" title={it.label.length > 28 ? it.label : undefined}>
              <span className="bc-tab-text">{it.label}</span>{it.count !== undefined && <TabCount n={it.count} />}
            </T.Trigger>
          ))}
        </T.List>
      </div>
      {items.map((it) => <T.Content key={it.value} value={it.value} className="bc-tab-panel">{it.content}</T.Content>)}
    </T.Root>
  );
}
