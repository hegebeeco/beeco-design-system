import { type UploadFn } from './files';
export type UploadItem = {
    id: string;
    file: File;
    /** Előnézet (objectURL) – a csempén a töltés alatt is látszik a kép */
    preview: string;
    loaded: number;
    status: 'uploading' | 'error';
    error?: string;
};
/**
 * Több fájl párhuzamos feltöltése a projekt által adott `upload` függvénnyel.
 * Siker → onDone(eredmény) és a csempe eltűnik (a kép a galériába kerül); hiba → a csempén marad „Újra” gombbal;
 * megszakítás → a csempe eltűnik, és szól (onCancel).
 */
export declare function useUploads<R>(upload: UploadFn<R>, onDone: (result: R, file: File) => void, onCancel?: (file: File) => void): {
    items: UploadItem[];
    start: (files: readonly File[]) => void;
    retry: (id: string) => void;
    cancel: (id: string) => void;
    keys: Set<string>;
    busy: boolean;
};
