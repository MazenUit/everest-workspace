export enum Size {
    Small = 'SMALL',
    Medium = 'MEDIUM',
    Large = 'LARGE',
  }
  
  /** Order matters: index 0 < 1 < 2 for "fits" checks */
  export const SIZE_ORDER: Size[] = [Size.Small, Size.Medium, Size.Large];
  
  export function sizeIndex(size: Size): number {
    const i = SIZE_ORDER.indexOf(size);
    if (i === -1) throw new Error(`Unknown size: ${size}`);
    return i;
  }
  
  /** Package fits locker if locker is same size or larger */
  export function lockerFitsPackage(lockerSize: Size, packageSize: Size): boolean {
    return sizeIndex(lockerSize) >= sizeIndex(packageSize);
  }


  //  Database boundary
export function sizeFromLabel(label: string): Size {
  const normalized = label.toUpperCase();
  if (normalized === Size.Small) return Size.Small;
  if (normalized === Size.Medium) return Size.Medium;
  if (normalized === Size.Large) return Size.Large;
  throw new Error(`Unknown size label: ${label}`);
}

// HTTP boundary
export function tryParseSizeLabel(value: unknown): Size | null {
  if (typeof value !== 'string') return null;
  const normalized = value.toUpperCase();
  if (normalized === Size.Small) return Size.Small;
  if (normalized === Size.Medium) return Size.Medium;
  if (normalized === Size.Large) return Size.Large;
  return null;
}