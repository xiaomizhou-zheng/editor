import React from 'react';

import Icon from '@atlaskit/icon';

const Logo = (props: any) => {
  return (
    // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
    <svg {...props} width="24" height="24" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M12.0054 2.10605C12.2479 1.96492 12.5474 1.96463 12.7901 2.10529L20.4073 6.51936C20.6484 6.65908 20.7969 6.91665 20.7969 7.19531V15.9909C20.7969 16.2703 20.6477 16.5284 20.4056 16.6678L12.7868 21.0567C12.5457 21.1956 12.249 21.1958 12.0077 21.0572L4.39214 16.683C4.14957 16.5437 4 16.2853 4 16.0055V7.21484C4 6.93671 4.14787 6.67955 4.38825 6.53964L12.0054 2.10605ZM9.58393 5.32339L6.35243 7.20429L12.3831 10.674L18.433 7.18113L15.23 5.32505L12.4176 6.95693L9.58393 5.32339ZM5.5625 12.54V8.55246L11.5781 12.0135V19.0085L8.31792 17.136V14.1374L5.5625 12.54ZM16.4609 17.137L13.1406 19.0496V12.0409L19.2344 8.52267V12.4602L16.4609 14.0673V17.137Z"
        fill="currentColor"
      />
    </svg>
  );
};

const CodeSandboxIcon = () => {
  return <Icon glyph={Logo} label="Open" />;
};

export default CodeSandboxIcon;
