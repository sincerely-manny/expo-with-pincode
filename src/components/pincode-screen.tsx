import { useSelector } from '@xstate/store/react';
import { forwardRef, useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { useLocalAuthentication } from '../hooks/use-local-authentication';
import { store } from '../store';
import {
  type PicodeScreenMode,
  type PincodeScreenProps,
  isPincodeScreenModeGuard,
} from '../types';

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

    const setMode = useCallback((mode: PicodeScreenMode) => {
      store.send({
        type: 'state.mode',
        mode,
      });
    }, []);

    useEffect(() => {
      setMode(mode);
    }, [mode, setMode]);

    const input = useSelector(store, (state) => state.context.input.value);
    const submitAfterLastInput = useSelector(
      store,
      (state) => state.context.config.submitAfterLastInput
    );

    const { submitCheck, submitSet, submitReset } = useLocalAuthentication();

    // MARK: - Auto-submit after last input

    // biome-ignore lint/correctness/useExhaustiveDependencies: adding callback to dependencies will cause infinite loop
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
    }, [
      input,
      mode,
      submitAfterLastInput,
      submitCheck,
      submitSet,
      submitReset,
    ]);

    return (
      <View {...props} ref={ref}>
        {children}
      </View>
    );
  }
);
