import { registerWebModule, NativeModule } from 'expo';

import { ExpoWithPincodeModuleEvents } from './ExpoWithPincode.types';

class ExpoWithPincodeModule extends NativeModule<ExpoWithPincodeModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoWithPincodeModule);
