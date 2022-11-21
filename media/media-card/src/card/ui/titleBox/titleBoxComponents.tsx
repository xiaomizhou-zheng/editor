/** @jsx jsx */
import { jsx } from '@emotion/react';

import {
  errorMessageWrapperStyles,
  titleBoxFooterStyles,
  titleBoxHeaderStyles,
  titleBoxIconStyles,
  titleBoxWrapperStyles,
} from './styles';
import {
  TitleBoxFooterProps,
  TitleBoxHeaderProps,
  TitleBoxWrapperProps,
} from './types';

export const TitleBoxWrapper = (props: TitleBoxWrapperProps) => {
  const { breakpoint, titleBoxBgColor } = props;

  return (
    <div
      id="titleBoxWrapper"
      css={titleBoxWrapperStyles({
        breakpoint: breakpoint,
        titleBoxBgColor: titleBoxBgColor,
      })}
    >
      {props.children}
    </div>
  );
};

export const TitleBoxHeader = (props: TitleBoxHeaderProps) => {
  const { hasIconOverlap } = props;
  return (
    <div id="titleBoxHeader" css={titleBoxHeaderStyles({ hasIconOverlap })}>
      {props.children}
    </div>
  );
};

export const TitleBoxFooter = (props: TitleBoxFooterProps) => {
  const { hasIconOverlap } = props;
  return (
    <div id="titleBoxFooter" css={titleBoxFooterStyles({ hasIconOverlap })}>
      {props.children}
    </div>
  );
};

export const TitleBoxIcon = (props: any) => {
  return (
    <div id="titleBoxIcon" css={titleBoxIconStyles}>
      {props.children}
    </div>
  );
};

export const ErrorMessageWrapper = (props: any) => {
  return <div css={errorMessageWrapperStyles}>{props.children}</div>;
};
