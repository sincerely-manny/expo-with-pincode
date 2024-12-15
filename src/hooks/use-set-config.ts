import { getDefaultStore, useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';

import { isPincodeSetAtom } from '../store/auth';
import { configAtom } from '../store/config';
import { Config } from '../types';

export function useSetConfig(config: Partial<Config>) {
  useAtom(isPincodeSetAtom);
  // const setAtom = useSetAtom(configAtom);
  const [currentConfig, setAtom] = useAtom(configAtom);
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

const store = getDefaultStore();
export function setConfig(config: Partial<Config>) {
  const prev = store.get(configAtom);
  store.set(configAtom, { ...prev, ...config });
}
