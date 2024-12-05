import { PincodeScreen } from './components/pincode-screen';
import { withAuthenticationRequired } from './hoc/with-authentication-required';
import { useLocalAuthentication } from './hooks/use-local-authentication';
import { useSetConfig } from './hooks/use-set-config';

export { PincodeScreen } from './components/pincode-screen';
export { withAuthenticationRequired } from './hoc/with-authentication-required';
export { useLocalAuthentication } from './hooks/use-local-authentication';
export { useSetConfig } from './hooks/use-set-config';
export type * as ExpoWithPincodeType from './types';

export default {
  useLocalAuthentication,
  useSetConfig,
  withAuthenticationRequired,
  PincodeScreen,
};
