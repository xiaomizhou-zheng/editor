/** @jsx jsx */
import { forwardRef, memo, useMemo } from 'react';

import { css, jsx } from '@emotion/react';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import noop from '@atlaskit/ds-lib/noop';
import { DN600, N0, N700, N900 } from '@atlaskit/theme/colors';
import GlobalTheme from '@atlaskit/theme/components';
import { token } from '@atlaskit/tokens';
import VisuallyHidden from '@atlaskit/visually-hidden';

import HeadingComponent from './internal/components/heading';
import WeekDaysComponent from './internal/components/week-days';
import WeekHeaderComponent from './internal/components/week-header';
import { blankStringArray } from './internal/constants';
import useCalendarRef from './internal/hooks/use-calendar-ref';
import useControlledDateState from './internal/hooks/use-controlled-date-state';
import useFocusing from './internal/hooks/use-focusing';
import useGetWeeks from './internal/hooks/use-get-weeks';
import useHandleDateChange from './internal/hooks/use-handle-date-change';
import useHandleDateSelect from './internal/hooks/use-handle-date-select';
import useLocale from './internal/hooks/use-locale';
import useUniqueId from './internal/hooks/use-unique-id';
import type { CalendarProps } from './types';

const lightWrapperStyles = css({
  display: 'inline-block',
  boxSizing: 'border-box',
  // TODO Delete this comment after verifying spacing token -> previous value `16`
  padding: token('spacing.scale.200', '16px'),
  backgroundColor: token('utility.UNSAFE_util.transparent', N0),
  color: token('color.text', N900),
  outline: 'none',
  userSelect: 'none',
});

const darkWrapperStyles = css({
  display: 'inline-block',
  boxSizing: 'border-box',
  // TODO Delete this comment after verifying spacing token -> previous value `16`
  padding: token('spacing.scale.200', '16px'),
  backgroundColor: token('utility.UNSAFE_util.transparent', N700),
  color: token('color.text', DN600),
  outline: 'none',
  userSelect: 'none',
});

const gridsContainerStyles = css({
  display: 'inline-block',
  width: 289,
  // TODO Delete this comment after verifying spacing token -> previous value `0`
  margin: token('spacing.scale.0', '0px'),
  marginBottom: 5,
  textAlign: 'center',
});

const analyticsAttributes = {
  componentName: 'calendar',
  packageName: process.env._PACKAGE_NAME_ as string,
  packageVersion: process.env._PACKAGE_VERSION_ as string,
};

const CalendarWithMode = forwardRef<HTMLDivElement, CalendarProps>(
  function Calendar(
    {
      day,
      defaultDay = 0,
      defaultMonth = 0,
      defaultPreviouslySelected = blankStringArray,
      defaultSelected = blankStringArray,
      defaultYear = 0,
      disabled,
      disabledDateFilter,
      minDate,
      maxDate,
      month,
      nextMonthLabel,
      onBlur = noop,
      onChange = noop,
      onFocus = noop,
      onSelect = noop,
      previouslySelected,
      previousMonthLabel,
      selected,
      today,
      locale = 'en-US',
      year,
      analyticsContext,
      weekStartDay = 0,
      testId,
      calendarRef,
      mode,
      className,
      style,
      tabIndex = 0,
    },
    ref,
  ) {
    const {
      day: [dayValue, setDayValue],
      month: [monthValue, setMonthValue],
      year: [yearValue, setYearValue],
      today: [todayValue],
      selected: [selectedValue, setSelectedValue],
      previous: [previouslySelectedValue, setPreviouslySelectedValue],
    } = useControlledDateState({
      day,
      defaultDay,
      month,
      defaultMonth,
      year,
      defaultYear,
      today,
      selected,
      defaultSelected,
      previouslySelected,
      defaultPreviouslySelected,
    });

    const onChangeWithAnalytics = usePlatformLeafEventHandler({
      fn: onChange,
      action: 'changed',
      analyticsData: analyticsContext,
      ...analyticsAttributes,
    });

    const { navigate, handleClickNext, handleClickPrev } = useHandleDateChange({
      day: [dayValue, setDayValue],
      month: [monthValue, setMonthValue],
      year: [yearValue, setYearValue],
      onChange: onChangeWithAnalytics,
    });

    const onSelectWithAnalytics = usePlatformLeafEventHandler({
      fn: onSelect,
      action: 'selected',
      analyticsData: analyticsContext,
      ...analyticsAttributes,
    });

    const { handleClickDay, handleContainerKeyDown } = useHandleDateSelect({
      day: [dayValue, setDayValue],
      month: [monthValue, setMonthValue],
      year: [yearValue, setYearValue],
      selected: [selectedValue, setSelectedValue],
      previous: [, setPreviouslySelectedValue],
      onSelect: onSelectWithAnalytics,
      navigate,
    });

    const { handleContainerBlur, handleContainerFocus } = useFocusing({
      onFocus,
      onBlur,
    });

    useCalendarRef(calendarRef, {
      navigate,
    });

    const weeks = useGetWeeks({
      day: dayValue,
      month: monthValue,
      year: yearValue,
      today: todayValue,
      selected: selectedValue,
      previouslySelected: previouslySelectedValue,
      disabled,
      disabledDateFilter,
      minDate,
      maxDate,
      weekStartDay,
    });

    const announceId = useUniqueId('announce');
    const announcerDate = useMemo(
      () => new Date(yearValue, monthValue - 1, dayValue).toString(),
      [dayValue, monthValue, yearValue],
    );
    const { monthsLong, daysShort } = useLocale({ locale, weekStartDay });

    return (
      <div
        className={className}
        style={style}
        onBlur={handleContainerBlur}
        onFocus={handleContainerFocus}
        onKeyDown={handleContainerKeyDown}
        role="presentation"
        data-testid={testId && `${testId}--container`}
        ref={ref}
      >
        <VisuallyHidden>
          <span id={announceId} aria-live="assertive" aria-relevant="text">
            {announcerDate}
          </span>
        </VisuallyHidden>
        <div
          css={
            !mode || mode === 'light' ? lightWrapperStyles : darkWrapperStyles
          }
          aria-describedby={announceId}
          aria-label="calendar"
          role="grid"
          tabIndex={tabIndex}
        >
          <HeadingComponent
            // The month number needs to be translated to index in the month
            // name array e.g. 1 (January) -> 0
            monthLongTitle={monthsLong[monthValue - 1]}
            year={yearValue}
            nextMonthLabel={nextMonthLabel}
            previousMonthLabel={previousMonthLabel}
            handleClickNext={handleClickNext}
            handleClickPrev={handleClickPrev}
            mode={mode}
            testId={testId}
          />
          <div css={gridsContainerStyles} role="presentation">
            <WeekHeaderComponent daysShort={daysShort} mode={mode} />
            <WeekDaysComponent
              weeks={weeks}
              handleClickDay={handleClickDay}
              mode={mode}
              testId={testId}
            />
          </div>
        </div>
      </div>
    );
  },
);

/**
 * __Calendar__
 *
 * A calendar is used for date selection.
 *
 * - [Examples](https://atlassian.design/components/calendar/examples)
 * - [Code](https://atlassian.design/components/calendar/code)
 * - [Usage](https://atlassian.design/components/calendar/usage)
 */
const Calendar = memo(
  forwardRef<HTMLDivElement, CalendarProps>(function Calendar(props, ref) {
    return (
      <GlobalTheme.Consumer>
        {({ mode }) => <CalendarWithMode {...props} mode={mode} ref={ref} />}
      </GlobalTheme.Consumer>
    );
  }),
);

Calendar.displayName = 'Calendar';

export default Calendar;
