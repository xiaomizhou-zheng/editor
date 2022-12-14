## API Report File for "@atlaskit/editor-jira-transformer"

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
export interface ContextInfo {
  // (undocumented)
  baseUrl: string;
  // (undocumented)
  clientId: string;
  // (undocumented)
  collection: string;
  // (undocumented)
  token: string;
}

// @public (undocumented)
export type CustomEncoder = (userId: string) => string;

// @public (undocumented)
export interface JIRACustomEncoders {
  // (undocumented)
  mention?: CustomEncoder;
}

// @public (undocumented)
export class JIRATransformer implements Transformer_2<string> {
  constructor(
    schema: Schema,
    customEncoders?: JIRACustomEncoders,
    mediaContextInfo?: MediaContextInfo,
  );
  // (undocumented)
  encode(node: Node_2): string;
  // (undocumented)
  parse(html: string): Node_2;
}

// @public (undocumented)
export interface MediaContextInfo {
  // (undocumented)
  uploadContext?: ContextInfo;
  // (undocumented)
  viewContext?: ContextInfo;
}

// (No @packageDocumentation comment for this package)
```
