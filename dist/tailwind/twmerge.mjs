// beeco design system 1.51.0 – GENERÁLT FÁJL, ne szerkeszd kézzel. Forrás: tokens/*.json, eszköz: tools/tokens-build.js
// Használat: import { extendTailwindMerge } from 'tailwind-merge';
//            import beecoTwMerge from '@beeco/design-system/tailwind-merge';
//            const twMerge = extendTailwindMerge(beecoTwMerge);
// A rounded-l kimarad (Tailwindben a bal oldali sarkok osztálya is).
const beecoTwMerge = {
  "extend": {
    "classGroups": {
      "font-size": [
        {
          "text": [
            "xs",
            "s",
            "m",
            "l",
            "xl",
            "2xl",
            "3xl"
          ]
        }
      ],
      "font-weight": [
        {
          "font": [
            "regular",
            "semibold",
            "bold"
          ]
        }
      ],
      "font-family": [
        {
          "font": [
            "display",
            "body",
            "sans"
          ]
        }
      ],
      "shadow": [
        {
          "shadow": [
            "none",
            "s",
            "m",
            "l",
            "soft"
          ]
        }
      ],
      "rounded": [
        {
          "rounded": [
            "xs",
            "s",
            "m",
            "pill"
          ]
        }
      ],
      "z": [
        {
          "z": [
            "behind",
            "sticky",
            "header",
            "drawer",
            "overlay",
            "modal",
            "popover",
            "toast",
            "tooltip"
          ]
        }
      ],
      "min-h": [
        {
          "min-h": [
            "tap"
          ]
        }
      ],
      "min-w": [
        {
          "min-w": [
            "tap"
          ]
        }
      ]
    }
  }
};
export default beecoTwMerge;
