import React from 'react';
import { mount } from 'enzyme';
import { ZoomControlsBase, ZoomControlsProps } from '../../../zoomControls';
import { ZoomLevelIndicator } from '../../../styleWrappers';
import { ZoomLevel } from '../../../domain/zoomLevel';
import { fakeIntl } from '@atlaskit/media-test-helpers';

describe('Zooming', () => {
  describe('<ZoomControls />', () => {
    const setupBase = (props?: Partial<ZoomControlsProps>) => {
      const onChange = jest.fn();
      const createAnalyticsEventSpy = jest.fn();
      createAnalyticsEventSpy.mockReturnValue({ fire: jest.fn() });

      const component = mount(
        <ZoomControlsBase
          createAnalyticsEvent={createAnalyticsEventSpy}
          zoomLevel={new ZoomLevel(1)}
          onChange={onChange}
          intl={fakeIntl}
          {...props}
        />,
      );

      return {
        onChange,
        component,
        createAnalyticsEventSpy,
      };
    };

    it('should increase and decrease zoom', () => {
      const { component, onChange } = setupBase();
      const zoomLevel = new ZoomLevel(1);

      component.find('button').first().simulate('click');
      expect(onChange).lastCalledWith(zoomLevel.zoomOut());
      component.find('button').last().simulate('click');
      expect(onChange).lastCalledWith(zoomLevel.zoomIn());
    });

    it('should not allow zooming above upper limit', () => {
      const { component, onChange } = setupBase({
        zoomLevel: new ZoomLevel(1).fullyZoomIn(),
      });
      component.find('button').last().simulate('click');
      expect(onChange).not.toBeCalled();
    });

    it('should not allow zooming below lower limit', () => {
      const { component, onChange } = setupBase({
        zoomLevel: new ZoomLevel(1).fullyZoomOut(),
      });
      component.find('button').first().simulate('click');
      expect(onChange).not.toBeCalled();
    });

    describe('zoom level indicator', () => {
      it('shows 100% zoom level', () => {
        const { component } = setupBase();
        expect(component.find(ZoomLevelIndicator).text()).toEqual('100 %');
      });
    });

    describe('analytics', () => {
      it('triggers analytics events on zoom Out', () => {
        const { component, createAnalyticsEventSpy } = setupBase();
        component.find('button').first().simulate('click');

        expect(createAnalyticsEventSpy).toHaveBeenCalledWith({
          eventType: 'ui',
          action: 'clicked',
          actionSubject: 'button',
          actionSubjectId: 'zoomOut',
          attributes: {
            zoomScale: 0.48,
          },
        });
      });

      it('triggers analytics events on zoom in', () => {
        const { component, createAnalyticsEventSpy } = setupBase();
        component.find('button').last().simulate('click');

        expect(createAnalyticsEventSpy).toHaveBeenCalledWith({
          eventType: 'ui',
          action: 'clicked',
          actionSubject: 'button',
          actionSubjectId: 'zoomIn',
          attributes: {
            zoomScale: 1.5,
          },
        });
      });
    });
  });
});
