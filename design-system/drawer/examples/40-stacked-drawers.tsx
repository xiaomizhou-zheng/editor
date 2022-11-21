/** @jsx jsx */
import { Component, SyntheticEvent } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';

import Drawer from '../src';

interface State {
  isDrawerOpen: boolean;
  isNestedDrawerOpen: boolean;
}

const spacingStyles = css({
  padding: '2rem',
});
export default class DrawersExample extends Component<{}, State> {
  state = {
    isDrawerOpen: false,
    isNestedDrawerOpen: false,
  };

  openDrawer = () =>
    this.setState({
      isDrawerOpen: true,
      isNestedDrawerOpen: false,
    });

  openNestedDrawer = () =>
    this.setState({
      isNestedDrawerOpen: true,
    });

  onClose = (...args: [SyntheticEvent, any]) => {
    console.log('onClose', args);
    this.setState({
      isDrawerOpen: false,
      isNestedDrawerOpen: false,
    });
  };

  onNestedClose = (...args: [SyntheticEvent, any]) => {
    console.log('onClose Nested', args);
    this.setState({
      isNestedDrawerOpen: false,
    });
  };

  onCloseComplete = (args: any) => console.log('onCloseComplete', args);

  onNestedCloseComplete = (args: any) =>
    console.log('onNestedCloseComplete', args);

  render() {
    return (
      <div css={spacingStyles}>
        <div css={spacingStyles}>
          <Drawer
            onClose={this.onNestedClose}
            onCloseComplete={this.onNestedCloseComplete}
            isOpen={this.state.isNestedDrawerOpen}
            width="full"
          >
            <code>Nested Drawer contents</code>
          </Drawer>
        </div>
        <Drawer
          onClose={this.onClose}
          onCloseComplete={this.onCloseComplete}
          isOpen={this.state.isDrawerOpen}
          width="narrow"
        >
          <code>Drawer contents</code>
          <div css={spacingStyles}>
            <Button
              id="open-drawer"
              type="button"
              onClick={this.openNestedDrawer}
            >
              Open Nested drawer
            </Button>
          </div>
        </Drawer>
        <Button id="open-drawer" type="button" onClick={this.openDrawer}>
          Open drawer
        </Button>
      </div>
    );
  }
}
