<!-- API Report Version: 2.3 -->

## API Report File for "@atlaskit/give-kudos"

> Do not edit this file. This report is auto-generated using [API Extractor](https://api-extractor.com/).
> [Learn more about API reports](https://hello.atlassian.net/wiki/spaces/UR/pages/1825484529/Package+API+Reports)

### Table of contents

- [Main Entry Types](#main-entry-types)

### Main Entry Types

<!--SECTION START: Main Entry Types-->

```ts
/// <reference types="react" />

import { LazyExoticComponent } from 'react';

// @public (undocumented)
export interface GiveKudosDrawerProps {
  // (undocumented)
  addFlag?: (flag: any) => void;
  // (undocumented)
  analyticsSource: string;
  // (undocumented)
  cloudId: string;
  // (undocumented)
  isOpen: boolean;
  // (undocumented)
  onClose: () => void;
  // (undocumented)
  recipient?: KudosRecipient;
  // (undocumented)
  teamCentralBaseUrl: string;
  // (undocumented)
  testId?: string;
}

// @public (undocumented)
export const GiveKudosLauncher: (props: GiveKudosDrawerProps) => JSX.Element;

// @public (undocumented)
export const GiveKudosLauncherLazy: LazyExoticComponent<(
  props: GiveKudosDrawerProps,
) => JSX.Element>;

// @public (undocumented)
export interface KudosRecipient {
  // (undocumented)
  recipientId: string;
  // (undocumented)
  type: KudosType;
}

// @public (undocumented)
export enum KudosType {
  // (undocumented)
  INDIVIDUAL = 'individual',
  // (undocumented)
  TEAM = 'team',
}

// (No @packageDocumentation comment for this package)
```

<!--SECTION END: Main Entry Types-->
