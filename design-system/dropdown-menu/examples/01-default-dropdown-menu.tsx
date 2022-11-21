import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';

export default () => (
  <DropdownMenu
    trigger="Page actions"
    isOpen
    onOpenChange={(e) => console.log('dropdown opened', e)}
    testId="dropdown"
  >
    <DropdownItemGroup>
      <DropdownItem>Move</DropdownItem>
      <DropdownItem>Clone</DropdownItem>
      <DropdownItem>Delete</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);
