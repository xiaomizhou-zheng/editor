/**  @jsx jsx */
import { ChangeEvent, useState } from 'react';

import { css, jsx } from '@emotion/react';

import { Checkbox } from '../../src';

interface CheckedItems {
  [value: string]: boolean;
}

const checkboxGroupStyles = css({
  display: 'flex',
  paddingLeft: '24px',
  flexDirection: 'column',
});

const PARENT_ID: string = 'All projects';
const CHILD_1_ID: string = 'Design System';
const CHILD_2_ID: string = 'Jira Software';
const CHILD_3_ID: string = 'Confluence';

const getCheckedChildrenCount = (checkedItems: CheckedItems) => {
  const childItems = Object.keys(checkedItems).filter((i) => i !== PARENT_ID);
  return childItems.reduce(
    (count, i) => (checkedItems[i] ? count + 1 : count),
    0,
  );
};

const getIsParentIndeterminate = (checkedItems: CheckedItems) => {
  const checkedChildrenCount = getCheckedChildrenCount(checkedItems);
  return checkedChildrenCount > 0 && checkedChildrenCount < 3;
};

const IndeterminateCheckboxExample = () => {
  const initialCheckedItems: Record<string, boolean> = {
    [PARENT_ID]: false,
    [CHILD_1_ID]: false,
    [CHILD_2_ID]: false,
    [CHILD_3_ID]: false,
  };
  const [checkedItems, setCheckedItems] = useState(initialCheckedItems);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const itemValue = event.target.value;

    if (itemValue === PARENT_ID) {
      const newCheckedState = !checkedItems[PARENT_ID];
      // Set all items to the checked state of the parent
      setCheckedItems(
        Object.keys(checkedItems).reduce(
          (items, i) => ({ ...items, [i]: newCheckedState }),
          {},
        ),
      );
    } else {
      const newCheckedItems = {
        ...checkedItems,
        [itemValue]: !checkedItems[itemValue],
      };

      setCheckedItems({
        // If all children would be unchecked, also uncheck the parent
        ...newCheckedItems,
        [PARENT_ID]: getCheckedChildrenCount(newCheckedItems) > 0,
      });
    }
  };

  return (
    <div>
      <Checkbox
        isChecked={checkedItems[PARENT_ID]}
        isIndeterminate={getIsParentIndeterminate(checkedItems)}
        onChange={onChange}
        label="All projects"
        value={PARENT_ID}
        name="parent"
      />
      <div css={checkboxGroupStyles}>
        <Checkbox
          isChecked={checkedItems[CHILD_1_ID]}
          onChange={onChange}
          label="Design System"
          value={CHILD_1_ID}
          name="child-1"
        />
        <Checkbox
          isChecked={checkedItems[CHILD_2_ID]}
          onChange={onChange}
          label="Jira Software"
          value={CHILD_2_ID}
          name="child-1"
        />
        <Checkbox
          isChecked={checkedItems[CHILD_3_ID]}
          onChange={onChange}
          label="Confluence"
          value={CHILD_3_ID}
          name="child-3"
          testId="child-3"
        />
      </div>
    </div>
  );
};

export default IndeterminateCheckboxExample;
