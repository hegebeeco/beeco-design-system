// beeco design system 1.52.0 – GENERÁLT FÁJL, ne szerkeszd kézzel. Forrás: tokens/*.json, eszköz: tools/tokens-build.js
// Használat (tailwind.config.js): presets: [require('@beeco/design-system/tailwind')]
// és a CSS-ben: @import '@beeco/design-system/css/beeco-tokens.css';
module.exports = {
  "darkMode": [
    "variant",
    [
      "&:where(.dark, .dark *)",
      "&:where([data-theme=\"dark\"], [data-theme=\"dark\"] *)"
    ]
  ],
  "theme": {
    "colors": {
      "transparent": "transparent",
      "current": "currentColor",
      "inherit": "inherit",
      "bg": "rgb(var(--bc-bg-rgb) / <alpha-value>)",
      "surface": "rgb(var(--bc-surface-rgb) / <alpha-value>)",
      "surface-2": "rgb(var(--bc-surface-2-rgb) / <alpha-value>)",
      "surface-accent": "rgb(var(--bc-surface-accent-rgb) / <alpha-value>)",
      "ink": "rgb(var(--bc-ink-rgb) / <alpha-value>)",
      "ink-soft": "rgb(var(--bc-ink-soft-rgb) / <alpha-value>)",
      "ink-muted": "rgb(var(--bc-ink-muted-rgb) / <alpha-value>)",
      "line": "rgb(var(--bc-line-rgb) / <alpha-value>)",
      "line-soft": "rgb(var(--bc-line-soft-rgb) / <alpha-value>)",
      "accent": "rgb(var(--bc-accent-rgb) / <alpha-value>)",
      "accent-press": "rgb(var(--bc-accent-press-rgb) / <alpha-value>)",
      "on-accent": "rgb(var(--bc-on-accent-rgb) / <alpha-value>)",
      "shadow": "rgb(var(--bc-shadow-rgb) / <alpha-value>)",
      "focus": "rgb(var(--bc-focus-rgb) / <alpha-value>)",
      "success": "rgb(var(--bc-success-rgb) / <alpha-value>)",
      "success-bg": "rgb(var(--bc-success-bg-rgb) / <alpha-value>)",
      "success-ink": "rgb(var(--bc-success-ink-rgb) / <alpha-value>)",
      "danger": "rgb(var(--bc-danger-rgb) / <alpha-value>)",
      "danger-bg": "rgb(var(--bc-danger-bg-rgb) / <alpha-value>)",
      "danger-ink": "rgb(var(--bc-danger-ink-rgb) / <alpha-value>)",
      "warning": "rgb(var(--bc-warning-rgb) / <alpha-value>)",
      "warning-bg": "rgb(var(--bc-warning-bg-rgb) / <alpha-value>)",
      "warning-ink": "rgb(var(--bc-warning-ink-rgb) / <alpha-value>)",
      "info": "rgb(var(--bc-info-rgb) / <alpha-value>)",
      "info-bg": "rgb(var(--bc-info-bg-rgb) / <alpha-value>)",
      "info-ink": "rgb(var(--bc-info-ink-rgb) / <alpha-value>)",
      "highlight": "rgb(var(--bc-highlight-rgb) / <alpha-value>)",
      "scrim": "rgb(var(--bc-scrim-rgb) / <alpha-value>)",
      "c": {
        "honey": "rgb(var(--bc-honey-rgb) / <alpha-value>)",
        "honey-deep": "rgb(var(--bc-honey-deep-rgb) / <alpha-value>)",
        "butter": "rgb(var(--bc-butter-rgb) / <alpha-value>)",
        "cream": "rgb(var(--bc-cream-rgb) / <alpha-value>)",
        "paper": "rgb(var(--bc-paper-rgb) / <alpha-value>)",
        "white": "rgb(var(--bc-white-rgb) / <alpha-value>)",
        "olive": "rgb(var(--bc-olive-rgb) / <alpha-value>)",
        "olive-strong": "rgb(var(--bc-olive-strong-rgb) / <alpha-value>)",
        "olive-soft": "rgb(var(--bc-olive-soft-rgb) / <alpha-value>)",
        "forest": "rgb(var(--bc-forest-rgb) / <alpha-value>)",
        "leaf": "rgb(var(--bc-leaf-rgb) / <alpha-value>)",
        "lime": "rgb(var(--bc-lime-rgb) / <alpha-value>)",
        "sage": "rgb(var(--bc-sage-rgb) / <alpha-value>)",
        "sage-bg": "rgb(var(--bc-sage-bg-rgb) / <alpha-value>)",
        "sprout": "rgb(var(--bc-sprout-rgb) / <alpha-value>)",
        "blossom": "rgb(var(--bc-blossom-rgb) / <alpha-value>)",
        "blossom-bg": "rgb(var(--bc-blossom-bg-rgb) / <alpha-value>)",
        "berry": "rgb(var(--bc-berry-rgb) / <alpha-value>)",
        "red": "rgb(var(--bc-red-rgb) / <alpha-value>)",
        "crimson": "rgb(var(--bc-crimson-rgb) / <alpha-value>)",
        "blush": "rgb(var(--bc-blush-rgb) / <alpha-value>)",
        "ember": "rgb(var(--bc-ember-rgb) / <alpha-value>)",
        "rust": "rgb(var(--bc-rust-rgb) / <alpha-value>)",
        "sky": "rgb(var(--bc-sky-rgb) / <alpha-value>)",
        "sky-bg": "rgb(var(--bc-sky-bg-rgb) / <alpha-value>)",
        "ice": "rgb(var(--bc-ice-rgb) / <alpha-value>)",
        "water": "rgb(var(--bc-water-rgb) / <alpha-value>)",
        "navy": "rgb(var(--bc-navy-rgb) / <alpha-value>)",
        "focus": "rgb(var(--bc-focus-rgb) / <alpha-value>)",
        "black": "rgb(var(--bc-black-rgb) / <alpha-value>)",
        "coal": "rgb(var(--bc-coal-rgb) / <alpha-value>)",
        "graphite": "rgb(var(--bc-graphite-rgb) / <alpha-value>)",
        "slate": "rgb(var(--bc-slate-rgb) / <alpha-value>)",
        "silver": "rgb(var(--bc-silver-rgb) / <alpha-value>)",
        "mist": "rgb(var(--bc-mist-rgb) / <alpha-value>)",
        "night": "rgb(var(--bc-night-rgb) / <alpha-value>)",
        "night-surface": "rgb(var(--bc-night-surface-rgb) / <alpha-value>)",
        "night-line": "rgb(var(--bc-night-line-rgb) / <alpha-value>)"
      }
    },
    "fontFamily": {
      "display": [
        "var(--bc-font-display)"
      ],
      "body": [
        "var(--bc-font-body)"
      ],
      "sans": [
        "var(--bc-font-body)"
      ]
    },
    "fontSize": {
      "xs": [
        "var(--bc-fs-xs)",
        {
          "lineHeight": "var(--bc-lh-normal)"
        }
      ],
      "s": [
        "var(--bc-fs-s)",
        {
          "lineHeight": "var(--bc-lh-normal)"
        }
      ],
      "m": [
        "var(--bc-fs-m)",
        {
          "lineHeight": "var(--bc-lh-normal)"
        }
      ],
      "l": [
        "var(--bc-fs-l)",
        {
          "lineHeight": "var(--bc-lh-normal)"
        }
      ],
      "xl": [
        "var(--bc-fs-xl)",
        {
          "lineHeight": "var(--bc-lh-tight)"
        }
      ],
      "2xl": [
        "var(--bc-fs-2xl)",
        {
          "lineHeight": "var(--bc-lh-tight)"
        }
      ],
      "3xl": [
        "var(--bc-fs-3xl)",
        {
          "lineHeight": "var(--bc-lh-tight)"
        }
      ]
    },
    "fontWeight": {
      "regular": "var(--bc-fw-regular)",
      "semibold": "var(--bc-fw-semibold)",
      "bold": "var(--bc-fw-bold)"
    },
    "borderRadius": {
      "none": "0",
      "xs": "var(--bc-r-xs)",
      "s": "var(--bc-r-s)",
      "m": "var(--bc-r-m)",
      "l": "var(--bc-r-l)",
      "pill": "var(--bc-r-pill)",
      "DEFAULT": "var(--bc-r-m)",
      "full": "9999px"
    },
    "borderWidth": {
      "0": "0",
      "hair": "var(--bc-bw-hair)",
      "base": "var(--bc-bw-base)",
      "DEFAULT": "var(--bc-bw-hair)"
    },
    "boxShadow": {
      "none": "none",
      "s": "var(--bc-shadow-s)",
      "m": "var(--bc-shadow-m)",
      "l": "var(--bc-shadow-l)",
      "soft": "var(--bc-shadow-soft)"
    },
    "extend": {
      "spacing": {
        "tap": "var(--bc-tap)"
      },
      "minHeight": {
        "tap": "var(--bc-tap)"
      },
      "minWidth": {
        "tap": "var(--bc-tap)"
      },
      "zIndex": {
        "behind": "var(--bc-z-behind)",
        "sticky": "var(--bc-z-sticky)",
        "header": "var(--bc-z-header)",
        "drawer": "var(--bc-z-drawer)",
        "overlay": "var(--bc-z-overlay)",
        "modal": "var(--bc-z-modal)",
        "popover": "var(--bc-z-popover)",
        "toast": "var(--bc-z-toast)",
        "tooltip": "var(--bc-z-tooltip)"
      },
      "transitionDuration": {
        "fast": "var(--bc-t-fast)",
        "base": "var(--bc-t-base)",
        "slow": "var(--bc-t-slow)",
        "press": "var(--bc-t-press)"
      },
      "transitionTimingFunction": {
        "out": "var(--bc-ease-out)",
        "in-out": "var(--bc-ease-in-out)",
        "drawer": "var(--bc-ease-drawer)",
        "bounce": "var(--bc-ease-bounce)"
      }
    }
  }
};
