import React from 'react';
import { act } from '@testing-library/react';
import { mockReactDomWarningGlobal } from '../../_testing-library';
import { waitUntil } from '@atlaskit/elements-test-helpers';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { EmojiProvider } from '../../../../api/EmojiResource';
import { CachingMediaEmoji } from '../../../../components/common/CachingEmoji';
import Emoji from '../../../../components/common/Emoji';
import ResourcedEmoji from '../../../../components/common/ResourcedEmoji';
import EmojiPicker from '../../../../components/picker/EmojiPicker';
import EmojiPickerList from '../../../../components/picker/EmojiPickerList';
import EmojiTypeAhead from '../../../../components/typeahead/EmojiTypeAhead';
import { hasSelector } from '../../_emoji-selectors';
import {
  getEmojiResourcePromiseFromRepository,
  mediaEmoji,
  mediaEmojiId,
  newSiteEmojiRepository,
} from '../../_test-data';
import {
  emojisVisible,
  setupPicker,
  findEmojiPreview,
} from '../picker/_emoji-picker-test-helpers';
import { EmojiPreviewComponent } from '../../../../../src/components/common/EmojiPreviewComponent';

describe('Media Emoji Handling across components', () => {
  mockReactDomWarningGlobal();

  let emojiProvider: Promise<EmojiProvider>;

  beforeEach(() => {
    emojiProvider = getEmojiResourcePromiseFromRepository(
      newSiteEmojiRepository(),
    );
  });

  describe('<ResourcedEmoji/>', () => {
    it('ResourcedEmoji renders media emoji via Emoji', async () => {
      const component = mountWithIntl(
        <ResourcedEmoji emojiProvider={emojiProvider} emojiId={mediaEmojiId} />,
      );

      await waitUntil(() => hasSelector(component, Emoji));
      const emojiDescription = component.find(Emoji).prop('emoji');
      expect(emojiDescription).toEqual(mediaEmoji);
      expect(component.find(Emoji).length).toEqual(1);
    });
  });

  describe('<EmojiPicker/>', () => {
    it('Media emoji rendered in picker', async () => {
      const component = mountWithIntl<any, any>(
        <EmojiPicker emojiProvider={emojiProvider} />,
      );
      await waitUntil(() => hasSelector(component, EmojiPickerList));
      const list = component.find(EmojiPickerList);
      expect(list.length).toEqual(1);

      await waitUntil(() => emojisVisible(component, list));
      const emojiDescription = component.find(Emoji).prop('emoji');
      expect(emojiDescription).toEqual(mediaEmoji);
      expect(component.find(CachingMediaEmoji).length).toEqual(1);
    });

    it('Media emoji rendered in picker preview', async () => {
      const component = await setupPicker({ emojiProvider });
      await waitUntil(() => hasSelector(component, EmojiPickerList));
      const list = component.find(EmojiPickerList);
      expect(list.length).toEqual(1);
      await waitUntil(() => emojisVisible(component, list));
      const emoji = component.find(Emoji);
      const emojiDescription = emoji.prop('emoji');
      expect(emojiDescription).toEqual(mediaEmoji);
      expect(list.find(CachingMediaEmoji).length).toEqual(1);

      act(() => {
        // Hover to force preview
        const img = emoji.find({ role: 'button' }).last();
        img.simulate('mouseenter');
      });
      await waitUntil(() => findEmojiPreview(component));

      let preview = component.find(EmojiPreviewComponent);
      expect(preview.length).toEqual(1);

      await waitUntil(() =>
        hasSelector(
          component,
          Emoji,
          (preview = component.find(EmojiPreviewComponent)),
        ),
      );
      const previewEmojiDescription = preview.find(Emoji).prop('emoji');
      expect(previewEmojiDescription).toEqual(mediaEmoji);
      expect(preview.find(CachingMediaEmoji).length).toEqual(1);
    });
  });

  describe('<EmojiTypeAhead/>', () => {
    it('Media emoji rendered in type ahead', async () => {
      const component = mountWithIntl(
        <EmojiTypeAhead emojiProvider={emojiProvider} />,
      );

      await waitUntil(() => hasSelector(component, Emoji));

      const emojiDescription = component.find(Emoji).prop('emoji');
      expect(emojiDescription).toEqual(mediaEmoji);
      expect(component.find(CachingMediaEmoji).length).toEqual(1);
    });
  });
});
