/** @jsx jsx */
import React, { useMemo, useCallback, MouseEvent } from 'react';
import { css, jsx } from '@emotion/react';

import { AnnotationSharedCSSByState } from '@atlaskit/editor-common/styles';
import type { OnAnnotationClickPayload } from '@atlaskit/editor-common/types';
import {
  AnnotationMarkStates,
  AnnotationId,
  AnnotationDataAttributes,
} from '@atlaskit/adf-schema';
import { ThemeProps } from '@atlaskit/theme/types';

const markStyles = (props: ThemeProps) => css`
  color: inherit;
  background-color: unset;
  -webkit-tap-highlight-color: transparent;

  &[data-mark-annotation-state='${AnnotationMarkStates.ACTIVE}'] {
    ${AnnotationSharedCSSByState({ theme: props }).blur};

    &:focus,
    &[data-has-focus='true'] {
      ${AnnotationSharedCSSByState({ theme: props }).focus};
    }
  }
`;

type MarkComponentProps = {
  id: AnnotationId;
  annotationParentIds: AnnotationId[];
  dataAttributes: AnnotationDataAttributes;
  state: AnnotationMarkStates | null;
  hasFocus: boolean;
  onClick: (props: OnAnnotationClickPayload) => void;
};
export const MarkComponent: React.FC<MarkComponentProps> = ({
  annotationParentIds,
  children,
  dataAttributes,
  id,
  state,
  hasFocus,
  onClick,
}) => {
  const annotationIds = useMemo(
    () => [...new Set([...annotationParentIds, id])],
    [id, annotationParentIds],
  );
  const onMarkClick = useCallback(
    (event: MouseEvent) => {
      // prevents multiple callback on overlapping annotations
      if (event.defaultPrevented || state !== AnnotationMarkStates.ACTIVE) {
        return;
      }

      // prevents from opening link URL inside webView in Safari
      event.preventDefault();

      onClick({ eventTarget: event.target as HTMLElement, annotationIds });
    },
    [annotationIds, onClick, state],
  );

  const overriddenData = !state
    ? dataAttributes
    : {
        ...dataAttributes,
        'data-mark-annotation-state': state,
        'data-has-focus': hasFocus,
      };
  const accessibility =
    state !== AnnotationMarkStates.ACTIVE
      ? { 'aria-disabled': true }
      : {
          'aria-details': annotationIds.join(', '),
        };

  return (
    <mark
      id={id}
      onClick={onMarkClick}
      {...accessibility}
      {...overriddenData}
      css={markStyles}
    >
      {children}
    </mark>
  );
};
