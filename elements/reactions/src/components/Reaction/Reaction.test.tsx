import React from 'react';
import { act, fireEvent, screen } from '@testing-library/react';
import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { EmojiDescription, EmojiProvider, toEmojiId } from '@atlaskit/emoji';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import { getTestEmojiRepository } from '@atlaskit/util-data-test/get-test-emoji-repository';
import {
  ReactionSummary,
  ReactionClick,
  ReactionMouseEnter,
  User,
} from '../../types';
import {
  mockReactDomWarningGlobal,
  renderWithIntl,
  useFakeTimers,
} from '../../__tests__/_testing-library';
import { RENDER_FLASHANIMATION_TESTID } from '../FlashAnimation';
import { Reaction, RENDER_REACTION_TESTID } from './Reaction';

const emojiRepository = getTestEmojiRepository();
const ari = 'ari:cloud:owner:demo-cloud-id:item/1';
const containerAri = 'ari:cloud:owner:demo-cloud-id:container/1';

const grinning: EmojiDescription = emojiRepository.findByShortName(
  ':grinning:',
) as EmojiDescription;

/**
 * create a summary reaction object
 * @param count number of selections of the emoji
 * @param reacted does the emoji been clicked
 * @param users list of users selecting the emoji
 * @returns ReactionSummary object
 */
const getReaction = (
  count: number,
  reacted: boolean,
  users?: User[],
): ReactionSummary => ({
  ari,
  containerAri,
  emojiId: toEmojiId(grinning).id!,
  count,
  reacted,
  users,
});

/**
 * Render a <Reaction /> component with the given props.
 * @param reacted does the emoji been clicked
 * @param count number of selections of the emoji
 * @param onClick click handler
 * @param onMouseEnter onMouseEnter handler
 * @param enableFlash show custom animation or render as standard without animation (defaults to false)
 * @param onEvent onEvent for the analytics engine handler
 * @param users list of users reacted to the emoji clicked
 * @returns JSX.Element
 */
const renderReaction = (
  reacted: boolean,
  count: number,
  onClick: ReactionClick = () => {},
  onMouseEnter: ReactionMouseEnter = () => {},
  enableFlash = false,
  onEvent: (event: UIAnalyticsEvent, channel?: string) => void = () => {},
  users: User[] = [],
) =>
  renderWithIntl(
    <AnalyticsListener channel="fabric-elements" onEvent={onEvent}>
      <Reaction
        reaction={getReaction(count, reacted, users)}
        emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        flash={enableFlash}
      />
    </AnalyticsListener>,
  );

describe('@atlaskit/reactions/components/Reaction', () => {
  mockReactDomWarningGlobal();
  useFakeTimers();

  it('should render emoji with resolved emoji data', async () => {
    const count = 1;
    const reacted = false;
    renderReaction(reacted, count);

    const emojiButton = await screen.findByTestId(RENDER_REACTION_TESTID);
    expect(emojiButton).toBeInTheDocument();
    expect(emojiButton).toHaveAttribute('data-emoji-id', grinning.id);
  });

  it('should call onClick on click', async () => {
    const count = 1;
    const reacted = false;
    const onClickSpy = jest.fn();
    const onMouseEnterSpy = jest.fn();
    renderReaction(reacted, count, onClickSpy, onMouseEnterSpy);

    const emojiButton = await screen.findByTestId(RENDER_REACTION_TESTID);
    expect(emojiButton).toBeInTheDocument();

    act(() => {
      fireEvent.mouseUp(emojiButton);
    });
    expect(onClickSpy).toHaveBeenCalled();
  });

  it('should delegate flash to Flash component', async () => {
    const count = 1;
    const reacted = false;
    const enableFlash = true;
    const onClickSpy = jest.fn();
    const onMouseEnterSpy = jest.fn();

    renderReaction(reacted, count, onClickSpy, onMouseEnterSpy, enableFlash);
    act(() => {
      jest.runAllTimers();
    });

    const flashAnimationWrapper = await screen.findByTestId(
      RENDER_FLASHANIMATION_TESTID,
    );
    expect(flashAnimationWrapper).toBeInTheDocument();
    const styles = window.getComputedStyle(flashAnimationWrapper);
    expect(styles.getPropertyValue('animation')).toBeTruthy();
  });

  it('should render ReactionTooltip', async () => {
    const count = 1;
    const reacted = false;
    const onClickSpy = jest.fn();
    const onMouseEnterSpy = jest.fn();
    renderReaction(reacted, count, onClickSpy, onMouseEnterSpy);

    const content = await screen.findByRole('button');
    expect(content).toBeInTheDocument();
    const tooltipWrapper = await screen.findByRole('presentation');
    expect(tooltipWrapper).toBeInTheDocument();
  });

  describe('with analytics', () => {
    it('should trigger clicked for Reaction', async () => {
      const count = 10;
      const reacted = false;
      const onClickSpy = jest.fn();
      const onMouseEnterSpy = jest.fn();
      const enableFlash = false;
      const onEventSpy = jest.fn();
      renderReaction(
        reacted,
        count,
        onClickSpy,
        onMouseEnterSpy,
        enableFlash,
        onEventSpy,
      );

      const btn = await screen.findByRole('button');
      expect(btn).toBeInTheDocument();

      // Click the Reaction emoji button
      act(() => {
        fireEvent.mouseUp(btn);
      });
      expect(onEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            action: 'clicked',
            actionSubject: 'existingReaction',
            eventType: 'ui',
            attributes: {
              added: true,
              emojiId: toEmojiId(grinning).id!,
              packageName: '@atlaskit/reactions',
              packageVersion: expect.any(String),
            },
          }),
        }),
        'fabric-elements',
      );
    });

    it('should trigger hovered for Reaction', async () => {
      const count = 10;
      const reacted = false;
      const onClickSpy = jest.fn();
      const onMouseEnterSpy = jest.fn();
      const enableFlash = false;
      const onEventSpy = jest.fn();
      const users: User[] = [
        {
          id: 'user-1',
          displayName: 'Luiz',
        },
      ];
      renderReaction(
        reacted,
        count,
        onClickSpy,
        onMouseEnterSpy,
        enableFlash,
        onEventSpy,
        users,
      );

      const btn = await screen.findByRole('button');
      expect(btn).toBeInTheDocument();

      // Click the Reaction emoji button
      act(() => {
        fireEvent.mouseOver(btn);
      });

      expect(onEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            action: 'hovered',
            actionSubject: 'existingReaction',
            eventType: 'ui',
            attributes: {
              packageName: '@atlaskit/reactions',
              packageVersion: expect.any(String),
            },
          }),
        }),
        'fabric-elements',
      );
    });
  });
});
