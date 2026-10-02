export type Evszak = 'tavasz' | 'nyar' | 'osz' | 'tel';

/** Melyik évszak van (északi félteke, hónap szerint): III–V tavasz, VI–VIII nyár, IX–XI ősz, XII–II tél */
export function evszak(d: Date = new Date()): Evszak {
  const m = d.getMonth() + 1;
  if (m >= 3 && m <= 5) return 'tavasz';
  if (m >= 6 && m <= 8) return 'nyar';
  if (m >= 9 && m <= 11) return 'osz';
  return 'tel';
}
