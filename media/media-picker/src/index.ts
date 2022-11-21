export { isImagePreview } from './domain/preview';

export type {
  BrowserConfig,
  DropzoneConfig,
  UploadParams,
  UploadsStartEventPayload,
  UploadPreviewUpdateEventPayload,
  UploadEndEventPayload,
  UploadErrorEventPayload,
  MediaFile,
  Preview,
  NonImagePreview,
  ImagePreview,
  MediaError,
  MediaErrorName,
} from './types';
export type { LocalUploadConfig } from './components/types';

// REACT COMPONENTS

export { DropzoneLoader as Dropzone } from './components/dropzone';
export { ClipboardLoader as Clipboard } from './components/clipboard';
export { BrowserLoader as Browser } from './components/browser';
