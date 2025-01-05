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
import { getStorageItem, setStorageItem } from '../model/settings';
import type {
  Config,
  PicodeScreenMode,
  PincodeScreenMessages,
  PincodeScreenStep,
  PincodeState,
} from '../types';

export type StoreContextInput = {
  value: PincodeState['input'];
  cursor: number;
};

const input: StoreContextInput = {
  value: [null, null, null, null],
  cursor: 0,
};

export type StoreContextState = {
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
  isAuthenticated: boolean;
  validTill: Date | null;
  timeout: null | ReturnType<typeof setTimeout>;
  mutex: boolean;
};

const session: Session = {
  isAuthenticated: false,
  validTill: null,
  timeout: null,
  mutex: false,
};

type Settings = {
  usePasscode: boolean;
  useFaceId: boolean;
};

const settings: Settings = {
  usePasscode: getStorageItem('USE_PASSCODE_ENABLED'),
  useFaceId: getStorageItem('USE_FACE_ID_ENABLED'),
};

type Context = {
  input: StoreContextInput;
  state: StoreContextState;
  config: Config;
  session: Session;
  settings: Settings;
  device: Device;
};

// biome-ignore lint/complexity/noBannedTypes: union reqired for xstate
type EmptyPayload = {};

type Transitions = {
  'input.input': { char: number };
  'input.backspace': EmptyPayload;
  'input.reset': EmptyPayload;
  'state.error': { enable?: boolean };
  'state.success': { enable?: boolean };
  'state.loading': { enable?: boolean };
  'state.reset': EmptyPayload;
  'state.message': { message: keyof PincodeScreenMessages };
  'state.mode': { mode: PicodeScreenMode };
  'state.step': { step: PincodeScreenStep };
  'device.setIsPincodeSet': { isPincodeSet: boolean };
  'device.setIsBiometricsAvailable': { isBiometricsAvailable: boolean };
  'config.update': Partial<Config>;
  'settings.setUsePasscode': { usePasscode: boolean };
  'settings.setUseFaceId': { useFaceId: boolean };
  'session.startTimeout': EmptyPayload;
  'session.clearTimeout': EmptyPayload;
  'session.start': EmptyPayload;
  'session.end': EmptyPayload;
  'session.renew': EmptyPayload;
  'session.setMutex': { lock: boolean };
};

type Events = {
  type: 'state.changed';
  value: StoreContextState & { input: StoreContextInput['value'] };
};

function emitStateChange(
  state: StoreContextState,
  input: StoreContextInput,
  emit: (event: Events) => void
) {
  // We need to clone the input value to proxy errors
  const value = [...input.value] as StoreContextInput['value'];
  emit({ type: 'state.changed', value: { ...state, input: value } });
}

export const store = createStoreWithProducer<Context, Transitions, Events>(
  produce,
  {
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
      'input.reset': ({ state, input }, _: EmptyPayload, { emit }) => {
        input.cursor = 0;
        input.value = Array(input.value.length).fill(
          null
        ) as StoreContextInput['value'];
        emitStateChange(state, input, emit);
      },
      //
      // MARK: - Form state management
      //
      'state.error': ({ state, input }, { enable = true }, { emit }) => {
        if (enable) {
          state.error = true;
          state.success = false;
          state.loading = false;
        } else {
          state.error = false;
        }
        emitStateChange(state, input, emit);
      },
      'state.success': ({ state, input }, { enable = true }, { emit }) => {
        if (enable) {
          state.error = false;
          state.success = true;
          state.loading = false;
        } else {
          state.success = false;
        }
        emitStateChange(state, input, emit);
      },
      'state.loading': ({ state, input }, { enable = true }, { emit }) => {
        if (enable) {
          state.error = false;
          state.success = false;
          state.loading = true;
        } else {
          state.loading = false;
        }
        emitStateChange(state, input, emit);
      },
      'state.reset': ({ state, input }, _: EmptyPayload, { emit }) => {
        state.error = false;
        state.success = false;
        state.loading = false;
        emitStateChange(state, input, emit);
      },
      'state.message': (
        { state, config },
        event: { message: keyof PincodeScreenMessages }
      ) => {
        state.message = config.messages[event.message];
      },
      'state.mode': (
        { state, input },
        event: { mode: PicodeScreenMode },
        { emit }
      ) => {
        state.mode = event.mode;
        state.step = STEP.enter;
        emitStateChange(state, input, emit);
      },
      'state.step': (
        { state, input },
        event: { step: PincodeScreenStep },
        { emit }
      ) => {
        state.step = event.step;
        emitStateChange(state, input, emit);
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
      'config.update': ({ config, input }, event: Partial<Config>) => {
        Object.assign(config, event);
        if (config.pincodeLength !== undefined) {
          input.value = Array(config.pincodeLength).fill(
            null
          ) as StoreContextInput['value'];
          input.cursor = 0;
        }
      },
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
      'settings.setUseFaceId': (
        { settings },
        event: { useFaceId: boolean }
      ) => {
        settings.useFaceId = event.useFaceId;
        setStorageItem('USE_FACE_ID_ENABLED', event.useFaceId);
      },
      //
      // MARK: - Session management
      //
      'session.startTimeout': ({ session, config }) => {
        session.validTill = new Date(Date.now() + config.sessionTimeout);
        session.timeout = setTimeout(() => {
          const mutex = store.getSnapshot().context.session.mutex;
          if (!mutex) {
            store.send({ type: 'session.end' });
          } else {
            store.send({ type: 'session.startTimeout' });
          }
        }, config.sessionTimeout);
      },
      'session.clearTimeout': ({ session }) => {
        if (session.timeout) {
          clearTimeout(session.timeout);
        }
      },
      'session.start': ({ session, config }) => {
        store.send({ type: 'session.clearTimeout' });
        session.isAuthenticated = true;
        session.validTill = new Date(Date.now() + config.sessionTimeout);
        store.send({ type: 'session.startTimeout' });
      },
      'session.end': ({ session }) => {
        session.isAuthenticated = false;
        session.validTill = null;
        store.send({ type: 'session.clearTimeout' });
      },
      'session.renew': ({ session, config }) => {
        if (session.isAuthenticated) {
          store.send({ type: 'session.clearTimeout' });
          session.validTill = new Date(Date.now() + config.sessionTimeout);
          store.send({ type: 'session.startTimeout' });
        }
      },
      'session.setMutex': ({ session }, event: { lock: boolean }) => {
        session.mutex = event.lock;
      },
    },
  }
);
