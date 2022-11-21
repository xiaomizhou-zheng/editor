import React from 'react';
import { ElementName, MetadataBlock } from '../../src';
import ExampleContainer from './example-container';

export default () => (
  <ExampleContainer>
    <MetadataBlock
      primary={[
        { name: ElementName.CollaboratorGroup },
        { name: ElementName.ModifiedOn },
      ]}
      secondary={[
        { name: ElementName.SubscriberCount },
        { name: ElementName.CommentCount },
        { name: ElementName.AttachmentCount },
        { name: ElementName.Priority },
        { name: ElementName.State },
      ]}
    />
  </ExampleContainer>
);
