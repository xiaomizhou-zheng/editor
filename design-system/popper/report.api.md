## API Report File for "@atlaskit/popper"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

<!--
	Generated API Report version: 2.0
-->

[Learn more about API reports](https://hello.atlassian.net/wiki/spaces/UR/pages/1825484529/Package+API+Reports)

```ts
import { Manager } from 'react-popper';
import { ManagerProps } from 'react-popper';
import { Modifier } from 'react-popper';
import { Placement } from '@popperjs/core';
import { placements } from '@popperjs/core';
import { PopperArrowProps } from 'react-popper';
import { PopperChildrenProps } from 'react-popper';
import { PopperProps } from 'react-popper';
import { default as React_2 } from 'react';
import { Reference } from 'react-popper';
import { ReferenceProps } from 'react-popper';
import { StrictModifier } from 'react-popper';
import { VirtualElement } from '@popperjs/core';

// @public (undocumented)
interface CustomPopperProps<Modifiers> {
  children?: (childrenProps: PopperChildrenProps) => React_2.ReactNode;
  modifiers?: PopperProps<Modifiers>['modifiers'];
  offset?: Offset;
  placement?: Placement;
  referenceElement?: HTMLElement | VirtualElement;
  strategy?: PopperProps<Modifiers>['strategy'];
}

export { Manager };

export { ManagerProps };

export { Modifier };

// @public (undocumented)
type Offset = [number | null | undefined, number | null | undefined];

export { Placement };

export { placements };

// @public (undocumented)
export function Popper<CustomModifiers>({
  children,
  offset,
  placement,
  referenceElement,
  modifiers,
  strategy,
}: CustomPopperProps<CustomModifiers>): JSX.Element;

export { PopperArrowProps };

export { PopperChildrenProps };

export { PopperProps };

export { Reference };

export { ReferenceProps };

export { StrictModifier };

// (No @packageDocumentation comment for this package)
```