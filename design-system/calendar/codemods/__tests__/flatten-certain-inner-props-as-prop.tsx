jest.autoMockOff();

import { flattenCertainInnerPropsAsProp } from '../migrations/flatten-certain-inner-props-as-prop';
import { createTransformer } from '../utils';

const transformer = createTransformer('@atlaskit/calendar', [
  flattenCertainInnerPropsAsProp,
]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Flatten Inner Prop Style As Prop', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Calendar from '@atlaskit/calendar';
    const SimpleCalendar = () => {
      return (
        <Calendar
          innerProps={{
            style: {
              border: '1px solid red',
              display: 'inline-block',
            },
            className: 'abc',
          }}
        />
      )
    };
  `,
    `
    import React from 'react';
    import Calendar from '@atlaskit/calendar';
    const SimpleCalendar = () => {
      return (
        <Calendar
          innerProps={{
            style: {
              border: '1px solid red',
              display: 'inline-block',
            },
            className: 'abc',
          }}
          style={{
            border: '1px solid red',
            display: 'inline-block',
          }}
          className={'abc'} />
      );
    };
  `,
    'should flatten style & className properties in inner props as a new standalone props',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Calendar from '@atlaskit/calendar';
    const SimpleCalendar = () => {
      return (
        <Calendar
          innerProps={{
            className: 'abc',
          }}
        />
      )
    };
  `,
    `
    import React from 'react';
    import Calendar from '@atlaskit/calendar';
    const SimpleCalendar = () => {
      return (
        <Calendar
          innerProps={{
            className: 'abc',
          }}
          className={'abc'} />
      );
    };
  `,
    'should just flatten className property in inner props as a new standalone prop',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Calendar from '@atlaskit/calendar';
    const SimpleCalendar = () => {
      return (
        <Calendar
          innerProps={{
            style: {
              border: '1px solid red',
              display: 'inline-block',
            },
          }}
        />
      )
    };
  `,
    `
    import React from 'react';
    import Calendar from '@atlaskit/calendar';
    const SimpleCalendar = () => {
      return (
        <Calendar
          innerProps={{
            style: {
              border: '1px solid red',
              display: 'inline-block',
            },
          }}
          style={{
            border: '1px solid red',
            display: 'inline-block',
          }} />
      );
    };
  `,
    'should just flatten style property in inner props as a new standalone prop',
  );
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Calendar from '@atlaskit/calendar';
    const SimpleCalendar = () => {
      return (
        <Calendar
          innerProps={{
            theme: 'dark'
          }}
        />
      )
    };
  `,
    `
    import React from 'react';
    import Calendar from '@atlaskit/calendar';
    const SimpleCalendar = () => {
      return (
        <Calendar
          innerProps={{
            theme: 'dark'
          }}
        />
      )
    };
  `,
    'should not flatten any other prop in inner props if className & style prop is not present',
  );
});
