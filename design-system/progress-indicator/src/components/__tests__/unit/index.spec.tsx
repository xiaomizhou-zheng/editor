/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React, { FC } from 'react';

import { mount, shallow } from 'enzyme';

import __noop from '@atlaskit/ds-lib/noop';

import { ButtonIndicator, PresentationalIndicator } from '../../indicator';
import ProgressDots from '../../progress-dots';

// NOTE: "StubComponent" saves duplicating required props; avoids errors in the logs
const StubComponent: FC<{ onSelect?: () => any }> = ({ onSelect }) => (
  <ProgressDots
    selectedIndex={0}
    values={['one', 'two', 'three']}
    onSelect={onSelect}
  />
);

describe('Progress Indicator', () => {
  it('should be possible to create a component', () => {
    const wrapper = shallow(<StubComponent />);
    expect(wrapper).not.toBe(undefined);
  });

  describe('values property', () => {
    it('should render the correct number of indicators', () => {
      const wrapper = mount(
        <ProgressDots
          selectedIndex={0}
          values={['one', 'two', 'three', 'four', 'five']}
        />,
      );
      expect(wrapper.find(PresentationalIndicator)).toHaveLength(5);
    });
    it('should accept an array of any value types', () => {
      const numericValues = mount(
        <ProgressDots selectedIndex={0} values={[1, 2, 3]} />,
      );
      const objectValues = mount(
        <ProgressDots
          selectedIndex={0}
          values={[{ key: 'value' }, { key: 'value' }, { key: 'value' }]}
        />,
      );
      expect(numericValues.find(PresentationalIndicator)).toHaveLength(3);
      expect(objectValues.find(PresentationalIndicator)).toHaveLength(3);
    });
  });

  describe('onSelect property', () => {
    it('should return an <PresentationalIndicator /> when NOT specified', () => {
      const wrapper = mount(<StubComponent />);
      expect(wrapper.find(PresentationalIndicator).exists()).toBe(true);
    });
    it('should return an <ButtonIndicator /> when specified', () => {
      const wrapper = mount(<StubComponent onSelect={__noop} />);
      expect(wrapper.find(ButtonIndicator).exists()).toBe(true);
    });
  });

  describe('selectedIndex property', () => {
    it('should return a "selected" <Indicator* /> at the correct index', () => {
      const wrapper = mount(<StubComponent />);
      expect(
        wrapper.find(PresentationalIndicator).at(1).prop('style'),
      ).toEqual({ backgroundColor: 'var(--ds-background-neutral, #C1C7D0)' });
      expect(
        wrapper.find(PresentationalIndicator).at(0).prop('style'),
      ).toEqual({ backgroundColor: 'var(--ds-icon, #091E42)' });
    });
  });
});

describe('ProgressDotsWithAnalytics', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    (global.console.warn as jest.Mock).mockRestore();
    (global.console.error as jest.Mock).mockRestore();
  });
});
