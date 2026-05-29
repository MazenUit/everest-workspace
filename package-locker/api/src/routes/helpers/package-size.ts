import { Size } from '../../domain/types';

// Parse the package size from the request body
export function parsePackageSize(value: unknown): Size | null {
  if (typeof value !== 'string') return null;

  const normalized = value.toUpperCase();

  if (normalized === 'SMALL') return Size.Small;
  if (normalized === 'MEDIUM') return Size.Medium;
  if (normalized === 'LARGE') return Size.Large;

  return null;
}