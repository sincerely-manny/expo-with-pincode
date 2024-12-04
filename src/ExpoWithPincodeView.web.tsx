import * as React from 'react';

import { ExpoWithPincodeViewProps } from './ExpoWithPincode.types';

export default function ExpoWithPincodeView(props: ExpoWithPincodeViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
