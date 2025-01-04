import { useSelector } from '@xstate/store/react';
import { store } from '../store';

export function usePinInputState() {
  const { value, cursor } = useSelector(store, (state) => state.context.input);
  const { error, success, loading, message } = useSelector(
    store,
    (state) => state.context.state
  );
  const isFilled = value.every((i) => i !== null);

  return {
    error,
    success,
    input: value,
    cursor,
    isFilled,
    loading,
    message,
  };
}
