## API Report File for "@atlaskit/calendar"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

<!--
	Generated API Report version: 2.0
-->

[Learn more about API reports](https://hello.atlassian.net/wiki/spaces/UR/pages/1825484529/Package+API+Reports)

```ts
/// <reference types="react" />

import { CSSProperties } from 'react';
import { ForwardRefExoticComponent } from 'react';
import { MemoExoticComponent } from 'react';
import { RefAttributes } from 'react';
import { ThemeModes } from '@atlaskit/theme/types';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';

// @public (undocumented)
type ArrowKeys = 'left' | 'up' | 'right' | 'down';

// @public
const Calendar: MemoExoticComponent<ForwardRefExoticComponent<
  Pick<
    CalendarProps,
    | 'style'
    | 'disabled'
    | 'year'
    | 'previousMonthLabel'
    | 'nextMonthLabel'
    | 'mode'
    | 'testId'
    | 'className'
    | 'tabIndex'
    | 'onFocus'
    | 'onBlur'
    | 'onChange'
    | 'onSelect'
    | 'selected'
    | 'analyticsContext'
    | 'day'
    | 'month'
    | 'defaultDay'
    | 'defaultMonth'
    | 'defaultYear'
    | 'today'
    | 'defaultSelected'
    | 'previouslySelected'
    | 'defaultPreviouslySelected'
    | 'weekStartDay'
    | 'disabledDateFilter'
    | 'minDate'
    | 'maxDate'
    | 'locale'
    | 'calendarRef'
    | 'createAnalyticsEvent'
  > &
    RefAttributes<HTMLDivElement>
>>;
export default Calendar;

// @public (undocumented)
export interface CalendarProps extends WithAnalyticsEventsProps {
  analyticsContext?: Record<string, any>;
  // @internal
  calendarRef?: React.Ref<CalendarRef>;
  className?: string;
  day?: number;
  defaultDay?: number;
  defaultMonth?: number;
  defaultPreviouslySelected?: Array<string>;
  defaultSelected?: Array<string>;
  defaultYear?: number;
  disabled?: Array<string>;
  disabledDateFilter?: (date: string) => boolean;
  locale?: string;
  maxDate?: string;
  minDate?: string;
  // @internal
  mode?: ThemeModes;
  month?: number;
  nextMonthLabel?: string;
  onBlur?: React.FocusEventHandler;
  onChange?: (event: ChangeEvent, analyticsEvent: UIAnalyticsEvent) => void;
  onFocus?: React.FocusEventHandler;
  onSelect?: (event: SelectEvent, analyticsEvent: UIAnalyticsEvent) => void;
  previouslySelected?: Array<string>;
  previousMonthLabel?: string;
  selected?: Array<string>;
  style?: CSSProperties;
  tabIndex?: number;
  testId?: string;
  today?: string;
  weekStartDay?: WeekDay;
  year?: number;
}

// @public (undocumented)
export interface CalendarRef {
  // (undocumented)
  navigate: (type: ArrowKeys) => void;
}

// @public (undocumented)
export type ChangeEvent = {
  iso: ISODate;
  type: 'left' | 'up' | 'right' | 'down' | 'prev' | 'next';
} & DateObj;

// @public (undocumented)
type DateObj = {
  day: number;
  month: number;
  year: number;
};

// @public (undocumented)
type ISODate = string;

// @public (undocumented)
export type SelectEvent = {
  iso: ISODate;
} & DateObj;

// @public (undocumented)
type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// (No @packageDocumentation comment for this package)
```