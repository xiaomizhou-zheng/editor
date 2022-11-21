/** @jsx jsx */
import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import AddIcon from '@atlaskit/icon/glyph/add';

import Tooltip from '../src';

function Example() {
  return (
    <Tooltip content="Outer tooltip">
      {(tooltipProps) => (
        <Button
          iconAfter={
            <Tooltip content="Inner tooltip" position="right">
              <AddIcon label="inner" size="small" />
            </Tooltip>
          }
          {...tooltipProps}
        >
          Hover Over Me Or My Icon
        </Button>
      )}
    </Tooltip>
  );
}

export default () => <Example />;
