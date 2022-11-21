/**@jsx jsx */
import { jsx } from '@emotion/react';
import { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl-next';
import { messages } from '@atlaskit/media-ui';
import { predefinedAvatarViewWrapperStyles } from './styles';
import { Avatar } from '../avatar-list';

import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import Button from '@atlaskit/button/custom-theme-button';
import { LargeAvatarImage } from './largeImageAvatar';

export interface BackBtnProps {
  onClick?: () => void;
}

class BackBtn extends PureComponent<BackBtnProps, {}> {
  render() {
    return (
      <Button
        className="back-button"
        iconAfter={<ArrowLeftIcon label="" />}
        onClick={this.props.onClick}
      />
    );
  }
}

export interface PredefinedAvatarViewProps {
  avatars: Array<Avatar>;
  onGoBack?: () => void;
  onAvatarSelected: (avatar: Avatar) => void;
  selectedAvatar?: Avatar;
  predefinedAvatarsText?: string;
}

export class PredefinedAvatarView extends PureComponent<
  PredefinedAvatarViewProps,
  {}
> {
  static defaultProps: PredefinedAvatarViewProps = {
    avatars: [],
    onAvatarSelected() {},
  };

  render() {
    const {
      avatars,
      selectedAvatar,
      onGoBack,
      predefinedAvatarsText,
    } = this.props;
    const cards = avatars.map((avatar, idx) => {
      const elementKey = `predefined-avatar-${idx}`;
      return (
        <li key={elementKey}>
          <LargeAvatarImage
            isSelected={avatar === selectedAvatar}
            src={avatar.dataURI}
            onClick={this.createOnItemClickHandler(avatar)}
          />
        </li>
      );
    });

    return (
      <div
        css={predefinedAvatarViewWrapperStyles}
        id="predefined-avatar-view-wrapper"
      >
        <div className="header">
          <BackBtn onClick={onGoBack} />
          <div className="description">
            {predefinedAvatarsText || (
              <FormattedMessage {...messages.default_avatars} />
            )}
          </div>
        </div>
        <ul>{cards}</ul>
      </div>
    );
  }

  createOnItemClickHandler(avatar: Avatar) {
    const { onAvatarSelected } = this.props;
    return () => {
      if (onAvatarSelected) {
        onAvatarSelected(avatar);
      }
    };
  }
}
