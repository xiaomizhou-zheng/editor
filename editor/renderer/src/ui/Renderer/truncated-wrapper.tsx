/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { Component } from 'react';
import { token } from '@atlaskit/tokens';

export interface TruncatedWrapperProps {
  height?: number;
  fadeHeight?: number;
  backgroundColor?: string;
}

interface FadeOutProps {
  height: number;
  fadeHeight: number;
  backgroundColor: string;
}

const fadeOutStyles = (
  maxHeight: number,
  top: number,
  backgroundColor: string,
) => css`
  position: relative;
  overflow-y: hidden;
  max-height: ${maxHeight}px;
  &::after {
    content: '';
    position: absolute;
    top: ${top}px;
    bottom: 0;
    left: 0;
    right: 0;
    background-image: linear-gradient(
      ${token('color.background.neutral.subtle', 'rgba(255, 255, 255, 0)')},
      ${backgroundColor}
    );
  }
`;

const FadeOut: React.FC<FadeOutProps> = (props) => {
  const { children, backgroundColor, fadeHeight, height } = props;
  const top = height - fadeHeight;
  const styles = fadeOutStyles(height, top, backgroundColor);
  return <div css={styles}>{children}</div>;
};

export class TruncatedWrapper extends Component<TruncatedWrapperProps, {}> {
  constructor(props: TruncatedWrapperProps) {
    super(props);
  }

  // TODO: Quality ticket as elevation.surface will be issue when sits top of modal. https://product-fabric.atlassian.net/browse/DSP-4123
  render() {
    const {
      height = 95,
      fadeHeight = 24,
      backgroundColor = token('elevation.surface', 'white'),
      children,
    } = this.props;
    return (
      <FadeOut
        height={height}
        fadeHeight={fadeHeight}
        backgroundColor={backgroundColor}
      >
        {children}
      </FadeOut>
    );
  }
}
