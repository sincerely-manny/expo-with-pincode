import { useAtomValue } from 'jotai';
import { type FC, forwardRef, useEffect, useRef } from 'react';
import { View, type ViewProps } from 'react-native';

import { inputAtom } from '../store/component-state';
import { store } from './pincode-store-provider';

type CharacterProps = {
  value?: number | null;
};

type InputFieldProps = {
  characterElement: FC<CharacterProps>;
  onCharacterChange?: (index: number, value: number | null) => void;
} & Omit<ViewProps, 'children'>;

export const PincodeInputField = forwardRef<View, InputFieldProps>(
  function PincodeInputField(
    { characterElement: Character, onCharacterChange, ...props },
    ref
  ) {
    const input = useAtomValue(inputAtom, { store });
    const inputValueRef = useRef(input);
    useEffect(() => {
      for (let i = 0; i < input.length; i++) {
        if (input[i] !== inputValueRef.current[i]) {
          onCharacterChange?.(i, input[i]);
        }
      }
      inputValueRef.current = input;
    }, [input, onCharacterChange]);

    return (
      <View {...props} ref={ref}>
        {input.map((value, index) => (
          <Character key={index} value={value} />
        ))}
      </View>
    );
  }
);
