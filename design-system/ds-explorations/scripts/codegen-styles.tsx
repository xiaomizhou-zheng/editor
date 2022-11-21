/* eslint-disable no-console */
import { writeFile } from 'fs/promises';
import { join } from 'path';

import { createPartialSignedArtifact, createSignedArtifact } from '@af/codegen';

import { createColorStylesFromTemplate } from './color-codegen-template';
import { createColorMapTemplate } from './color-map-template';
import { createInteractionStylesFromTemplate } from './interaction-codegen';
import { createSpacingStylesFromTemplate } from './spacing-codegen-template';
import { createSpacingScaleTemplate } from './spacing-scale-template';

const colorMapOutputFolder = join(__dirname, '../', 'src', 'internal');
const tokensDependencyPath = require.resolve(
  '../../tokens/src/artifacts/tokens-raw/atlassian-light',
);

writeFile(
  join(colorMapOutputFolder, 'color-map.tsx'),
  createSignedArtifact(createColorMapTemplate(), 'yarn codegen-styles', {
    description:
      'The color map is used to map a background color token to a matching text color that will meet contrast.',
    dependencies: [tokensDependencyPath],
    outputFolder: colorMapOutputFolder,
  }),
).then(() => console.log(join(colorMapOutputFolder, 'color-map.tsx')));

writeFile(
  join(__dirname, '../', 'src', 'internal', 'spacing-scale.tsx'),
  createSignedArtifact(
    createSpacingScaleTemplate(),
    'yarn codegen-styles',
    'Some artifact',
  ),
).then(() => console.log('spacing-scale.tsx written!'));

// generate colors
Promise.all(
  [{ target: 'text.partial.tsx' }, { target: 'box.partial.tsx' }].map(
    ({ target }) => {
      const targetPath = join(__dirname, '../', 'src', 'components', target);

      const source = createPartialSignedArtifact(
        (options) => options.map(createColorStylesFromTemplate).join('\n'),
        'yarn codegen-styles',
        {
          id: 'colors',
          absoluteFilePath: targetPath,
          dependencies: [tokensDependencyPath],
        },
      );

      return writeFile(targetPath, source).then(() =>
        console.log(`${targetPath} written!`),
      );
    },
  ),
)
  .then(() => {
    // generate spacing values
    return Promise.all(
      [
        { target: 'box.partial.tsx' },
        { target: 'stack.partial.tsx' },
        { target: 'inline.partial.tsx' },
      ].map(({ target }) => {
        const targetPath = join(__dirname, '../', 'src', 'components', target);

        const source = createPartialSignedArtifact(
          (options) => options.map(createSpacingStylesFromTemplate).join('\n'),
          'yarn codegen-styles',
          {
            id: 'spacing',
            absoluteFilePath: targetPath,
            dependencies: [tokensDependencyPath],
          },
        );

        return writeFile(targetPath, source).then(() =>
          console.log(`${targetPath} written!`),
        );
      }),
    );
  })
  .then(() => {
    const targetPath = join(
      __dirname,
      '../',
      'src',
      'components',
      'interaction-surface.partial.tsx',
    );

    const source = createPartialSignedArtifact(
      (options) => options.map(createInteractionStylesFromTemplate).join('\n'),
      'yarn codegen-styles',
      {
        id: 'interactions',
        absoluteFilePath: targetPath,
        dependencies: [tokensDependencyPath],
      },
    );

    return writeFile(targetPath, source).then(() =>
      console.log(`${targetPath} written!`),
    );
  });
