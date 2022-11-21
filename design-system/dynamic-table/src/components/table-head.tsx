import React, { KeyboardEvent } from 'react';

import { validateSortKey } from '../internal/helpers';
import { Head } from '../styled/table-head';
import { HeadType, RowCellType, SortOrderType } from '../types';

import RankableHeadCell from './rankable/table-head-cell';
import HeadCell from './table-head-cell';

interface TableHeadProps {
  head: HeadType;
  sortKey?: string;
  sortOrder?: SortOrderType;
  isFixedSize?: boolean;
  onSort: (item: RowCellType) => () => void;
  isRankable?: boolean;
  isRanking: boolean;
  testId?: string;
}

class TableHead extends React.Component<TableHeadProps, {}> {
  UNSAFE_componentWillMount() {
    validateSortKey(this.props.sortKey, this.props.head);
  }

  UNSAFE_componentWillReceiveProps(nextProps: TableHeadProps) {
    if (
      this.props.sortKey !== nextProps.sortKey ||
      this.props.head !== nextProps.head
    ) {
      validateSortKey(nextProps.sortKey, nextProps.head);
    }
  }

  canSortOnEnterPressed = (e: KeyboardEvent, isSortable: Boolean | void) =>
    isSortable && e.key === 'Enter';

  render() {
    const {
      head,
      sortKey,
      sortOrder,
      isFixedSize,
      onSort,
      isRanking,
      isRankable,
      testId,
    } = this.props;

    if (!head) {
      return null;
    }

    const HeadCellComponent = isRankable ? RankableHeadCell : HeadCell;

    const { cells, ...rest } = head;

    return (
      <Head
        {...rest}
        isRanking={isRanking}
        data-testid={testId && `${testId}--head`}
      >
        <tr>
          {cells.map((cell, index) => {
            const { isSortable, key, ...restCellProps } = cell;

            return (
              <HeadCellComponent
                isFixedSize={isFixedSize}
                isSortable={!!isSortable}
                isRanking={isRanking}
                key={key || index}
                onClick={isSortable ? onSort(cell) : undefined}
                onKeyDown={(e: KeyboardEvent) =>
                  this.canSortOnEnterPressed(e, isSortable)
                    ? onSort(cell)()
                    : undefined
                }
                testId={testId}
                sortOrder={key === sortKey ? sortOrder : undefined}
                {...restCellProps}
              />
            );
          })}
        </tr>
      </Head>
    );
  }
}

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default TableHead;
