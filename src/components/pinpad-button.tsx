import { useSelector } from '@xstate/store/react';
import { forwardRef, useCallback, useMemo } from 'react';
import type { View } from 'react-native';
import { useLocalAuthentication } from '../hooks/use-local-authentication';
import { store } from '../store';
import type { PinpadValue } from '../types';
import {
  KeyboardPressable,
  type KeyboardPressableProps,
} from '../views/keyboard-pressable';

type PinpadButtonProps = {
  value: PinpadValue;
} & KeyboardPressableProps;

export const PinpadButton = forwardRef<View, PinpadButtonProps>(
  function PinpadButton({ onPress, value, ...props }, ref) {
    const setNextChar = useCallback((char: number) => {
      store.send({ type: 'input.input', char });
    }, []);
    const backspace = useCallback(() => {
      store.send({ type: 'input.backspace' });
    }, []);

    const { error, success, loading } = useSelector(
      store,
      (state) => state.context.state
    );
    const mode = useSelector(store, (state) => state.context.state.mode);

    const disabled = useMemo(() => {
      return success || error || loading || !!props.disabled;
    }, [error, loading, props.disabled, success]);

    const { submitSet, submitCheck, submitReset, submitBiometrics } =
      useLocalAuthentication();

    const handlePinpadPress = useCallback(
      (value: PinpadValue) => {
        switch (value) {
          case 'backspace':
            backspace();
            break;
          case 'faceid':
            submitBiometrics();
            break;
          case 'clear':
            store.send({ type: 'input.reset' });
            break;
          case 'submit':
            if (mode === 'create') {
              submitSet();
            } else if (mode === 'check') {
              submitCheck();
            } else if (mode === 'reset') {
              submitReset();
            }
            break;
          default:
            setNextChar(value);
            break;
        }
      },
      [
        backspace,
        mode,
        setNextChar,
        submitBiometrics,
        submitCheck,
        submitReset,
        submitSet,
      ]
    );
    return (
      <KeyboardPressable
        // @ts-expect-error: ref is not a valid prop for View
        ref={ref}
        // onTouchStart={() => console.log('onTouchStart')}
        onPress={(e) => {
          handlePinpadPress(value);
          onPress?.(e);
        }}
        {...props}
        value={value}
        disabled={disabled}
      />
    );
  }
);
