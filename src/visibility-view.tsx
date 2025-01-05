import { requireNativeViewManager } from 'expo-modules-core';
import type { ComponentType } from 'react';
import type { ViewProps } from 'react-native';

export type VisibilityViewProps = ViewProps & {
  onBecameVisible?: () => void;
  onBecameHidden?: () => void;
  onUserInteraction?: () => void;
};

const NativeView: ComponentType<VisibilityViewProps> =
  requireNativeViewManager('ExpoWithPincode');

export function VisibilityView(props: VisibilityViewProps) {
  return <NativeView {...props} />;
}
