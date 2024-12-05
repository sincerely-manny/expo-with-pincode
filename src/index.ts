import { PincodeScreen } from './components/PincodeScreen';
import { useLocalAuthentication } from './useLocalAuthentication';
import { withAuthenticationRequired } from './withAuthenticationRequired';
export type * as ExpoWithPincodeType from './types';

const ExpoWithPincode = {
  useLocalAuthentication,
  withAuthenticationRequired,
  PincodeScreen,
};

export default ExpoWithPincode;
