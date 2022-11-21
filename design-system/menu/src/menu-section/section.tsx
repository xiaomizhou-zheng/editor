/** @jsx jsx */
import { forwardRef, Fragment, Ref } from 'react';

import { css, jsx } from '@emotion/react';

import { N30A } from '@atlaskit/theme/colors';
import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';
import { headingSizes } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import HeadingItem from '../menu-item/heading-item';
import type { SectionProps } from '../types';

const gridSize = gridSizeFn();
const itemHeadingTopMargin = gridSize * 2.5;
const itemHeadingBottomMargin = gridSize * 0.75;
// Skeleton content is slightly shorter than the real content.
// Because of that we slightly increase the top margin to offset this so the
// containing size both real and skeleton always equal approx 30px.
const itemHeadingContentHeight = headingSizes.h100.lineHeight;
const skeletonHeadingHeight = gridSize;
const skeletonHeadingMarginOffset = 3;
const skeletonHeadingTopMargin =
  itemHeadingTopMargin +
  (itemHeadingContentHeight - skeletonHeadingHeight) -
  skeletonHeadingMarginOffset;
// We want to move the entire body up by 3px without affecting the height of the skeleton container.
const skeletonHeadingBottomMargin =
  itemHeadingBottomMargin + skeletonHeadingMarginOffset;
const sectionPaddingTopBottom = gridSize * 0.75;
const VAR_SEPARATOR_COLOR = '--ds-menu-seperator-color';

const sectionStyles = css({
  '&::before, &::after': {
    display: 'block',
    height: sectionPaddingTopBottom,
    content: '""',
  },
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '& [data-ds--menu--heading-item]': {
    marginTop: itemHeadingTopMargin,
    marginBottom: itemHeadingBottomMargin,
    '&:first-of-type': {
      marginTop: itemHeadingTopMargin - sectionPaddingTopBottom,
    },
  },
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '& [data-ds--menu--skeleton-heading-item]': {
    marginTop: skeletonHeadingTopMargin,
    marginBottom: skeletonHeadingBottomMargin,
    '&:first-of-type': {
      marginTop: skeletonHeadingTopMargin - sectionPaddingTopBottom,
    },
  },
  '&:focus': {
    // NOTE: Firefox allows elements that have "overflow: auto" to gain focus (as if it had tab-index="0")
    // We have made a deliberate choice to leave this behaviour as is.
    // This makes the outline go inside by 1px so it can actually be displayed
    // else it gets cut off from the overflow: scroll from the parent menu group.
    outlineOffset: -1,
  },
});

const scrollableStyles = css({
  flexShrink: 1,
  overflow: 'auto',
});

const unscrollableStyles = css({
  flexShrink: 0,
});

const separatorStyles = css({
  borderTop: `2px solid var(${VAR_SEPARATOR_COLOR}, ${token(
    'color.border',
    N30A,
  )})`,
});

const noSeparatorStyles = css({
  // this is to ensure that adjacent sections without separators don't get additional margins.
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '[data-section] + &': {
    marginTop: -6,
  },
});

/**
 * __Section__
 *
 * A section includes related actions or items in a menu.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/menu/docs/section)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/menu)
 */
const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      children,
      overrides,
      title,
      testId,
      isScrollable,
      hasSeparator,
      id,
      ...rest
    }: // Type needed on props to extract types with extract react types.
    SectionProps,
    ref,
  ) => {
    const childrenMarkup =
      title !== undefined ? (
        <Fragment>
          <HeadingItem
            // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
            cssFn={
              overrides && overrides.HeadingItem && overrides.HeadingItem.cssFn
            }
            testId={testId && `${testId}--heading`}
            aria-hidden
          >
            {title}
          </HeadingItem>
          {children}
        </Fragment>
      ) : (
        children
      );

    return (
      <div
        {...rest}
        id={id}
        // NOTE: Firefox allows elements that have "overflow: auto" to gain focus (as if it had tab-index="0")
        // We have made a deliberate choice to leave this behaviour as is.
        css={[
          sectionStyles,
          isScrollable ? scrollableStyles : unscrollableStyles,
          hasSeparator ? separatorStyles : noSeparatorStyles,
        ]}
        aria-label={title}
        data-testid={testId}
        role="group"
        data-section
        ref={ref as Ref<HTMLDivElement>}
      >
        {childrenMarkup}
      </div>
    );
  },
);

export default Section;
