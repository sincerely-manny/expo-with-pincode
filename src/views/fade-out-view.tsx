import { requireNativeViewManager } from 'expo-modules-core';
import type { ComponentType } from 'react';
import type { ViewProps } from 'react-native';

export type FadeOutViewProps = ViewProps & {
  isVisible?: boolean;
  animationDuration?: number;
  fadeInDelay?: number;
  fadeOutDelay?: number;
  onFadeInComplete?: () => void;
  onFadeOutComplete?: () => void;
};

const NativeView: ComponentType<FadeOutViewProps> =
  requireNativeViewManager('FadeOutView');

export function FadeOutView(props: FadeOutViewProps) {
  return <NativeView {...props} />;
}
