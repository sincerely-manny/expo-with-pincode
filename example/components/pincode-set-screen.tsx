import { useRouter } from 'expo-router';
import {
  PincodeInputField,
  PincodeScreen,
  PinpadButton,
  usePinInputState,
  usePinSettings,
} from 'expo-with-pincode';
import { useState } from 'react';
import { Text, View } from 'react-native';

export function PincodeSetScreen() {
  const { message } = usePinInputState();
  const router = useRouter();
  const { isPincodeSet } = usePinSettings();
  const [mode, setMode] = useState<'reset' | 'create'>(
    isPincodeSet ? 'reset' : 'create'
  );
  return (
    <PincodeScreen
      mode={mode}
      onSuccessfulSetPincode={router.back}
      onSuccessfulResetPincode={() => setMode('create')}
    >
      <Text
        style={{
          alignSelf: 'center',
          margin: 20,
        }}
      >
        {message}
      </Text>
      <PincodeInputField
        style={{
          flexDirection: 'row',
          borderWidth: 1,
          alignSelf: 'center',
          width: '40%',
          margin: 20,
          justifyContent: 'center',
        }}
        characterElement={({ value }) => (
          <Text>{value === null ? '-' : '*'}</Text>
        )}
      />
      <View
        style={{
          flexDirection: 'row',
          width: 210,
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignSelf: 'center',
          margin: 20,
          gap: 5,
        }}
      >
        {([1, 2, 3, 4, 5, 6, 7, 8, 9, 'faceid', 0, 'backspace'] as const).map(
          (v) => (
            <PinpadButton
              value={v}
              style={{
                width: 60,
                height: 60,
                borderWidth: 1,
                borderRadius: 999,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              key={v}
            >
              <Text>{v}</Text>
            </PinpadButton>
          )
        )}
      </View>
    </PincodeScreen>
  );
}
