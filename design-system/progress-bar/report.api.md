## API Report File for "@atlaskit/progress-bar"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

<!--
	Generated API Report version: 2.0
-->

[Learn more about API reports](https://hello.atlassian.net/wiki/spaces/UR/pages/1825484529/Package+API+Reports)

```ts
/// <reference types="react" />

import { jsx } from '@emotion/react';
import { ThemeProp } from '@atlaskit/theme/components';

// @public (undocumented)
interface CustomProgressBarProps {
  ariaLabel?: string;
  isIndeterminate?: boolean;
  testId?: string;
  value?: number;
}

// @public (undocumented)
interface DefaultProgressBarProps extends CustomProgressBarProps {
  appearance?: 'default' | 'success' | 'inverse';
  // @deprecated (undocumented)
  theme?: ThemeProp<ThemeTokens, ThemeProps>;
}

// @public
const ProgressBar: ({
  appearance,
  ariaLabel,
  isIndeterminate,
  testId,
  theme,
  value,
}: DefaultProgressBarProps) => jsx.JSX.Element;
export default ProgressBar;

// @public
export const SuccessProgressBar: ({
  ariaLabel,
  isIndeterminate,
  testId,
  value,
}: CustomProgressBarProps) => JSX.Element;

// @public @deprecated (undocumented)
type ThemeProps = {
  value: string | number;
};

// @public @deprecated (undocumented)
type ThemeTokens = {
  container: any;
  bar: any;
  determinateBar: any;
  increasingBar: any;
  decreasingBar: any;
};

// @public
export const TransparentProgressBar: ({
  ariaLabel,
  isIndeterminate,
  testId,
  value,
}: CustomProgressBarProps) => JSX.Element;

// (No @packageDocumentation comment for this package)
```