import Storage from 'expo-sqlite/kv-store';
import { useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { stringify } from 'superjson';

import { memoAtoms, TData, TKey } from './kvStoreAtoms';

/**
 * A hook to get, set, and remove an async stored state.
 * @param key The key of the stored state.
 * @returns `[state, setState]` — A stateful value and a function to update it.
 */
export function useKvStore<K extends TKey>(key: K) {
  const [memoValue, setMemoValue] = useAtom(memoAtoms[key]);

  const set = useCallback(
    async (value: TData<K>) => {
      let json: string | null = null;
      try {
        json = stringify(value);
      } catch (error) {
        console.error('Failed to stringify value', error);
      }
      if (json) {
        try {
          await Storage.setItem(key, json);
        } catch (error) {
          console.error('Failed to set item', error);
        }
      }
    },
    [key]
  );

  useEffect(() => {
    set(memoValue);
  }, [memoValue, set]);

  return [memoValue, setMemoValue];
}
