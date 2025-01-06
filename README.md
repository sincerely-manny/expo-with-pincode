# expo-with-pincode

Headless UI library for creating a pincode screen in your app.

Peer dependencies:
```json
{
  "expo": "^52.0.0",
  "expo-local-authentication": "*",
  "expo-secure-store": "*",
  "expo-sqlite": "*"
}
```

# Installation

```
npm install expo-with-pincode expo-local-authentication expo-secure-store expo-sqlite
npx pod-install
```

# Quick start

1. Create an auth screen: `PincodeAuthScreen.tsx` and style it as you prefer:

```tsx
import {
  PincodeInputField,
  PincodeScreen,
  PinpadButton,
  usePinInputState,
} from 'expo-with-pincode';
import { Text, View } from 'react-native';

export function PincodeAuthScreen() {
  const { message } = usePinInputState();
  return (
    <PincodeScreen mode="check">
      <Text>{message}</Text>
      <PincodeInputField
        style={{ flexDirection: 'row' }}
        characterElement={({ value }) => (<Text>{value === null ? '-' : '*'}</Text>)}
      />
      <View style={{ flexDirection: 'row' }} >
        {([1, 2, 3, 4, 5, 6, 7, 8, 9, 'faceid', 0, 'backspace'] as const).map((v) => (
            <PinpadButton value={v} style={{ borderWidth: 1 }} key={v}>
              <Text>{v}</Text>
            </PinpadButton>
          ))}
      </View>
    </PincodeScreen>
  );
}
```

2. In a root component of your app call `setPinConfig` to set the pincode configuration:

```tsx
import { Stack } from 'expo-router';
import { setPincodeConfig } from 'expo-with-pincode';
import { useEffect } from 'react';

import { PincodeAuthScreen } from '../components/pincode-auth-screen';
import { PincodeSetScreen } from '../components/pincode-set-screen';

setPincodeConfig({
  SetPinScreen: PincodeSetScreen,
  AuthScreen: PincodeAuthScreen,
});

export default function RootLayout() {
  return <Stack />;
}
```

3. Wrap a component that you want to protect with a pincode screen with `withAuthenticationRequired` HOC:

```tsx
import { withAuthenticationRequired } from 'expo-with-pincode';
import { SafeAreaView, ScrollView, Text } from 'react-native';

function ProtectedScreen() {
  return (
    <SafeAreaView>
      <ScrollView>
        <Text>❗️protected content❗️</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export default withAuthenticationRequired(ProtectedScreen);
```

4. You're all set.

# API

## `useLocalAuthentication()`

Hook to use for local authentication.
Use this hook to authenticate the user using biometrics or pincode.
@returns Object with the following properties:
- `authenticate: (method: "pin" | "biometrics") => Promise<boolean>`: Authenticate the user using either pincode or biometrics. Returns `true` if the authentication was successful.
- `submitCheck: () => Promise<boolean>`: Submit the pincode for verification (authenticate and run callbacks).
- `submitSet: () => Promise<boolean>`: Submit the pincode for setting (authenticate and run callbacks).
- `submitReset: () => Promise<boolean>`: Submit the pincode for resetting (authenticate and run callbacks).
- `submitBiometrics: () => Promise<boolean>`: Submit biometrics for verification (authenticate and run callbacks).
- `isAuthenticated: boolean`: Boolean indicating if the user is authenticated.

## `usePinInputState()`

Hook that returns the current pin input state.
@returns Object with the following properties:
- `input`: Array of numbers representing the pin input.
- `cursor`: Number representing the cursor position.
- `isFilled`: Boolean indicating if the input is filled.
- `loading`: Boolean indicating if the input is loading.
- `message`: String representing the state message.
- `error`: Boolean indicating if the input is in error state.
- `success`: Boolean indicating if the input is in success state.

## `usePinSettings()`

