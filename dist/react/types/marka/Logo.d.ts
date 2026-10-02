export type LogoProps = {
    /** s 24 px · m 36 px (alap) · l 56 px magas */
    size?: 's' | 'm' | 'l';
    /** A képernyőolvasó neve. Üres szöveg = díszítő (pl. ha mellette a link szövege már kimondja). Alap: „beeco” */
    label?: string;
    className?: string;
};
/**
 * Logo (atom, Javaslat 10): a beeco logó, amely a témával magától vált – sötét módban a fekete „be” és a csápok
 * krémszínűek (logo-sotet.webp), a méh marad. CSS-háttér (bc-logo), így a projektnek nem kell képet importálnia.
 */
export declare function Logo({ size, label, className }: LogoProps): import("react").JSX.Element;
