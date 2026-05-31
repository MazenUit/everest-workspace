export type PackageSize = 'SMALL' | 'MEDIUM' | 'LARGE';

export interface Locker {
  id: string;
  size: PackageSize;
  isAvailable: boolean;
}

export interface ApiError {
  message: string;
  reason?: string;
}
