/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import {
  getFreeToUseAvatarImage,
  RANDOM_USERS,
} from '../../examples-util/data';
import AvatarGroup from '../../src';

const AvatarGroupBorderColorExample = () => {
  const data = RANDOM_USERS.map((d, i) => ({
    email: d.email,
    key: d.email,
    name: d.name,
    href: '#',
    src: getFreeToUseAvatarImage(i),
  }));

  return <AvatarGroup data={data} borderColor="#FF6347" />;
};

export default AvatarGroupBorderColorExample;
