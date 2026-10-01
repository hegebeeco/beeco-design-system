import { useCallback, useEffect, useRef, useState } from 'react';
import { errorText, fileKey, isAbort, type UploadFn } from './files';

export type UploadItem = {
  id: string;
  file: File;
  /** Előnézet (objectURL) – a csempén a töltés alatt is látszik a kép */
  preview: string;
  loaded: number;
  status: 'uploading' | 'error';
  error?: string;
};

let seq = 0;

/**
 * Több fájl párhuzamos feltöltése a projekt által adott `upload` függvénnyel.
 * Siker → onDone(eredmény) és a csempe eltűnik (a kép a galériába kerül); hiba → a csempén marad „Újra” gombbal;
 * megszakítás → a csempe eltűnik, és szól (onCancel).
 */
export function useUploads<R>(upload: UploadFn<R>, onDone: (result: R, file: File) => void, onCancel?: (file: File) => void) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const ctrls = useRef(new Map<string, AbortController>());
  const done = useRef(onDone); done.current = onDone;
  const cancelCb = useRef(onCancel); cancelCb.current = onCancel;

  const patch = (id: string, p: Partial<UploadItem>) => setItems((xs) => xs.map((x) => (x.id === id ? { ...x, ...p } : x)));
  const drop = (id: string) => setItems((xs) => { const x = xs.find((i) => i.id === id); if (x) URL.revokeObjectURL(x.preview); return xs.filter((i) => i.id !== id); });

  const run = useCallback((id: string, file: File) => {
    const ctrl = new AbortController();
    ctrls.current.set(id, ctrl);
    // A haladást legfeljebb képkockánként írjuk (gyors hálózaton se rajzoljon feleslegesen sokszor)
    let raf = 0, last = 0;
    const onProgress = (loaded: number) => { last = loaded; if (!raf) raf = requestAnimationFrame(() => { raf = 0; patch(id, { loaded: last }); }); };
    upload(file, { onProgress, signal: ctrl.signal }).then(
      (r) => { cancelAnimationFrame(raf); ctrls.current.delete(id); drop(id); done.current(r, file); },
      (e) => { cancelAnimationFrame(raf); ctrls.current.delete(id); if (isAbort(e)) return; patch(id, { status: 'error', error: errorText(e) }); },
    );
  }, [upload]);

  const start = useCallback((files: readonly File[]) => {
    const next = files.map((file) => ({ id: `u${++seq}`, file, preview: URL.createObjectURL(file), loaded: 0, status: 'uploading' as const }));
    setItems((xs) => [...xs, ...next]);
    next.forEach((i) => run(i.id, i.file));
  }, [run]);

  const retry = useCallback((id: string) => {
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, status: 'uploading', loaded: 0, error: undefined } : x)));
    const it = items.find((x) => x.id === id);
    if (it) run(id, it.file);
  }, [items, run]);

  const cancel = useCallback((id: string) => {
    const it = items.find((x) => x.id === id);
    ctrls.current.get(id)?.abort();
    ctrls.current.delete(id);
    drop(id);
    if (it) cancelCb.current?.(it.file);
  }, [items]);

  // Elhagyáskor minden futó feltöltés leáll
  useEffect(() => () => ctrls.current.forEach((c) => c.abort()), []);

  const keys = new Set(items.map((i) => fileKey(i.file)));
  return { items, start, retry, cancel, keys, busy: items.some((i) => i.status === 'uploading') };
}
