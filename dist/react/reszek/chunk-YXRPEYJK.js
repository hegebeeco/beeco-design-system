/* beeco design system 1.46.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  useFieldContext
} from "./chunk-IPVSEXKS.js";

// react/src/field/FieldInput.tsx
function FieldInput({ children }) {
  const f = useFieldContext();
  if (!f) throw new Error("A mez\u0151nek Field-en bel\xFCl kell lennie (docs/komponensek.md 3/A)");
  return children(f);
}

export {
  FieldInput
};
