/** @jsx jsx */
import React, { useState } from 'react';

import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/custom-theme-button';

export const Centered = ({
  as: As = 'div',
  ...props
}: React.HTMLProps<HTMLDivElement> & { as?: string }) => (
  <As
    css={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
    {...props}
  />
);

export const RetryContainer = (props: { children: React.ReactNode }) => {
  const [count, setCount] = useState(0);
  const increment = () => setCount((prev) => prev + 1);

  return (
    <div key={count}>
      {props.children}

      <Centered>
        <Button appearance="primary" onClick={increment}>
          Re-enter
        </Button>
      </Centered>
    </div>
  );
};
