import { create } from 'zustand';
import * as api from '../api/client';
import type { Locker, PackageSize } from '../types';
import { ensureMinDelay } from '../utils/min-delay';

type StoredResult = { lockerId: string; pickupCode: string };

interface LockerState {
  lockers: Locker[];
  lockersLoading: boolean;
  lockersError: string | null;

  storeBusy: boolean;
  storeError: string | null;
  lastStored: StoredResult | null;

  retrieveBusy: boolean;
  retrieveError: string | null;
  lastCharge: number | null;

  fetchLockers: () => Promise<void>;
  storePackage: (size: PackageSize) => Promise<void>;
  retrievePackage: (
    lockerId: string,
    pickupCode: string,
    simulatedIso?: string
  ) => Promise<void>;
}

export const useLockerStore = create<LockerState>((set) => ({
  lockers: [],
  lockersLoading: false,
  lockersError: null,

  storeBusy: false,
  storeError: null,
  lastStored: null,

  retrieveBusy: false,
  retrieveError: null,
  lastCharge: null,

  fetchLockers: async () => {
    const started = Date.now();
    set({ lockersLoading: true, lockersError: null });
    const result = await api.listLockers();
    await ensureMinDelay(started);
    if (!result.ok) {
      set({ lockersLoading: false, lockersError: result.error.message });
      return;
    }
    set({ lockersLoading: false, lockers: result.data.lockers });
  },

  storePackage: async (size) => {
    const started = Date.now();
    set({ storeBusy: true, storeError: null, lastStored: null });
    const result = await api.storePackage(size);
    await ensureMinDelay(started);
    if (!result.ok) {
      set({ storeBusy: false, storeError: result.error.message });
      return;
    }
    set({
      storeBusy: false,
      lastStored: {
        lockerId: result.data.lockerId,
        pickupCode: result.data.pickupCode,
      },
    });
    await useLockerStore.getState().fetchLockers();
  },

  retrievePackage: async (lockerId, pickupCode, simulatedIso) => {
    const started = Date.now();
    set({ retrieveBusy: true, retrieveError: null, lastCharge: null });
    const result = await api.retrievePackage(lockerId, pickupCode, simulatedIso);
    await ensureMinDelay(started);
    if (!result.ok) {
      set({ retrieveBusy: false, retrieveError: result.error.message });
      return;
    }
    set({ retrieveBusy: false, lastCharge: result.data.storageCharge });
    await useLockerStore.getState().fetchLockers();
  },
}));
