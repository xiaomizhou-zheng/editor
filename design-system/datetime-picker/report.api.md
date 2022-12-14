## API Report File for "@atlaskit/datetime-picker"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

<!--
	Generated API Report version: 2.0
-->

[Learn more about API reports](https://hello.atlassian.net/wiki/spaces/UR/pages/1825484529/Package+API+Reports)

```ts
import { ComponentType } from 'react';
import { FocusEvent as FocusEvent_2 } from 'react';
import { ForwardRefExoticComponent } from 'react';
import { IndicatorComponentType } from '@atlaskit/select';
import { IndicatorProps } from '@atlaskit/select';
import { OptionType } from '@atlaskit/select';
import { default as React_2 } from 'react';
import { RefAttributes } from 'react';
import { SelectProps as SelectProps_2 } from '@atlaskit/select';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { WithContextProps } from '@atlaskit/analytics-next';

// @public (undocumented)
export type Appearance = 'default' | 'subtle' | 'none';

// @public (undocumented)
export const DatePicker: ForwardRefExoticComponent<
  Pick<
    Pick<
      Omit<DatePickerProps_2, keyof WithAnalyticsEventsProps>,
      | 'testId'
      | 'maxDate'
      | 'minDate'
      | 'isOpen'
      | 'nextMonthLabel'
      | 'parseInputValue'
      | 'formatDisplayLabel'
      | 'previousMonthLabel'
      | 'value'
      | 'dateFormat'
      | 'placeholder'
      | 'weekStartDay'
    > &
      Partial<
        Pick<
          Omit<DatePickerProps_2, keyof WithAnalyticsEventsProps>,
          | 'icon'
          | 'disabled'
          | 'appearance'
          | 'selectProps'
          | 'innerProps'
          | 'autoFocus'
          | 'defaultIsOpen'
          | 'defaultValue'
          | 'disabledDateFilter'
          | 'hideIcon'
          | 'id'
          | 'isDisabled'
          | 'isInvalid'
          | 'name'
          | 'onBlur'
          | 'onChange'
          | 'onFocus'
          | 'spacing'
          | 'locale'
        >
      > &
      Partial<
        Pick<
          {
            appearance: Appearance;
            autoFocus: boolean;
            defaultIsOpen: boolean;
            defaultValue: string;
            disabled: string[];
            disabledDateFilter: (_: string) => boolean;
            hideIcon: boolean;
            icon: ComponentType<IndicatorProps<OptionType, false>>;
            id: string;
            innerProps: {};
            isDisabled: boolean;
            isInvalid: boolean;
            name: string;
            onBlur: (event: FocusEvent_2<HTMLInputElement>) => void;
            onChange: (value: string) => void;
            onFocus: (event: FocusEvent_2<HTMLInputElement>) => void;
            selectProps: {};
            spacing: Spacing;
            locale: string;
          },
          never
        >
      > &
      RefAttributes<any> &
      WithContextProps,
    | 'testId'
    | 'icon'
    | 'disabled'
    | 'appearance'
    | 'selectProps'
    | 'innerProps'
    | 'autoFocus'
    | 'defaultIsOpen'
    | 'defaultValue'
    | 'disabledDateFilter'
    | 'hideIcon'
    | 'id'
    | 'isDisabled'
    | 'isInvalid'
    | 'name'
    | 'onBlur'
    | 'onChange'
    | 'onFocus'
    | 'spacing'
    | 'locale'
    | 'maxDate'
    | 'minDate'
    | 'isOpen'
    | 'nextMonthLabel'
    | 'parseInputValue'
    | 'formatDisplayLabel'
    | 'previousMonthLabel'
    | 'value'
    | 'dateFormat'
    | 'placeholder'
    | 'weekStartDay'
    | 'key'
    | 'analyticsContext'
  > &
    RefAttributes<any>
>;

// @public (undocumented)
const datePickerDefaultProps: {
  appearance: Appearance;
  autoFocus: boolean;
  defaultIsOpen: boolean;
  defaultValue: string;
  disabled: string[];
  disabledDateFilter: (_: string) => boolean;
  hideIcon: boolean;
  icon: ComponentType<IndicatorProps<OptionType, false>>;
  id: string;
  innerProps: {};
  isDisabled: boolean;
  isInvalid: boolean;
  name: string;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  onChange: (value: string) => void;
  onFocus: (event: React.FocusEvent<HTMLInputElement>) => void;
  selectProps: {};
  spacing: Spacing;
  locale: string;
};

// @public (undocumented)
export interface DatePickerProps extends WithAnalyticsEventsProps {
  appearance?: Appearance;
  autoFocus?: boolean;
  dateFormat?: string;
  defaultIsOpen?: boolean;
  defaultValue?: string;
  disabled?: string[];
  disabledDateFilter?: (date: string) => boolean;
  formatDisplayLabel?: (value: string, dateFormat: string) => string;
  hideIcon?: boolean;
  icon?: IndicatorComponentType<OptionType>;
  id?: string;
  innerProps?: React.AllHTMLAttributes<HTMLElement>;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isOpen?: boolean;
  locale?: string;
  maxDate?: string;
  minDate?: string;
  name?: string;
  nextMonthLabel?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onChange?: (value: string) => void;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  parseInputValue?: (date: string, dateFormat: string) => Date;
  placeholder?: string;
  previousMonthLabel?: string;
  selectProps?: SelectProps;
  spacing?: Spacing;
  testId?: string;
  value?: string;
  weekStartDay?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

// @public (undocumented)
type DatePickerProps_2 = typeof datePickerDefaultProps & DatePickerProps;

// @public (undocumented)
export const DateTimePicker: React_2.ForwardRefExoticComponent<
  Pick<
    Pick<
      Omit<DateTimePickerProps_2, keyof WithAnalyticsEventsProps>,
      'testId' | 'value' | 'dateFormat' | 'timeFormat' | 'parseValue'
    > &
      Partial<
        Pick<
          Omit<DateTimePickerProps_2, keyof WithAnalyticsEventsProps>,
          | 'appearance'
          | 'innerProps'
          | 'autoFocus'
          | 'defaultValue'
          | 'id'
          | 'isDisabled'
          | 'isInvalid'
          | 'name'
          | 'onBlur'
          | 'onChange'
          | 'onFocus'
          | 'spacing'
          | 'locale'
          | 'times'
          | 'timeIsEditable'
          | 'datePickerProps'
          | 'timePickerProps'
          | 'datePickerSelectProps'
          | 'timePickerSelectProps'
        >
      > &
      Partial<
        Pick<
          {
            appearance: string;
            autoFocus: boolean;
            isDisabled: boolean;
            name: string;
            onBlur: (event: React_2.FocusEvent<HTMLInputElement>) => void;
            onChange: (value: string) => void;
            onFocus: (event: React_2.FocusEvent<HTMLInputElement>) => void;
            innerProps: {};
            id: string;
            defaultValue: string;
            timeIsEditable: boolean;
            isInvalid: boolean;
            datePickerProps: {};
            timePickerProps: {};
            datePickerSelectProps: {};
            timePickerSelectProps: {};
            times: string[];
            spacing: string;
            locale: string;
          },
          never
        >
      > &
      React_2.RefAttributes<any> &
      WithContextProps,
    | 'testId'
    | 'appearance'
    | 'innerProps'
    | 'autoFocus'
    | 'defaultValue'
    | 'id'
    | 'isDisabled'
    | 'isInvalid'
    | 'name'
    | 'onBlur'
    | 'onChange'
    | 'onFocus'
    | 'spacing'
    | 'locale'
    | 'value'
    | 'dateFormat'
    | 'key'
    | 'analyticsContext'
    | 'times'
    | 'timeIsEditable'
    | 'timeFormat'
    | 'datePickerProps'
    | 'timePickerProps'
    | 'datePickerSelectProps'
    | 'timePickerSelectProps'
    | 'parseValue'
  > &
    React_2.RefAttributes<any>
>;

// @public (undocumented)
const dateTimePickerDefaultProps: {
  appearance: string;
  autoFocus: boolean;
  isDisabled: boolean;
  name: string;
  onBlur: (event: React_2.FocusEvent<HTMLInputElement>) => void;
  onChange: (value: string) => void;
  onFocus: (event: React_2.FocusEvent<HTMLInputElement>) => void;
  innerProps: {};
  id: string;
  defaultValue: string;
  timeIsEditable: boolean;
  isInvalid: boolean;
  datePickerProps: {};
  timePickerProps: {};
  datePickerSelectProps: {};
  timePickerSelectProps: {};
  times: string[];
  spacing: string;
  locale: string;
};

// @public (undocumented)
export interface DateTimePickerProps extends WithAnalyticsEventsProps {
  appearance?: Appearance;
  autoFocus?: boolean;
  dateFormat?: string;
  datePickerProps?: DatePickerProps;
  datePickerSelectProps?: SelectProps_2<any>;
  defaultValue?: string;
  id?: string;
  innerProps?: React_2.AllHTMLAttributes<HTMLElement>;
  isDisabled?: boolean;
  isInvalid?: boolean;
  locale?: string;
  name?: string;
  onBlur?: React_2.FocusEventHandler<HTMLInputElement>;
  onChange?: (value: string) => void;
  onFocus?: React_2.FocusEventHandler<HTMLInputElement>;
  parseValue?: (
    dateTimeValue: string,
    date: string,
    time: string,
    timezone: string,
  ) => {
    dateValue: string;
    timeValue: string;
    zoneValue: string;
  };
  spacing?: Spacing;
  testId?: string;
  timeFormat?: string;
  timeIsEditable?: boolean;
  timePickerProps?: TimePickerProps;
  timePickerSelectProps?: SelectProps_2<any>;
  times?: Array<string>;
  value?: string;
}

// @public (undocumented)
type DateTimePickerProps_2 = typeof dateTimePickerDefaultProps &
  DateTimePickerProps;

// @public (undocumented)
type SelectProps = any;

// @public (undocumented)
export type Spacing = 'compact' | 'default';

// @public (undocumented)
export const TimePicker: React_2.ForwardRefExoticComponent<
  Pick<
    Pick<
      Omit<TimePickerProps_2, keyof WithAnalyticsEventsProps>,
      | 'testId'
      | 'isOpen'
      | 'formatDisplayLabel'
      | 'value'
      | 'placeholder'
      | 'timeFormat'
    > &
      Partial<
        Pick<
          Omit<TimePickerProps_2, keyof WithAnalyticsEventsProps>,
          | 'appearance'
          | 'selectProps'
          | 'innerProps'
          | 'autoFocus'
          | 'defaultIsOpen'
          | 'defaultValue'
          | 'hideIcon'
          | 'id'
          | 'isDisabled'
          | 'isInvalid'
          | 'name'
          | 'onBlur'
          | 'onChange'
          | 'onFocus'
          | 'spacing'
          | 'locale'
          | 'parseInputValue'
          | 'times'
          | 'timeIsEditable'
        >
      > &
      Partial<
        Pick<
          {
            appearance: Appearance;
            autoFocus: boolean;
            defaultIsOpen: boolean;
            defaultValue: string;
            hideIcon: boolean;
            id: string;
            innerProps: {};
            isDisabled: boolean;
            isInvalid: boolean;
            name: string;
            onBlur: (event: React_2.FocusEvent<HTMLInputElement>) => void;
            onChange: (value: string) => void;
            onFocus: (event: React_2.FocusEvent<HTMLInputElement>) => void;
            parseInputValue: (
              time: string,
              timeFormat: string,
            ) => string | Date;
            selectProps: {};
            spacing: Spacing;
            times: string[];
            timeIsEditable: boolean;
            locale: string;
          },
          never
        >
      > &
      React_2.RefAttributes<any> &
      WithContextProps,
    | 'testId'
    | 'appearance'
    | 'selectProps'
    | 'innerProps'
    | 'autoFocus'
    | 'defaultIsOpen'
    | 'defaultValue'
    | 'hideIcon'
    | 'id'
    | 'isDisabled'
    | 'isInvalid'
    | 'name'
    | 'onBlur'
    | 'onChange'
    | 'onFocus'
    | 'spacing'
    | 'locale'
    | 'isOpen'
    | 'parseInputValue'
    | 'formatDisplayLabel'
    | 'value'
    | 'placeholder'
    | 'key'
    | 'analyticsContext'
    | 'times'
    | 'timeIsEditable'
    | 'timeFormat'
  > &
    React_2.RefAttributes<any>
>;

// @public (undocumented)
const timePickerDefaultProps: {
  appearance: Appearance;
  autoFocus: boolean;
  defaultIsOpen: boolean;
  defaultValue: string;
  hideIcon: boolean;
  id: string;
  innerProps: {};
  isDisabled: boolean;
  isInvalid: boolean;
  name: string;
  onBlur: (event: React_2.FocusEvent<HTMLInputElement>) => void;
  onChange: (value: string) => void;
  onFocus: (event: React_2.FocusEvent<HTMLInputElement>) => void;
  parseInputValue: (time: string, timeFormat: string) => string | Date;
  selectProps: {};
  spacing: Spacing;
  times: string[];
  timeIsEditable: boolean;
  locale: string;
};

// @public (undocumented)
export interface TimePickerProps extends WithAnalyticsEventsProps {
  appearance?: Appearance;
  autoFocus?: boolean;
  defaultIsOpen?: boolean;
  defaultValue?: string;
  formatDisplayLabel?: (time: string, timeFormat: string) => string;
  hideIcon?: boolean;
  id?: string;
  innerProps?: React_2.AllHTMLAttributes<HTMLElement>;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isOpen?: boolean;
  locale?: string;
  name?: string;
  onBlur?: React_2.FocusEventHandler<HTMLElement>;
  onChange?: (value: string) => void;
  onFocus?: React_2.FocusEventHandler<HTMLElement>;
  // (undocumented)
  parseInputValue?: (time: string, timeFormat: string) => string | Date;
  placeholder?: string;
  selectProps?: SelectProps_2<any>;
  spacing?: Spacing;
  testId?: string;
  timeFormat?: string;
  timeIsEditable?: boolean;
  times?: string[];
  value?: string;
}

// @public (undocumented)
type TimePickerProps_2 = typeof timePickerDefaultProps & TimePickerProps;

// (No @packageDocumentation comment for this package)
```
