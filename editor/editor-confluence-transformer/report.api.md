## API Report File for "@atlaskit/editor-confluence-transformer"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

<!--
	Generated API Report version: 2.0
-->

[Learn more about API reports](https://hello.atlassian.net/wiki/spaces/UR/pages/1825484529/Package+API+Reports)

```ts
import { Node as Node_2 } from 'prosemirror-model';
import { Schema } from 'prosemirror-model';
import { Transformer as Transformer_2 } from '@atlaskit/editor-common/types';

// @public (undocumented)
export const CONFLUENCE_LANGUAGE_MAP: {
  actionscript: string;
  applescript: string;
  'c++': string;
  coldfusion: string;
  csharp: string;
  css: string;
  delphi: string;
  diff: string;
  erlang: string;
  groovy: string;
  java: string;
  javafx: string;
  javascript: string;
  perl: string;
  php: string;
  plaintext: string;
  powershell: string;
  python: string;
  ruby: string;
  sass: string;
  scala: string;
  shell: string;
  sql: string;
  visualbasic: string;
  xml: string;
};

// @public (undocumented)
export class ConfluenceTransformer implements Transformer_2<string> {
  constructor(schema: Schema);
  // (undocumented)
  encode: (node: Node_2) => string;
  // (undocumented)
  parse: (html: string) => Node_2;
}

// (No @packageDocumentation comment for this package)
```
