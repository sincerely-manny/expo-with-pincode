import { createStoreWithProducer } from '@xstate/store';
import { produce } from 'immer';
import {
  DEFAULT_PINCODE_LENGTH,
  DEFAULT_SESSION_TIMEOUT,
  DEFAULT_SUBMIT_TIMEOUT,
  MESSAGES,
  MODE,
  STEP,
} from '../constants';
import type {
  Config,
  PicodeScreenMode,
  PincodeScreenMessages,
  PincodeScreenStep,
  PincodeState,
} from '../types';
import { isBiometricsAvailable } from './biometrics';
import { isPincodeSet } from './pincode';
import { getStorageItem, setStorageItem } from './settings';

type StoreContextInput = {
  value: PincodeState['input'];
  cursor: number;
};

const input: StoreContextInput = {
  value: [null, null, null, null],
  cursor: 0,
};

type StoreContextState = {
  step: PincodeScreenStep;
  error: boolean;
  success: boolean;
  loading: boolean;
  message: string;
  mode: PicodeScreenMode;
};

const state: StoreContextState = {
  error: false,
  success: false,
  loading: false,
  message: MESSAGES.check,
  mode: MODE.check,
  step: STEP.enter,
};

type Device = {
  isPincodeSet?: boolean;
  isBiometricsAvailable?: boolean;
};

const device: Device = {
  isPincodeSet: undefined,
  isBiometricsAvailable: undefined,
};

const config: Config = {
  sessionTimeout: DEFAULT_SESSION_TIMEOUT,
  pincodeLength: DEFAULT_PINCODE_LENGTH,
  requireSetPincode: false,
  messages: MESSAGES,
  submitTimeout: DEFAULT_SUBMIT_TIMEOUT,
  submitAfterLastInput: true,
};

type Session = {
  validTill: Date | null;
  timeout: null | ReturnType<typeof setTimeout>;
};

const session: Session = {
  validTill: null,
  timeout: null,
};

type Settings = {
  usePasscode: boolean;
  useFaceId: boolean;
};

const settings: Settings = {
  usePasscode: getStorageItem('USE_PASSCODE_ENABLED'),
  useFaceId: getStorageItem('USE_FACE_ID_ENABLED'),
};

export const store = createStoreWithProducer(produce, {
  context: {
    input,
    state,
    config,
    session,
    settings,
    device,
  },
  on: {
    //
    // MARK: - Input management
    //
    'input.input': ({ input }, { char }: { char: number }) => {
      if (input.cursor < 0 || input.cursor >= input.value.length) {
        return;
      }
      input.value[input.cursor] = char;
      input.cursor += 1;
    },
    'input.backspace': ({ input }) => {
      if (input.cursor <= 0) {
        return;
      }
      input.cursor -= 1;
      input.value[input.cursor] = null;
    },
    'input.reset': ({ input }) => {
      input.cursor = 0;
      input.value = Array(input.value.length).fill(
        null
      ) as StoreContextInput['value'];
    },
    //
    // MARK: - Form state management
    //
    'state.error': (
      { state, config },
      event?: { error: keyof PincodeScreenMessages }
    ) => {
      state.error = true;
      state.success = false;
      state.loading = false;
      state.message = event?.error
        ? config.messages[event?.error]
        : config.messages.incorrect;
    },
    'state.success': (
      { state, config },
      event?: { success: keyof PincodeScreenMessages }
    ) => {
      state.error = false;
      state.success = true;
      state.loading = false;
      state.message = event?.success
        ? config.messages[event?.success]
        : config.messages.correct;
    },
    'state.loading': ({ state }) => {
      state.error = false;
      state.success = false;
      state.loading = true;
    },
    'state.reset': ({ state }) => {
      state.error = false;
      state.success = false;
      state.loading = false;
      state.message = MESSAGES.check;
    },
    'state.message': (
      { state, config },
      event: { message: keyof PincodeScreenMessages }
    ) => {
      state.message = config.messages[event.message];
    },
    'state.mode': ({ state }, event: { mode: PicodeScreenMode }) => {
      state.mode = event.mode;
      state.step = STEP.enter;
    },
    'state.step': ({ state }, event: { step: PincodeScreenStep }) => {
      state.step = event.step;
    },
    //
    // MARK: - Device state management
    //
    'device.setIsPincodeSet': (
      { device },
      event: { isPincodeSet: boolean }
    ) => {
      device.isPincodeSet = event.isPincodeSet;
    },
    'device.setIsBiometricsAvailable': (
      { device },
      event: { isBiometricsAvailable: boolean }
    ) => {
      device.isBiometricsAvailable = event.isBiometricsAvailable;
    },
    //
    // MARK: - Configuration management
    //
    'config.update': ({ config }, event: Partial<Config>) => {
      Object.assign(config, event);
    },
    //
    // MARK: - Session management
    //
    // MARK: - Settings management
    //
    'settings.setUsePasscode': (
      { settings },
      event: { usePasscode: boolean }
    ) => {
      settings.usePasscode = event.usePasscode;
      setStorageItem('USE_PASSCODE_ENABLED', event.usePasscode);
    },
    'settings.setUseFaceId': ({ settings }, event: { useFaceId: boolean }) => {
      settings.useFaceId = event.useFaceId;
      setStorageItem('USE_FACE_ID_ENABLED', event.useFaceId);
    },
  },
});

// MARK: - On init
async function initStore() {
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
}

initStore();
