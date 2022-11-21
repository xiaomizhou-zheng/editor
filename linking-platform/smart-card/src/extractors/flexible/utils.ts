import { JsonLd } from 'json-ld-types';
import {
  LinkAttachmentType,
  LinkCommentType,
  LinkProgrammingLanguageType,
  LinkSubscriberType,
} from '../common/detail';
import {
  extractPersonCreatedBy,
  extractPersonUpdatedBy,
  LinkTypeUpdatedBy,
} from '@atlaskit/linking-common/extractors';

const extractLinkName = (link?: JsonLd.Primitives.Link): string | undefined => {
  if (link && typeof link === 'object' && link['@type'] === 'Link') {
    return link.name;
  }
};

const extractValue = <TData extends JsonLd.Data.BaseData, TResult>(
  data: JsonLd.Data.BaseData,
  key: keyof TData,
): TResult | undefined => {
  return ((data as TData)?.[key] as unknown) as TResult;
};

export const extractCommentCount = (data: JsonLd.Data.BaseData) =>
  extractValue<LinkCommentType, number>(data, 'schema:commentCount');

export const extractDueOn = (data: JsonLd.Data.BaseData) =>
  extractValue<JsonLd.Data.BaseData, string>(data, 'endTime');

type LinkViewCountType =
  | JsonLd.Data.Document
  | JsonLd.Data.SourceCodeRepository
  | JsonLd.Data.Task;
export const extractViewCount = (data: JsonLd.Data.BaseData) =>
  extractValue<LinkViewCountType, number>(data, 'atlassian:viewCount');

type LinkReactCountType =
  | JsonLd.Data.Document
  | JsonLd.Data.Message
  | JsonLd.Data.Project
  | JsonLd.Data.Task;
export const extractReactCount = (data: JsonLd.Data.BaseData) =>
  extractValue<LinkReactCountType, number>(data, 'atlassian:reactCount');

type LinkVoteCountType =
  | JsonLd.Data.Document
  | JsonLd.Data.SourceCodePullRequest
  | JsonLd.Data.SourceCodeRepository
  | JsonLd.Data.Task;
export const extractVoteCount = (data: JsonLd.Data.BaseData) =>
  extractValue<LinkVoteCountType, number>(data, 'atlassian:voteCount');

export const extractCreatedBy = (
  data: JsonLd.Data.BaseData,
): string | undefined => {
  const persons = extractPersonCreatedBy(data);
  if (persons && persons.length) {
    return persons[0].name;
  }
};

export const extractModifiedBy = (
  data: JsonLd.Data.BaseData,
): string | undefined => {
  const person = extractPersonUpdatedBy(data as LinkTypeUpdatedBy);
  if (person) {
    return person.name;
  }
};

export const extractProgrammingLanguage = (data: JsonLd.Data.BaseData) =>
  extractValue<LinkProgrammingLanguageType, string>(
    data,
    'schema:programmingLanguage',
  );

export const extractSourceBranch = (
  data: JsonLd.Data.SourceCodePullRequest,
): string | undefined =>
  extractLinkName(data['atlassian:mergeSource'] as JsonLd.Primitives.Link);

export const extractSubscriberCount = (data: JsonLd.Data.BaseData) =>
  extractValue<LinkSubscriberType, number>(data, 'atlassian:subscriberCount');

export const extractAttachmentCount = (data: JsonLd.Data.BaseData) =>
  extractValue<LinkAttachmentType, number>(data, 'atlassian:attachmentCount');

export const extractTargetBranch = (
  data: JsonLd.Data.SourceCodePullRequest,
): string | undefined =>
  extractLinkName(data['atlassian:mergeDestination'] as JsonLd.Primitives.Link);
