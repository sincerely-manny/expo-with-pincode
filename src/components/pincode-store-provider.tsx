import { createStore, Provider } from 'jotai';
import { PropsWithChildren } from 'react';

// @ts-ignore: TypeScript cannot resolve dependent types
export const store = createStore();

export function PincodeStoreProvider({ children }: PropsWithChildren) {
  return <Provider store={store}>{children}</Provider>;
}
