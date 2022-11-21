import React from 'react';

import { Colgroup } from './colgroup';
import { SharedTableProps } from './types';

export type TableProps = SharedTableProps & {
  innerRef?: React.RefObject<HTMLTableElement>;
  children: React.ReactNode[];
};

export const Table = React.memo(
  ({
    innerRef,
    isNumberColumnEnabled,
    columnWidths,
    layout,
    renderWidth,
    children,
  }: TableProps) => {
    return (
      <table data-number-column={isNumberColumnEnabled} ref={innerRef}>
        <Colgroup
          columnWidths={columnWidths}
          layout={layout}
          isNumberColumnEnabled={isNumberColumnEnabled}
          renderWidth={renderWidth}
        />
        <tbody>{children}</tbody>
      </table>
    );
  },
);
