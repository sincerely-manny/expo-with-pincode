import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { PINCODE_SECURE_KEY } from '../constants';
// prettier-ignore
import {
    authMutexAtom,
    isAuthenticatedAtomGet,
    isAuthenticatedAtomSet,
    isPincodeSetAtom,
} from '../store/auth';
import {
    cursorAtom,
    errorAtom,
    inputAtom,
    stepAtom,
    successAtom,
} from '../store/component-state';
import { configAtom } from '../store/config';
import { sessionValidTillAtom, sessoionTimeoutAtom } from '../store/session';
import { PincodeState } from '../types';
import { useKvStore } from './use-kv-store';

/**
 * Hook to use for local authentication.
 * Use this hook to authenticate the user using biometrics or pincode.
 * @returns Object with the following properties:
 * - `isAuthenticated`: Boolean indicating if the user is authenticated and session is valid.
 * - `isBiometricAvailable`: Boolean indicating if biometrics are available.
 * - `authenticateWithBiometrics`: Function to authenticate the user with biometrics.
 * Sets isAuthenticated to true if successful.
 * Returns a boolean indicating if the authentication was successful.
 * - `authenticateWithPincode`: Function to authenticate the user with a pincode.
 * Sets isAuthenticated to true if successful.
 * Returns a boolean indicating if the authentication was successful.
 * - `setPincode`: Function to set a pincode.
 * - `clearPincode`: Function to clear the pincode.
 * - `isPincodeSet`: Boolean indicating if a pincode is set.
 * - `PIN_INPUT_INITIAL_STATE`: Initial state for the pin input.
 * - `isFaceIDEnabled`: Boolean indicating if Face ID is enabled.
 * - `setFaceIDEnabled`: Function to enable Face ID.
 * - `handleAuthSuccess`: Function to handle successful authentication.
 * - `handleAuthFailure`: Function to handle failed authentication.
 * - `resetInput`: Function to reset the pin input.
 * - `submitCheck`: Function to submit the pin input for checking.
 * - `submitSet`: Function to submit the pin input for setting (creating, both pincode and confirmation).
 * - `submitReset`: Function to submit the pin input for resetting (deleting).
 *
 * To protect a screen, use `withAuthenticationRequired` HOC.
 */
