/** Egy videólink értelmezése (06b/15): saját fájl, YouTube, Vimeo – vagy miért nem jó. Hálózati kérés nélkül, csak a szövegből. */
export type VideoSource = {
    kind: 'empty';
} | {
    kind: 'file';
    url: string;
} | {
    kind: 'youtube' | 'vimeo';
    id: string;
    provider: string;
    embedUrl: string;
    watchUrl: string;
} | {
    kind: 'invalid';
    reason: 'not-url' | 'unsupported' | 'bad-id' | 'insecure';
    message: string;
};
/** A hibaüzenet mindig megmondja a következő lépést */
export declare const VIDEO_URL_MSG: {
    readonly 'not-url': "Ez nem link. Másold be a teljes címet, pl. https://youtu.be/… vagy https://vimeo.com/…";
    readonly unsupported: "Ezt a linket nem tudom lejátszani. YouTube-, Vimeo- vagy MP4/WebM-videólinket adj meg.";
    readonly 'bad-id': "A link hiányos: nincs benne a videó azonosítója. Másold ki újra a videó „Megosztás” gombjával.";
    readonly insecure: "Csak biztonságos (https://) linket tudok beágyazni. Írd át a link elejét https://-re.";
};
export declare function parseVideoUrl(input: string): VideoSource;
