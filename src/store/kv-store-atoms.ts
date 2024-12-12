import Storage from 'expo-sqlite/kv-store';
import { atom, PrimitiveAtom } from 'jotai';
import { parse } from 'superjson';

const AsyncStorageDefault = {
  USE_PASSCODE_ENABLED: true,
  USE_FACE_ID_ENABLED: true,
} as const;

export type TKey = keyof typeof AsyncStorageDefault;
export type TData<K> = K extends TKey ? (typeof AsyncStorageDefault)[K] : never;

export const memoAtoms: {
  [key in TKey]: PrimitiveAtom<TData<key>>;
} = Object.keys(AsyncStorageDefault).reduce((acc, key) => {
  let value = AsyncStorageDefault[key];
  const storedJson = Storage.getItemSync(key);
  if (storedJson) {
    try {
      value = parse(storedJson) as TData<typeof key>;
    } catch {
      console.error(`Failed to parse stored value: ${key}`);
    }
  }
  acc[key] = atom(value);
  return acc;
}, {} as any);
