import React from 'react';
import { ElementItem, ElementName, MetadataBlock } from '../../src';
import ExampleContainer from './example-container';

const appearances = [
  'default',
  'inprogress',
  'moved',
  'new',
  'removed',
  'success',
];

const primary = appearances.map((appearance) => ({
  name: ElementName.State,
  appearance,
  text: appearance.toUpperCase(),
})) as ElementItem[];

export default () => (
  <ExampleContainer>
    <MetadataBlock primary={primary} />
  </ExampleContainer>
);
