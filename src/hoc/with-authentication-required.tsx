// import { PincodeScreen } from "../screen/pincode";
import { useFocusEffect } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import type { ComponentType, PropsWithoutRef } from 'react';
import { forwardRef } from 'react';

import { useLocalAuthentication } from '../hooks/use-local-authentication';
import { authMutexAtom } from '../store/auth';
import { configAtom } from '../store/config';

/**
 * A higher-order component that wraps a component and requires the user to be authenticated.
 * If the user is not authenticated, the pincode screen will be shown.
 *
 * @param Component The component to wrap.
 * @returns The wrapped component.
 */

export function withAuthenticationRequired<P extends JSX.IntrinsicAttributes>(
  Component: ComponentType<PropsWithoutRef<P>>
) {
  const WithAuthenticationRequired = forwardRef<unknown, P>(
    function WithAuthenticationRequired(props, ref) {
      const { isAuthenticated, isPincodeSet } = useLocalAuthentication();
      const setAuthMutex = useSetAtom(authMutexAtom);
      const { AuthScreen, SetPinScreen, requireSetPincode } =
        useAtomValue(configAtom);

      useFocusEffect(() => {
        setAuthMutex(true);
        return () => {
          setAuthMutex(false);
        };
      });

      if (!AuthScreen || !SetPinScreen) {
        throw new Error(
          'AuthScreen and SetPinScreen must be set in the config'
        );
      }

      if (!isAuthenticated) {
        if (isPincodeSet) {
          return <AuthScreen />;
        } else if (requireSetPincode) {
          return <SetPinScreen />;
        }
      }
      return <Component {...props} ref={ref} />;
    }
  );
  return WithAuthenticationRequired;
}
