import React from 'react';
import { Component } from 'react';
import {
  MediaClient,
  FileIdentifier,
  FileState,
  MediaFileArtifacts,
  globalMediaEventEmitter,
  MediaSubscription,
} from '@atlaskit/media-client';
import { NumericalCardDimensions } from '@atlaskit/media-common';
import { CustomMediaPlayer, InactivityDetector } from '@atlaskit/media-ui';
import { CardDimensions } from '../types';
import { defaultImageCardDimensions } from '../utils';
import { CardLoading } from '../utils/lightCards/cardLoading';

import {
  WithAnalyticsEventsProps,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { ProgressBar } from './ui/progressBar/progressBar';
import { Breakpoint } from './ui/common';
import { calcBreakpointSize } from './ui/styles';
import { isValidPercentageUnit } from '../utils/isValidPercentageUnit';
import { getElementDimension } from '../utils/getElementDimension';
import type { CardPreview } from '../types';
import { InlinePlayerWrapper } from './inlinePlayerWrapper';
export interface InlinePlayerOwnProps {
  identifier: FileIdentifier;
  mediaClient: MediaClient;
  dimensions?: CardDimensions;
  originalDimensions?: NumericalCardDimensions;
  autoplay: boolean;
  selected?: boolean;
  onFullscreenChange?: (fullscreen: boolean) => void;
  onError?: (error: Error) => void;
  readonly onClick?: (
    event: React.MouseEvent<HTMLDivElement>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => void;
  testId?: string;
  readonly cardPreview?: CardPreview;
  //To Forward Ref
  readonly forwardRef?: React.Ref<HTMLDivElement>;
}

export type InlinePlayerProps = InlinePlayerOwnProps & WithAnalyticsEventsProps;

export interface InlinePlayerState {
  fileSrc?: string;
  isUploading?: boolean;
  progress?: number;
  elementWidth?: number;
}

export const getPreferredVideoArtifact = (
  fileState: FileState,
): keyof MediaFileArtifacts | undefined => {
  if (fileState.status === 'processed' || fileState.status === 'processing') {
    const { artifacts } = fileState;
    if (!artifacts) {
      return undefined;
    }

    return artifacts['video_1280.mp4']
      ? 'video_1280.mp4'
      : artifacts['video_640.mp4']
      ? 'video_640.mp4'
      : undefined;
  }

  return undefined;
};

export class InlinePlayerBase extends Component<
  InlinePlayerProps,
  InlinePlayerState
> {
  subscription?: MediaSubscription;
  state: InlinePlayerState = {};
  divRef: React.RefObject<HTMLDivElement> = React.createRef();

  static defaultProps = {
    dimensions: defaultImageCardDimensions,
  };

  componentDidMount() {
    this.saveElementWidth();
    const { mediaClient, identifier } = this.props;
    const { id, collectionName } = identifier;

    this.revoke();
    this.unsubscribe();
    this.subscription = mediaClient.file
      .getFileState(id, { collectionName })
      .subscribe({
        next: async (fileState) => {
          if (fileState.status === 'uploading') {
            this.setState({ isUploading: true, progress: fileState.progress });
          } else {
            this.setState({ isUploading: false });
          }

          const { fileSrc: existingFileSrc } = this.state;
          // we want to reuse the existing fileSrc to prevent re renders
          if (existingFileSrc) {
            return;
          }

          if (fileState.status !== 'error' && fileState.preview) {
            const { value } = await fileState.preview;

            if (value instanceof Blob && value.type.indexOf('video/') === 0) {
              const fileSrc = URL.createObjectURL(value);
              this.setFileSrc(fileSrc);
              return;
            }
          }

          if (
            fileState.status === 'processed' ||
            fileState.status === 'processing'
          ) {
            const artifactName = getPreferredVideoArtifact(fileState);
            const { artifacts } = fileState;
            if (!artifactName || !artifacts) {
              this.setBinaryURL();
              return;
            }

            try {
              const fileSrc = await mediaClient.file.getArtifactURL(
                artifacts,
                artifactName,
                collectionName,
              );

              this.setFileSrc(fileSrc);
            } catch (error) {
              const { onError } = this.props;

              if (onError && error instanceof Error) {
                onError(error);
              }
            }
          }
        },
      });
  }

  setFileSrc = (fileSrc: string) => {
    this.setState({ fileSrc });
  };

  // Tries to use the binary artifact to provide something to play while the video is still processing
  setBinaryURL = async () => {
    const { mediaClient, identifier, onError } = this.props;
    const { id, collectionName } = identifier;

    try {
      const fileSrc = await mediaClient.file.getFileBinaryURL(
        id,
        collectionName,
      );

      this.setFileSrc(fileSrc);
    } catch (error) {
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  };

  unsubscribe = () => {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  };

  revoke = () => {
    const { fileSrc } = this.state;
    if (fileSrc) {
      URL.revokeObjectURL(fileSrc);
    }
  };

  componentWillUnmount() {
    this.unsubscribe();
    this.revoke();
  }

  onDownloadClick = () => {
    const { mediaClient, identifier } = this.props;
    const { id, collectionName } = identifier;

    mediaClient.file.downloadBinary(id, undefined, collectionName);
  };

  onFirstPlay = () => {
    const { identifier } = this.props;
    globalMediaEventEmitter.emit('media-viewed', {
      fileId: identifier.id,
      viewingLevel: 'full',
    });
  };

  private get breakpoint(): Breakpoint {
    const width =
      this.state.elementWidth ||
      (this.props.dimensions ? this.props.dimensions.width : '') ||
      defaultImageCardDimensions.width;

    return calcBreakpointSize(parseInt(`${width}`, 10));
  }

  saveElementWidth = () => {
    const { dimensions } = this.props;
    if (!dimensions) {
      return;
    }

    const { width } = dimensions;

    if (width && isValidPercentageUnit(width) && !!this.divRef.current) {
      const elementWidth = getElementDimension(this.divRef.current, 'width');
      this.setState({ elementWidth });
    }
  };

  render() {
    const {
      onClick,
      dimensions,
      originalDimensions,
      selected,
      testId,
      identifier,
      forwardRef,
      autoplay,
      cardPreview,
      onFullscreenChange,
    } = this.props;
    const { fileSrc, isUploading, progress } = this.state;

    if (!fileSrc) {
      return <CardLoading testId={testId} dimensions={dimensions} />;
    }

    return (
      <InlinePlayerWrapper
        testId={testId || 'media-card-inline-player'}
        selected={{ selected }}
        onClick={onClick}
        innerRef={forwardRef || undefined}
        dimensions={dimensions}
      >
        <InactivityDetector>
          {(checkMouseMovement) => (
            <CustomMediaPlayer
              type="video"
              src={fileSrc}
              onFullscreenChange={onFullscreenChange}
              fileId={identifier.id}
              isAutoPlay={autoplay}
              isHDAvailable={false}
              onDownloadClick={this.onDownloadClick}
              onFirstPlay={this.onFirstPlay}
              lastWatchTimeConfig={{
                contentId: identifier.id,
              }}
              originalDimensions={originalDimensions}
              showControls={checkMouseMovement}
              poster={cardPreview?.dataURI}
            />
          )}
        </InactivityDetector>
        {isUploading ? (
          <ProgressBar
            progress={progress}
            breakpoint={this.breakpoint}
            positionBottom
            showOnTop
          />
        ) : null}
      </InlinePlayerWrapper>
    );
  }
}

const InlinePlayerForwardRef = React.forwardRef<
  HTMLDivElement,
  InlinePlayerProps
>((props, ref) => {
  return <InlinePlayerBase {...props} forwardRef={ref} />;
});

export const InlinePlayer = InlinePlayerForwardRef;
