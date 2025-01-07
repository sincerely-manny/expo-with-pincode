import { requireNativeViewManager } from 'expo-modules-core';
import { forwardRef, type ComponentType, type ForwardedRef } from 'react';
import type { NativeSyntheticEvent, View, ViewProps } from 'react-native';
import type { PinpadValue } from '../types';

export type KeyboardPressableProps = ViewProps & {
  onPress?: (event?: NativeSyntheticEvent<View>) => void;
  disabled?: boolean | null;
  ref: ForwardedRef<ComponentType<KeyboardPressableProps> | null>;
  value: PinpadValue;
};

const NativeView: ComponentType<KeyboardPressableProps> =
  requireNativeViewManager('KeyboardPressable');

export const KeyboardPressable = forwardRef<
  ComponentType<KeyboardPressableProps>,
  KeyboardPressableProps
>(function KeyboardPressable({ onPress, value, ...props }, ref) {
  return (
    <NativeView
      {...props}
      // @ts-expect-error: onPress is not a valid prop for ExpoView
      onPressCallback={onPress}
      ref={ref}
      keyType={value}
    />
  );
});
