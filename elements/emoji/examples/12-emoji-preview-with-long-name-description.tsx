import React from 'react';
import { token } from '@atlaskit/tokens';
import { getEmojis } from '@atlaskit/util-data-test/get-emojis';

import { emojiPickerWidth } from '../src/util/constants';
import filters from '../src/util/filters';
import { IntlProvider } from 'react-intl-next';
import { EmojiPreviewComponent } from '../src/components/common/EmojiPreviewComponent';

const emojis = getEmojis();

const tongueEmoji = filters.byShortName(
  emojis,
  ':stuck_out_tongue_closed_eyes:',
);
const longTongueEmoji = {
  ...tongueEmoji,
  name: `${tongueEmoji.name} ${tongueEmoji.name} ${tongueEmoji.name}`,
  shortName: `${tongueEmoji.shortName}_${tongueEmoji.shortName}_${tongueEmoji.shortName}`,
};

const borderedStyle = {
  margin: '20px',
  border: `1px solid ${token('color.border', '#ddd')}`,
  backgroundColor: token('elevation.surface', 'white'),
  width: emojiPickerWidth,
};

export default function Example() {
  return (
    <IntlProvider locale="en">
      <div style={borderedStyle}>
        {longTongueEmoji && <EmojiPreviewComponent emoji={longTongueEmoji} />}
      </div>
    </IntlProvider>
  );
}
