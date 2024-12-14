import { useAtomValue } from 'jotai';

import {
    cursorAtom,
    errorAtom,
    inputAtom,
    loadingAtom,
    messageAtom,
    successAtom,
} from '../store/component-state';

export function usePinInputState() {
  const error = useAtomValue(errorAtom);
  const success = useAtomValue(successAtom);
  const input = useAtomValue(inputAtom);
  const cursor = useAtomValue(cursorAtom);
  const isFilled = input.every((i) => i !== null);
  const loading = useAtomValue(loadingAtom);
  const message = useAtomValue(messageAtom);

  return {
    error,
    success,
    input,
    cursor,
    isFilled,
    loading,
    message,
  };
}
