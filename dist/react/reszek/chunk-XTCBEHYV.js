/* beeco design system 1.45.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  useFieldContext
} from "./chunk-ADN74CWZ.js";

// react/src/field/FieldInput.tsx
function FieldInput({ children }) {
  const f = useFieldContext();
  if (!f) throw new Error("A mez\u0151nek Field-en bel\xFCl kell lennie (docs/komponensek.md 3/A)");
  return children(f);
}

export {
  FieldInput
};
