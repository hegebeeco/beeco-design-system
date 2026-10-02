export type Evszak = 'tavasz' | 'nyar' | 'osz' | 'tel';
/** Melyik évszak van (északi félteke, hónap szerint): III–V tavasz, VI–VIII nyár, IX–XI ősz, XII–II tél */
export declare function evszak(d?: Date): Evszak;
