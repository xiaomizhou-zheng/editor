import React from 'react';

import { MarkdownTransformer } from '@atlaskit/editor-markdown-transformer';
import { ADFEncoder, ReactRenderer } from '@atlaskit/renderer';

// @ts-ignore
import DOCUMENT from '../src/error-handling/convert-to-error/README.md';

const adfEncoder = new ADFEncoder(schema => new MarkdownTransformer(schema));
const document = adfEncoder.encode(DOCUMENT);

export default <ReactRenderer document={document} />;
