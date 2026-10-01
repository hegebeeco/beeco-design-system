import { IconButton } from '../inputs/Button';
import { NumberField } from '../inputs/NumberField';
import { SelectField } from '../inputs/SelectField';
import { TextField } from '../inputs/TextField';
import { CloseIcon } from './icons';
import { OPS, type AudienceField, type AudienceRule } from './audience';

type Props = {
  rule: AudienceRule;
  n: number;
  fields: ReadonlyArray<AudienceField>;
  onChange: (r: AudienceRule) => void;
  onRemove: () => void;
  onBlur: () => void;
  error?: string;
  disabled?: boolean;
};

/** Egy szabálysor: mező · feltétel · érték · törlés. A mező váltásakor a feltétel és az érték alapra áll. */
export function AudienceRuleRow({ rule, n, fields, onChange, onRemove, onBlur, error, disabled }: Props) {
  const f = fields.find((x) => x.key === rule.field);
  const ops = f ? OPS[f.type] : [];
  const valueLabel = f ? `${f.label} – érték` : 'Érték';
  return (
    <li className="bc-aud-rule" data-rule={rule.id} data-invalid={error ? true : undefined} onBlur={onBlur} aria-label={`${n}. feltétel`}>
      <div className="bc-aud-grid">
        <SelectField label="Mire szűr" help="Melyik felhasználói adat alapján válogatunk. Csak olyan adat választható, amit az app valóban tárol."
          placeholder="Válassz…" value={rule.field} disabled={disabled}
          options={fields.map((x) => ({ value: x.key, label: x.label }))}
          onChange={(e) => { const nf = fields.find((x) => x.key === e.target.value); onChange({ ...rule, field: e.target.value, op: nf ? OPS[nf.type][0].value : 'eq', value: null }); }} />
        <SelectField label="Feltétel" help="Hogyan vessük össze a felhasználó adatát az értékkel: egyezzen, legyen legalább, legfeljebb, vagy tartalmazza."
          value={f ? rule.op : ''} disabled={disabled || !f} placeholder={f ? undefined : 'Előbb a mezőt'}
          options={ops.map((o) => ({ value: o.value, label: o.label }))}
          onChange={(e) => onChange({ ...rule, op: e.target.value as AudienceRule['op'] })} />
        {!f || f.type === 'select' ? (
          <SelectField label={valueLabel} help={f?.help ?? 'Előbb válaszd ki, mire szűrjön a feltétel.'} placeholder="Válassz…" disabled={disabled || !f}
            value={typeof rule.value === 'string' ? rule.value : ''} options={f?.options ?? []}
            onChange={(e) => onChange({ ...rule, value: e.target.value || null })} />
        ) : f.type === 'number' ? (
          <NumberField label={valueLabel} help={f.help} min={f.min} max={f.max} unit={f.unit} decimals={f.decimals} disabled={disabled}
            value={typeof rule.value === 'number' ? rule.value : null} onChange={(v) => onChange({ ...rule, value: v })} />
        ) : (
          <TextField label={valueLabel} help={f.help} maxLength={f.maxLength ?? 60} disabled={disabled}
            value={typeof rule.value === 'string' ? rule.value : ''} onChange={(e) => onChange({ ...rule, value: e.target.value })} />
        )}
        {!disabled && <IconButton className="bc-aud-remove" aria-label={`${n}. feltétel törlése`} danger onClick={onRemove}><CloseIcon /></IconButton>}
      </div>
      {error && <p className="bc-error" role="alert">{n}. feltétel: {error}</p>}
    </li>
  );
}
