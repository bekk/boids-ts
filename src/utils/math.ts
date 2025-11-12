/**
 * Tvinger et tall til å være innenfor et spesifisert område.
 * Returnerer verdien hvis den er mellom min og max, min hvis den er under min,
 * og max hvis den er over max.
 * @param value Tallet som skal klampes
 * @param min Den nedre grensen
 * @param max Den øvre grensen
 * @returns Det klampede tallet
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
