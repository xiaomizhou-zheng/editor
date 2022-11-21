/**@jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import { MouseEvent, Component, ReactNode } from 'react';
import cx from 'classnames';

import { MediaType } from '@atlaskit/media-client';
import TickIcon from '@atlaskit/icon/glyph/check';
import { Ellipsify } from '@atlaskit/media-ui';

// We dont require things directly from "utils" to avoid circular dependencies
import { FileIcon } from '../../../utils/fileIcon';
import { ErrorIcon } from '../../../utils/errorIcon';
import CardActions from '../../../utils/cardActions';
import { CardAction, CardEventHandler } from '../../actions';
import { CardStatus } from '../../../types';

import {
  tickBoxStyles,
  errorLineStyles,
  leftColumnStyles,
  topRowStyles,
  bottomRowStyles,
  rightColumnStyles,
  subtitleStyles,
} from './styles';
import {
  Metadata,
  AltWrapper,
  ErrorMessage,
  TitleWrapper,
  Overlay,
} from './cardOverlayComponents';

const resolveTitleText = (
  cardStatus: CardStatus,
  mediaName?: string,
  error?: ReactNode,
  selected?: boolean,
): string => {
  // don't show title if error
  // also when card is uploading + selected, title is already showing outside of the overlay
  if (error || !mediaName || (cardStatus === 'uploading' && !selected)) {
    return '';
  }

  return mediaName;
};

export interface CardOverlayProps {
  readonly cardStatus: CardStatus;

  mediaType?: MediaType;
  mediaName?: string;
  subtitle?: string;

  selectable?: boolean;
  selected?: boolean;
  persistent: boolean;

  error?: ReactNode;
  alt?: string;
  noHover?: boolean;

  actions?: Array<CardAction>;
  icon?: string;
}

export interface CardOverlayState {
  isMenuExpanded: boolean;
}

export class CardOverlay extends Component<CardOverlayProps, CardOverlayState> {
  static defaultProps = {
    actions: [],
    mediaName: '',
  };

  constructor(props: CardOverlayProps) {
    super(props);

    this.state = {
      isMenuExpanded: false,
    };
  }

  private get wrapperClassNames() {
    const {
      error,
      noHover,
      selectable,
      selected,
      mediaType,
      persistent,
    } = this.props;
    const { isMenuExpanded } = this.state;

    return error
      ? cx('overlay', { error, active: isMenuExpanded })
      : cx('overlay', mediaType, {
          active: isMenuExpanded,
          selectable,
          selected,
          // Yes, you right. We put "persistent" class when it is NOT persistent. 🤦
          persistent: !persistent,
          noHover,
        });
  }

  render() {
    const {
      cardStatus,
      error,
      noHover,
      mediaName,
      persistent,
      selected,
      actions,
    } = this.props;

    const titleText = resolveTitleText(cardStatus, mediaName, error, selected);
    const menuTriggerColor = !persistent ? 'white' : undefined;

    return (
      <Overlay
        hasError={!!error}
        noHover={noHover}
        className={this.wrapperClassNames}
      >
        <div css={topRowStyles} className={'top-row'}>
          {this.errorLine()}
          <TitleWrapper>
            {titleText ? (
              <Ellipsify
                testId="media-card-file-name"
                text={titleText}
                lines={2}
              />
            ) : null}
          </TitleWrapper>
          {this.tickBox()}
        </div>
        <div css={bottomRowStyles} className={'bottom-row'}>
          <div css={leftColumnStyles}>{this.bottomLeftColumn()}</div>
          <div css={rightColumnStyles}>
            {actions ? (
              <CardActions
                actions={actions}
                onToggle={this.onMenuToggle}
                triggerColor={menuTriggerColor}
              />
            ) : null}
          </div>
        </div>
      </Overlay>
    );
  }

  errorLine() {
    const { error, alt } = this.props;
    return (
      error && (
        <React.Fragment>
          <div css={errorLineStyles}>
            <ErrorIcon />
            <ErrorMessage>{error}</ErrorMessage>
          </div>
          {alt && (
            <div css={errorLineStyles}>
              <AltWrapper>{alt}</AltWrapper>
            </div>
          )}
        </React.Fragment>
      )
    );
  }

  tickBox() {
    const { selected, selectable } = this.props;
    const tick = <TickIcon label="tick" />;
    const className = cx('tickbox', { selected });

    return (
      selectable && (
        <div css={tickBoxStyles} className={className}>
          {tick}
        </div>
      )
    );
  }

  bottomLeftColumn() {
    const { error } = this.props;

    if (!error) {
      const { mediaType, subtitle, icon } = this.props;
      const classNames = cx('metadata');

      const fileIcon =
        mediaType || icon ? (
          <FileIcon mediaType={mediaType} iconUrl={icon} />
        ) : null;

      const subtitleEl = subtitle ? (
        <div css={subtitleStyles} className="file-size">
          {subtitle}
        </div>
      ) : null;

      return (
        <div>
          <Metadata className={classNames}>
            {fileIcon}
            {subtitleEl}
          </Metadata>
        </div>
      );
    }
  }

  onMenuToggle = (attrs: { isOpen: boolean }) => {
    this.setState({ isMenuExpanded: attrs.isOpen });
  };

  removeBtnClick(handler: CardEventHandler) {
    return (e: MouseEvent<HTMLDivElement, any>) => {
      e.preventDefault();
      e.stopPropagation();
      handler();
    };
  }
}
