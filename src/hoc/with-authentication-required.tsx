import { useSelector } from '@xstate/store/react';
import throttle from 'lodash.throttle';
import type { ComponentType, PropsWithoutRef } from 'react';
import { forwardRef, useCallback } from 'react';
import { StyleSheet, Text } from 'react-native';
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

      return (
        <VisibilityView
          onBecameVisible={() => setAuthMutex(true)}
          onBecameHidden={() => setAuthMutex(false)}
          onTouchStart={() => renewSession()}
          style={styles.container}
        >
          <FadeOutView
            style={styles.container}
            isVisible={true}
            onFadeIn={() => console.log('Fade in')}
            onFadeOut={() => console.log('Fade out')}
          >
            {!isAuthenticated && isPincodeSet && <AuthScreen />}
            {!isAuthenticated &&
              !isPincodeSet &&
              requireSetPincode &&
              !!SetPinScreen && <SetPinScreen />}
            <Text>Test</Text>
          </FadeOutView>
          {isAuthenticated && <Component {...props} ref={ref} />}
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
});
