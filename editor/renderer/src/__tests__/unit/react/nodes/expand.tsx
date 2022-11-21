import { shallow } from 'enzyme';
import React from 'react';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { HardBreak } from '../../../../react/nodes';
import Expand from '../../../../ui/Expand';

describe('Expand', () => {
  describe('analytics', () => {
    it('should call when expanding', () => {
      const fireAnalyticsEvent = jest.fn();
      const expand = mountWithIntl(
        <Expand
          title={'Cool cheese'}
          nodeType={'expand'}
          children={shallow(<HardBreak />)}
          fireAnalyticsEvent={fireAnalyticsEvent}
        />,
      );

      expand.find('button').simulate('click');

      expect(fireAnalyticsEvent).toHaveBeenCalledWith({
        action: 'toggleExpand',
        actionSubject: 'expand',
        attributes: {
          platform: 'web',
          mode: 'renderer',
          expanded: true,
        },
        eventType: 'track',
      });
    });
  });
});
