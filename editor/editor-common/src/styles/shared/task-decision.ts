import { css } from '@emotion/react';

import { akEditorTableCellMinWidth } from '@atlaskit/editor-shared-styles';

export const TaskDecisionSharedCssClassName = {
  DECISION_CONTAINER: 'decisionItemView-content-wrap',
};

export const tasksAndDecisionsStyles = css`
  .ProseMirror {
    .taskItemView-content-wrap,
    .${TaskDecisionSharedCssClassName.DECISION_CONTAINER} {
      position: relative;
      min-width: ${akEditorTableCellMinWidth}px;
    }

    .${TaskDecisionSharedCssClassName.DECISION_CONTAINER} {
      margin-top: 0;
    }
  }

  div[data-task-list-local-id] {
    margin: 12px 0 0 0;
  }

  // If task list is first in the document then set margin top to zero.
  div[data-task-list-local-id]:first-child,
  style:first-child + div[data-task-list-local-id] {
    margin-top: 0;
  }

  div[data-task-list-local-id] div[data-task-list-local-id] {
    margin-top: 0px;
    margin-left: 24px;
  }
`;
