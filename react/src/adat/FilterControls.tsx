import { useId, type ReactNode } from 'react';
import { HelpButton } from '../field/HelpButton';
import { Button } from '../inputs/Button';
import { Combobox } from '../pickers/Combobox';

export type FilterOption = { value: string; label: string };
export type FilterDef = {
  id: string;
  /** Látható címke: „Kupon” */
  label: string;
  options: ReadonlyArray<FilterOption>;
  /** Többes választás (keresős legördülő, címkékkel) */
  multiple?: boolean;
  /** Súgó (ⓘ) – a szűrősávban nem kötelező (jóváhagyva 2026-10-01) */
  help?: ReactNode;
  /** Az „összes” opció szövege egyes szűrőnél – alap: „mindegy” */
  anyLabel?: string;
  /** Függő szűrő: ha a szülő változik vagy törlődik, ez is törlődik (pl. kategória → alkategória) */
  parent?: string;
  loading?: boolean;
  loadError?: string;
  onRetry?: () => void;
};
export type FilterValue = string | string[] | null | undefined;

const MULTI_HELP = 'Több is választható. Ha egyet sem választasz, mindegyik látszik.';

/** Egy szűrő: egyes → natív választó („mindegy” opcióval), többes → keresős legördülő (01 Combobox). */
export function FilterControl({ def, value, onChange }: { def: FilterDef; value: FilterValue; onChange: (v: FilterValue) => void }) {
  const id = useId();
  if (def.multiple)
    return (
      <Combobox className="bc-filter is-multi" label={def.label} help={def.help ?? MULTI_HELP} options={def.options} multiple value={Array.isArray(value) ? value : []}
        onChange={(v) => onChange(v.length ? v : null)} loading={def.loading} loadError={def.loadError} onRetry={def.onRetry} maxChips={2} placeholder="mindegy" />
    );
  return (
    <div className="bc-filter">
      <div className="bc-label-row">
        <label className="bc-label" htmlFor={id}>{def.label}</label>
        {def.help && <HelpButton label={def.label}>{def.help}</HelpButton>}
      </div>
      <select id={id} className="bc-select" value={typeof value === 'string' ? value : ''} disabled={def.loading || Boolean(def.loadError)}
        aria-describedby={def.loadError ? `${id}-err` : undefined} onChange={(e) => onChange(e.target.value || null)}>
        <option value="">{def.loading ? 'Betöltés…' : def.anyLabel ?? 'mindegy'}</option>
        {def.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {def.loadError && (
        <div className="bc-filter-err">
          <p className="bc-error" id={`${id}-err`} role="alert">{def.loadError}</p>
          {def.onRetry && <Button variant="ghost" size="sm" onClick={def.onRetry}>Újrapróbálás</Button>}
        </div>
      )}
    </div>
  );
}

/** Aktív szűrő címkéje: „Kupon: van ×” · többesnél „Címke: bio +3 ×” – egy koppintással törölhető */
export function FilterChip({ text, onRemove }: { text: string; onRemove: () => void }) {
  return (
    <li className="bc-chip bc-fb-chip">
      <span title={text}>{text}</span>
      <button type="button" aria-label={`Szűrő törlése: ${text}`} onClick={onRemove}>×</button>
    </li>
  );
}

/** A szűrő értékének rövid szövege a címkéhez; null, ha nem aktív */
export function chipText(def: FilterDef, value: FilterValue) {
  const vals = Array.isArray(value) ? value : value ? [value] : [];
  if (!vals.length) return null;
  const first = def.options.find((o) => o.value === vals[0])?.label ?? vals[0];
  return `${def.label}: ${first}${vals.length > 1 ? ` +${vals.length - 1}` : ''}`;
}
