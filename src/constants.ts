export const PINCODE_SECURE_KEY =
  'LOCAL_AUTHENTICATION_PINCODE_FXEKOEJDMZYRWKFSLXARUH';
export const DEFAULT_SESSION_TIMEOUT = 60 * 1000; // 1 minute
export const DEFAULT_PINCODE_LENGTH = 4 as const;

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
  check: 'Enter your PIN',
  reset: 'Enter old PIN to reset it',
  correct: 'PIN is correct',
  incorrect: 'Incorrect  PIN',
  set: 'PIN is set',
};
