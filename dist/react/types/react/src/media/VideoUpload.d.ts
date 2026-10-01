import { type ReactNode } from 'react';
import { type UploadFn } from './files';
export type VideoUploadProps = {
    label: string;
    help: ReactNode;
    /** Feltöltés (haladással, megszakítható) – a projekt adja */
    upload: UploadFn<void>;
    /** Feldolgozás a feltöltés után (pl. átkódolás, regisztráció); hiba esetén a feltöltés megmarad, csak ez ismételhető */
    process?: () => Promise<void>;
    onDone?: (file: File) => void;
    maxSizeMB?: number;
    disabled?: boolean;
};
/** VideoUpload (organizmus, Javaslat 04 – 4): fájl → feltöltés → feldolgozás → kész. Csak MP4 (a tartalom szerint), méret-határ, megszakítás, újrapróbálás. */
export declare function VideoUpload({ label, help, upload, process, onDone, maxSizeMB, disabled }: VideoUploadProps): import("react").JSX.Element;
