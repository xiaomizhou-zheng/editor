import React from 'react';

import DynamicTable from '../src';

import { head, rows } from './content/sample-data';

export default function TableUncontrolled() {
  return (
    <DynamicTable
      head={head}
      rows={rows}
      rowsPerPage={5}
      defaultPage={1}
      loadingSpinnerSize="large"
      isRankable
    />
  );
}
