import { useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';

import { store } from '../components/pincode-store-provider';
import { isPincodeSetAtom } from '../store/auth';
import { configAtom } from '../store/config';
import type { Config } from '../types';

export function useSetConfig(config: Partial<Config>) {
  useAtom(isPincodeSetAtom);
  // const setAtom = useSetAtom(configAtom);
  const [currentConfig, setAtom] = useAtom(configAtom, { store });
  const setConfigValue = useCallback(
    (value: Partial<Config>) => {
      setAtom((prev) => ({ ...prev, ...value }));
    },
    [setAtom]
  );

  useEffect(() => {
    setConfigValue(config);
    // eslint-disable-next-line
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return currentConfig;
}

export function setConfig(config: Partial<Config>) {
  const prev = store.get(configAtom);
  store.set(configAtom, { ...prev, ...config });
}