Hook that returns the current pin settings and allows to set them.
@returns Object with the following properties:
- `isPincodeSet`: Boolean indicating if the pin is set.
- `isBiometricsAvailable`: Boolean indicating if biometrics are available on the device.
- `isFaceIdEnabled`: Boolean indicating if Face ID auth is enabled.
- `isPasscodeEnabled`: Boolean indicating if passcode auth is enabled.
- `setUsePasscode: (value: boolean) => void`: Set the use of passcode.
- `setUseFaceId: (value: boolean) => void`: Set the use of Face ID.


 ## `setPincodeConfig(config: Partial<Config>)`

Hook that sets the configuration for the pincode screen.

### type `Config`:
 * @property {number} sessionTimeout - Session timeout in milliseconds (default: 60_000).
 * @property {number} pincodeLength - Length of the pincode (default: 4).
 * @property {React.FC} [AuthScreen] - Component for the "Enter Pincode" screen (default: undefined).
 * @property {React.FC} [SetPinScreen] - Component for the "Set Pincode" screen (default: undefined).
 * @property {React.FC} [LoadingScreen] - Component for the loading screen (default: undefined).
 Screen will be shown while loading device configuration.
 If not provided, the default loading screen (`<ActivityIndicator />`) will be shown.
 * @property {boolean} requireSetPincode - Whether setting a pincode is required (default: false). If true, upon accessing protected component user will be redirected to the Set Pincode screen if the pincode is not set.
 * @property {() => void} [onSuccessfulAuth] - Callback invoked after successful authentication.
 * @property {() => void} [onFailedAuth] - Callback invoked after failed authentication.
 * @property {PincodeScreenMessages} messages - Messages displayed for various modes.
 * @property {number} submitTimeout - Timeout after successful submit or error in milliseconds (default: 2_000). Handy to notify the user about the result.
 * @property {boolean} submitAfterLastInput - Automatically submit after the last character input (default: true).
 * @property {number} animationDuration - Duration of the pincode screen fadeout after successful sign-in in milliseconds (default: 1000).

 ### type `PincodeScreenMessages`
 ```ts
 const DEFAULT_MESSAGES: PincodeScreenMessages = {
  create: 'Create your PIN',
  confirm: 'Confirm your PIN',
  set: 'PIN is set',
  nomatch: 'PINs do not match',
  check: 'Enter your PIN',
  correct: 'PIN is correct',
  incorrect: 'Incorrect  PIN',
  reset: 'Enter old PIN to reset it',
  isreset: 'PIN is reset',
};
```

## `withAuthenticationRequired(Component)`
HOC that wraps a component with a pincode screen.

## `PincodeScreen`
Wrap your pincode screens with this component.

```ts
export type PincodeScreenProps = {
  mode: PicodeScreenMode;
  onSuccessfulSetPincode?: () => void;
  onSuccessfulResetPincode?: () => void;
} & PropsWithRef<ViewProps>;
```

### Props:
 * @property {string} `mode` - Mode of the pincode screen: 'create','check', 'reset'.
 * @property {() => void} `onSuccessfulSetPincode` - Callback invoked after successful pincode setting (ex. to navigate to previous screen).
 * @property {() => void} `onSuccessfulResetPincode` - Callback invoked after successful pincode reset (ex. to navigate to previous screen, or to set a new pincode).

## `PincodeInputField`
Component that renders the pincode input field with characters.

```ts
type InputFieldProps = {
  characterElement: FC<CharacterProps>;
  onCharacterChange?: (index: number, value: number | null) => void;
} & Omit<ViewProps, 'children'>;
```

### Props:
 * @property {FC<CharacterProps>} `characterElement` - Component to render the character.
 * @property {(index: number, value: number | null) => void} `onCharacterChange` - Callback invoked when a character is changed.

## `PinpadButton`
Component that renders a pinpad button.

```ts
type PinpadButtonProps = {
  value: PinpadValue;
} & PropsWithRef<PressableProps>;
```

### Props:
 * @property {PinpadValue} `value` - Value of the button: `0-9`, `'faceid'`, `'backspace'`, `'clear'`, `'submit'`.
