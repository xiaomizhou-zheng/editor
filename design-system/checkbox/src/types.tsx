import React from 'react';

import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

export type Size = 'small' | 'medium' | 'large' | 'xlarge';

/**
 *
 *
 * CHECKBOX PROPTYPES
 *
 *
 */

export type OwnProps = {
  /**
   * Sets whether the checkbox begins checked.
   */
  defaultChecked?: boolean;
  /**
   * id assigned to input
   */
  id?: string;
  /**
   * Sets whether the checkbox is checked or unchecked.
   */
  isChecked?: boolean;
  /**
   * Sets whether the checkbox is disabled.
   */
  isDisabled?: boolean;
  /**
   * Sets whether the checkbox is indeterminate. This only affects the
   * style and does not modify the isChecked property.
   */
  isIndeterminate?: boolean;
  /**
   * Marks the field as invalid. Changes style of unchecked component.
   */
  isInvalid?: boolean;
  /**
   * Marks the field as required & changes the label style.
   */
  isRequired?: boolean;
  /**
   * The label to be displayed to the right of the checkbox. The label is part
   * of the clickable element to select the checkbox.
   */
  label?: React.ReactChild;
  /**
   * The name of the submitted field in a checkbox.
   */
  name?: string;
  /**
   * Function that is called whenever the state of the checkbox changes. It will
   * be called with an object containing the react synthetic event. Use currentTarget to get value, name and checked
   */
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
  /**
   * The value to be used in the checkbox input. This is the value that will be returned on form submission.
   */
  value?: number | string;
  /**
   * The size of the Checkbox
   */
  size?: Size;
  /**
   * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
   * we have generated testid based on the one you pass to the Checkbox component:
   * - `{testId}--hidden-checkbox` to check if it got changed to checked/unchecked.
   */
  testId?: string;
  /**
   * Additional information to be included in the `context` of analytics events that come from radio
   */
  analyticsContext?: Record<string, any>;
};

// Expose all props on a html input element
type Combine<First, Second> = Omit<First, keyof Second> & Second;
export type CheckboxProps = Combine<
  Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    /**
     * 'disabled', 'required', and 'checked' are omitted so that
     * consumers must handle state using our props.
     *
     * 'css' is added globally to element attributes by emotion.
     * This was causing a bug, making the css prop required in
     * some cases. We explicitly omit it to avoid that.
     *
     * Because 'className' (which the css prop uses internally)
     * is still available, this should not break existing usage.
     */
    'disabled' | 'required' | 'checked' | 'css'
  >,
  OwnProps
>;

export interface LabelTextProps extends React.HTMLProps<HTMLSpanElement> {
  children: React.ReactNode;
}

export interface LabelProps extends React.HTMLProps<HTMLInputElement> {
  isDisabled?: boolean;
  /**
   * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
   */
  testId?: string;
  /**
   * Click handler that is conditionally applied for Firefox
   * as Firefox does not dispatch modified click events (e.g. Ctrl+Click) down to the underlying input element
   */
  onClick?: React.MouseEventHandler;
}
