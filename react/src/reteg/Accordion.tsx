import * as A from '@radix-ui/react-accordion';
import type { ReactNode } from 'react';

export type AccordionItem = { value: string; title: ReactNode; content: ReactNode; disabled?: boolean };

type Common = {
  items: AccordionItem[];
  /** A fejlécek címszintje (az oldal címrendjéhez igazítva) */
  headingLevel?: 2 | 3 | 4;
};
export type AccordionProps =
  | (Common & { type?: 'single'; defaultValue?: string; value?: string; onValueChange?: (v: string) => void })
  | (Common & { type: 'multiple'; defaultValue?: string[]; value?: string[]; onValueChange?: (v: string[]) => void });

/**
 * Accordion / lenyitható (molekula, Javaslat 03 – 10): pl. partner-adatlap szakaszai, „Hogyan olvasd?”.
 * Radix: Enter/Szóköz nyit-zár, nyilak a fejlécek között, aria-expanded + aria-controls.
 * single: egyszerre egy nyitva (újra kattintva bezárható) · multiple: több is nyitva lehet.
 */
export function Accordion(props: AccordionProps) {
  const { items, headingLevel = 3 } = props;
  const H = `h${headingLevel}` as 'h3';
  const list = items.map((it) => (
    <A.Item key={it.value} value={it.value} disabled={it.disabled} className="bc-acc-item">
      <A.Header asChild>
        <H className="bc-acc-h">
          <A.Trigger className="bc-acc-trigger">
            <span>{it.title}</span>
            <svg className="bc-acc-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
          </A.Trigger>
        </H>
      </A.Header>
      <A.Content className="bc-acc-content"><div className="bc-acc-inner">{it.content}</div></A.Content>
    </A.Item>
  ));
  if (props.type === 'multiple') {
    return <A.Root type="multiple" className="bc-acc" defaultValue={props.defaultValue} value={props.value} onValueChange={props.onValueChange}>{list}</A.Root>;
  }
  return <A.Root type="single" collapsible className="bc-acc" defaultValue={props.defaultValue} value={props.value} onValueChange={props.onValueChange}>{list}</A.Root>;
}
