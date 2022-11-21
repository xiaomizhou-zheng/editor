import {
  Updater,
  ReactionsReadyState,
  ReactionStatus,
  ReactionSummary,
} from '../types';

const compareEmojiId = (l: string, r: string): number => {
  return l.localeCompare(r);
};

type ReactionSummarySortFunction = (
  a: ReactionSummary,
  b: ReactionSummary,
) => number;

const sortByRelevance: ReactionSummarySortFunction = (
  a: ReactionSummary,
  b: ReactionSummary,
) => {
  if (a.count > b.count) {
    return -1;
  } else if (a.count < b.count) {
    return 1;
  } else {
    return compareEmojiId(a.emojiId, b.emojiId);
  }
};

const sortByPreviousPosition = (
  reactions: ReactionSummary[],
): ReactionSummarySortFunction => {
  type Indexes = { [emojiId: string]: number };
  const indexes: Indexes = reactions.reduce((map, reaction, index) => {
    map[reaction.emojiId] = index;
    return map;
  }, {} as Indexes);

  const getPosition = ({ emojiId }: ReactionSummary) =>
    indexes[emojiId] === undefined ? reactions.length : indexes[emojiId];

  return (a, b) => getPosition(a) - getPosition(b);
};

export const readyState = (
  reactions: ReactionSummary[],
): ReactionsReadyState => ({
  status: ReactionStatus.ready,
  reactions: reactions.filter((reaction) => reaction.count > 0),
});

export const byEmojiId = (emojiId: string) => (reaction: ReactionSummary) =>
  reaction.emojiId === emojiId;

export const addOne = (reaction: ReactionSummary): ReactionSummary => ({
  ...reaction,
  count: reaction.count + 1,
  reacted: true,
});

export const removeOne = (reaction: ReactionSummary): ReactionSummary => ({
  ...reaction,
  count: reaction.count - 1,
  reacted: false,
});

export const updateByEmojiId = (
  emojiId: string,
  updater: Updater<ReactionSummary> | ReactionSummary,
) => (reaction: ReactionSummary) =>
  reaction.emojiId === emojiId
    ? updater instanceof Function
      ? updater(reaction)
      : updater
    : reaction;

export const getReactionsSortFunction = (reactions?: ReactionSummary[]) =>
  reactions && reactions.length
    ? sortByPreviousPosition(reactions)
    : sortByRelevance;

export const flattenAris = (a: string[], b: string[]): string[] => a.concat(b);

export function isRealErrorFromService(errorCode?: number) {
  // we don't count 401 or 403 as a real error from services
  return !errorCode || !(errorCode === 401 || errorCode === 403);
}
