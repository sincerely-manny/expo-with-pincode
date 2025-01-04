import {
  type StoreContextInput,
  type StoreContextState,
  store,
} from '../store';
import type { PincodeScreenMessages } from '../types';

function setMessage(message: keyof PincodeScreenMessages) {
  store.send({
    type: 'state.message',
    message,
  });
}

export function handleMessages({
  success,
  error,
  mode,
  step,
  input,
}: StoreContextState & { input: StoreContextInput['value'] }) {
  if (success) {
    switch (mode) {
      case 'check':
        setMessage('correct');
        break;
      case 'create':
        setMessage('set');
        break;
      case 'reset':
        setMessage('isreset');
        break;
    }
    return;
  }

  if (error) {
    switch (mode) {
      case 'check':
      case 'reset':
        setMessage('incorrect');
        break;
      case 'create':
        setMessage('nomatch');
        break;
    }
    return;
  }

  if (input.some((i) => i !== null)) {
    return;
  }

  switch (mode) {
    case 'check':
      setMessage('check');
      break;
    case 'create':
      switch (step) {
        case 'enter':
          setMessage('create');
          break;
        case 'confirm':
          setMessage('confirm');
          break;
      }
      break;
    case 'reset':
      setMessage('reset');
      break;
  }
}
