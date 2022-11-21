import React from 'react';

import withDimensions, { WithDimensionsProps } from '../../hoc/with-dimensions';
import { inlineStylesIfRanking } from '../../internal/helpers';
import HeadCell, { TableHeadCellProps } from '../table-head-cell';

class RankableTableHeadCell extends React.Component<
  WithDimensionsProps & TableHeadCellProps,
  {}
> {
  render() {
    const { isRanking, refHeight, refWidth, ...restProps } = this.props;
    const inlineStyles = inlineStylesIfRanking(isRanking, refWidth);
    return <HeadCell inlineStyles={inlineStyles} {...restProps} />;
  }
}

export default withDimensions<WithDimensionsProps & TableHeadCellProps>(
  RankableTableHeadCell,
);
