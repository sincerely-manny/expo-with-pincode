import { PincodeInputField } from './components/pincode-input-field';
import { PincodeScreen } from './components/pincode-screen';
import { PinpadButton } from './components/pinpad-button';
import { withAuthenticationRequired } from './hoc/with-authentication-required';
import { useLocalAuthentication } from './hooks/use-local-authentication';
import { usePinInputState } from './hooks/use-pin-input-state';
import { usePinSettings } from './hooks/use-pin-setting';
import { setPincodeConfig } from './model/config';

export { PincodeInputField } from './components/pincode-input-field';
export { PincodeScreen } from './components/pincode-screen';
export { PinpadButton } from './components/pinpad-button';
export { withAuthenticationRequired } from './hoc/with-authentication-required';
export { useLocalAuthentication } from './hooks/use-local-authentication';
export { usePinInputState } from './hooks/use-pin-input-state';
export { usePinSettings } from './hooks/use-pin-setting';
export { setPincodeConfig } from './model/config';
export type * as ExpoWithPincodeType from './types';

export default {
  setPincodeConfig,
  useLocalAuthentication,
  usePinInputState,
  usePinSettings,
  withAuthenticationRequired,
  PincodeScreen,
  PincodeInputField,
  PinpadButton,
};
