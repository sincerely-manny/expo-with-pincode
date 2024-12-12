# expo-with-pincode

Headless UI library for creating a pincode screen in your app.

# Installation

```
npm install expo-with-pincode expo-local-authentication expo-router expo-secure-store expo-sqlite jotai superjson
npx pod-install
```

# Quick start

1. Create an auth screen: `PincodeAuthScreen.tsx` and style it as you prefer:

```tsx
import {
  PincodeInputField,
  PincodeScreen,
  PinpadButton,
  usePinpadStateMessage,
} from 'expo-with-pincode';
import { Text, View } from 'react-native';

export function PincodeAuthScreen() {
  const message = usePinpadStateMessage();
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
import { useSetConfig } from 'expo-with-pincode';
import { useEffect } from 'react';

import { PincodeAuthScreen } from '../components/pincode-auth-screen';
import { PincodeSetScreen } from '../components/pincode-set-screen';

export default function RootLayout() {
  const setPinConfig = useSetConfig();
  useEffect(() => {
    setPinConfig({
      AuthScreen: PincodeAuthScreen,
      SetPinScreen: PincodeSetScreen,
    });
  }, [setPinConfig]);
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

Hook that returns an object with the following properties:
 * Use this hook to authenticate the user using biometrics or pincode.
 * @returns Object with the following properties:
 * - `isAuthenticated`: Boolean indicating if the user is authenticated and session is valid.
 * - `isBiometricAvailable`: Boolean indicating if biometrics are available.
 * - `authenticateWithBiometrics`: Function to authenticate the user with biometrics.
 * Sets isAuthenticated to true if successful.
 * Returns a boolean indicating if the authentication was successful.
 * - `authenticateWithPincode`: Function to authenticate the user with a pincode.
 * Sets isAuthenticated to true if successful.
 * Returns a boolean indicating if the authentication was successful.
 * - `setPincode`: Function to set a pincode.
 * - `clearPincode`: Function to clear the pincode.
 * - `isPincodeSet`: Boolean indicating if a pincode is set.
 * - `PIN_INPUT_INITIAL_STATE`: Initial state for the pin input.
 * - `isFaceIDEnabled`: Boolean indicating if Face ID is enabled.
 * - `setFaceIDEnabled`: Function to enable Face ID.
 * - `handleAuthSuccess`: Function to handle successful authentication.
 * - `handleAuthFailure`: Function to handle failed authentication.
 * - `resetInput`: Function to reset the pin input.
 * - `submitCheck`: Function to submit the pin input for checking.
 * - `submitSet`: Function to submit the pin input for setting (creating, both pincode and confirmation).
 * - `submitReset`: Function to submit the pin input for resetting (deleting).


 ## `useSetConfig(config: Config)`

Hook that sets the configuration for the pincode screen.

### type `Config`:
 * @property {number} `sessionTimeout` - Session timeout in milliseconds (default: 1 minute).
 * @property {number} `pincodeLength` - Length of the pincode (default: 4).
 * @property {React.FC} `AuthScreen` - Component for the "Enter Pincode" screen (default: null).
 * @property {React.FC} `SetPinScreen` - Component for the "Set Pincode" screen (default: null).
 * @property {boolean} `requireSetPincode` - Whether setting a pincode is required (default: false).
 * @property {() => void} `onSuccessfulAuth` - Callback invoked after successful authentication.
 * @property {() => void} `onFailedAuth` - Callback invoked after failed authentication.
 * @property {PincodeScreenMessages} `messages` - Messages displayed for various modes.
 * @property {number} `submitTimeout` - Timeout after successful submit or error in milliseconds (default: 2 seconds).
 * @property {boolean} `submitAfterLastInput` - Automatically submit after the last input (default: true).

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

## `usePinpadStateMessage()`
A hook that returns a message to display on the pinpad screen.


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
