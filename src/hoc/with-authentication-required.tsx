import { useSelector } from '@xstate/store/react';
import type { ComponentType, PropsWithoutRef } from 'react';
import { forwardRef, useCallback } from 'react';

import { store } from '../store';

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
      const isPincodeSet = useSelector(
        store,
        (state) => state.context.device.isPincodeSet
      );
      const isAuthenticated = useSelector(
        store,
        (state) => state.context.session.isAuthenticated
      );
      const setAuthMutex = useCallback((lock: boolean) => {
        store.send({
          type: 'session.setMutex',
          lock,
        });
      }, []);

      const { AuthScreen, SetPinScreen, requireSetPincode } = useSelector(
        store,
        (state) => state.context.config
      );

      // useFocusEffect(() => {
      //   setAuthMutex(true);
      //   return () => {
      //     setAuthMutex(false);
      //   };
      // });

      if (!AuthScreen || (!SetPinScreen && requireSetPincode)) {
        throw new Error(
          'AuthScreen and SetPinScreen must be set in the config'
        );
      }

      if (!isAuthenticated) {
        if (isPincodeSet) {
          return <AuthScreen />;
        }
        if (requireSetPincode && SetPinScreen) {
          return <SetPinScreen />;
        }
      }
      return <Component {...props} ref={ref} />;
    }
  );
  return WithAuthenticationRequired;
}
