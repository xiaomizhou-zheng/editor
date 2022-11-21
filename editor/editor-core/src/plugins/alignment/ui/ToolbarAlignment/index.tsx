/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { injectIntl, WrappedComponentProps } from 'react-intl-next';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import ToolbarButton from '../../../../ui/ToolbarButton';
import Dropdown from '../../../../ui/Dropdown';
import Alignment from '../../../../ui/Alignment';
import { AlignmentPluginState, AlignmentState } from '../../pm-plugins/types';
import {
  expandIconWrapper,
  separator,
  triggerWrapper,
  wrapper,
} from './styles';
import { IconMap } from './icon-map';
import { messages } from './messages';

export interface State {
  isOpen: boolean;
}

export interface Props {
  pluginState: AlignmentPluginState;
  changeAlignment: (align: AlignmentState) => void;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  isReducedSpacing?: boolean;
  disabled?: boolean;
}

export class AlignmentToolbar extends React.Component<
  Props & WrappedComponentProps,
  State
> {
  static displayName = 'AlignmentToolbar';

  state: State = {
    isOpen: false,
  };

  render() {
    const { isOpen } = this.state;
    const {
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      isReducedSpacing,
      pluginState,
      disabled,
      intl,
    } = this.props;

    const title = intl.formatMessage(messages.alignment);

    return (
      <span css={wrapper}>
        <Dropdown
          mountTo={popupsMountPoint}
          boundariesElement={popupsBoundariesElement}
          scrollableElement={popupsScrollableElement}
          isOpen={isOpen}
          handleClickOutside={this.hide}
          handleEscapeKeydown={this.hide}
          fitWidth={112}
          fitHeight={80}
          trigger={
            <ToolbarButton
              spacing={isReducedSpacing ? 'none' : 'default'}
              disabled={disabled}
              selected={isOpen}
              title={title}
              className="align-btn"
              aria-label={title}
              aria-expanded={isOpen}
              aria-haspopup
              onClick={this.toggleOpen}
              iconBefore={
                <div css={triggerWrapper}>
                  <IconMap alignment={pluginState.align} />
                  <span css={expandIconWrapper}>
                    <ExpandIcon label="" />
                  </span>
                </div>
              }
            />
          }
        >
          <Alignment
            onClick={(align) => this.changeAlignment(align)}
            selectedAlignment={pluginState.align}
          />
        </Dropdown>
        <span css={separator} />
      </span>
    );
  }

  private changeAlignment = (align: AlignmentState) => {
    this.toggleOpen();
    return this.props.changeAlignment(align);
  };

  private toggleOpen = () => {
    this.handleOpenChange({ isOpen: !this.state.isOpen });
  };

  private handleOpenChange = ({ isOpen }: { isOpen: boolean }) => {
    this.setState({ isOpen });
  };

  private hide = () => {
    if (this.state.isOpen) {
      this.setState({ isOpen: false });
    }
  };
}

export default injectIntl(AlignmentToolbar);
