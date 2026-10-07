/* beeco design system 1.52.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  Combobox
} from "./chunk-UOQIVCP6.js";

// react/src/kieg2/AddressSearch.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { jsx } from "react/jsx-runtime";
function AddressSearch({
  search,
  onPick,
  label = "C\xEDm keres\xE9se",
  minChars = 3,
  debounceMs = 300,
  disabled,
  help = "\xCDrd be a c\xEDmet vagy a hely nev\xE9t (pl. \u201EAndr\xE1ssy \xFAt 12, Budapest\u201D), \xE9s v\xE1lassz a list\xE1b\xF3l \u2013 a t\u0171 \xE9s a koordin\xE1t\xE1k magukt\xF3l be\xE1llnak."
}) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState([]);
  const [picked, setPicked] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [tick, setTick] = useState(0);
  const searchRef = useRef(search);
  searchRef.current = search;
  useEffect(() => {
    const q = query.trim();
    if (q.length < minChars) {
      setHits([]);
      setLoading(false);
      setError(void 0);
      return;
    }
    const ctl = new AbortController();
    setLoading(true);
    setError(void 0);
    const t = setTimeout(() => {
      searchRef.current(q, ctl.signal).then((r) => {
        if (!ctl.signal.aborted) {
          setHits(r);
          setLoading(false);
        }
      }).catch(() => {
        if (!ctl.signal.aborted) {
          setLoading(false);
          setError("A c\xEDmkeres\xE9s most nem m\u0171k\xF6dik. Pr\xF3b\xE1ld \xFAjra, vagy \xEDrd be a koordin\xE1t\xE1kat.");
        }
      });
    }, debounceMs);
    return () => {
      clearTimeout(t);
      ctl.abort();
    };
  }, [query, minChars, debounceMs, tick]);
  const options = useMemo(() => {
    const list = hits.map((h) => ({ value: h.id, label: h.label }));
    if (picked && !hits.some((h) => h.id === picked.id)) list.unshift({ value: picked.id, label: picked.label });
    return list;
  }, [hits, picked]);
  return /* @__PURE__ */ jsx("div", { className: "bc-loc-search", children: /* @__PURE__ */ jsx(
    Combobox,
    {
      label,
      help,
      range: `legal\xE1bb ${minChars} bet\u0171`,
      disabled,
      filter: false,
      onQueryChange: setQuery,
      minChars,
      placeholder: "Utca, h\xE1zsz\xE1m, telep\xFCl\xE9s",
      options,
      value: picked?.id ?? null,
      loading,
      loadError: error,
      onRetry: () => setTick((n) => n + 1),
      onChange: (id) => {
        const h = hits.find((x) => x.id === id) ?? (picked?.id === id ? picked : null);
        setPicked(h);
        if (h) onPick(h);
      }
    }
  ) });
}

export {
  AddressSearch
};
