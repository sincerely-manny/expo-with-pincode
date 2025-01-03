import { Provider, createStore } from 'jotai';
import type { PropsWithChildren } from 'react';

export const store = createStore() as ReturnType<typeof createStore>;

export function PincodeStoreProvider({ children }: PropsWithChildren<never>) {
  return <Provider store={store}>{children}</Provider>;
}
