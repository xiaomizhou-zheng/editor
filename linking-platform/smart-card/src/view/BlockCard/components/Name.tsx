/** @jsx jsx */
import { jsx } from '@emotion/react';
import { fontSize } from '@atlaskit/theme/constants';

import { gs } from '../../common/utils';

export interface NameProps {
  name: React.ReactNode;
  isLeftPadded?: boolean;
  testId?: string;
  children?: React.ReactNode;
  textColor?: string;
}

export const blockCardContentHeaderNameClassName =
  'block-card-content-header-name';

export const Name = ({
  name,
  isLeftPadded = true,
  testId,
  textColor,
}: NameProps) => (
  <span
    css={{
      fontSize: `${fontSize()}px`,
      fontWeight: 500,
      marginLeft: isLeftPadded ? gs(1) : '0',
      lineHeight: gs(2.5),
      // Spec: show max two lines.
      display: '-webkit-box',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      wordBreak: 'break-word',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      color: textColor ? textColor : 'inherit',
      // Fallback options.
      maxHeight: gs(6),
    }}
    data-testid={testId}
    data-trello-do-not-use-override="block-card-content-header-name"
    className={blockCardContentHeaderNameClassName}
  >
    {name}
  </span>
);
