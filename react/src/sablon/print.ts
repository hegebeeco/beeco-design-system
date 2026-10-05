import { useEffect } from 'react';

/**
 * Nyomtatható oldal (Javaslat 20): amíg a komponens látszik, a <html> `bc-print-page` osztályt kap – nyomtatáskor (és PDF-be
 * mentéskor) a keret (oldalsáv, felső sáv, ugrólink, értesítések), a vezérlők (súgógombok, eszközsor, oldalfej-gombok,
 * `.bc-print-hide`) rejtve, a kártyák nem törnek ketté (bc-sablon.css). A lap MINDIG világos témában megy a papírra:
 * a beforeprint előtt a téma világosra vált, az afterprint után visszaáll (sötét módban a világos betű fehér lapon olvashatatlan).
 */
export function usePrintFrame(enabled = true) {
  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return;
    const html = document.documentElement;
    html.classList.add('bc-print-page');
    let saved: { theme: string | null; dark: boolean } | null = null;
    const before = () => {
      if (saved) return;
      saved = { theme: html.getAttribute('data-theme'), dark: html.classList.contains('dark') };
      html.setAttribute('data-theme', 'light');
      html.classList.remove('dark');
    };
    const after = () => {
      if (!saved) return;
      if (saved.theme === null) html.removeAttribute('data-theme'); else html.setAttribute('data-theme', saved.theme);
      html.classList.toggle('dark', saved.dark);
      saved = null;
    };
    window.addEventListener('beforeprint', before);
    window.addEventListener('afterprint', after);
    return () => {
      after();
      html.classList.remove('bc-print-page');
      window.removeEventListener('beforeprint', before);
      window.removeEventListener('afterprint', after);
    };
  }, [enabled]);
}
