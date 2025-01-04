import { useSelector } from '@xstate/store/react';
import { type PropsWithRef, forwardRef, useCallback, useMemo } from 'react';
import { Pressable, type PressableProps, type View } from 'react-native';
import { useLocalAuthentication } from '../hooks/use-local-authentication';
import { store } from '../store';
import type { PinpadValue } from '../types';

type PinpadButtonProps = {
  value: PinpadValue;
} & PropsWithRef<PressableProps>;

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
      if (props.disabled !== undefined) {
        return props.disabled;
      }
      return success || error || loading;
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
