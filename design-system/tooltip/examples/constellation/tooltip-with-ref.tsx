import React, { Ref, useEffect } from 'react';

import Button from '@atlaskit/button/standard-button';
import { token } from '@atlaskit/tokens';

import Tooltip from '../../src';

const CustomizedTagWithRef = React.forwardRef((props, ref: Ref<any>) => {
  const { children, ...rest } = props;
  return (
    <div
      {...rest}
      ref={ref}
      style={{
        display: 'inline-block',
        background: token('color.background.warning.bold', 'orange'),
        color: token('color.text.warning.inverse', '#000000'),
      }}
    >
      {children}
    </div>
  );
});

const CustomizedTagExample = () => {
  const ref = React.createRef();

  useEffect(() => {
    if (ref.current) {
      console.log(ref.current);
    }
  });

  return (
    <Tooltip content="Hello world" tag={CustomizedTagWithRef}>
      {(tooltipProps) => <Button {...tooltipProps}>Hover over me</Button>}
    </Tooltip>
  );
};

export default CustomizedTagExample;
