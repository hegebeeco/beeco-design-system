import { useCallback, useLayoutEffect, useRef, useState, type ClipboardEvent, type FormEvent } from 'react';

/**
 * Élő karakterszámláló + beillesztés-levágás jelzése szöveges mezőkhöz.
 * Vezérelt és nem vezérelt (react-hook-form register) módban is működik: a DOM-értéket olvassa.
 */
export function useLengthCounter<T extends HTMLInputElement | HTMLTextAreaElement>(maxLength?: number) {
  const ref = useRef<T | null>(null);
  const [len, setLen] = useState(0);
  const [notice, setNotice] = useState<string>();

  // Első megjelenéskor (és ha kívülről kap értéket) a tényleges hosszt olvassa
  useLayoutEffect(() => { if (ref.current) setLen(ref.current.value.length); });

  const onInput = useCallback((e: FormEvent<T>) => {
    setLen(e.currentTarget.value.length);
    setNotice(undefined);
  }, []);

  const onPaste = useCallback((e: ClipboardEvent<T>) => {
    if (!maxLength) return;
    const el = e.currentTarget;
    const pasted = e.clipboardData.getData('text');
    const selected = (el.selectionEnd ?? 0) - (el.selectionStart ?? 0);
    const room = maxLength - (el.value.length - selected);
    // A böngésző a maxLength miatt magától levágja – mi szólunk, hogy ne vesszen el csendben
    if (pasted.length > room) setTimeout(() => setNotice(`A beillesztett szöveg végét levágtam: legfeljebb ${maxLength} karakter lehet.`), 0);
  }, [maxLength]);

  return { ref, len, notice, onInput, onPaste };
}
