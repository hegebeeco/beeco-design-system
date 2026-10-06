/* beeco design system 1.46.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/reteg/shellNav.ts
import { createContext, useContext } from "react";
var noop = () => {
};
var ShellNavContext = createContext({ closeNav: noop, openNav: noop, navOpen: false, narrow: false, collapsed: false, inShell: false });
var useShellNav = () => useContext(ShellNavContext);

export {
  ShellNavContext,
  useShellNav
};
