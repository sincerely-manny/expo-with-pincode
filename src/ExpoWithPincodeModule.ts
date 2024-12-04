import { NativeModule, requireNativeModule } from 'expo';

import { ExpoWithPincodeModuleEvents } from './ExpoWithPincode.types';

declare class ExpoWithPincodeModule extends NativeModule<ExpoWithPincodeModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoWithPincodeModule>('ExpoWithPincode');
