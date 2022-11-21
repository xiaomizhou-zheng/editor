/** @jsx jsx */
import { useState } from 'react';

import { css, jsx } from '@emotion/react';

import Select, { ValueType } from '@atlaskit/select';
import Tag from '@atlaskit/tag';
import Group from '@atlaskit/tag-group';
import {
  fontSize as getFontSize,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';

import InlineEdit from '../../src';

const fontSize = getFontSize();
const gridSize = getGridSize();

const readViewContainerStyles = css({
  display: 'flex',
  maxWidth: '100%',
  height: `${(gridSize * 2.5) / fontSize}em`,
  padding: `${gridSize}px ${gridSize - 2}px`,
  fontSize: `${fontSize}px`,
  lineHeight: `${(gridSize * 2.5) / fontSize}`,
});

const editViewContainerStyles = css({
  position: 'relative',
  zIndex: 300,
});

interface OptionType {
  label: string;
  value: string;
}

const selectOptions = [
  { label: 'CSS', value: 'CSS' },
  { label: 'Design', value: 'Design' },
  { label: 'HTML', value: 'HTML' },
  { label: 'Javascript', value: 'Javascript' },
  { label: 'User Experience', value: 'User Experience' },
  { label: 'User Research', value: 'User Research' },
];

const InlineEditCustomSelectExample = () => {
  const [editValue, setEditValue] = useState<ValueType<OptionType, true>>([]);

  const onConfirm = (value: ValueType<OptionType, true>) => {
    if (!value) {
      return;
    }

    setEditValue(value);
  };

  return (
    <div
      style={{
        padding: `${gridSize}px ${gridSize}px ${gridSize * 6}px`,
      }}
    >
      <InlineEdit<ValueType<OptionType, true>>
        defaultValue={editValue}
        label="Skills required"
        editView={(fieldProps) => (
          <div css={editViewContainerStyles}>
            <Select
              {...fieldProps}
              options={selectOptions}
              isMulti
              autoFocus
              openMenuOnFocus
            />
          </div>
        )}
        readView={() =>
          editValue && editValue.length === 0 ? (
            <div css={readViewContainerStyles}>Click to select options</div>
          ) : (
            <div style={{ padding: `${gridSize / 2}px` }}>
              <Group>
                {editValue &&
                  editValue.map((option: OptionType) => (
                    <Tag text={option.label} key={option.label} />
                  ))}
              </Group>
            </div>
          )
        }
        onConfirm={onConfirm}
      />
    </div>
  );
};

export default InlineEditCustomSelectExample;
