import { useAtomValue, useSetAtom } from 'jotai';
import { forwardRef, useEffect } from 'react';
import { View } from 'react-native';

import { useLocalAuthentication } from '../hooks/use-local-authentication';
import {
  errorAtom,
  inputAtom,
  messageAtom,
  modeAtom,
  stepAtom,
  successAtom,
} from '../store/component-state';
import { configAtom } from '../store/config';
import { type PincodeScreenProps, isPincodeScreenModeGuard } from '../types';
import { store } from './pincode-store-provider';

export const PincodeScreen = forwardRef<View, PincodeScreenProps>(
  function PincodeScreen(
    {
      children,
      mode,
      onSuccessfulSetPincode,
      onSuccessfulResetPincode,
      ...props
    }: PincodeScreenProps,
    ref
  ) {
    if (!mode || !isPincodeScreenModeGuard(mode)) {
      throw new Error('Invalid pincode screen mode');
    }

    const success = useAtomValue(successAtom, { store });
    const error = useAtomValue(errorAtom, { store });
    const step = useAtomValue(stepAtom, { store });
    const setMode = useSetAtom(modeAtom, { store });
    useEffect(() => {
      setMode(mode);
    }, [mode, setMode]);

    const input = useAtomValue(inputAtom, { store });
    const { submitAfterLastInput, messages } = useAtomValue(configAtom, {
      store,
    });
    const setMessage = useSetAtom(messageAtom, { store });

    const { submitCheck, submitSet, submitReset } = useLocalAuthentication();

    // MARK: - Auto-submit after last input

    useEffect(() => {
      if (submitAfterLastInput && input.every((i) => i !== null)) {
        if (mode === 'check') {
          submitCheck();
        } else if (mode === 'create') {
          submitSet(onSuccessfulSetPincode);
        } else if (mode === 'reset') {
          submitReset(onSuccessfulResetPincode);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input, mode]);

    // MARK: - Message handling

    useEffect(() => {
      if (success) {
        if (mode === 'check') {
          setMessage(messages.correct);
        } else if (mode === 'create') {
          setMessage(messages.set);
        } else if (mode === 'reset') {
          setMessage(messages.isreset);
        }
      } else if (error) {
        if (mode === 'check' || mode === 'reset') {
          setMessage(messages.incorrect);
        } else if (mode === 'create') {
          setMessage(messages.nomatch);
        }
      } else if (mode === 'check' && input.every((i) => i === null)) {
        setMessage(messages.check);
      } else if (mode === 'create' && input.every((i) => i === null)) {
        if (step === 'enter') {
          setMessage(messages.create);
        } else if (step === 'confirm') {
          setMessage(messages.confirm);
        }
      } else if (mode === 'reset' && input.every((i) => i === null)) {
        setMessage(messages.reset);
      }
    }, [
      input,
      mode,
      messages.check,
      setMessage,
      messages.create,
      messages.confirm,
      step,
      success,
      error,
      messages.correct,
      messages.incorrect,
      messages.nomatch,
      messages.set,
      messages.isreset,
      messages.reset,
    ]);

    return (
      <View {...props} ref={ref}>
        {children}
      </View>
    );
  }
);
