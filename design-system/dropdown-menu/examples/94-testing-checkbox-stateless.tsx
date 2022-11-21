import React, { useState } from 'react';

import DropdownMenu, {
  DropdownItemCheckbox,
  DropdownItemCheckboxGroup,
} from '../src';

const DropdownMenuCheckboxStateless = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const selectOption = (option: string) => {
    if (selected.includes(option)) {
      setSelected(selected.filter((x) => x !== option));
    } else {
      setSelected([...selected, option]);
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <DropdownMenu trigger="Choices" testId="lite-mode-ddm">
        <DropdownItemCheckboxGroup id="cities" title="Some cities">
          <DropdownItemCheckbox
            id="sydney"
            isSelected={selected.includes('sydney')}
            onClick={() => {
              selectOption('sydney');
            }}
          >
            Sydney
          </DropdownItemCheckbox>

          <DropdownItemCheckbox
            id="melbourne"
            isSelected={selected.includes('melbourne')}
            onClick={() => {
              selectOption('melbourne');
            }}
          >
            Melbourne
          </DropdownItemCheckbox>
        </DropdownItemCheckboxGroup>
      </DropdownMenu>
    </div>
  );
};

export default DropdownMenuCheckboxStateless;
