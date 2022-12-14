## API Report File for "@atlaskit/lozenge"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

<!--
	Generated API Report version: 2.0
-->

[Learn more about API reports](https://hello.atlassian.net/wiki/spaces/UR/pages/1825484529/Package+API+Reports)

```ts
import { CSSProperties } from 'react';
import { jsx } from '@emotion/react';
import { MemoExoticComponent } from 'react';
import { ReactNode } from 'react';

// @public
const Lozenge: MemoExoticComponent<({
  children,
  testId,
  isBold,
  appearance,
  maxWidth,
  style,
}: LozengeProps) => jsx.JSX.Element>;
export default Lozenge;

// @public (undocumented)
interface LozengeProps {
  appearance?: ThemeAppearance;
  children?: ReactNode;
  isBold?: boolean;
  maxWidth?: number | string;
  style?: Pick<CSSProperties, 'backgroundColor' | 'color'>;
  testId?: string;
}

// @public (undocumented)
export type ThemeAppearance =
  | 'default'
  | 'inprogress'
  | 'moved'
  | 'new'
  | 'removed'
  | 'success';

// (No @packageDocumentation comment for this package)
```
