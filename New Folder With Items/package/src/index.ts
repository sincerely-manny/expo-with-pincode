import { PincodeInputField } from './components/pincode-input-field';
import { PincodeScreen } from './components/pincode-screen';
import { PincodeStoreProvider } from './components/pincode-store-provider';
import { PinpadButton } from './components/pinpad-button';
import { withAuthenticationRequired } from './hoc/with-authentication-required';
import { useLocalAuthentication } from './hooks/use-local-authentication';
import { usePinInputState } from './hooks/use-pin-input-state';
import { setConfig, useSetConfig } from './hooks/use-set-config';

export { PincodeInputField } from './components/pincode-input-field';
export { PincodeScreen } from './components/pincode-screen';
export { PincodeStoreProvider } from './components/pincode-store-provider';
export { PinpadButton } from './components/pinpad-button';
export { withAuthenticationRequired } from './hoc/with-authentication-required';
export { useLocalAuthentication } from './hooks/use-local-authentication';
export { usePinInputState } from './hooks/use-pin-input-state';
export { setConfig, useSetConfig } from './hooks/use-set-config';
export type * as ExpoWithPincodeType from './types';

export default {
  useLocalAuthentication,
  useSetConfig,
  setConfig,
  usePinInputState,
  withAuthenticationRequired,
  PincodeScreen,
  PincodeInputField,
  PinpadButton,
  PincodeStoreProvider,
};
