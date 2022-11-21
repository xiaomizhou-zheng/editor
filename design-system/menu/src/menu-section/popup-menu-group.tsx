/** @jsx jsx */
import { jsx } from '@emotion/react';

import type { MenuGroupProps } from '../types';

import MenuGroup from './menu-group';

/**
 * @deprecated
 */
const PopupMenuGroup = ({
  maxWidth = 800,
  minWidth = 320,
  ...rest
}: MenuGroupProps) => (
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
  <MenuGroup maxWidth={maxWidth} minWidth={minWidth} {...rest} />
);

export default PopupMenuGroup;
