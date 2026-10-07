/* beeco design system 1.52.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  BeeMoment
} from "./chunk-IQE2XY7J.js";
import {
  CopyButton
} from "./chunk-4TH22F4Y.js";
import {
  Button
} from "./chunk-E5CUZH7I.js";
import {
  cx
} from "./chunk-42HXLUBI.js";

// react/src/kieg/StatusPages.tsx
import { useId } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var HEAD = {
  "szerverhiba": "Hiba t\xF6rt\xE9nt n\xE1lunk",
  "nem-talalhato": "404 \xB7 Nincs ilyen oldal",
  "nincs-jogosultsag": "403 \xB7 Nincs jogosults\xE1god",
  "munkamenet-lejart": "Lej\xE1rt a munkamenet",
  "offline": "Nincs internetkapcsolat"
};
function StatusPage({ kind, action, secondary, sima, extra, className }) {
  const id = useId();
  return /* @__PURE__ */ jsxs("section", { className: cx("bc-status-page", className), "aria-labelledby": id, "data-kind": kind, children: [
    /* @__PURE__ */ jsx("h1", { id, className: "bc-status-h", children: HEAD[kind] }),
    /* @__PURE__ */ jsx(
      BeeMoment,
      {
        pillanat: kind,
        valtozat: 0,
        sima,
        live: kind === "szerverhiba" ? "alert" : void 0,
        action: (action || secondary) && /* @__PURE__ */ jsxs("div", { className: "bc-row bc-status-actions", children: [
          action,
          secondary
        ] })
      }
    ),
    extra && /* @__PURE__ */ jsx("div", { className: "bc-status-extra", children: extra })
  ] });
}
var Home = ({ href, label = "Vissza a kezd\u0151lapra", primary }) => /* @__PURE__ */ jsx("a", { className: cx("bc-btn", !primary && "is-secondary"), href, children: label });
function ErrorPage({ onRetry, retrying, homeHref = "/", errorId, action, className }) {
  return /* @__PURE__ */ jsx(
    StatusPage,
    {
      kind: "szerverhiba",
      className,
      action: action ?? (onRetry ? /* @__PURE__ */ jsx(Button, { busy: retrying, onClick: onRetry, children: "\xDAjrapr\xF3b\xE1l\xE1s" }) : /* @__PURE__ */ jsx(Home, { href: homeHref, primary: true })),
      secondary: onRetry && !action ? /* @__PURE__ */ jsx(Home, { href: homeHref }) : void 0,
      extra: errorId && /* @__PURE__ */ jsxs("p", { className: "bc-status-code", children: [
        "Hibak\xF3d: ",
        /* @__PURE__ */ jsx(CopyButton, { value: errorId, what: "hibak\xF3d", showValue: true }),
        " \u2013 add meg, ha \xEDrsz nek\xFCnk."
      ] })
    }
  );
}
function NotFoundPage({ homeHref = "/", action, className }) {
  return /* @__PURE__ */ jsx(
    StatusPage,
    {
      kind: "nem-talalhato",
      className,
      action: action ?? /* @__PURE__ */ jsx(Home, { href: homeHref, primary: true, label: "Ir\xE1ny a kezd\u0151lap" }),
      secondary: /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: () => history.back(), children: "Vissza az el\u0151z\u0151 oldalra" })
    }
  );
}
function ForbiddenPage({ homeHref = "/", onRequestAccess, requested, action, className }) {
  return /* @__PURE__ */ jsx(
    StatusPage,
    {
      kind: "nincs-jogosultsag",
      className,
      action: action ?? /* @__PURE__ */ jsx(Home, { href: homeHref, primary: !onRequestAccess }),
      secondary: onRequestAccess && /* @__PURE__ */ jsx(Button, { disabled: requested, onClick: onRequestAccess, children: requested ? "K\xE9r\xE9s elk\xFCldve" : "Hozz\xE1f\xE9r\xE9s k\xE9r\xE9se" })
    }
  );
}
function SessionExpired({ onLogin, loginHref = "/login", action, className }) {
  return /* @__PURE__ */ jsx(
    StatusPage,
    {
      kind: "munkamenet-lejart",
      className,
      action: action ?? (onLogin ? /* @__PURE__ */ jsx(Button, { onClick: onLogin, children: "Bel\xE9p\xE9s \xFAjra" }) : /* @__PURE__ */ jsx("a", { className: "bc-btn", href: loginHref, children: "Bel\xE9p\xE9s \xFAjra" }))
    }
  );
}
function OfflinePage({ onRetry, retrying, className }) {
  return /* @__PURE__ */ jsx(StatusPage, { kind: "offline", className, action: onRetry && /* @__PURE__ */ jsx(Button, { busy: retrying, onClick: onRetry, children: "\xDAjrapr\xF3b\xE1l\xE1s" }) });
}

export {
  StatusPage,
  ErrorPage,
  NotFoundPage,
  ForbiddenPage,
  SessionExpired,
  OfflinePage
};
