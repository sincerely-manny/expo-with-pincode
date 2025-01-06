import Storage from 'expo-sqlite/kv-store';

const StorageDefault = {
  EWP_USE_PASSCODE_ENABLED: true,
  EWP_USE_FACE_ID_ENABLED: true,
  EWP_AUTO_FACE_ID: true,
};

export type TKey = keyof typeof StorageDefault;
export type TData<K> = K extends TKey ? (typeof StorageDefault)[K] : never;

export function setStorageItem<K extends TKey>(key: K, value: TData<K>) {
  Storage.setItemSync(key, JSON.stringify(value));
}

export function getStorageItem<K extends TKey>(key: K): TData<K> {
  const storedJson = Storage.getItemSync(key);
  if (storedJson) {
    try {
      return JSON.parse(storedJson) as TData<K>;
    } catch {
      console.error(`Failed to parse stored value: ${key}`);
    }
  }
  return StorageDefault[key] as TData<K>;
}
