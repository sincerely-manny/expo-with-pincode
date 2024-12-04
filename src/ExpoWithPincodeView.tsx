import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoWithPincodeViewProps } from './ExpoWithPincode.types';

const NativeView: React.ComponentType<ExpoWithPincodeViewProps> =
  requireNativeView('ExpoWithPincode');

export default function ExpoWithPincodeView(props: ExpoWithPincodeViewProps) {
  return <NativeView {...props} />;
}
