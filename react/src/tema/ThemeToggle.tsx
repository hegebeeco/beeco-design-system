import { SegmentedControl } from '../inputs/SegmentedControl';
import { TooltipIconButton } from '../reteg/Tooltip';
import { useTheme } from './ThemeProvider';
import type { ThemeMode } from './tema';

export type ThemeLabels = {
  /** A háromállású kapcsoló neve (képernyőolvasó) */
  group: string;
  light: string;
  dark: string;
  auto: string;
  /** Az ikongomb neve és felirata, ha most világos látszik */
  toDark: string;
  /** … ha most sötét látszik */
  toLight: string;
};

/** Alapfeliratok magyarul; kétnyelvű appban a `labels` írja felül (pl. i18n-ből) */
export const THEME_LABELS_HU: ThemeLabels = {
  group: 'Megjelenés', light: 'Világos', dark: 'Sötét', auto: 'Rendszer szerint',
  toDark: 'Sötét mód bekapcsolása', toLight: 'Világos mód bekapcsolása',
};

const svg = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const;
export const IcSun = () => <svg {...svg}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>;
export const IcMoon = () => <svg {...svg}><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /></svg>;
export const IcAuto = () => <svg {...svg}><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></svg>;

export type ThemeToggleProps = {
  /** 'icon' (alap): kompakt hely (oldalsáv alja, eszközsáv) – csak piktogram, súgó-buborékkal (6/A).
   *  'segmented': beállítás-oldal – Világos · Sötét · Rendszer szerint. */
  variant?: 'icon' | 'segmented';
  labels?: Partial<ThemeLabels>;
  className?: string;
};

/** Téma-váltó (atom/molekula, Javaslat 09) – ThemeProvider alatt */
export function ThemeToggle({ variant = 'icon', labels, className }: ThemeToggleProps) {
  const { mode, resolved, setMode, toggle } = useTheme();
  const l = { ...THEME_LABELS_HU, ...labels };

  if (variant === 'segmented') {
    return (
      <SegmentedControl<ThemeMode> label={l.group} value={mode} onChange={setMode} className={className}
        items={[
          { value: 'light', label: l.light, icon: <IcSun /> },
          { value: 'dark', label: l.dark, icon: <IcMoon /> },
          { value: 'auto', label: l.auto, icon: <IcAuto /> },
        ]} />
    );
  }
  // A piktogram azt mutatja, AMIRE vált (a megszokott minta: világosban hold, sötétben nap)
  const toDark = resolved === 'light';
  return (
    <TooltipIconButton label={toDark ? l.toDark : l.toLight} onClick={toggle} className={className} data-theme-toggle="">
      {toDark ? <IcMoon /> : <IcSun />}
    </TooltipIconButton>
  );
}
