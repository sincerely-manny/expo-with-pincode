import { store } from '../store';
import { isBiometricsAvailable } from './biometrics';
import { handleMessages } from './message';
import { isPincodeSet } from './pincode';

// MARK: - On init
export async function initStore() {
  const pincodeSet = await isPincodeSet();
  store.send({
    type: 'device.setIsPincodeSet',
    isPincodeSet: pincodeSet,
  });

  const biometricsAvailable = await isBiometricsAvailable();
  store.send({
    type: 'device.setIsBiometricsAvailable',
    isBiometricsAvailable: biometricsAvailable,
  });

  store.on('state.changed', ({ value }) => {
    handleMessages(value);
  });
}
