import { OptionData } from '@atlaskit/smart-user-picker';

import { Comment } from './ShareEntities';
import { User } from './User';

export type ShareContentState = {
  users: User[];
  comment?: Comment;
};

export type ShareError = {
  message: string;
};

export type ShareData = {
  users: OptionData[];
  comment: Comment;
};
