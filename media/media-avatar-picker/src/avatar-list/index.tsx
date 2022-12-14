/** @jsx jsx */
import { jsx } from '@emotion/react';
import { PureComponent } from 'react';

import { avatarListWrapperStyles } from './styles';
import { SmallAvatarImage } from '../predefined-avatar-view/smallImageAvatar';

export interface Avatar {
  dataURI: string;
}

export interface AvatarListProps {
  avatars: Array<Avatar>;
  onItemClick?: (avatar: Avatar) => void;
  selectedAvatar?: Avatar;
}

export class AvatarList extends PureComponent<AvatarListProps, {}> {
  static defaultProps = {
    avatars: [],
  };

  render() {
    const { avatars, selectedAvatar } = this.props;
    const cards = avatars.map((avatar, idx) => {
      const elementKey = `predefined-avatar-${idx}`;
      return (
        <li key={elementKey}>
          <SmallAvatarImage
            isSelected={avatar === selectedAvatar}
            src={avatar.dataURI}
            onClick={this.onItemClick(avatar)}
            id="small-avatar-image"
          />
        </li>
      );
    });

    return (
      <div css={avatarListWrapperStyles}>
        <ul>{cards}</ul>
      </div>
    );
  }

  onItemClick = (avatar: Avatar) => () => {
    const { onItemClick } = this.props;
    if (onItemClick) {
      onItemClick(avatar);
    }
  };
}
