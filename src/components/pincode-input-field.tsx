import { useAtomValue } from 'jotai';
import { FC, forwardRef, useEffect, useRef } from 'react';
import { View, ViewProps } from 'react-native';

import { inputAtom } from '../store/component-state';

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
    const input = useAtomValue(inputAtom);
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
