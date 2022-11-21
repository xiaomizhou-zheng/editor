## API Report File for "@atlaskit/popup"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

<!--
	Generated API Report version: 2.0
-->

[Learn more about API reports](https://hello.atlassian.net/wiki/spaces/UR/pages/1825484529/Package+API+Reports)

```ts
import { ComponentType } from 'react';
import { CSSProperties } from 'react';
import { Dispatch } from 'react';
import { FC } from 'react';
import { Placement } from '@atlaskit/popper';
import { PopperChildrenProps } from '@atlaskit/popper';
import { default as React_2 } from 'react';
import { ReactNode } from 'react';
import { Ref } from 'react';
import { SetStateAction } from 'react';

// @public (undocumented)
interface BaseProps {
  autoFocus?: boolean;
  boundary?: 'clippingParents' | HTMLElement;
  content: (props: ContentProps) => React_2.ReactNode;
  fallbackPlacements?: Placement[];
  id?: string;
  isOpen: boolean;
  offset?: [number, number];
  onClose?(event: Event | React_2.MouseEvent | React_2.KeyboardEvent): void;
  placement?: Placement;
  popupComponent?: ComponentType<PopupComponentProps>;
  rootBoundary?: 'viewport' | 'document';
  shouldFlip?: boolean;
  shouldUseCaptureOnOutsideClick?: boolean;
  testId?: string;
}

// @public (undocumented)
export interface ContentProps {
  isOpen: boolean;
  onClose?: BaseProps['onClose'];
  setInitialFocusRef: Dispatch<SetStateAction<HTMLElement | null>>;
  update: PopperChildrenProps['update'];
}

// @public (undocumented)
const Popup: FC<PopupProps>;
export { Popup };
export default Popup;

// @public (undocumented)
export interface PopupComponentProps {
  'data-placement': Placement;
  'data-testid'?: string;
  children: ReactNode;
  id?: string;
  ref: Ref<HTMLDivElement>;
  style: CSSProperties;
  tabIndex: number | undefined;
}

// @public (undocumented)
export interface PopupProps extends BaseProps {
  trigger: (props: TriggerProps) => React_2.ReactNode;
  zIndex?: number;
}

// @public (undocumented)
export interface TriggerProps {
  // (undocumented)
  'aria-controls'?: string;
  // (undocumented)
  'aria-expanded': boolean;
  // (undocumented)
  'aria-haspopup': boolean;
  // (undocumented)
  ref: Ref<any>;
}

// (No @packageDocumentation comment for this package)
```