/* beeco design system 1.48.2 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/reteg/Accordion.tsx
import * as A from "@radix-ui/react-accordion";
import { jsx, jsxs } from "react/jsx-runtime";
function Accordion(props) {
  const { items, headingLevel = 3 } = props;
  const H = `h${headingLevel}`;
  const list = items.map((it) => /* @__PURE__ */ jsxs(A.Item, { value: it.value, disabled: it.disabled, className: "bc-acc-item", children: [
    /* @__PURE__ */ jsx(A.Header, { asChild: true, children: /* @__PURE__ */ jsx(H, { className: "bc-acc-h", children: /* @__PURE__ */ jsxs(A.Trigger, { className: "bc-acc-trigger", children: [
      /* @__PURE__ */ jsx("span", { children: it.title }),
      /* @__PURE__ */ jsx("svg", { className: "bc-acc-chev", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M6 9l6 6 6-6" }) })
    ] }) }) }),
    /* @__PURE__ */ jsx(A.Content, { className: "bc-acc-content", children: /* @__PURE__ */ jsx("div", { className: "bc-acc-inner", children: it.content }) })
  ] }, it.value));
  if (props.type === "multiple") {
    return /* @__PURE__ */ jsx(A.Root, { type: "multiple", className: "bc-acc", defaultValue: props.defaultValue, value: props.value, onValueChange: props.onValueChange, children: list });
  }
  return /* @__PURE__ */ jsx(A.Root, { type: "single", collapsible: true, className: "bc-acc", defaultValue: props.defaultValue, value: props.value, onValueChange: props.onValueChange, children: list });
}

export {
  Accordion
};
