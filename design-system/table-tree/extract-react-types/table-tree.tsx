import { ElementType, ReactNode } from 'react';

class Content extends Object {}

export type Item = {
  id: string;
  hasChildren: boolean;
  children?: Item[];
};

/**
 * This is hard-coded here because our actual <TableTree /> has no typings
 * for its props.
 *
 * Adding types for real *might* break things so will need a little care.
 *
 * Defining it here for now lets us provide *something* without much headache.
 */
type TableTreeProps = {
  /**
   * The contents of the table,
   * used when composing `Cell`, `Header`, `Headers`, `Row`, and `Rows` components.
   * For basic usage, you can instead specify table contents with the `items` prop.
   */
  children?: ReactNode;
  /**
   * Each column component is used to render the cells in that column.
   * A cell's `content` value, specified in the data passed to `items`, is provided as props.
   */
  columns?: ElementType<Content>[];
  /**
   * The widths of the respective columns in the table.
   */
  columnWidths?: (string | number)[];
  /**
   * The header text of the respective columns of the table.
   */
  headers?: string[];
  // eslint-disable-next-line jsdoc/require-asterisk-prefix, jsdoc/check-alignment
  /**
    The data used to render the table.

    In addition to these props, any other data can be added, and it will
    be provided as props when rendering each cell.
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  items?: Item[] | null;
};

export default function (props: TableTreeProps) {
  return null;
}
