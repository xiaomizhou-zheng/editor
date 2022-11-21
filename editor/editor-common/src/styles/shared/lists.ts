import { css } from '@emotion/react';

import { bulletListSelector, orderedListSelector } from '@atlaskit/adf-schema';

import browser from '../../utils/browser';

export const listPaddingLeftMarkerSpace = 24;

export const listsSharedStyles = css`
  /* =============== INDENTATION SPACING ========= */

  ul,
  ol {
    box-sizing: border-box;
    padding-left: ${listPaddingLeftMarkerSpace}px;

    /*
    Firefox does not handle empty block element inside li tag.
    If there is not block element inside li tag,
      then firefox sets inherited height to li
    However, if there is any block element and if it's empty
      (or has empty inline element) then
    firefox sets li tag height to zero.
    More details at
    https://product-fabric.atlassian.net/wiki/spaces/~455502413/pages/3149365890/ED-14110+Investigation
    */
    li p:empty,
    li p > span:empty {
      ${browser.gecko ? 'display: inline-block;' : ''}
    }
  }

  ${orderedListSelector}, ${bulletListSelector} {
    /*
      Ensures list item content adheres to the list's margin instead
      of filling the entire block row. This is important to allow
      clicking interactive elements which are floated next to a list.

      For some history and context on this block, see PRs related to tickets.:
      @see ED-6551 - original issue.
      @see ED-7015 - follow up issue.
      @see ED-7447 - flow-root change.

      We use 'display: table' (old clear fix / new block formatting context hack)
      for older browsers and 'flow-root' for modern browsers.

      @see https://css-tricks.com/display-flow-root/
    */
    // For older browsers the do not support flow-root.
    /* stylelint-disable declaration-block-no-duplicate-properties */
    display: table;
    display: flow-root;
    /* stylelint-enable declaration-block-no-duplicate-properties */
  }

  /* =============== INDENTATION AESTHETICS ========= */

  /**
        We support nested lists up to six levels deep.
    **/

  /* LEGACY LISTS */

  ul,
  ul ul ul ul {
    list-style-type: disc;
  }

  ul ul,
  ul ul ul ul ul {
    list-style-type: circle;
  }

  ul ul ul,
  ul ul ul ul ul ul {
    list-style-type: square;
  }

  ol,
  ol ol ol ol {
    list-style-type: decimal;
  }
  ol ol,
  ol ol ol ol ol {
    list-style-type: lower-alpha;
  }
  ol ol ol,
  ol ol ol ol ol ol {
    list-style-type: lower-roman;
  }

  /* PREDICTABLE LISTS */

  ol[data-indent-level='1'],
  ol[data-indent-level='4'] {
    list-style-type: decimal;
  }

  ol[data-indent-level='2'],
  ol[data-indent-level='5'] {
    list-style-type: lower-alpha;
  }

  ol[data-indent-level='3'],
  ol[data-indent-level='6'] {
    list-style-type: lower-roman;
  }

  ul[data-indent-level='1'],
  ul[data-indent-level='4'] {
    list-style-type: disc;
  }

  ul[data-indent-level='2'],
  ul[data-indent-level='5'] {
    list-style-type: circle;
  }

  ul[data-indent-level='3'],
  ul[data-indent-level='6'] {
    list-style-type: square;
  }
`;
