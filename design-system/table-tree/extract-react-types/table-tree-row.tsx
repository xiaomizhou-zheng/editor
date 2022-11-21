import { ReactNode } from 'react';

import { Item } from './table-tree';

/**
 * This is hard-coded here because our actual <TableTree /> has no typings
 * for its props.
 *
 * Adding types for real *might* break things so will need a little care.
 *
 * Defining it here for now lets us provide *something* without much headache.
 */
type RowProps = {
  /**
   * Whether the row has children
   */
  hasChildren?: boolean;
  /**
   * Children contained in the row. Should be one or more Cell components.
   */
  children?: React.ReactNode;
  /**
   * ID for the row item
   */
  itemId?: string;
  // eslint-disable-next-line jsdoc/require-asterisk-prefix, jsdoc/check-alignment
  /**
    The data used to render the row and descendants. Pass down from `children` render prop.

    In addition to these props, any other data can be added to the object, and it will
    be provided as props when rendering each cell.
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  items?: Item[] | null;
  /**
   * Controls the expanded state of the row.
   */
  isExpanded?: ReactNode;
  /**
   * Sets the default expanded state of the row.
   */
  isDefaultExpanded?: ReactNode;
  /**
   * `aria-label` attached to the expand chevron button
   */
  expandLabel?: string;
  /**
   * `aria-label` attached to the collapse chevron button
   */
  collapseLabel?: string;
  /**
   * Callback called when row collapses.
   */
  onCollapse?: (data: Item) => void;
  /**
   * Callback called when row expands.
   */
  onExpand?: (data: Item) => void;
  /**
   * Children to render under row.
   * Normally set by parent Item component and does not need to be configured.
   */
  renderChildren?: () => React.ReactNode;
  /**
   * Data to render. Passed down by Item and passed into onExpand and onCollapse callbacks.
   * Normally set by parent Item component and does not need to be configured.
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  data?: Item;
  /**
   * Depth used for rendering indent.
   * Normally set by parent Item component and does not need to be configured.
   */
  depth?: number;
};

const TableRow = function (props: RowProps) {
  return null;
};

TableRow.defaultProps = {
  isDefaultExpanded: false,
};

export default TableRow;
