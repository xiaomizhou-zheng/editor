jest.autoMockOff();

import { createTransformer } from '../utils';
import { renameUnsafeAllowUndoRedoButtonsProp } from '../migrates/rename-unsafe-allowUndoRedoButtons-prop';

// This stays as require() since changing to import will trigger a linter error
const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

const transformer = createTransformer('@atlaskit/editor-core', [
  renameUnsafeAllowUndoRedoButtonsProp,
]);

describe('Rename UNSAFE_allowUndoRedoButtons to allowUndoRedoButtons', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor />
    );
    `, // -----
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor />
    );
    `, // -----
    'rename nothing if UNSAFE_allowUndoRedoButtons prop not set',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor allowUndoRedoButtons />
    );
    `, // -----
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor allowUndoRedoButtons />
    );
    `, // -----
    'rename nothing if boolean prop',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor allowUndoRedoButtons={true} />
    );
    `, // -----
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor allowUndoRedoButtons={true} />
    );
    `, // -----
    'rename nothing if UNSAFE_allowUndoRedoButtons not found',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor UNSAFE_allowUndoRedoButtons={true} />
    );
    `, // -----
    `
    import React from 'react';
    import { Editor } from '@atlaskit/editor-core';

    export default () => (
      <Editor allowUndoRedoButtons={true} />
    );
    `, // -----
    'rename UNSAFE_allowUndoRedoButtons to allowUndoRedoButtons and do not change other options',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import { Editor as AKEditor } from '@atlaskit/editor-core';

    export default () => (
      <AKEditor UNSAFE_allowUndoRedoButtons={true} />
    );
    `, // -----
    `
    import React from 'react';
    import { Editor as AKEditor } from '@atlaskit/editor-core';

    export default () => (
      <AKEditor allowUndoRedoButtons={true} />
    );
    `, // -----
    'rename UNSAFE_allowUndoRedoButtons to allowUndoRedoButtons when Editor is renamed',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';

    const Editor = (props) => {
      <pre contenteditable>{props.children}</pre>
    };

    export default () => (
      <Editor UNSAFE_allowUndoRedoButtons={true} />
    );
    `, // -----
    `
    import React from 'react';

    const Editor = (props) => {
      <pre contenteditable>{props.children}</pre>
    };

    export default () => (
      <Editor UNSAFE_allowUndoRedoButtons={true} />
    );
    `, // -----
    'rename nothing if UNSAFE_allowUndoRedoButtons for Editor is not from @atlaskit/editor-core',
  );
});
