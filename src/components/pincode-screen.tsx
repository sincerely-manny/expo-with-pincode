import { useAtom, useAtomValue } from 'jotai';
import { forwardRef, useCallback, useMemo, useRef } from 'react';
import { Text, View } from 'react-native';

import { MODE, STEP } from '../constants';
import { useKvStore } from '../hooks/use-kv-store';
import { useLocalAuthentication } from '../hooks/use-local-authentication';
// prettier-ignore
import {
  cursorAtom,
  errorAtom,
  inputAtom,
  loadingAtom,
  stepAtom,
  successAtom,
} from '../store/component-state';
import { configAtom } from '../store/config';
// prettier-ignore
import {
  isPincodeScreenModeGuard,
  PincodeScreenProps,
  PincodeState,
} from '../types';

export const PincodeScreen = forwardRef<View, PincodeScreenProps>(
  function PincodeScreen(
    { children, mode, ...props }: PincodeScreenProps,
    ref
  ) {
    if (!mode || !isPincodeScreenModeGuard(mode)) {
      throw new Error('Invalid pincode screen mode');
    }

    const {
      isBiometricAvailable,
      authenticateWithBiometrics,
      authenticateWithPincode,
      clearPincode,
      setPincode,
      isPincodeSet,
    } = useLocalAuthentication();

    const { pincodeLength, onSuccessfulAuth, onFailedAuth } =
      useAtomValue(configAtom);

    if (mode === MODE.check && !isPincodeSet) {
      mode = MODE.create;
    }

    const [isFaceIDEnabled] = useKvStore('USE_FACE_ID_ENABLED');

    const INITIAL_STATE = useMemo<PincodeState<typeof pincodeLength>>(
      () => ({
        input: Array(pincodeLength).fill(null) as PincodeState<
          typeof pincodeLength
        >['input'],
        cursor: 0,
      }),
      [pincodeLength]
    );

    // const [input, setInput] = useState(INITIAL_STATE.input);
    // const confirmationPincode = useRef<string | null>(null);
    // const [cursor, setCursor] = useState(INITIAL_STATE.cursor);
    // const [step, setStep] = useState<PincodeScreenStep>(STEP.enter);
    // const [error, setError] = useState(false);
    // const [success, setSuccess] = useState(false);
    // const [, setLoading] = useState(false);
    //
    const [input, setInput] = useAtom(inputAtom);
    const confirmationPincode = useRef<string | null>(null);
    const [cursor, setCursor] = useAtom(cursorAtom);
    const [step, setStep] = useAtom(stepAtom);
    const [error, setError] = useAtom(errorAtom);
    const [success, setSuccess] = useAtom(successAtom);
    const [, setLoading] = useAtom(loadingAtom);

    const reset = useCallback(() => {
      setInput(INITIAL_STATE.input as unknown as PincodeState['input']);
      setCursor(INITIAL_STATE.cursor);
      setStep(STEP.enter);
      // setError(false);
      setSuccess(false);
    }, [
      setInput,
      INITIAL_STATE.input,
      INITIAL_STATE.cursor,
      setCursor,
      setStep,
      setSuccess,
    ]);

    const resetWithTimeout = useCallback(() => {
      setTimeout(reset, 2000);
    }, [reset]);

    const handleAuthSuccess = useCallback(async () => {
      setSuccess(true);
      onSuccessfulAuth && onSuccessfulAuth();
    }, [onSuccessfulAuth, setSuccess]);

    const handleAuthFailure = useCallback(() => {
      setError(true);
      onFailedAuth && onFailedAuth();
      resetWithTimeout();
    }, [setError, onFailedAuth, resetWithTimeout]);

    const handleBiometricAuth = useCallback(async () => {
      if (mode !== MODE.check) {
        return;
      }
      setLoading(true);
      try {
        const authSuccess = await authenticateWithBiometrics();
        // eslint-disable-next-line no-unused-expressions
        authSuccess ? handleAuthSuccess() : handleAuthFailure();
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, [
      authenticateWithBiometrics,
      handleAuthFailure,
      handleAuthSuccess,
      mode,
      setLoading,
    ]);

    return (
      <View {...props} ref={ref}>
        <Text>Pincode screen</Text>
        <Text>Mode: {mode}</Text>
        <Text>Biometric: {isBiometricAvailable ? 'Yes' : 'No'}</Text>
        <Text>FaceID: {isFaceIDEnabled ? 'Enabled' : 'Disabled'}</Text>
        <Text>Pincode set: {isPincodeSet ? 'Yes' : 'No'}</Text>
        <Text>Pincode length: {pincodeLength}</Text>
        <Text>Cursor: {cursor}</Text>
        <Text>Step: {step}</Text>
        <Text>Error: {error ? 'Yes' : 'No'}</Text>
        <Text>Success: {success ? 'Yes' : 'No'}</Text>
      </View>
    );
  }
);
