/* beeco design system 1.48.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/inputs/useLengthCounter.ts
import { useCallback, useLayoutEffect, useRef, useState } from "react";
function useLengthCounter(maxLength) {
  const ref = useRef(null);
  const [len, setLen] = useState(0);
  const [notice, setNotice] = useState();
  useLayoutEffect(() => {
    if (ref.current) setLen(ref.current.value.length);
  });
  const pasted = useRef(false);
  const onInput = useCallback((e) => {
    setLen(e.currentTarget.value.length);
    if (pasted.current) {
      pasted.current = false;
      return;
    }
    setNotice(void 0);
  }, []);
  const onPaste = useCallback((e) => {
    if (!maxLength) return;
    const el = e.currentTarget;
    const text = e.clipboardData.getData("text");
    const selected = (el.selectionEnd ?? 0) - (el.selectionStart ?? 0);
    const room = maxLength - (el.value.length - selected);
    if (text.length > room) {
      pasted.current = true;
      setNotice(`A beillesztett sz\xF6veg v\xE9g\xE9t lev\xE1gtam: legfeljebb ${maxLength} karakter lehet.`);
    }
  }, [maxLength]);
  return { ref, len, notice, onInput, onPaste };
}

export {
  useLengthCounter
};
