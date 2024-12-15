import { useAtom, useSetAtom } from 'jotai';
import { useCallback } from 'react';

import { isPincodeSetAtom } from '../store/auth';
import { configAtom } from '../store/config';
import { Config } from '../types';

export function useSetConfig() {
  const setAtom = useSetAtom(configAtom);
  const setConfigValue = useCallback(
    (value: Partial<Config>) => {
      setAtom((prev) => ({ ...prev, ...value }));
    },
    [setAtom]
  );
  useAtom(isPincodeSetAtom);
  return setConfigValue;
}
