import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
  addReaction: {
    id: 'fabric.reactions.add',
    defaultMessage: 'Add reaction',
    description: 'Message for add reaction button',
  },
  loadingReactions: {
    id: 'fabric.reactions.loading',
    defaultMessage: 'Loading...',
    description: 'Message while reactions are being loaded',
  },
  moreEmoji: {
    id: 'fabric.reactions.more.emojis',
    defaultMessage: 'More emojis',
    description:
      'Tooltip of the "show more" button in the quick reaction selector. The full emoji selector is displayed when the user clicks on it.',
  },
  reactWithEmoji: {
    id: 'fabric.reactions.reactwithemoji',
    defaultMessage: 'React with {emoji} emoji',
    description: 'Aria label on reaction button',
  },
  unexpectedError: {
    id: 'fabric.reactions.error.unexpected',
    defaultMessage: 'Reactions are temporarily unavailable',
    description: 'Unexpected error message',
  },
  otherUsers: {
    id: 'fabric.reactions.other.reacted.users',
    defaultMessage:
      '{count, plural, one {and one other} other {and {count} others}}',
    description:
      "The number of users that have reacted similarly, but aren't shown",
  },
});
