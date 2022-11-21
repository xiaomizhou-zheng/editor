import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';

import Drawer, { DrawerWidth } from '../../../src';
import { widths } from '../../../src/constants';

const DrawerWidths = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [drawerWidth, setDrawerWidth] = useState<DrawerWidth>('wide');

  return (
    <>
      <Drawer width={drawerWidth} onClose={() => setOpen(false)} isOpen={open}>
        {widths.map((width) => (
          <p>
            <Button
              isSelected={width === drawerWidth}
              onClick={() => setDrawerWidth(width)}
            >
              {width.charAt(0).toUpperCase()}
              {width.substring(1).toLowerCase()}
            </Button>
          </p>
        ))}
      </Drawer>
      <Button appearance="primary" onClick={() => setOpen(true)}>
        See drawer widths
      </Button>
    </>
  );
};

export default DrawerWidths;
