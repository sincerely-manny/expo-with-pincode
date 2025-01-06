import { useSelector } from '@xstate/store/react';
import { useCallback, useRef } from 'react';
import { PINCODE_SET_CONFIRMATION_WAIT } from '../constants';
import { verifyBiometrics } from '../model/biometrics';
import { clearPincode, setPincode, verifyPincode } from '../model/pincode';
import { store } from '../store';
import { waitAsync } from '../utils/wait';

/**
 * Hook to use for local authentication.
 * Use this hook to authenticate the user using biometrics or pincode.
 * @returns Object with the following properties:
 * - `authenticate`: Authenticate the user using either pincode or biometrics.
 * - `submitCheck`: Submit the pincode for verification (authenticate and run callbacks).
 * - `submitSet`: Submit the pincode for setting (authenticate and run callbacks).
 * - `submitReset`: Submit the pincode for resetting (authenticate and run callbacks).
 * - `submitBiometrics`: Submit biometrics for verification (authenticate and run callbacks).
 *
 * To protect a screen, use `withAuthenticationRequired` HOC.
 */
export function useLocalAuthentication() {
  const { value: input } = useSelector(store, (state) => state.context.input);
  const { onFailedAuth, onSuccessfulAuth, submitTimeout, animationDuration } =
    useSelector(store, (state) => state.context.config);

  // MARK: - Authencitation methods
  const authenticate = useCallback(
    async (method: 'pin' | 'biometrics') => {
      store.send({ type: 'state.loading' });
      let auth = false;
      switch (method) {
        case 'pin':
          auth = await verifyPincode(input.join(''));
          break;
        case 'biometrics':
          auth = await verifyBiometrics();
          break;
      }
      if (auth) {
        setTimeout(() => {
          store.send({ type: 'session.start' });
        }, submitTimeout);
      }
      store.send({ type: 'state.loading', enable: false });
      return auth;
    },
    [input, submitTimeout]
  );

  // MARK: - Handle auth success and failure
  const resetWithTimeout = useCallback(
    (callback?: () => void) => {
      setTimeout(() => {
        store.send({ type: 'input.reset' });
        store.send({ type: 'state.reset' });
        callback?.();
      }, submitTimeout);
    },
    [submitTimeout]
  );

  const handleAuthSuccess = useCallback(async () => {
    store.send({ type: 'state.success' });
    onSuccessfulAuth?.();
    // resetWithTimeout();
    setTimeout(() => {
      store.send({ type: 'input.reset' });
      store.send({ type: 'state.reset' });
    }, submitTimeout + animationDuration);
  }, [onSuccessfulAuth, submitTimeout, animationDuration]);

  const handleAuthFailure = useCallback(() => {
    store.send({ type: 'state.error' });
    onFailedAuth?.();
    resetWithTimeout();
  }, [onFailedAuth, resetWithTimeout]);

  // MARK: - Submission
  const submitCheck = useCallback(async () => {
    const success = await authenticate('pin');
    if (success) {
      store.send({ type: 'state.success' });
      handleAuthSuccess();
    } else {
      store.send({ type: 'state.error' });
      handleAuthFailure();
    }
  }, [handleAuthFailure, handleAuthSuccess, authenticate]);

  const confirmationRef = useRef<string | null>(null);
  const submitSet = useCallback(
    async (onSuccessCallback?: () => void) => {
      if (confirmationRef.current === null) {
        confirmationRef.current = input.join('');
        await waitAsync(PINCODE_SET_CONFIRMATION_WAIT);
        store.send({ type: 'input.reset' });
        store.send({ type: 'state.step', step: 'confirm' });
        return;
      }
      if (confirmationRef.current === input.join('')) {
        await setPincode(confirmationRef.current);
        store.send({ type: 'state.success' });
        resetWithTimeout(onSuccessCallback);
      } else {
        store.send({ type: 'state.error' });
        resetWithTimeout();
      }
      confirmationRef.current = null;
    },
    [input, resetWithTimeout]
  );

  const submitReset = useCallback(
    async (onSuccessCallback?: () => void) => {
      const success = await authenticate('pin');
      if (success) {
        await clearPincode();
        store.send({ type: 'state.success' });
        resetWithTimeout(onSuccessCallback);
      } else {
        store.send({ type: 'state.error' });
        resetWithTimeout();
      }
    },
    [resetWithTimeout, authenticate]
  );

  const submitBiometrics = useCallback(async () => {
    const success = await authenticate('biometrics');
    if (success) {
      store.send({ type: 'state.success' });
      handleAuthSuccess();
    } else {
      store.send({ type: 'state.error' });
      handleAuthFailure();
    }
  }, [handleAuthFailure, handleAuthSuccess, authenticate]);

  // MARK: - Return
  return {
    submitCheck,
    submitSet,
    submitReset,
    submitBiometrics,
    authenticate,
  };
}
