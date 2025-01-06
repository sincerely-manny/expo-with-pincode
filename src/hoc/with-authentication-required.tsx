import { useSelector } from '@xstate/store/react';
import throttle from 'lodash.throttle';
import type { ComponentType, PropsWithoutRef } from 'react';
import { forwardRef, useCallback, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { store } from '../store';
import { FadeOutView } from '../views/fade-out-view';
import { VisibilityView } from '../views/visibility-view';

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

      const renewSession = useCallback(
        throttle(() => {
          store.send({ type: 'session.renew' });
        }, 1000),
        []
      );

      const { AuthScreen, SetPinScreen, requireSetPincode } = useSelector(
        store,
        (state) => state.context.config
      );

      if (!AuthScreen || (!SetPinScreen && requireSetPincode)) {
        throw new Error(
          'AuthScreen and SetPinScreen must be set in the config'
        );
      }

      const showProtectedScreen = useMemo(() => {
        if (!isPincodeSet && !requireSetPincode) {
          return true;
        }
        return isAuthenticated;
      }, [isAuthenticated, isPincodeSet, requireSetPincode]);

      const [fadeOutViewDisplay, setFadeOutViewDisplay] = useState(
        !showProtectedScreen
      );

      console.log('isAuthenticated', isAuthenticated);

      return (
        <VisibilityView
          onBecameVisible={() => setAuthMutex(true)}
          onBecameHidden={() => setAuthMutex(false)}
          onTouchStart={() => renewSession()}
          style={styles.container}
        >
          {isAuthenticated && <Component {...props} ref={ref} />}
          <FadeOutView
            style={[
              styles.pinContainer,
              {
                display: fadeOutViewDisplay ? 'flex' : 'none',
              },
            ]}
            isVisible={!isAuthenticated}
            onFadeOut={() => setFadeOutViewDisplay(false)}
          >
            {isPincodeSet && <AuthScreen />}
            {!isPincodeSet && requireSetPincode && !!SetPinScreen && (
              <SetPinScreen />
            )}
          </FadeOutView>
        </VisibilityView>
      );
    }
  );
  return WithAuthenticationRequired;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pinContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
