import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useMemo, useRef } from 'react';
import { View } from 'react-native';

import { MODE, STEP } from '../constants';
import { useKvStore } from '../hooks/use-kv-store';
import { useLocalAuthentication } from '../hooks/use-local-authentication';
import {
    configAtom,
    cursorAtom,
    errorAtom,
    inputAtom,
    loadingAtom,
    stepAtom,
    successAtom,
} from '../store';
import {
    isPincodeScreenModeGuard,
    PincodeScreenProps,
    PincodeState,
} from '../types';

export function PincodeScreen({
  className,
  style,
  children,
  mode,
  onSuccessfulAuth,
}: PincodeScreenProps) {
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

  const config = useAtomValue(configAtom);

  if (mode === MODE.check && !isPincodeSet) {
    mode = MODE.create;
  }

  const [isFaceIDEnabled] = useKvStore('USE_FACE_ID_ENABLED');

  const INITIAL_STATE = useMemo<PincodeState<typeof config.pincodeLength>>(
    () => ({
      input: Array(config.pincodeLength).fill(null) as PincodeState<
        typeof config.pincodeLength
      >['input'],
      cursor: 0,
    }),
    [config]
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
    resetWithTimeout();
  }, [setError, resetWithTimeout]);

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
    <View className={className} style={style}>
      {children}
    </View>
  );
}
