import {
  FileState,
  FileDetails,
  isErrorFileState,
  Identifier,
  isFileIdentifier,
  ErrorFileState,
} from '@atlaskit/media-client';

const getProcessingStatusFromFileState = (status: FileState['status']) => {
  switch (status) {
    case 'processed':
      return 'succeeded';
    case 'processing':
      return 'running';
    case 'failed-processing':
      return 'failed';
  }
};

const getFileDetailsFromFileState = (
  state: Exclude<FileState, ErrorFileState>,
): FileDetails => ({
  id: state.id,
  name: state.name,
  size: state.size,
  mimeType: state.mimeType,
  createdAt: state.createdAt,
  mediaType: state.mediaType,
  processingStatus: getProcessingStatusFromFileState(state.status),
});

export const getFileDetails = (
  identifier: Identifier,
  fileState?: FileState,
): FileDetails => {
  return isFileIdentifier(identifier)
    ? fileState && !isErrorFileState(fileState)
      ? getFileDetailsFromFileState(fileState)
      : { id: identifier.id }
    : {
        id: identifier.mediaItemType,
        name: identifier.name || identifier.dataURI,
        mediaType: 'image',
      };
};
