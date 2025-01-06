import { useSelector } from '@xstate/store/react';
import { store } from '../store';

/**
 * Hook to use for pin input state.
 * Use this hook to get the current state of the pin input.
 * @returns Object with the following properties:
 * - `error`: If in Error state.
 * - `success`: If in Success state.
 * - `input`: Current pin input.
 * - `cursor`: Current cursor position.
 * - `isFilled`: Is the pin input filled.
 * - `loading`: Is the pin input in loading state.
 * - `message`: Message to display.
 */
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
