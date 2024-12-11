import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { forwardRef, useCallback, useMemo } from 'react';
import { Pressable, PressableProps, View } from 'react-native';

import { useLocalAuthentication } from '../hooks/use-local-authentication';
import {
  cursorAtom,
  errorAtom,
  inputAtom,
  loadingAtom,
  successAtom,
} from '../store/component-state';
import { configAtom } from '../store/config';
import { PincodeState, PinpadValue } from '../types';

type PinpadButtonProps = {
  value: PinpadValue;
} & PressableProps;

export const PinpadButton = forwardRef<View, PinpadButtonProps>(
  function PinpadButton({ onPress, value, ...props }, ref) {
    const [input, setInput] = useAtom(inputAtom);
    const [cursor, setCursor] = useAtom(cursorAtom);

    const { pincodeLength, submitTimeout } = useAtomValue(configAtom);

    const setLoading = useSetAtom(loadingAtom);
    const error = useAtomValue(errorAtom);
    const success = useAtomValue(successAtom);

    const disabled = useMemo(() => {
      if (props.disabled !== undefined) {
        return props.disabled;
      }
      return success || error;
    }, [error, props.disabled, success]);

    const {
      isBiometricAvailable,
      authenticateWithBiometrics,
      authenticateWithPincode,
      isFaceIDEnabled,
      handleAuthSuccess,
      handleAuthFailure,
      resetInput,
    } = useLocalAuthentication();

    const handleBiometricAuth = useCallback(async () => {
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
      setLoading,
    ]);

    const handlePinpadPress = useCallback(
      (value: PinpadValue) => {
        switch (value) {
          case 'backspace':
            if (cursor > 0) {
              setInput((prev) => {
                const next = [...prev];
                next[cursor - 1] = null;
                return next as PincodeState['input'];
              });
              setCursor((prev) => prev - 1);
            }
            break;
          case 'faceid':
            if (isBiometricAvailable && isFaceIDEnabled) {
              handleBiometricAuth();
            }
            break;
          case 'clear':
            resetInput();
            break;
          case 'submit':
            authenticateWithPincode(input.join(''), {
              delayAfterSuccess: submitTimeout,
            });
            break;
          default:
            if (cursor < pincodeLength) {
              setInput((prev) => {
                const next = [...prev];
                next[cursor] = value;
                return next as PincodeState['input'];
              });
              setCursor((prev) => prev + 1);
            }
            break;
        }
      },
      [
        authenticateWithPincode,
        cursor,
        handleBiometricAuth,
        input,
        isBiometricAvailable,
        isFaceIDEnabled,
        pincodeLength,
        resetInput,
        setCursor,
        setInput,
        submitTimeout,
      ]
    );
    return (
      <Pressable
        ref={ref}
        onPress={(event) => {
          handlePinpadPress(value);
          onPress?.(event);
        }}
        {...props}
        disabled={disabled}
      />
    );
  }
);
