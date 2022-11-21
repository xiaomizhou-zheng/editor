import React from 'react';

import { render } from '@testing-library/react';

import { AtlassianLogo } from '../../index';

describe('Logo component', () => {
  it('should be an svg', () => {
    const { container } = render(<AtlassianLogo />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  describe('when it is unlabelled', () => {
    it('should have a no role', () => {
      const testId = 'no-role';
      const { getByTestId } = render(
        <AtlassianLogo label="" testId={testId} />,
      );

      const wrapper = getByTestId(`${testId}--wrapper`);
      expect(wrapper).not.toHaveAttribute('role');
    });
  });

  describe('when it is labelled', () => {
    it('should have an img role', () => {
      const label = 'A test label';
      const { getByRole } = render(<AtlassianLogo label={label} />);
      expect(getByRole('img')).toBeInTheDocument();
    });

    it('should render its label', () => {
      const label = 'A test label';
      const { getByRole } = render(<AtlassianLogo label={label} />);
      expect(getByRole('img')).toHaveAttribute('aria-label', label);
    });
  });
});
