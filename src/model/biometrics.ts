import * as LocalAuthentication from 'expo-local-authentication';

export async function isBiometricsCompatible() {
  return await LocalAuthentication.hasHardwareAsync();
}
export async function isBiometricsEnrolled() {
  return await LocalAuthentication.isEnrolledAsync();
}
export async function isBiometricsAvailable() {
  const [compatible, enrolled] = await Promise.all([
    isBiometricsCompatible(),
    isBiometricsEnrolled(),
  ]);
  return compatible && enrolled;
}
/**
 * Authenticate with biometrics
 * @returns true if the authentication was successful, false otherwise
 */
export async function verifyBiometrics() {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Authenticate',
    cancelLabel: 'Cancel',
    disableDeviceFallback: true,
  });
  return result.success;
}
