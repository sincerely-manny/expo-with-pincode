import { useAtomValue } from 'jotai';

import { store } from '../components/pincode-store-provider';
import {
  cursorAtom,
  errorAtom,
  inputAtom,
  loadingAtom,
  messageAtom,
  successAtom,
} from '../store/component-state';

export function usePinInputState() {
  const error = useAtomValue(errorAtom, { store });
  const success = useAtomValue(successAtom, { store });
  const input = useAtomValue(inputAtom, { store });
  const cursor = useAtomValue(cursorAtom, { store });
  const isFilled = input.every((i) => i !== null);
  const loading = useAtomValue(loadingAtom, { store });
  const message = useAtomValue(messageAtom, { store });

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
