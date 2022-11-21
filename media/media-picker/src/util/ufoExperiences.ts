import {
  ConcurrentExperience,
  ExperiencePerformanceTypes,
  ExperienceTypes,
} from '@atlaskit/ufo';
import { FileAttributes, WithFileAttributes } from '@atlaskit/media-common';
import {
  RequestMetadata,
  getMediaEnvironment,
  getMediaRegion,
} from '@atlaskit/media-client';
import { ComponentName, LOGGED_FEATURE_FLAG_KEYS } from './analytics';

export type UFOFailedEventPayload = {
  failReason: string;
  error?: string;
  errorDetail?: string | undefined;
  uploadDurationMsec: number;
  request?: RequestMetadata;
} & WithFileAttributes;

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

let ufoExperience: ConcurrentExperience | undefined;

const initExperience = (id: string, componentName: ComponentName) => {
  if (!ufoExperience) {
    const inlineExperience = {
      platform: { component: `media-picker-${componentName}` },
      type: ExperienceTypes.Experience,
      performanceType: ExperiencePerformanceTypes.InlineResult,
      featureFlags: LOGGED_FEATURE_FLAG_KEYS,
    };
    ufoExperience = new ConcurrentExperience('media-upload', inlineExperience);
  }
  return ufoExperience.getInstance(id);
};

const getExperience = (id: string) => {
  if (ufoExperience) {
    return ufoExperience.getInstance(id);
  }
};

export const startMediaUploadUfoExperience = (
  id: string,
  componentName: ComponentName,
) => {
  initExperience(id, componentName).start();
};

export const succeedMediaUploadUfoExperience = (
  id: string,
  properties: FileAttributes,
) => {
  getExperience(id)?.success({
    metadata: {
      fileAttributes: properties,
      packageName,
      packageVersion,
      mediaEnvironment: getMediaEnvironment(),
      mediaRegion: getMediaRegion(),
    },
  });
};

export const failMediaUploadUfoExperience = (
  id: string,
  properties?: UFOFailedEventPayload,
) => {
  const refinedMetadata = {
    ...properties,
    packageName,
    packageVersion,
    mediaEnvironment: getMediaEnvironment(),
    mediaRegion: getMediaRegion(),
  };
  getExperience(id)?.failure({
    metadata: refinedMetadata,
  });
};
