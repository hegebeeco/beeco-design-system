/* beeco design system 1.43.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  markerHtml
} from "./chunk-3ZRENN3X.js";
import {
  accuracyText,
  useGeolocation
} from "./chunk-F7WOJZQG.js";
import {
  AddressSearch
} from "./chunk-NW45TBYP.js";
import {
  MiniMap
} from "./chunk-P6LXFE5S.js";
import {
  HU_CENTER,
  LAT_RANGE,
  LNG_RANGE,
  formatLatLng,
  inHungary,
  looksSwapped,
  roundLatLng,
  sameLatLng,
  validLatLng
} from "./chunk-JEMBLYYW.js";
import {
  NumberField
} from "./chunk-QXEIJ6BB.js";
import {
  HelpButton
} from "./chunk-UT76A3TH.js";
import {
  Button
} from "./chunk-Z655PA3P.js";
import {
  cx
} from "./chunk-4NETF2NE.js";

// react/src/kieg2/LocationPicker.tsx
import { useEffect, useId, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var toDraft = (v) => ({ lat: v?.lat ?? null, lng: v?.lng ?? null });
var SRC = { map: "t\xE9rk\xE9pr\u0151l", search: "c\xEDmkeres\xE9sb\u0151l", fields: "a mez\u0151kb\u0151l", geo: "a jelenlegi helyedb\u0151l", swap: "felcser\xE9lve" };
function LocationPicker({
  label,
  help,
  value,
  onChange,
  renderMap,
  search,
  geolocation = true,
  defaultCenter = HU_CENTER,
  decimals = 6,
  error,
  required,
  disabled = false,
  readOnly = false,
  className,
  latName,
  lngName
}) {
  const id = useId();
  const [draft, setDraft] = useState(() => toDraft(value));
  const [said, setSaid] = useState("");
  const emitted = useRef(value);
  const geo = useGeolocation();
  const locked = disabled || readOnly;
  useEffect(() => {
    if (!sameLatLng(value, emitted.current, decimals)) {
      emitted.current = value;
      setDraft(toDraft(value));
    }
  }, [value, decimals]);
  const emit = (v, source) => {
    emitted.current = v;
    onChange(v, source);
    if (v && source !== "fields") setSaid(`A hely be\xE1ll\xEDtva ${SRC[source]}: ${formatLatLng(v, decimals)}`);
  };
  const setPoint = (p, source) => {
    const r = roundLatLng(p, decimals);
    if (!validLatLng(r)) return;
    setDraft(r);
    emit(r, source);
  };
  const setField = (k, n) => {
    const d = { ...draft, [k]: n };
    setDraft(d);
    const p = d.lat !== null && d.lng !== null ? { lat: d.lat, lng: d.lng } : null;
    emit(p && validLatLng(p) ? p : null, "fields");
  };
  const point = draft.lat !== null && draft.lng !== null && validLatLng({ lat: draft.lat, lng: draft.lng }) ? { lat: draft.lat, lng: draft.lng } : null;
  const outside = point && !inHungary(point);
  const swapped = point && looksSwapped(point);
  const gs = geo.state;
  return /* @__PURE__ */ jsxs("fieldset", { className: cx("bc-loc", className), disabled, "aria-describedby": error ? `${id}-err` : void 0, "aria-invalid": error ? true : void 0, children: [
    /* @__PURE__ */ jsxs("legend", { className: "bc-loc-legend", children: [
      /* @__PURE__ */ jsxs("span", { className: "bc-label", children: [
        label,
        required && /* @__PURE__ */ jsx("span", { className: "is-req", "aria-hidden": "true", children: "*" }),
        required && /* @__PURE__ */ jsx("span", { className: "bc-sr", children: " (k\xF6telez\u0151)" })
      ] }),
      /* @__PURE__ */ jsx(HelpButton, { label, children: help })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bc-loc-grid", children: [
      /* @__PURE__ */ jsx("div", { className: "bc-loc-map", children: renderMap ? renderMap({
        center: point ?? defaultCenter,
        marker: point,
        disabled: locked,
        onPick: (p) => !locked && setPoint(p, "map"),
        markerHtml: markerHtml({ label: "", kind: "neutral", selected: true, title: "Kiv\xE1lasztott hely" })
      }) : /* @__PURE__ */ jsx(MiniMap, { point }) }),
      /* @__PURE__ */ jsxs("div", { className: "bc-loc-side", children: [
        search && !readOnly && /* @__PURE__ */ jsx(AddressSearch, { search, disabled, onPick: (h) => setPoint(h, "search") }),
        /* @__PURE__ */ jsxs("div", { className: "bc-loc-coords", children: [
          /* @__PURE__ */ jsx(
            NumberField,
            {
              label: "Sz\xE9less\xE9g (lat)",
              help: "\xC9szak\u2013d\xE9l ir\xE1ny\xFA helyzet fokban. Magyarorsz\xE1gon kb. 45,7 \xE9s 48,6 k\xF6z\xF6tt van. Tizedesvessz\u0151vel vagy ponttal is \xEDrhatod.",
              name: latName,
              value: draft.lat,
              onChange: (n) => setField("lat", n),
              min: LAT_RANGE.min,
              max: LAT_RANGE.max,
              decimals,
              unit: "\xB0",
              readOnly,
              disabled
            }
          ),
          /* @__PURE__ */ jsx(
            NumberField,
            {
              label: "Hossz\xFAs\xE1g (lng)",
              help: "Kelet\u2013nyugat ir\xE1ny\xFA helyzet fokban. Magyarorsz\xE1gon kb. 16,1 \xE9s 22,9 k\xF6z\xF6tt van. Tizedesvessz\u0151vel vagy ponttal is \xEDrhatod.",
              name: lngName,
              value: draft.lng,
              onChange: (n) => setField("lng", n),
              min: LNG_RANGE.min,
              max: LNG_RANGE.max,
              decimals,
              unit: "\xB0",
              readOnly,
              disabled
            }
          )
        ] }),
        geolocation && !readOnly && /* @__PURE__ */ jsxs("div", { className: "bc-loc-geo", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "secondary",
              busy: gs.status === "locating",
              disabled,
              onClick: () => geo.locate((p) => setPoint(p, "geo")),
              icon: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", width: "20", height: "20", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": "true", children: [
                /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "4" }),
                /* @__PURE__ */ jsx("path", { d: "M12 2v4M12 18v4M2 12h4M18 12h4" })
              ] }),
              children: gs.status === "locating" ? "Keresem a helyed\u2026" : "Jelenlegi helyem"
            }
          ),
          gs.status === "found" && /* @__PURE__ */ jsxs("p", { className: "bc-notice", role: "status", children: [
            "Megvan: ",
            accuracyText(gs.accuracy),
            " pontoss\xE1ggal."
          ] }),
          (gs.status === "denied" || gs.status === "unavailable" || gs.status === "timeout") && /* @__PURE__ */ jsx("p", { className: "bc-loc-geo-err", role: "alert", "data-geo": gs.status, children: gs.message })
        ] }),
        outside && /* @__PURE__ */ jsxs("div", { className: "bc-alert is-warning bc-loc-warn", role: "status", children: [
          /* @__PURE__ */ jsx("p", { children: swapped ? "Ez a pont Magyarorsz\xE1gon k\xEDv\xFCl van \u2013 lehet, hogy felcser\xE9lted a sz\xE9less\xE9get \xE9s a hossz\xFAs\xE1got." : "Ez a pont Magyarorsz\xE1gon k\xEDv\xFCl van. Ha t\xE9nyleg ott a hely, hagyd \xEDgy." }),
          swapped && !locked && /* @__PURE__ */ jsx(Button, { size: "sm", variant: "secondary", onClick: () => setPoint({ lat: point.lng, lng: point.lat }, "swap"), children: "Felcser\xE9lem" })
        ] })
      ] })
    ] }),
    error && /* @__PURE__ */ jsx("p", { className: "bc-error", id: `${id}-err`, role: "alert", children: error }),
    /* @__PURE__ */ jsx("p", { className: "bc-sr", role: "status", children: said })
  ] });
}

export {
  LocationPicker
};
