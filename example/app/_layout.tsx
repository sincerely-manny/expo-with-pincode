import { Stack } from 'expo-router';
import { config } from 'expo-with-pincode';

import { useSelector } from '@xstate/store/react';
import { store } from 'expo-with-pincode/store';
import { useEffect } from 'react';
import { PincodeAuthScreen } from '../components/pincode-auth-screen';
import { PincodeSetScreen } from '../components/pincode-set-screen';

config({
  SetPinScreen: PincodeSetScreen,
  AuthScreen: PincodeAuthScreen,
  sessionTimeout: 10_000,
});

export default function RootLayout() {
  const mutex = useSelector(store, (state) => state.context.session.mutex);

  useEffect(() => {
    console.log('mutex', mutex);
  }, [mutex]);
  return <Stack />;
}
