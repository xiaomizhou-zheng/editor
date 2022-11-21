import { ACTION, ACTION_SUBJECT } from './enums';
import { TrackAEP } from './utils';

type CopyAEP = TrackAEP<
  ACTION.COPIED,
  ACTION_SUBJECT.DOCUMENT,
  undefined,
  {
    content: string[];
    inputMethod?: string;
    nodeType?: string;
  },
  undefined
>;

type CutAEP = TrackAEP<
  ACTION.CUT,
  ACTION_SUBJECT.DOCUMENT,
  undefined,
  {
    content: string[];
  },
  undefined
>;

export type CutCopyEventPayload = CutAEP | CopyAEP;
