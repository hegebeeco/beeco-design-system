import { forwardRef, useEffect, useLayoutEffect, useRef, useState, type ClipboardEvent, type InputHTMLAttributes, type KeyboardEvent } from 'react';
import { Field, type FieldProps } from '../field/Field';
import { FieldInput } from '../field/FieldInput';
import { mergeRefs } from '../inputs/mergeRefs';
import { formatNational, parsePhone, phoneInfo, phoneProblem, toE164, typedDigits, type PhoneInfo, type PhoneKind } from './phone';

export type PhoneFieldProps = FieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'type'> & {
  /** E.164 („+36301234567”) vagy üres szöveg */
  value: string;
  /** Minden változáskor: E.164 + a szám adatai (mobil/vezetékes, teljes-e, érvényes-e) */
  onChange: (value: string, info: PhoneInfo) => void;
  /** Milyen szám kell: bármely (alap), csak mobil vagy csak vezetékes */
  kind?: 'barmely' | Exclude<PhoneKind, 'ismeretlen'>;
};

const RANGE = { barmely: 'mobil: 9 számjegy · vezetékes: 8', mobil: 'mobil: 20, 30, 31, 50, 70 + 7 számjegy', vezetekes: 'vezetékes: 8 számjegy (Budapest: 1 + 7)' };
const KIND = { mobil: 'mobilszám', vezetekes: 'vezetékes szám', ismeretlen: '' };
// Hányadik karakter után áll a formázott szövegben az n-edik számjegy
const caretAfter = (text: string, n: number) => { if (n <= 0) return 0; let seen = 0; for (let i = 0; i < text.length; i++) if (/\d/.test(text[i]) && ++seen === n) return i + 1; return text.length; };

/**
 * PhoneField (molekula, Javaslat 06a/1): rögzített +36 előtag, gépelés közbeni magyar tagolás (30 123 4567),
 * betű nem írható be (jelzi), beillesztésnél felismeri a +36 / 06 / 0036 előtagot, a túl hosszút levágja és szól.
 * Kilépéskor ellenőriz: ismeretlen előhívó, hiányzó számjegyek, mobil/vezetékes elvárás.
 */
export const PhoneField = forwardRef<HTMLInputElement, PhoneFieldProps>(function PhoneField(
  { label, help, range, error, notice, required, disabled, className, value, onChange, kind = 'barmely', onBlur, onFocus, ...rest }, ref) {
  const inner = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(() => formatNational(parsePhone(value).digits));
  const [note, setNote] = useState<string>();
  const [touched, setTouched] = useState(false);
  const focused = useRef(false);
  const caret = useRef<number | null>(null);

  // Kívülről jövő érték (űrlap visszaállítása) – csak ha nem épp gépel
  useEffect(() => { if (!focused.current) setText(formatNational(parsePhone(value).digits)); }, [value]);
  useLayoutEffect(() => {
    const el = inner.current;
    if (el && caret.current !== null && document.activeElement === el) el.setSelectionRange(caret.current, caret.current);
    caret.current = null;
  }, [text]);

  const digits = typedDigits(text).digits;
  const info = phoneInfo(digits);

  /** Új számjegysor → tagolás, kurzor, jelzés, kifelé E.164 */
  const apply = (d: string, digitsBeforeCaret: number, msg?: string) => {
    const i0 = phoneInfo(d);
    let m = msg;
    if (d.length > i0.need) { d = d.slice(0, i0.need); m = m ?? `Legfeljebb ${i0.need} számjegy lehet – a többit nem írtam be.`; }
    const i = phoneInfo(d);
    const t = formatNational(d);
    caret.current = caretAfter(t, Math.min(digitsBeforeCaret, d.length));
    setText(t); setNote(m);
    onChange(toE164(i.digits), i);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // A tagoló szóközt a törlés „átugorja”: az előtte/utána álló számjegyet törli (különben a kurzor beragadna)
    const el = e.currentTarget, s = el.selectionStart ?? 0;
    if (s !== el.selectionEnd) return;
    const back = e.key === 'Backspace' && el.value[s - 1] === ' ';
    const fwd = e.key === 'Delete' && el.value[s] === ' ';
    if (!back && !fwd) return;
    e.preventDefault();
    const raw = back ? el.value.slice(0, s - 2) + el.value.slice(s - 1) : el.value.slice(0, s + 1) + el.value.slice(s + 2);
    const before = (back ? el.value.slice(0, s - 2) : el.value.slice(0, s)).replace(/\D/g, '').length;
    apply(raw.replace(/\D/g, ''), before);
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const el = e.currentTarget;
    const clip = e.clipboardData.getData('text');
    const p = parsePhone(clip);
    if (p.foreign) { setNote('Csak magyar (+36) szám adható meg – a beillesztést kihagytam.'); return; }
    const s = el.selectionStart ?? el.value.length, en = el.selectionEnd ?? s;
    // Teljes szám (előtaggal vagy legalább 8 jeggyel) → lecseréli a mezőt; különben a kurzorhoz szúrja
    const whole = /^\s*(\+|00|06)/.test(clip) || p.digits.length >= 8;
    const head = whole ? '' : el.value.slice(0, s).replace(/\D/g, '');
    const tail = whole ? '' : el.value.slice(en).replace(/\D/g, '');
    const d = head + p.digits + tail;
    const msg = p.cropped || d.length > phoneInfo(d).need ? `A beillesztett szám végét levágtam: legfeljebb ${phoneInfo(d).need} számjegy lehet.`
      : p.letters ? 'A beillesztett szövegből csak a számjegyeket tartottam meg.' : undefined;
    apply(d, head.length + p.digits.length, msg);
  };

  const problem = touched ? (required && !digits ? 'Add meg a telefonszámot – pl. 30 123 4567.' : phoneProblem(info, kind)) : undefined;
  const kindText = info.kind !== 'ismeretlen' ? `${KIND[info.kind]} · ${info.need} számjegy` : RANGE[kind];

  return (
    // Az állapot (7/9) a tartomány-sorban: a teljes szám jó dolog, ezért nem kapja a számláló „határon” hibaszínét
    <Field label={label} help={help} range={`${range ?? kindText} · ${digits.length}/${info.need}${info.valid ? ' ✓' : ''}`}
      error={error ?? problem} notice={notice ?? note} required={required} disabled={disabled} className={className}>
      <FieldInput>
        {(f) => (
          <div className="bc-phone">
            <span className="bc-phone-cc" aria-hidden="true">+36</span>
            <input ref={mergeRefs(ref, inner)} id={f.id} aria-describedby={f.describedBy} aria-invalid={f.invalid || undefined}
              className="bc-input" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="30 123 4567"
              required={required} disabled={disabled} value={text} aria-label={`${label} (+36 után)`}
              onFocus={(e) => { focused.current = true; onFocus?.(e); }}
              onBlur={(e) => { focused.current = false; setTouched(true); onBlur?.(e); }}
              onKeyDown={onKeyDown} onPaste={onPaste}
              onChange={(e) => {
                const raw = e.target.value, at = e.target.selectionStart ?? raw.length;
                const t = typedDigits(raw);
                apply(t.digits, typedDigits(raw.slice(0, at)).digits.length, t.letters ? 'Csak számjegyet írhatsz be – a betűt kihagytam.' : undefined);
              }} {...rest} />
          </div>
        )}
      </FieldInput>
    </Field>
  );
});
