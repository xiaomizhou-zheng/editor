## API Report File for "@atlaskit/tabs"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

<!--
	Generated API Report version: 2.0
-->

[Learn more about API reports](https://hello.atlassian.net/wiki/spaces/UR/pages/1825484529/Package+API+Reports)

```ts
import { jsx } from '@emotion/react';
import { KeyboardEvent as KeyboardEvent_2 } from 'react';
import { MouseEvent as MouseEvent_2 } from 'react';
import { ReactNode } from 'react';
import UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next/withAnalyticsEvents';

// @public (undocumented)
type OnChangeCallback = (
  index: SelectedType,
  analyticsEvent: UIAnalyticsEvent,
) => void;

// @public (undocumented)
type SelectedType = number;

// @public
export function Tab({ children, testId }: TabProps): jsx.JSX.Element;

// @public (undocumented)
export type TabAttributesType = {
  onClick: () => void;
  id: string;
  'aria-controls': string;
  'aria-posinset': number;
  'aria-selected': boolean;
  'aria-setsize': number;
  onMouseDown: (e: MouseEvent_2<HTMLElement>) => void;
  onKeyDown: (e: KeyboardEvent_2<HTMLElement>) => void;
  role: 'tab';
  tabIndex: number;
};

// @public @deprecated (undocumented)
export interface TabData {
  [key: string]: any;
  content?: ReactNode;
  label?: string;
  testId?: string;
}

// @public
export const TabList: (props: TabListProps) => jsx.JSX.Element;

// @public (undocumented)
export type TabListAttributesType = {
  selected: SelectedType;
  tabsId: string;
  onChange: (index: SelectedType) => void;
};

// @public (undocumented)
export interface TabListProps {
  children: ReactNode;
}

// @public
export const TabPanel: ({ children, testId }: TabPanelProps) => jsx.JSX.Element;

// @public (undocumented)
export type TabPanelAttributesType = {
  role: 'tabpanel';
  id: string;
  hidden?: boolean;
  'aria-labelledby': string;
  onMouseDown: (e: MouseEvent_2<HTMLElement>) => void;
  tabIndex: number;
};

// @public (undocumented)
export interface TabPanelProps {
  children: ReactNode;
  testId?: string;
}

// @public (undocumented)
export interface TabProps {
  children: ReactNode;
  testId?: string;
}

// @public
const Tabs: (props: TabsProps) => jsx.JSX.Element;
export default Tabs;

// @public (undocumented)
export interface TabsProps extends WithAnalyticsEventsProps {
  analyticsContext?: Record<string, any>;
  children: ReactNode;
  defaultSelected?: SelectedType;
  id: string;
  onChange?: OnChangeCallback;
  selected?: SelectedType;
  shouldUnmountTabPanelOnChange?: boolean;
  testId?: string;
}

// @public (undocumented)
export const useTab: () => TabAttributesType;

// @public (undocumented)
export const useTabPanel: () => TabPanelAttributesType;

// (No @packageDocumentation comment for this package)
```