/** @jsx jsx */
import { jsx } from '@emotion/react';
import { smallImage } from '@atlaskit/media-test-helpers';

import { BlockCardResolvedView } from '../src/view/BlockCard';
import { VRTestCase } from './utils/common';

export default () => (
  <VRTestCase title="Block card with lozenge">
    {() => (
      <BlockCardResolvedView
        icon={{ url: smallImage }}
        users={[
          {
            src: smallImage,
            name: 'Abhi',
          },
        ]}
        title="Smart Links - Designs"
        link="https://icatcare.org/app/uploads/2019/09/The-Kitten-Checklist-1.png"
        byline={'Updated 2 days ago. Created 3 days ago.'}
        thumbnail={smallImage}
        context={{ text: 'Dropbox', icon: smallImage }}
        lozenge={{
          text: 'I love cheese',
          appearance: 'inprogress',
          isBold: true,
        }}
      />
    )}
  </VRTestCase>
);
