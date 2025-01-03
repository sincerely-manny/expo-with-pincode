// import { PincodeScreen } from "../screen/pincode";
import { useFocusEffect } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import type { ComponentType, PropsWithoutRef } from 'react';
import { forwardRef, useCallback, useEffect } from 'react';

import { store } from '../components/pincode-store-provider';
import { useLocalAuthentication } from '../hooks/use-local-authentication';
import {
  authMutexAtom,
  isAuthenticatedAtomGet,
  isAuthenticatedAtomSet,
} from '../store/auth';
import { configAtom } from '../store/config';
import { sessionValidTillAtom, sessoionTimeoutAtom } from '../store/session';

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
      useAuthRenewalInterval();
      const { isPincodeSet } = useLocalAuthentication();
      const isAuthenticated = useAtomValue(isAuthenticatedAtomGet, { store });
      const setAuthMutex = useSetAtom(authMutexAtom, { store });
      const { AuthScreen, SetPinScreen, requireSetPincode } =
        store.get(configAtom);

      useFocusEffect(() => {
        setAuthMutex(true);
        return () => {
          setAuthMutex(false);
        };
      });

      if (!AuthScreen || (!SetPinScreen && requireSetPincode)) {
        throw new Error(
          'AuthScreen and SetPinScreen must be set in the config'
        );
      }

      if (!isAuthenticated) {
        if (isPincodeSet) {
          return <AuthScreen />;
        } else if (requireSetPincode && SetPinScreen) {
          return <SetPinScreen />;
        }
      }
      return <Component {...props} ref={ref} />;
    }
  );
  return WithAuthenticationRequired;
}

function useAuthRenewalInterval() {
  const isAuthenticated = useAtomValue(isAuthenticatedAtomGet, { store });
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtomSet, { store });
  const authMutex = useAtomValue(authMutexAtom, { store });
  const setSessionTimeout = useSetAtom(sessoionTimeoutAtom, { store });
  const sessionValidTill = useAtomValue(sessionValidTillAtom, { store });

  const clearSessionWithMutex = useCallback(() => {
    if (authMutex) {
      setIsAuthenticated(true);
      return;
    }
    setIsAuthenticated(false);
  }, [authMutex, setIsAuthenticated]);

  useEffect(() => {
    setSessionTimeout((prevTimeout) => {
      prevTimeout && clearTimeout(prevTimeout);
      if (!isAuthenticated || !sessionValidTill) {
        return null;
      }
      const t = sessionValidTill.getTime() - Date.now();
      const timeout = setTimeout(() => {
        clearSessionWithMutex();
      }, t);
      return timeout;
    });
  }, [
    sessionValidTill,
    isAuthenticated,
    authMutex,
    setSessionTimeout,
    clearSessionWithMutex,
  ]);
  return null;
}
