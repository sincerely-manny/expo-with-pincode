import { useAtomValue } from 'jotai';

import { messageAtom } from '../store/component-state';

export function usePinpadStateMessage() {
  const message = useAtomValue(messageAtom);
  return message;
}
