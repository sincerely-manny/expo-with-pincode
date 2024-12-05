// import { PincodeScreen } from "../screen/pincode";
import { useFocusEffect } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import type { ComponentType, PropsWithoutRef } from 'react';
import { forwardRef } from 'react';

import { useLocalAuthentication } from '../hooks/use-local-authentication';
import { authMutexAtom, configAtom } from '../store';
import { PincodeScreenComponent } from '../types';

/**
 * A higher-order component that wraps a component and requires the user to be authenticated.
 * If the user is not authenticated, the pincode screen will be shown.
 *
 * @param Component The component to wrap.
 * @returns The wrapped component.
 */

export function withAuthenticationRequired<P extends JSX.IntrinsicAttributes>(
  Component: ComponentType<PropsWithoutRef<P>>,
  PincodeScreen?: PincodeScreenComponent
) {
  const WithAuthenticationRequired = forwardRef<unknown, P>(
    function WithAuthenticationRequired(props, ref) {
      const { isAuthenticated, isPincodeSet } = useLocalAuthentication();
      const setAuthMutex = useSetAtom(authMutexAtom);
      const config = useAtomValue(configAtom);
      const ConfiguredPincodeScreen = config?.pincodeScreen;

      useFocusEffect(() => {
        setAuthMutex(true);
        return () => {
          setAuthMutex(false);
        };
      });

      // if (!PincodeScreen && !ConfiguredPincodeScreen) {
      //   throw new Error(
      //     'Pincode screen must be provided either as a prop or in the config.'
      //   );
      // }

      if (!isAuthenticated && isPincodeSet) {
        if (PincodeScreen) {
          return <PincodeScreen mode="check" />;
        } else if (ConfiguredPincodeScreen) {
          return <ConfiguredPincodeScreen mode="check" />;
        } else {
          // throw new Error(
          //   'Pincode screen must be provided either as a prop or in the config.'
          // );
        }
      }
      return <Component {...props} ref={ref} />;
    }
  );
  return WithAuthenticationRequired;
}
