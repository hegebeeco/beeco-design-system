/** A sprite-tal rendelkező szereplők (tools/meh-sprite/mozgasok.json) */
export type SpriteSzereplo = 'hazigazda' | 'szurkolo' | 'gondolkodo' | 'piheno' | 'futar' | 'bajnok';
export type BeeSpriteProps = {
    szereplo: SpriteSzereplo;
    /** s = 64 px, m = 128 px (alap), l = 192 px – a kijelző sűrűségéhez a megfelelő (1×/2×/3×) lapot tölti */
    size?: 's' | 'm' | 'l';
    /** Újraindítja a mozgást, ha változik (pl. minden sikeres mentésnél) */
    replay?: unknown;
    /** Ha a mozgás mond valamit, amit a szöveg nem; alapból díszítő */
    label?: string;
    className?: string;
};
/**
 * BeeSprite (atom, Javaslat 05 – méhecske-sprite): a meglévő méhecske kódból animált mozgása.
 * A beállított számú ismétlés után megáll (végtelen mozgás nincs); csökkentett mozgásnál az első képkocka áll.
 * Mobilapp: ugyanez Lottie-ként (dist/meh/<szereplo>/lottie.json) – docs/meh-sprite.md.
 */
export declare function BeeSprite({ szereplo, size, replay, label, className }: BeeSpriteProps): import("react").JSX.Element;
