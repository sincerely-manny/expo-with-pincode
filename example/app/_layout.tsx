import { Stack } from 'expo-router';
import { useSetConfig } from 'expo-with-pincode';
import { useEffect } from 'react';

import { PincodeAuthScreen } from '../components/pincode-auth-screen';
import { PincodeSetScreen } from '../components/pincode-set-screen';

export default function RootLayout() {
  const setPinConfig = useSetConfig();
  useEffect(() => {
    setPinConfig({
      SetPinScreen: PincodeSetScreen,
      AuthScreen: PincodeAuthScreen,
    });
  }, [setPinConfig]);
  return <Stack />;
}
