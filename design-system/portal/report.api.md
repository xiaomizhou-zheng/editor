## API Report File for "@atlaskit/portal"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

<!--
	Generated API Report version: 2.0
-->

[Learn more about API reports](https://hello.atlassian.net/wiki/spaces/UR/pages/1825484529/Package+API+Reports)

```ts
/// <reference types="react" />

import type { Layers } from '@atlaskit/theme/types';
import { default as React_2 } from 'react';

// @public
type LayerName = keyof Layers;

// @public (undocumented)
function Portal(props: PortalProps): JSX.Element | null;
export default Portal;

// @public (undocumented)
export const PORTAL_MOUNT_EVENT = 'akPortalMount';

// @public (undocumented)
export const PORTAL_UNMOUNT_EVENT = 'akPortalUnmount';

// @public
export type PortalEvent = CustomEvent<PortalEventDetail>;

// @public
interface PortalEventDetail {
  // (undocumented)
  layer: LayerName | null;
  // (undocumented)
  zIndex: number;
}

// @public
export interface PortalProps {
  // (undocumented)
  children: React_2.ReactNode;
  // (undocumented)
  zIndex?: number | string;
}

// (No @packageDocumentation comment for this package)
```