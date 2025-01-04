import { Stack } from 'expo-router';
import { config } from 'expo-with-pincode';

import { PincodeAuthScreen } from '../components/pincode-auth-screen';
import { PincodeSetScreen } from '../components/pincode-set-screen';

config({
  SetPinScreen: PincodeSetScreen,
  AuthScreen: PincodeAuthScreen,
});

export default function RootLayout() {
  return <Stack />;
}
