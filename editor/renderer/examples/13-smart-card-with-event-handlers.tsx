import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';

import { default as Renderer } from '../src/ui/Renderer';
import document from './helper/smart-card.adf.json';

export default function Example() {
  return (
    <SmartCardProvider>
      <Renderer
        document={document}
        appearance="full-page"
        eventHandlers={{
          smartCard: {
            onClick: (e, url) => {
              window.open(url, '_blank');
            },
          },
        }}
      />
    </SmartCardProvider>
  );
}
