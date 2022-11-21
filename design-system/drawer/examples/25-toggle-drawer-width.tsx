/** @jsx jsx */

import { Component } from 'react';

import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';

import Drawer, { DrawerWidth } from '../src';
import { widths } from '../src/constants';

interface State {
  width: DrawerWidth;
}

export default class DrawersExample extends Component<{}, State> {
  state = {
    width: widths[0] as DrawerWidth,
  };

  onNextClick = () => {
    const width = widths[
      (widths.indexOf(this.state.width) + 1) % widths.length
    ] as DrawerWidth;
    this.setState({
      width,
    });
  };

  render() {
    return (
      <Drawer isOpen width={this.state.width}>
        <div>
          <code>{this.state.width} width</code>
        </div>
        <div style={{ margin: '1rem 0' }}>
          <Button type="button" onClick={this.onNextClick}>
            Next width
          </Button>
        </div>
      </Drawer>
    );
  }
}
