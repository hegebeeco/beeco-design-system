import { useRef, useState, type FormEvent } from 'react';
import { Button } from '../inputs/Button';
import { TextArea } from '../inputs/TextArea';
import { shake } from '../meh/motion';

export type RerollFormProps = {
  /** Ki volt az előző nyertes (a kérdésben megnevezzük) */
  previous: string;
  minLength: number;
  maxLength?: number;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
};

/**
 * Újrasorsolás indoklása (06b/14): az ok kötelező, mert a jegyzőkönyvbe kerül (onReroll naplózza).
 * Szóvicc itt nincs – ez döntés, nem ünnep (Javaslat 05: 4A).
 */
export function RerollForm({ previous, minLength, maxLength = 200, onConfirm, onCancel }: RerollFormProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string>();
  const form = useRef<HTMLFormElement>(null);
  const area = useRef<HTMLTextAreaElement>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const r = reason.trim();
    if (r.length < minLength) {
      setError(r.length === 0 ? `Írd le röviden, miért sorsolsz újra (legalább ${minLength} karakter) – a jegyzőkönyvbe kerül.` : `Legalább ${minLength} karakter kell – most ${r.length}. Írj egy kicsit többet.`);
      shake(form.current); area.current?.focus();
      return;
    }
    onConfirm(r);
  };

  return (
    <form ref={form} className="bc-draw-reroll" onSubmit={submit} noValidate aria-label="Újrasorsolás">
      <p className="bc-draw-reroll-q">Újrasorsolás – {previous} kimarad a következő húzásból.</p>
      <TextArea ref={area} label="Az újrasorsolás oka" required minLength={minLength} maxLength={maxLength} rows={2} value={reason} error={error}
        help="Miért kell új nyertes? Pl. „Nem válaszolt 7 napig”, „Lemondott a nyereményről”. A jegyzőkönyvbe kerül, a nyertes nem látja."
        onChange={(e) => { setReason(e.target.value); if (error) setError(undefined); }} />
      <div className="bc-draw-actions">
        <Button type="submit">Újrasorsolom</Button>
        <Button variant="ghost" onClick={onCancel}>Mégse</Button>
      </div>
    </form>
  );
}
