import React from 'react';
import { ColorPaletteMenu } from '../src';
import { extendedPalette } from '../mock-data';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';
import { token } from '@atlaskit/tokens';

class ColorPaletteMenuExample extends React.Component<{}, { color: string }> {
  state = {
    color: token('color.background.accent.purple.subtle', colors.P200),
  };

  render() {
    return (
      <ColorPaletteMenu
        label="Change color"
        palette={extendedPalette}
        selectedColor={this.state.color}
        cols={6}
        onChange={(newColor: string) => this.setState({ color: newColor })}
      />
    );
  }
}

export default () => <ColorPaletteMenuExample />;