export function useLocalAuthentication() {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [hasSavedBiometric, setHasSavedBiometric] = useState(false);
  const [isPincodeSet, setIsPincodeSet] = useAtom(isPincodeSetAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtomGet);
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtomSet);
  const authMutex = useAtomValue(authMutexAtom);
  const [sessionTimeout, setSessionTimeout] = useAtom(sessoionTimeoutAtom);
  const sessionValidTill = useAtomValue(sessionValidTillAtom);

  const [input, setInput] = useAtom(inputAtom);
  const setCursor = useSetAtom(cursorAtom);
  const setError = useSetAtom(errorAtom);
  const setSuccess = useSetAtom(successAtom);
  const setStep = useSetAtom(stepAtom);

  const [isFaceIDEnabled, setFaceIDEnabled] = useKvStore('USE_FACE_ID_ENABLED');

  const { pincodeLength, onFailedAuth, onSuccessfulAuth, submitTimeout } =
    useAtomValue(configAtom);

  const clearSessionWithMutex = useCallback(() => {
    if (authMutex) {
      setIsAuthenticated(true);
      return;
    }
    setIsAuthenticated(false);
  }, [authMutex, setIsAuthenticated]);

  useEffect(() => {
    sessionTimeout && clearTimeout(sessionTimeout);
    if (!isAuthenticated || !sessionValidTill) {
      return;
    }
    const t = sessionValidTill.getTime() - Date.now();
    const timeout = setTimeout(() => {
      clearSessionWithMutex();
    }, t);
    setSessionTimeout(timeout);
    // eslint-disable-next-line
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionValidTill, isAuthenticated, authMutex]);

  useEffect(() => {
    (async () => {
      const pincode = await SecureStore.getItemAsync(PINCODE_SECURE_KEY, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
      });
      setIsPincodeSet(!!pincode);
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
      const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
      setHasSavedBiometric(savedBiometrics);
    })();
  }, [setIsPincodeSet]);

  // MARK: - Authencitation methods

  const authenticateWithBiometrics = useCallback(async () => {
    const authenticated = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate',
      cancelLabel: 'Cancel',
      disableDeviceFallback: true,
    });
    if (authenticated.success) {
      setIsAuthenticated(true);
    }
    return true;
  }, [setIsAuthenticated]);

  const authenticateWithPincode = useCallback(
    async (pincode: string, { delayAfterSuccess = 0 } = {}) => {
      const savedPincode = await SecureStore.getItemAsync(PINCODE_SECURE_KEY, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
      });
      if (pincode === savedPincode) {
        setTimeout(() => {
          setIsAuthenticated(true);
        }, delayAfterSuccess);
        return true;
      }
      return false;
    },
    [setIsAuthenticated]
  );

  // MARK: - Pincode methods

  const setPincode = useCallback(
    async (pincode: string) => {
      try {
        await SecureStore.setItemAsync(PINCODE_SECURE_KEY, pincode, {
          keychainAccessible: SecureStore.WHEN_UNLOCKED,
        });
        setIsPincodeSet(true);
      } catch (error) {
        console.error('Error setting pincode', error);
      }
    },
    [setIsPincodeSet]
  );

  const clearPincode = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync(PINCODE_SECURE_KEY, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
      });
      setIsPincodeSet(false);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error clearing pincode', error);
    }
  }, [setIsAuthenticated, setIsPincodeSet]);

  // MARK: - Pinpad

  const INITIAL_STATE = useMemo<PincodeState<typeof pincodeLength>>(
    () => ({
      input: Array(pincodeLength).fill(null) as PincodeState<
        typeof pincodeLength
      >['input'],
      cursor: 0,
    }),
    [pincodeLength]
  );

  // MARK: - Handle auth success and failure

  const reset = useCallback(() => {
    setInput(INITIAL_STATE.input as unknown as PincodeState['input']);
    setCursor(INITIAL_STATE.cursor);
    setError(false);
    setSuccess(false);
    setStep('enter');
  }, [
    setInput,
    INITIAL_STATE.input,
    INITIAL_STATE.cursor,
    setCursor,
    setError,
    setSuccess,
    setStep,
  ]);

  const resetWithTimeout = useCallback(
    (callback?: () => void) => {
      setTimeout(() => {
        reset();
        callback && callback();
      }, submitTimeout);
    },
    [reset, submitTimeout]
  );

  const handleAuthSuccess = useCallback(async () => {
    setSuccess(true);
    onSuccessfulAuth && onSuccessfulAuth();
    resetWithTimeout();
  }, [onSuccessfulAuth, resetWithTimeout, setSuccess]);

  const handleAuthFailure = useCallback(() => {
    setError(true);
    onFailedAuth && onFailedAuth();
    resetWithTimeout();
  }, [setError, onFailedAuth, resetWithTimeout]);

  // MARK: - Submission

  const submitCheck = useCallback(async () => {
    const success = await authenticateWithPincode(input.join(''), {
      delayAfterSuccess: submitTimeout,
    });
    if (success) {
      setSuccess(true);
      setError(false);
      handleAuthSuccess();
    } else {
      setError(true);
      setSuccess(false);
      handleAuthFailure();
    }
  }, [
    authenticateWithPincode,
    handleAuthFailure,
    handleAuthSuccess,
    input,
    setError,
    setSuccess,
    submitTimeout,
  ]);

  const confirmationRef = useRef<string | null>(null);

  const submitSet = useCallback(
    async (onSuccessCallback?: () => void) => {
      if (confirmationRef.current === null) {
        confirmationRef.current = input.join('');
        setInput(INITIAL_STATE.input as unknown as PincodeState['input']);
        setCursor(INITIAL_STATE.cursor);
        setStep('confirm');
        return;
      }
      if (confirmationRef.current === input.join('')) {
        await setPincode(confirmationRef.current);
        setSuccess(true);
        setError(false);
        // onSuccessfulAuth && onSuccessfulAuth();
        resetWithTimeout(onSuccessCallback);
      } else {
        setSuccess(false);
        setError(true);
        // onFailedAuth && onFailedAuth();
        resetWithTimeout();
      }
      confirmationRef.current = null;
    },
    [
      INITIAL_STATE.cursor,
      INITIAL_STATE.input,
      input,
      resetWithTimeout,
      setCursor,
      setError,
      setInput,
      setPincode,
      setStep,
      setSuccess,
    ]
  );

  const submitReset = useCallback(
    async (onSuccessCallback?: () => void) => {
      const success = await authenticateWithPincode(input.join(''), {
        delayAfterSuccess: submitTimeout,
      });
      if (success) {
        await clearPincode();
        setSuccess(true);
        setError(false);
        resetWithTimeout(onSuccessCallback);
      } else {
        setError(true);
        setSuccess(false);
        resetWithTimeout();
      }
    },
    [
      authenticateWithPincode,
      clearPincode,
      input,
      resetWithTimeout,
      setError,
      setSuccess,
      submitTimeout,
    ]
  );

  // MARK: - Return

  return {
    isAuthenticated,
    isBiometricAvailable:
      isBiometricSupported && hasSavedBiometric && isPincodeSet,
    authenticateWithBiometrics,
    authenticateWithPincode,
    setPincode,
    clearPincode,
    isPincodeSet,
    PIN_INPUT_INITIAL_STATE: INITIAL_STATE,
    isFaceIDEnabled,
    setFaceIDEnabled,
    handleAuthSuccess,
    handleAuthFailure,
    resetInput: reset,
    submitCheck,
    submitSet,
    submitReset,
  };
}
