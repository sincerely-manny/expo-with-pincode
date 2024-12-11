// prettier-ignore
// prettier-ignore
import { useAtomValue, useSetAtom } from 'jotai';
import { forwardRef, useCallback, useEffect } from 'react';
import { View } from 'react-native';

import { useLocalAuthentication } from '../hooks/use-local-authentication';
import { inputAtom, messageAtom } from '../store/component-state';
import { configAtom } from '../store/config';
import { isPincodeScreenModeGuard, PincodeScreenProps } from '../types';

export const PincodeScreen = forwardRef<View, PincodeScreenProps>(
  function PincodeScreen(
    { children, mode, ...props }: PincodeScreenProps,
    ref
  ) {
    if (!mode || !isPincodeScreenModeGuard(mode)) {
      throw new Error('Invalid pincode screen mode');
    }

    const input = useAtomValue(inputAtom);
    const { submitAfterLastInput, submitTimeout, messages } =
      useAtomValue(configAtom);
    const setMessage = useSetAtom(messageAtom);

    const { authenticateWithPincode, handleAuthFailure, handleAuthSuccess } =
      useLocalAuthentication();

    const submitCheck = useCallback(() => {
      authenticateWithPincode(input.join(''), {
        delayAfterSuccess: submitTimeout,
      }).then((success) => {
        if (success) {
          setMessage(messages.correct);
          handleAuthSuccess();
        } else {
          setMessage(messages.incorrect);
          handleAuthFailure();
        }
      });
    }, [
      authenticateWithPincode,
      handleAuthFailure,
      handleAuthSuccess,
      input,
      messages.correct,
      messages.incorrect,
      setMessage,
      submitTimeout,
    ]);

    useEffect(() => {
      if (submitAfterLastInput && input.every((i) => i !== null)) {
        if (mode === 'check') {
          submitCheck();
        }
      }
    }, [input, mode, submitCheck, submitAfterLastInput]);

    useEffect(() => {
      if (mode === 'check' && input.every((i) => i === null)) {
        setMessage(messages.check);
      }
    }, [input, mode, messages.check, setMessage]);

    return (
      <View {...props} ref={ref}>
        {children}
      </View>
    );
  }
);
