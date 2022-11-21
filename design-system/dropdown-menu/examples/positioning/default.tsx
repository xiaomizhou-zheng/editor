import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

export default () => (
  <DropdownMenu trigger="Cities">
    <DropdownItemGroup>
      <DropdownItem>Sydney</DropdownItem>
      <DropdownItem>Brisbane</DropdownItem>
      <DropdownItem>Gold Coast</DropdownItem>
      <DropdownItem>Perth</DropdownItem>
      <DropdownItem>Darwin</DropdownItem>
      <DropdownItem>Melbourne</DropdownItem>
      <DropdownItem>Adelaide</DropdownItem>
      <DropdownItem>Canberra</DropdownItem>
      <DropdownItem>Hobart</DropdownItem>
      <DropdownItem>Newcastle</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);
