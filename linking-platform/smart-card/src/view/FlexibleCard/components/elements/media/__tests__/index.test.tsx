/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';
import { css } from '@emotion/react';
import { render } from '@testing-library/react';

import Media from '../index';
import { MediaType } from '../../../../../../constants';

jest.mock('react-render-image', () => ({ src, errored, onError }: any) => {
  switch (src) {
    case 'src-error':
      if (onError) {
        onError();
      }
      return errored;
    case 'src-loaded':
    default:
      return <img data-testid="smart-element-media-image" src="src-loaded" />;
  }
});

describe('Element: Media', () => {
  const testId = 'smart-element-media';

  it('renders element', async () => {
    const { findByTestId } = render(
      <Media type={MediaType.Image} url="src-loaded" />,
    );

    const element = await findByTestId(testId);
    const image = await findByTestId(`${testId}-image`);

    expect(element).toBeTruthy();
    expect(element.getAttribute('data-smart-element-media')).toBeTruthy();
    expect(image).toBeTruthy();
  });

  it('does not render element when neither type nor url is provided', async () => {
    const { container } = render(<Media />);
    expect(container.children.length).toBe(0);
  });

  it('does not render element when type is not provided', async () => {
    const { container } = render(<Media url="src-loaded" />);
    expect(container.children.length).toBe(0);
  });

  it('does not render element when url is not provided', async () => {
    const { container } = render(<Media type={MediaType.Image} />);
    expect(container.children.length).toBe(0);
  });

  it('renders with override css', async () => {
    const overrideCss = css`
      background-color: blue;
    `;
    const { findByTestId } = render(
      <Media
        overrideCss={overrideCss}
        type={MediaType.Image}
        url="src-loaded"
      />,
    );

    const element = await findByTestId(testId);

    expect(element).toHaveStyleDeclaration('background-color', 'blue');
  });

  describe('Image', () => {
    it('renders nothing on error', async () => {
      const { findByTestId, queryByTestId } = render(
        <Media type={MediaType.Image} url="src-error" />,
      );
      await findByTestId(testId);

      expect(queryByTestId(`${testId}-image`)).toBeNull();
    });
  });
});
