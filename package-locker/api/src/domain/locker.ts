// assign to the smallest locker that fits and is available.

import { Size } from './types';

export interface Locker {
  id: string;
  size: Size;
  isAvailable: boolean;
}

