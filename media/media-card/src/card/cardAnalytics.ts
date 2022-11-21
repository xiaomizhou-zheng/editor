import {
  FileAttributes,
  MediaTraceContext,
  PerformanceAttributes,
} from '@atlaskit/media-common';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  fireMediaCardEvent,
  getRenderSucceededEventPayload,
  getRenderErrorEventPayload,
  getRenderFailedFileStatusPayload,
  getCopiedFilePayload,
  getRenderCommencedEventPayload,
  MediaCardAnalyticsEventPayload,
  getRenderPreviewableCardPayload,
  SSRStatus,
} from '../utils/analytics';
import { CardStatus } from '../types';
import { MediaCardError } from '../errors';

export const fireOperationalEvent = (
  createAnalyticsEvent: CreateUIAnalyticsEvent,
  status: CardStatus,
  fileAttributes: FileAttributes,
  performanceAttributes: PerformanceAttributes,
  ssrReliability: SSRStatus,
  error: MediaCardError = new MediaCardError('missing-error-data'),
  traceContext: MediaTraceContext,
) => {
  const fireEvent = (payload: MediaCardAnalyticsEventPayload) =>
    fireMediaCardEvent(payload, createAnalyticsEvent);

  switch (status) {
    case 'complete':
      fireEvent(
        getRenderSucceededEventPayload(
          fileAttributes,
          performanceAttributes,
          ssrReliability,
          traceContext,
        ),
      );
      break;
    case 'failed-processing':
      fireEvent(
        getRenderFailedFileStatusPayload(
          fileAttributes,
          performanceAttributes,
          ssrReliability,
          traceContext,
        ),
      );
      break;
    case 'error':
      fireEvent(
        getRenderErrorEventPayload(
          fileAttributes,
          performanceAttributes,
          error,
          ssrReliability,
          traceContext,
        ),
      );
      break;
  }
};

export const fireCommencedEvent = (
  createAnalyticsEvent: CreateUIAnalyticsEvent,
  fileAttributes: FileAttributes,
  performanceAttributes: PerformanceAttributes,
  traceContext: MediaTraceContext,
) => {
  fireMediaCardEvent(
    getRenderCommencedEventPayload(
      fileAttributes,
      performanceAttributes,
      traceContext,
    ),
    createAnalyticsEvent,
  );
};

export const fireCopiedEvent = (
  createAnalyticsEvent: CreateUIAnalyticsEvent,
  fileId: string,
  cardRef: HTMLDivElement,
) => {
  if (typeof window.getSelection === 'function') {
    const selection = window.getSelection();
    if (selection?.containsNode?.(cardRef, true)) {
      fireMediaCardEvent(getCopiedFilePayload(fileId), createAnalyticsEvent);
    }
  }
};

export const fireScreenEvent = (
  createAnalyticsEvent: CreateUIAnalyticsEvent,
  fileAttributes: FileAttributes,
) => {
  fireMediaCardEvent(
    getRenderPreviewableCardPayload(fileAttributes),
    createAnalyticsEvent,
  );
};
