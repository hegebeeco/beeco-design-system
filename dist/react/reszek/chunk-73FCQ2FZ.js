/* beeco design system 1.46.3 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  ConfirmDialog
} from "./chunk-EZ7WHVF7.js";

// react/src/reteg/guard.tsx
import { createContext, useContext, useState } from "react";
import { jsx } from "react/jsx-runtime";
var LayerCloseContext = createContext(() => void 0);
var useLayerClose = () => useContext(LayerCloseContext);
function useCloseGuard({ onOpenChange, dirty, busy }) {
  const [asking, setAsking] = useState(false);
  const change = (next) => {
    if (next) {
      onOpenChange(true);
      return;
    }
    if (busy) return;
    if (dirty) {
      setAsking(true);
      return;
    }
    onOpenChange(false);
  };
  const discardDialog = /* @__PURE__ */ jsx(
    ConfirmDialog,
    {
      open: asking,
      onOpenChange: setAsking,
      title: "Elveted a m\xF3dos\xEDt\xE1sokat?",
      danger: true,
      confirmLabel: "Elvet\xE9s",
      cancelLabel: "Folytatom a szerkeszt\xE9st",
      onConfirm: () => onOpenChange(false),
      children: "A mentetlen m\xF3dos\xEDt\xE1said elvesznek. Ha meg akarod tartani \u0151ket, folytasd a szerkeszt\xE9st, \xE9s mentsd el."
    }
  );
  return { change, requestClose: () => change(false), discardDialog };
}

export {
  LayerCloseContext,
  useLayerClose,
  useCloseGuard
};
