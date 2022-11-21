/** @jsx jsx */
import { jsx } from '@emotion/react';
import { smallImage } from '@atlaskit/media-test-helpers';

import { BlockCardResolvedView } from '../src/view/BlockCard';
import { VRTestCase } from './utils/common';
import { ActionProps } from '../src/view/BlockCard/components/Action';

export default () => {
  const actionsList: Array<ActionProps> = [
    {
      id: 'Preview',
      text: 'Preview',
      promise: () => Promise.resolve(),
    },
    {
      id: 'Like',
      text: 'Like',
      promise: () => Promise.resolve(),
    },
    {
      id: 'Open',
      text: 'Open',
      promise: () => Promise.resolve(),
    },
    {
      id: 'Download',
      text: 'Download',
      promise: () => Promise.resolve(),
    },
  ];
  return (
    <VRTestCase title="Block card with actions menu">
      {() => (
        <BlockCardResolvedView
          icon={{ url: smallImage }}
          title="Smart Links - Designs"
          link="https://icatcare.org/app/uploads/2019/09/The-Kitten-Checklist-1.png"
          byline={'Updated 2 days ago. Created 3 days ago.'}
          thumbnail={smallImage}
          context={{ text: 'Dropbox', icon: smallImage }}
          actions={actionsList}
        />
      )}
    </VRTestCase>
  );
};
