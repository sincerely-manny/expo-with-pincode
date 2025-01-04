import { useSelector } from '@xstate/store/react';
import { store } from '../store';

/**
 * Hook to use for pin settings.
 * @returns Object with the following properties:
 * - `isPincodeSet`: Whether the pincode is set.
 */
export function usePinSettings() {
  const { isPincodeSet } = useSelector(store, (state) => state.context.device);
  return { isPincodeSet };
}
