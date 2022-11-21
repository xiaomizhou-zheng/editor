import {
  MediaItemType,
  MediaType,
  isMimeTypeSupportedByBrowser,
} from '@atlaskit/media-client';
import { CardStatus } from '../types';

export const shouldDisplayImageThumbnail = (
  cardStatus: CardStatus,
  mediaItemType: MediaItemType,
  dataURI?: string,
  mediaType?: MediaType,
  mimeType?: string,
): boolean => {
  if (mediaType === 'doc' || (!mimeType && mediaItemType === 'file')) {
    return false;
  }

  if (dataURI) {
    return (
      mediaItemType === 'external-image' ||
      (mimeType && isMimeTypeSupportedByBrowser(mimeType)) ||
      cardStatus === 'complete' ||
      cardStatus === 'loading-preview'
    );
  }

  return false;
};
