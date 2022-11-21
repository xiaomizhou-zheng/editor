/** @jsx jsx */

import type { CSSProperties } from 'react';

import { css, jsx, SerializedStyles } from '@emotion/react';

import type { Edge } from '@atlaskit/drag-and-drop-hitbox/types';

import { line } from './internal/constants';

export type DropIndicatorProps = {
  /**
   * The `edge` to draw a drop indicator on.
   *
   * `edge` is required as for the best possible performance
   * outcome you should only render this component when it needs to do something
   *
   * @example {closestEdge && <DropIndicator edge={closestEdge} />}
   */
  edge: Edge;
  /**
   * `gap` allows you to position the drop indicator further away from the drop target.
   * `gap` should be the distance between your drop targets
   * a drop indicator will be rendered halfway between the drop targets
   * (the drop indicator will be offset by half of the `gap`)
   *
   * `gap` should be a valid CSS length.
   * @example "8px"
   * @example "var(--gap)"
   */
  gap?: string;
};

const lineStyles = css({
  display: 'block',
  position: 'absolute',
  zIndex: 1,
  background: line.backgroundColor,
  content: '""',
  opacity: 0,
  pointerEvents: 'none',
});

const edgeStyles: Record<Edge, SerializedStyles> = {
  top: css({
    height: line.thickness,
    top: 'var(--local-line-offset)',
    right: 0,
    left: 0,
    opacity: 1,
  }),
  right: css({
    width: line.thickness,
    top: 0,
    right: 'var(--local-line-offset)',
    bottom: 0,
    opacity: 1,
  }),
  bottom: css({
    height: line.thickness,
    right: 0,
    bottom: 'var(--local-line-offset)',
    left: 0,
    opacity: 1,
  }),
  left: css({
    width: line.thickness,
    top: 0,
    bottom: 0,
    left: 'var(--local-line-offset)',
    opacity: 1,
  }),
};

/**
 * __Drop indicator__
 *
 * A drop indicator is used to communicate the intended resting place of the draggable item. The orientation of the drop indicator should always match the direction of the content flow.
 */
export function DropIndicator({ edge, gap = '0px' }: DropIndicatorProps) {
  /**
   * To clearly communicate the resting place of a draggable item during a drag operation,
   * the drop indicator should be positioned half way between draggable items.
   */
  const lineOffset = `calc(-0.5 * (${gap} + ${line.thickness}px))`;

  return (
    <div
      css={[lineStyles, edge && edgeStyles[edge]]}
      style={{ '--local-line-offset': lineOffset } as CSSProperties}
    />
  );
}

// This default export is intended for usage with React.lazy
export default DropIndicator;
