export const PINCODE_SECURE_KEY =
  'LOCAL_AUTHENTICATION_PINCODE_FXEKOEJDMZYRWKFSLXARUH';
export const DEFAULT_SESSION_TIMEOUT = 60 * 1000; // 1 minute
export const DEFAULT_PINCODE_LENGTH = 4 as const;
export const DEFAULT_SUBMIT_TIMEOUT = 2000; // 2 seconds
export const DEFAULT_ANIMATION_DURATION = 1000; // 1 second

export const MODE = {
  create: 'create',
  check: 'check',
  reset: 'reset',
} as const;

export const STEP = {
  enter: 'enter',
  confirm: 'confirm',
} as const;

export const MESSAGES = {
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

export const PINPAD_LAYOUT = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  'faceid',
  0,
  'backspace',
] as const;

export const PINPAD = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  faceid: 'faceid',
  backspace: 'backspace',
  clear: 'clear',
  submit: 'submit',
} as const;

export const PINCODE_SET_CONFIRMATION_WAIT = 300;
