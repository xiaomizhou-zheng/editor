/** @jsx jsx */

import { css, jsx } from '@emotion/react';

import { borderRadius, codeFontFamily } from '@atlaskit/theme/constants';

import { token } from '../../../src';
import {
  getBorderForBackground,
  getBoxShadow,
  getTextColorForBackground,
} from '../../../src/utils/color-detection';
import { TransformedTokenMerged } from '../types';

const baseTokenButtonUiStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  width: '100%',
  minHeight: 24,
  padding: '2px 12px',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'none',
  borderRadius: borderRadius(),
  color: token('color.text', '#172B4D'),
  fontFamily: codeFontFamily(),
  fontSize: 12,
  lineHeight: 1,
  '&:hover, &:focus': {
    background: token('color.background.neutral.hovered', '#091E4224'),
  },
  '&:active': {
    background: token('color.background.neutral.pressed', '#091E424F'),
  },
});

const subtleStyles = css({
  background: token('color.background.neutral', '#091E420F'),
});

const ghostStyles = css({
  display: 'inline-block',
  paddingLeft: '5px',
  justifyContent: 'flex-start',
  lineHeight: '20px',
  overflowWrap: 'break-word',
  textAlign: 'left',
  '&[data-is-hovered="true"]': {
    background: token('color.background.neutral', '#091E420F'),
    '&:hover, &:focus': {
      background: token('color.background.neutral', '#091E420F'),
    },
  },
});

interface TooltipButtonRenderProps {
  isHovered?: boolean;
}

const BaseTokenButtonStyle: React.FC<
  { className?: string } & TooltipButtonRenderProps
> = (props) => {
  const { children, isHovered, className } = props;
  return (
    <span
      css={baseTokenButtonUiStyles}
      data-is-hovered={isHovered}
      className={className}
    >
      {children}
    </span>
  );
};

const Label: React.FC<
  {
    appearance?: 'subtle' | 'none';
    className?: string;
  } & TooltipButtonRenderProps
> = (props) => {
  const { children, appearance = 'none', isHovered, className } = props;

  return (
    <BaseTokenButtonStyle
      className={className}
      isHovered={isHovered}
      css={[
        appearance === 'subtle' && subtleStyles,
        appearance === 'none' && ghostStyles,
      ]}
    >
      {children}
    </BaseTokenButtonStyle>
  );
};

const Color: React.FC<Pick<TransformedTokenMerged, 'value'>> = (props) => {
  const { children, value } = props;

  return (
    <BaseTokenButtonStyle
      css={[
        {
          backgroundColor: value,
          color: getTextColorForBackground(value),
          outline: getBorderForBackground(value),

          '&:hover, &:focus': {
            backgroundColor: value,
          },

          '&:active': {
            backgroundColor: value,
          },
        },
      ]}
    >
      {children}
    </BaseTokenButtonStyle>
  );
};

const Opacity: React.FC<Pick<TransformedTokenMerged, 'value'>> = (props) => {
  const { children, value } = props;

  return (
    <BaseTokenButtonStyle
      css={[
        {
          position: 'relative',
          zIndex: 0,
          backgroundColor: token('elevation.surface', '#ffffff'),
          backgroundImage: `linear-gradient(
          45deg,
          ${token('elevation.surface.sunken', '#F4F5F7')} 25%,
          transparent 25%
        ),
        linear-gradient(
          135deg,
          ${token('elevation.surface.sunken', '#F4F5F7')} 25%,
          transparent 25%
        ),
        linear-gradient(
          45deg,
          transparent 75%,
          ${token('elevation.surface.sunken', '#F4F5F7')} 75%
        ),
        linear-gradient(
          135deg,
          transparent 75%,
          ${token('elevation.surface.sunken', '#F4F5F7')} 75%
        )`,
          backgroundPosition: '0px 0px, 8px 0px, 8px -8px, 0px 8px',
          backgroundSize: '16px 16px',
          color: token('color.text', 'black'),
          overflow: 'hidden',
        },
      ]}
    >
      {children}
      <span
        css={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: value,
          backgroundColor: token('color.text', 'black'),
        }}
      />
    </BaseTokenButtonStyle>
  );
};

const Elevation: React.FC<Pick<TransformedTokenMerged, 'value'>> = (props) => {
  const { children, value } = props;

  return (
    <BaseTokenButtonStyle
      css={[
        {
          // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
          backgroundColor: 'white',
          // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
          color: 'black',
          boxShadow: getBoxShadow(value),
          outline: `1px solid ${token('color.border', '#091E4224')}`,

          '&:hover, &:focus, &:active': {
            // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
            backgroundColor: 'white',
          },
        },
      ]}
    >
      {children}
    </BaseTokenButtonStyle>
  );
};

export { Label, Color, Opacity, Elevation };
