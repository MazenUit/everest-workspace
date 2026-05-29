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