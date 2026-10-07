/* beeco design system 1.51.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  errorText,
  fileKey,
  isAbort
} from "./chunk-6XDZVDWZ.js";

// react/src/media/useUploads.ts
import { useCallback, useEffect, useRef, useState } from "react";
var seq = 0;
function useUploads(upload, onDone, onCancel) {
  const [items, setItems] = useState([]);
  const ctrls = useRef(/* @__PURE__ */ new Map());
  const done = useRef(onDone);
  done.current = onDone;
  const cancelCb = useRef(onCancel);
  cancelCb.current = onCancel;
  const patch = (id, p) => setItems((xs) => xs.map((x) => x.id === id ? { ...x, ...p } : x));
  const drop = (id) => setItems((xs) => {
    const x = xs.find((i) => i.id === id);
    if (x) URL.revokeObjectURL(x.preview);
    return xs.filter((i) => i.id !== id);
  });
  const run = useCallback((id, file) => {
    const ctrl = new AbortController();
    ctrls.current.set(id, ctrl);
    let raf = 0, last = 0;
    const onProgress = (loaded) => {
      last = loaded;
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0;
        patch(id, { loaded: last });
      });
    };
    upload(file, { onProgress, signal: ctrl.signal }).then(
      (r) => {
        cancelAnimationFrame(raf);
        ctrls.current.delete(id);
        drop(id);
        done.current(r, file);
      },
      (e) => {
        cancelAnimationFrame(raf);
        ctrls.current.delete(id);
        if (isAbort(e)) return;
        patch(id, { status: "error", error: errorText(e) });
      }
    );
  }, [upload]);
  const start = useCallback((files) => {
    const next = files.map((file) => ({ id: `u${++seq}`, file, preview: URL.createObjectURL(file), loaded: 0, status: "uploading" }));
    setItems((xs) => [...xs, ...next]);
    next.forEach((i) => run(i.id, i.file));
  }, [run]);
  const retry = useCallback((id) => {
    setItems((xs) => xs.map((x) => x.id === id ? { ...x, status: "uploading", loaded: 0, error: void 0 } : x));
    const it = items.find((x) => x.id === id);
    if (it) run(id, it.file);
  }, [items, run]);
  const cancel = useCallback((id) => {
    const it = items.find((x) => x.id === id);
    ctrls.current.get(id)?.abort();
    ctrls.current.delete(id);
    drop(id);
    if (it) cancelCb.current?.(it.file);
  }, [items]);
  useEffect(() => () => ctrls.current.forEach((c) => c.abort()), []);
  const keys = new Set(items.map((i) => fileKey(i.file)));
  return { items, start, retry, cancel, keys, busy: items.some((i) => i.status === "uploading") };
}

export {
  useUploads
};
