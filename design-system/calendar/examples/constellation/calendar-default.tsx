import React from 'react';

import Calendar from '../../src';

const defaultPreviouslySelected = ['2020-12-06'];
const defaultSelected = ['2020-12-08'];

export default () => (
  <Calendar
    maxDate={'2020-12-25'}
    defaultPreviouslySelected={defaultPreviouslySelected}
    defaultSelected={defaultSelected}
    defaultMonth={12}
    defaultYear={2020}
    testId={'calendar'}
  />
);
