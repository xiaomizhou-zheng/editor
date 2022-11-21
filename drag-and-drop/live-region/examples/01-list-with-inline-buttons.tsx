/* eslint-disable @atlassian/tangerine/import/no-relative-package-imports */
/** @jsx jsx */

import { useCallback, useReducer } from 'react';

import { css, jsx } from '@emotion/react';

import Button, { ButtonGroup } from '@atlaskit/button';
import ArrowDownIcon from '@atlaskit/icon/glyph/arrow-down';
import ArrowUpIcon from '@atlaskit/icon/glyph/arrow-up';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { announce } from '../src';

type ItemData = { id: string; label: string };

type Action = { type: 'MOVE_UP' | 'MOVE_DOWN'; id: string };

const defaultItems: ItemData[] = [
  { id: 'item-a', label: 'Item A' },
  { id: 'item-b', label: 'Item B' },
  { id: 'item-c', label: 'Item C' },
];

const listItemStyles = css({
  display: 'flex',
  maxWidth: 240,
  padding: 8,
  alignItems: 'center',
  background: token('elevation.surface.raised', '#FFF'),
  borderRadius: 3,
  boxShadow: token(
    'elevation.shadow.raised',
    'rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.31) 0px 0px 1px',
  ),
});

const ListItem = ({
  children,
  id,
  isFirst,
  isLast,
  dispatch,
}: {
  children: string;
  id: string;
  isFirst: boolean;
  isLast: boolean;
  dispatch: React.Dispatch<Action>;
}) => {
  const moveUp = useCallback(() => {
    dispatch({ type: 'MOVE_UP', id });
  }, [dispatch, id]);

  const moveDown = useCallback(() => {
    dispatch({ type: 'MOVE_DOWN', id });
  }, [dispatch, id]);

  return (
    <li css={listItemStyles}>
      <strong style={{ flex: 1, padding: '0 8px' }}>{children}</strong>
      <ButtonGroup>
        <Tooltip content={`Move ${children} up`}>
          {tooltipProps => (
            <Button
              {...tooltipProps}
              onClick={moveUp}
              iconBefore={<ArrowUpIcon label="" />}
              aria-disabled={isFirst}
            />
          )}
        </Tooltip>
        <Tooltip content={`Move ${children} down`}>
          {tooltipProps => (
            <Button
              {...tooltipProps}
              onClick={moveDown}
              iconBefore={<ArrowDownIcon label="" />}
              aria-disabled={isLast}
            />
          )}
        </Tooltip>
      </ButtonGroup>
    </li>
  );
};

const reducer: React.Reducer<ItemData[], Action> = (state, action) => {
  const index = state.findIndex(item => item.id === action.id);
  const item = state[index];

  let nextState = [...state];
  switch (action.type) {
    case 'MOVE_UP':
      if (index === 0) {
        return state;
      }
      nextState.splice(index, 1);
      nextState.splice(index - 1, 0, item);
      announce(`${item.label} moved to position ${index} of ${state.length}`);
      return nextState;

    case 'MOVE_DOWN':
      if (index === state.length - 1) {
        return state;
      }
      nextState.splice(index, 1);
      nextState.splice(index + 1, 0, item);
      announce(
        `${item.label} moved to position ${index + 2} of ${state.length}`,
      );
      return nextState;
  }
};

export default function App() {
  const [items, dispatch] = useReducer(reducer, defaultItems);

  return (
    <div>
      <ul style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
        {items.map(({ id, label }, index) => (
          <ListItem
            key={id}
            id={id}
            dispatch={dispatch}
            isFirst={index === 0}
            isLast={index === items.length - 1}
          >
            {label}
          </ListItem>
        ))}
      </ul>
    </div>
  );
}
