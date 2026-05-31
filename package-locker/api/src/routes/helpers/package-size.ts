import { Size, tryParseSizeLabel } from '../../domain/types';

export function parsePackageSize(value: unknown): Size | null {
  return tryParseSizeLabel(value);
}
