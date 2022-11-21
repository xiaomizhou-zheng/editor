/* sample-data.js */
/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/react';

import Avatar from '@atlaskit/avatar';
import { token } from '@atlaskit/tokens';

import { presidents } from './numerical';

interface President {
  id: number;
  name: string;
  party: string;
  number: number | string;
}

function createKey(input: string) {
  return input ? input.replace(/\s/g, '') : input;
}

const nameWrapperStyles = css({
  display: 'flex',
  alignItems: 'center',
});

const NameWrapper: FC = ({ children }) => (
  <span css={nameWrapperStyles}>{children}</span>
);

const avatarWrapperStyles = css({
  // TODO Delete this comment after verifying spacing token -> previous value `'8px'`
  marginRight: token('spacing.scale.100', '8px'),
});

const AvatarWrapper: FC = ({ children }) => (
  <div css={avatarWrapperStyles}>{children}</div>
);

export const caption = 'Sample Numerical Data';

export const createHead = (withWidth: boolean) => {
  return {
    cells: [
      {
        key: 'name',
        content: 'Name',
        isSortable: true,
        width: withWidth ? 25 : undefined,
      },
      {
        key: 'party',
        content: 'Party',
        shouldTruncate: true,
        isSortable: true,
        width: withWidth ? 15 : undefined,
      },
      {
        key: 'numeric',
        content: 'Arbitrary Number',
        isSortable: true,
        width: withWidth ? 10 : undefined,
      },
    ],
  };
};

export const head = createHead(true);

export const rows = presidents.map((president: President, index: number) => ({
  key: `row-${index}-${president.name}`,
  cells: [
    {
      key: createKey(president.name),
      content: (
        <NameWrapper>
          <AvatarWrapper>
            <Avatar name={president.name} size="medium" />
          </AvatarWrapper>
          <a href="https://atlassian.design">{president.name}</a>
        </NameWrapper>
      ),
    },
    {
      key: createKey(president.party),
      content: president.party,
    },
    {
      key: president.number,
      content: president.number,
    },
  ],
}));
