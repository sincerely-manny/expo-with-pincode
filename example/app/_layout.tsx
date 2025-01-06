import { Stack } from 'expo-router';
import { setPincodeConfig } from 'expo-with-pincode';

import { PincodeAuthScreen } from '../components/pincode-auth-screen';
import { PincodeSetScreen } from '../components/pincode-set-screen';

setPincodeConfig({
  SetPinScreen: PincodeSetScreen,
  AuthScreen: PincodeAuthScreen,
  sessionTimeout: 10_000,
  animationDuration: 2000,
  requireSetPincode: true,
});

export default function RootLayout() {
  return <Stack />;
}
