import { RequestMetadata } from '@atlaskit/media-client';
import {
  UIAttributes,
  UIEventPayload,
  OperationalAttributes,
  SuccessAttributes,
  FailureAttributes,
  OperationalEventPayload,
} from '@atlaskit/media-common';

import { LocalUploadConfig } from './components/types';
import { PluginItemPayload } from './domain/plugin';

export interface UploadParams {
  collection?: string;
}

export type MediaFile = {
  readonly id: string;
  readonly name: string;
  readonly size: number;
  readonly creationDate: number;
  readonly type: string;
  readonly occurrenceKey?: string;
};

export type NonImagePreview = {
  readonly file?: Blob;
};
export type ImagePreview = NonImagePreview & {
  readonly dimensions: {
    readonly width: number;
    readonly height: number;
  };
  readonly scaleFactor: number;
};
export type Preview = NonImagePreview | ImagePreview;

export type UploadsStartEventPayload = {
  readonly files: MediaFile[];
};

export type UploadPreviewUpdateEventPayload = {
  readonly file: MediaFile & {
    readonly collectionName?: string;
  };
  readonly preview: Preview;
};

export type UploadEndEventPayload = {
  readonly file: MediaFile;
};

export type UploadErrorEventPayload = {
  readonly fileId: string;
  readonly error: MediaError;
};

// Events public API
export type UploadEventPayloadMap = {
  readonly 'plugin-items-inserted': PluginItemPayload[];
  readonly 'uploads-start': UploadsStartEventPayload;
  readonly 'upload-preview-update': UploadPreviewUpdateEventPayload;
  readonly 'upload-end': UploadEndEventPayload;
  readonly 'upload-error': UploadErrorEventPayload;
};

export interface BrowserConfig extends LocalUploadConfig {
  readonly multiple?: boolean;
  readonly fileExtensions?: Array<string>;
  readonly replaceFileId?: string /* allow consumer to provide fileId (for replacement uploads). Passing this value will force multiple to be false */;
}

export interface ClipboardConfig extends LocalUploadConfig {}

export interface DropzoneConfig extends LocalUploadConfig {
  container?: HTMLElement;
  headless?: boolean;
}

// Error types

export type MediaErrorName =
  | 'object_create_fail'
  | 'metadata_fetch_fail'
  | 'token_fetch_fail'
  | 'token_update_fail'
  | 'token_source_empty'
  | 'upload_fail'
  | 'user_token_fetch_fail'
  | 'remote_upload_fail'
  | 'invalid_uuid';

export type MediaError = {
  readonly fileId?: string;
  readonly name: MediaErrorName;
  readonly description: string;
  readonly rawError?: Error;
};

export type { PluginItemPayload } from './domain/plugin';
export type { DropzoneDragEnterEventPayload } from './components/types';

// Analytics types

// UI Events...

export type ButtonClickedPayload = UIEventPayload<
  UIAttributes & {
    fileId?: string;
    fileCount?: number;
    collectionName?: string;
    cloudType?: string;
    serviceNames?: string[];
    files?: Array<{
      serviceName: string;
      accountId?: string;
      fileId: string;
      fileMimetype: string;
      fileSize: number;
      fileAge?: string;
    }>;
  },
  'clicked',
  'button'
>;

export type ClipboardPastePayload = UIEventPayload<
  UIAttributes & {
    fileCount?: number;
    fileAttributes: Array<{
      fileMimetype: string;
      fileSize: number;
    }>;
  },
  'pasted',
  'clipboard'
>;

export type DropzoneEventAction =
  | 'draggedOut'
  | 'draggedInto'
  | 'droppedInto'
  | 'folderDroppedInto';

export type DropzoneEventPayload = UIEventPayload<
  UIAttributes & { fileCount: number },
  DropzoneEventAction,
  'dropzone'
>;

// Operational Events...

export type MediaUploadType = 'localMedia' | 'cloudMedia';
export type MediaUploadSource = 'local' | 'cloud';

export type MediaUploadCommencedPayload = OperationalEventPayload<
  OperationalAttributes & {
    sourceType: MediaUploadSource;
    serviceName: string;
  },
  'commenced',
  'mediaUpload',
  MediaUploadType
>;

export type MediaUploadSuccessPayload = OperationalEventPayload<
  OperationalAttributes &
    SuccessAttributes & {
      sourceType: MediaUploadSource;
      serviceName: string;
      uploadDurationMsec: number;
    },
  'succeeded',
  'mediaUpload',
  MediaUploadType
>;

export type MediaUploadFailurePayload = OperationalEventPayload<
  OperationalAttributes &
    FailureAttributes & {
      sourceType: MediaUploadSource;
      serviceName: string;
      uploadDurationMsec: number;
      request?: RequestMetadata;
    },
  'failed',
  'mediaUpload',
  MediaUploadType
>;

export type UnhandledErrorPayload = OperationalEventPayload<
  OperationalAttributes &
    FailureAttributes & {
      browserInfo: string;
      info?: string;
    },
  'unhandledError',
  'error'
>;

export type UUIDValidationErrorPayload = OperationalEventPayload<
  OperationalAttributes &
    FailureAttributes & {
      uuid: string;
    },
  'failed',
  'mediaUpload'
>;

export type AnalyticsEventPayload =
  | ButtonClickedPayload
  | ClipboardPastePayload
  | MediaUploadCommencedPayload
  | MediaUploadSuccessPayload
  | MediaUploadFailurePayload
  | UnhandledErrorPayload
  | UUIDValidationErrorPayload;
