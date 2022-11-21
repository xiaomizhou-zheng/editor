import React from 'react';

import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';

import Button from '../../src';

const ButtonIconAfterExample = () => {
  return (
    <Button
      iconAfter={<StarFilledIcon label="" size="medium" />}
      appearance="primary"
    >
      Icon after
    </Button>
  );
};

export default ButtonIconAfterExample;
