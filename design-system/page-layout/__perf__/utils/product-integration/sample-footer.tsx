/** @jsx jsx */
import React, { Fragment } from 'react';

import { css, jsx } from '@emotion/react';

import { CustomItemComponentProps } from '@atlaskit/menu';
import { Footer } from '@atlaskit/side-navigation';
import { B400, N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const Container: React.FC<CustomItemComponentProps> = (props) => {
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
  return <div {...props} />;
};

const linkStyles = css({
  color: token('color.text.subtle', N200),
  fontSize: 12,
  ':hover': {
    color: token('color.link', B400),
    cursor: 'pointer',
    textDecoration: 'none',
  },
});

// This example footer conforms to a design taken from Jira designs found at
// https://www.figma.com/file/GA22za6unqO2WsBWM0Ddxk/Jira-navigation-3?node-id=124%3A7194
const ExampleFooter = () => {
  return (
    <Footer
      component={Container}
      description={
        <Fragment>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a css={linkStyles}>Give feedback</a> {' ∙ '}
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a css={linkStyles}>Learn more</a>
        </Fragment>
      }
    >
      You're in a next-gen project
    </Footer>
  );
};

export default ExampleFooter;
