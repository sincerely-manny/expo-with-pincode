import { getDefaultStore, Provider } from 'jotai';
import { PropsWithChildren } from 'react';

export const store = getDefaultStore() as ReturnType<typeof getDefaultStore>;

export function PincodeStoreProvider({ children }: PropsWithChildren<never>) {
  return <Provider store={store}>{children}</Provider>;
}
