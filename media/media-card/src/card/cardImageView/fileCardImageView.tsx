/**@jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import { Component, ReactNode } from 'react';
import {
  MediaItemType,
  MediaType,
  ImageResizeMode,
} from '@atlaskit/media-client';
import { Ellipsify, MediaImage } from '@atlaskit/media-ui';
import VidPlayIcon from '@atlaskit/icon/glyph/vid-play';

import { CardStatus, CardPreview, CardDimensions } from '../../types';
import { CardAction } from '../actions';

import { CardOverlay } from './cardOverlay';
import {
  bodyStyles,
  cardActionsWrapperStyles,
  overlayStyles,
  progressWrapperStyles,
  titleStyles,
  playIconBackgroundStyles,
} from './styles';
import { CardLoading } from '../../utils/lightCards/cardLoading';
import { shouldDisplayImageThumbnail } from '../../utils/shouldDisplayImageThumbnail';
import { ProgressBar } from '../../utils/progressBar';
import CardActions from '../../utils/cardActions';

import {
  CardImageViewWrapper,
  PlayIconWrapper,
  ProgressBarWrapper,
} from './cardImageViewWrapper';

export interface FileCardImageViewProps {
  readonly mediaName?: string;
  readonly mediaType?: MediaType;
  readonly mimeType?: string;
  readonly fileSize?: string;
  readonly dataURI?: string;
  readonly alt?: string;
  readonly progress?: number;
  readonly status: CardStatus;
  readonly mediaItemType: MediaItemType;
  readonly dimensions?: CardDimensions;
  readonly resizeMode?: ImageResizeMode;
  readonly disableOverlay?: boolean;
  readonly selectable?: boolean;
  readonly selected?: boolean;
  readonly error?: ReactNode;
  readonly actions?: CardAction[];
  readonly onDisplayImage?: () => void;
  readonly previewOrientation?: number;
  readonly onImageError?: (cardPreview: CardPreview) => void;
  readonly onImageLoad?: (cardPreview: CardPreview) => void;
  readonly cardPreview: CardPreview;
}

export class FileCardImageView extends Component<FileCardImageViewProps> {
  private wasThumbnailDisplayed = false;

  static defaultProps: Partial<FileCardImageViewProps> = {
    resizeMode: 'crop',
    disableOverlay: false,
  };

  render() {
    const {
      disableOverlay,
      selectable,
      selected,
      mediaType,
      progress,
      status,
      mediaName,
    } = this.props;
    return (
      <CardImageViewWrapper
        mediaName={mediaName}
        status={status}
        progress={progress}
        disableOverlay={disableOverlay}
        selectable={selectable}
        selected={selected}
        mediaType={mediaType}
      >
        {this.renderCardContents()}
      </CardImageViewWrapper>
    );
  }

  private renderCardContents = (): Array<JSX.Element> | JSX.Element => {
    const { status, mediaType, fileSize } = this.props;

    if (status === 'error') {
      return this.renderErrorContents();
    } else if (status === 'failed-processing') {
      return this.renderFailedContents();
    }

    // If a video has no errors/failed processing, we want to be able to play it
    // immediately, even if there's no image preview
    const isZeroSize =
      fileSize === '' && ['processing', 'loading-preview'].includes(status);
    if (
      mediaType !== 'video' &&
      !this.isFileCardImageReadyForDisplay &&
      !isZeroSize
    ) {
      return this.renderLoadingContents();
    }

    return this.renderSuccessCardContents();
  };

  private renderLoadingContents = () => {
    return (
      <div className="wrapper">
        <div className="img-wrapper">
          <CardLoading />
        </div>
      </div>
    );
  };

  private renderErrorContents = (): JSX.Element => {
    const {
      status,
      error,
      alt,
      mediaName,
      mediaType,
      actions,
      fileSize,
    } = this.props;

    return (
      <React.Fragment>
        <div className="wrapper" />
        <CardOverlay
          cardStatus={status}
          error={error}
          persistent={true}
          mediaName={mediaName}
          mediaType={mediaType}
          alt={alt}
          subtitle={fileSize}
          actions={actions}
        />
      </React.Fragment>
    );
  };

  private renderFailedContents = () => {
    const { status, mediaName, mediaType, actions, fileSize } = this.props;

    return (
      <React.Fragment>
        <div className="wrapper" />
        <CardOverlay
          cardStatus={status}
          noHover={true}
          persistent={true}
          mediaName={mediaName}
          mediaType={mediaType}
          subtitle={fileSize}
          actions={actions}
        />
      </React.Fragment>
    );
  };

  private renderUploadingCardOverlay = (): JSX.Element => {
    const {
      status,
      mediaName,
      mediaType,
      dataURI,
      selectable,
      selected,
    } = this.props;
    const isPersistent = mediaType === 'doc' || !dataURI;

    return (
      <CardOverlay
        cardStatus={status}
        persistent={isPersistent}
        mediaName={mediaName}
        selectable={selectable}
        selected={selected}
      />
    );
  };

  private renderPlayButton = () => {
    const {
      status,
      mediaItemType,
      mediaType,
      mimeType,
      selectable,
      dataURI,
    } = this.props;

    if (mediaType !== 'video') {
      return null;
    }

    if (
      selectable &&
      !shouldDisplayImageThumbnail(
        status,
        mediaItemType,
        dataURI,
        mediaType,
        mimeType,
      )
    ) {
      return null;
    }

    return (
      <PlayIconWrapper>
        <div css={playIconBackgroundStyles}>
          <VidPlayIcon
            testId="media-card-play-button"
            label="play"
            size="large"
          />
        </div>
      </PlayIconWrapper>
    );
  };

  onImageLoad = () => {
    const { onImageLoad, cardPreview } = this.props;
    onImageLoad && onImageLoad(cardPreview);
  };
  onImageError = () => {
    const { onImageError, cardPreview } = this.props;
    onImageError && onImageError(cardPreview);
  };

  private renderMediaImage = () => {
    const {
      status,
      mediaItemType,
      dataURI,
      mediaType,
      mimeType,
      previewOrientation,
      onDisplayImage,
      alt,
    } = this.props;

    if (
      !shouldDisplayImageThumbnail(
        status,
        mediaItemType,
        dataURI,
        mediaType,
        mimeType,
      )
    ) {
      return null;
    }

    if (
      !this.wasThumbnailDisplayed &&
      onDisplayImage &&
      mediaType === 'image'
    ) {
      onDisplayImage();
      this.wasThumbnailDisplayed = true;
    }

    return (
      <MediaImage
        dataURI={dataURI}
        alt={alt}
        crop={this.isCropped}
        stretch={this.isStretched}
        previewOrientation={previewOrientation}
        onImageLoad={this.onImageLoad}
        onImageError={this.onImageError}
      />
    );
  };

  private renderProgressBar = () => {
    const { mediaName, progress, actions, status } = this.props;

    if (status !== 'uploading') {
      return null;
    }

    return (
      <ProgressBarWrapper>
        <div css={overlayStyles}>
          <div css={titleStyles}>
            <Ellipsify
              testId="media-card-file-name"
              text={mediaName || ''}
              lines={2}
            />
          </div>
          <div css={bodyStyles}>
            <div css={progressWrapperStyles}>
              <ProgressBar progress={progress} />
            </div>
            <div css={cardActionsWrapperStyles}>
              {actions ? (
                <CardActions actions={actions} triggerColor="white" />
              ) : null}
            </div>
          </div>
        </div>
      </ProgressBarWrapper>
    );
  };

  private renderSuccessCardContents = (): JSX.Element => {
    const { disableOverlay, selectable, status } = this.props;

    let overlay: JSX.Element | null = null;
    if (!disableOverlay) {
      if (status === 'uploading') {
        if (selectable) {
          overlay = this.renderUploadingCardOverlay();
        }
      } else {
        overlay = this.renderSuccessCardOverlay();
      }
    }

    return (
      <div className="wrapper">
        <div className="img-wrapper">
          {this.renderMediaImage()}
          {this.renderProgressBar()}
          {this.renderPlayButton()}
        </div>
        {overlay}
      </div>
    );
  };

  private renderSuccessCardOverlay = (): JSX.Element => {
    const {
      status,
      mediaName,
      mediaType,
      fileSize,
      dataURI,
      selectable,
      selected,
      actions,
    } = this.props;
    const isPersistent = mediaType === 'doc' || !dataURI;

    return (
      <CardOverlay
        cardStatus={status}
        persistent={isPersistent}
        mediaName={mediaName}
        mediaType={mediaType}
        selectable={selectable}
        selected={selected}
        subtitle={fileSize}
        actions={actions}
      />
    );
  };

  private get isFileCardImageReadyForDisplay() {
    const { dataURI, status } = this.props;

    return (
      !!dataURI ||
      !['loading', 'processing', 'loading-preview'].includes(status)
    );
  }

  private get isCropped() {
    const { resizeMode } = this.props;

    return resizeMode === 'crop';
  }

  private get isStretched() {
    const { resizeMode } = this.props;

    return resizeMode === 'stretchy-fit';
  }
}
