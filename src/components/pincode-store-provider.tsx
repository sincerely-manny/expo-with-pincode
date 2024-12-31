import { createStore, Provider } from 'jotai';
import { PropsWithChildren } from 'react';

export const store = createStore() as ReturnType<typeof createStore>;

export function PincodeStoreProvider({ children }: PropsWithChildren<never>) {
  return <Provider store={store}>{children}</Provider>;
}
