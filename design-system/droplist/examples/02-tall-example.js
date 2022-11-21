import React, { PureComponent } from 'react';

import Button from '@atlaskit/button/standard-button';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import Item, { ItemGroup } from '@atlaskit/item';

import DropList from '../src';

export default class TallExample extends PureComponent {
  state = {
    eventResult: 'Click into and out of the content to trigger event handlers',
  };

  onKeyDown = () => {
    this.setState({
      eventResult: 'onKeyDown called',
    });
  };

  onClick = () => {
    this.setState({
      eventResult: 'onClick called',
    });
  };

  onOpenChange = () => {
    this.setState({
      eventResult: 'onOpenChange called',
    });
  };

  onItemActivated = () => {
    this.setState({
      eventResult: 'Item onActivated called',
    });
  };

  render() {
    return (
      <div>
        <div
          style={{
            borderStyle: 'dashed',
            borderWidth: '1px',
            borderColor: '#ccc',
            padding: '0.5em',
            color: '#ccc',
            margin: '0.5em',
          }}
        >
          {this.state.eventResult}
        </div>
        <DropList
          appearance="tall"
          position="right top"
          isTriggerNotTabbable
          onOpenChange={this.onOpenChange}
          onClick={this.onClick}
          isOpen
          trigger={<Button isSelected>...</Button>}
        >
          <ItemGroup title="Australia">
            <Item href="//atlassian.com" target="_blank">
              Sydney
            </Item>
            <Item>Canberra</Item>
            <Item>Adelaide</Item>
            <Item>Hobart</Item>
            <Item isHidden>Hidden item</Item>
            <Item isDisabled>Brisbane</Item>
            <Item onActivated={this.onItemActivated}>Melbourne</Item>
          </ItemGroup>
          <ItemGroup title="Brazil">
            <Item>Porto Alegre</Item>
            <Item>São Paulo</Item>
            <Item isDisabled>Rio de Janeiro</Item>
          </ItemGroup>
        </DropList>
      </div>
    );
  }
}
