import clientsSeed from '@/utils/mocks/clients';
import driveSeed from '@/utils/mocks/drive';
import leadsSeed from '@/utils/mocks/leads';
import meetingsSeed from '@/utils/mocks/meetings';
import usersSeed from '@/utils/mocks/users';
import type { ClientRecord, DriveFileRecord, LeadRecord, MeetingRecord, UserRecord } from '@/utils/types/admin';

type PersistOptions<T> = {
  hydrate?: (items: any[]) => T[];
};

const canUseStorage = () => typeof window !== 'undefined';

const cloneData = <T>(value: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
};

const createPersistentCollection = <T extends { id: string }>(storageKey: string, seed: T[], options: PersistOptions<T> = {}) => {
  return createSharedComposable(() => {
    const items = ref<T[]>([]);
    const initialized = ref(false);

    const reset = () => {
      items.value = cloneData(seed);
    };

    const load = () => {
      if (initialized.value) return;

      if (!canUseStorage()) {
        reset();
        initialized.value = true;
        return;
      }

      const stored = localStorage.getItem(storageKey);

      if (!stored) {
        reset();
        initialized.value = true;
        return;
      }

      try {
        const parsed = JSON.parse(stored);
        items.value = options.hydrate ? options.hydrate(parsed) : parsed;
      } catch {
        reset();
      }

      initialized.value = true;
    };

    const upsert = (item: T) => {
      const index = items.value.findIndex((current) => current.id === item.id);

      if (index >= 0) {
        items.value[index] = item;
        return;
      }

      items.value = [item, ...items.value];
    };

    const remove = (id: string) => {
      items.value = items.value.filter((item) => item.id !== id);
    };

    watch(
      items,
      (value) => {
        if (!canUseStorage()) return;
        localStorage.setItem(storageKey, JSON.stringify(value));
      },
      { deep: true }
    );

    load();

    return {
      items,
      load,
      reset,
      upsert,
      remove,
    };
  });
};

export const useClientsCrud = createPersistentCollection<ClientRecord>('template:clients', clientsSeed);
export const useLeadsCrud = createPersistentCollection<LeadRecord>('template:leads', leadsSeed);
export const useUsersCrud = createPersistentCollection<UserRecord>('template:users', usersSeed);
export const useDriveCrud = createPersistentCollection<DriveFileRecord>('template:drive', driveSeed);
export const useMeetingsCrud = createPersistentCollection<MeetingRecord>('template:meetings', meetingsSeed, {
  hydrate: (items) =>
    items.map((item) => ({
      ...item,
      startTime: new Date(item.startTime),
      endTime: new Date(item.endTime),
    })),
});
