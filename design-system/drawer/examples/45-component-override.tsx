/** @jsx jsx */

import { Component, FC, MouseEventHandler, SyntheticEvent } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher';
import { B50, N30A, N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Drawer from '../src';

interface State {
  isDrawerOpen: boolean;
}

interface IconWrapperProps {
  onClick: MouseEventHandler;
}

const iconButtonStyles = css({
  display: 'flex',
  width: '40px',
  height: '40px',
  // TODO Delete this comment after verifying spacing token -> previous value `'16px'`
  marginBottom: token('spacing.scale.200', '16px'),
  // TODO Delete this comment after verifying spacing token -> previous value `0`
  padding: token('spacing.scale.0', '0px'),
  alignItems: 'center',
  justifyContent: 'center',
  background: 0,
  border: 0,
  borderRadius: '50%',
  color: 'inherit',
  cursor: 'pointer',
  fontSize: 'inherit',
  lineHeight: 1,
  '&:hover': {
    backgroundColor: token('color.background.neutral.subtle.hovered', N30A),
  },
  '&:active': {
    backgroundColor: token('color.background.neutral.subtle.pressed', B50),
    outline: 0,
  },
});

const IconWrapper: FC<IconWrapperProps> = (props) => (
  <button type="button" css={iconButtonStyles} onClick={props.onClick}>
    {props.children}
  </button>
);

const SidebarOverrideComponent: FC = ({ children }) => {
  return (
    <div
      style={{
        alignItems: 'center',
        boxSizing: 'border-box',
        color: token('color.text.subtle', N500),
        display: 'flex',
        flexShrink: 0,
        flexDirection: 'column',
        height: '100vh',
        paddingBottom: 16,
        paddingTop: 24,
        width: 64,
      }}
    >
      {children}
      <IconWrapper onClick={() => console.log('onNewButtonClicked')}>
        <AppSwitcherIcon label="extra-button" />
      </IconWrapper>
    </div>
  );
};

export default class DrawersExample extends Component<{}, State> {
  state = {
    isDrawerOpen: false,
  };

  openDrawer = () =>
    this.setState({
      isDrawerOpen: true,
    });

  onClose = (...args: [SyntheticEvent, any]) => {
    console.log('onClose', args);
    this.setState({
      isDrawerOpen: false,
    });
  };

  onCloseComplete = (args: any) => console.log('onCloseComplete', args);

  render() {
    return (
      <div style={{ padding: '2rem' }}>
        <Drawer
          onClose={this.onClose}
          onCloseComplete={this.onCloseComplete}
          isOpen={this.state.isDrawerOpen}
          width="narrow"
          // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
          overrides={{
            Sidebar: {
              component: SidebarOverrideComponent,
            },
          }}
        >
          <code>Drawer contents</code>
        </Drawer>
        <Button id="open-drawer" type="button" onClick={this.openDrawer}>
          Open drawer
        </Button>
      </div>
    );
  }
}
