/** @jsx jsx */
import { useEffect } from 'react';
import { css, jsx } from '@emotion/react';
import AvatarsWithPluginState from '../../collab-edit/ui/avatars-with-plugin-state';
import { EventDispatcher } from '../../../event-dispatcher';
import { EditorView } from 'prosemirror-view';
import { CollabEditOptions } from '../../collab-edit';
import { useIntl } from 'react-intl-next';
import { avatarGroupMessages } from '../messages';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
  DispatchAnalyticsEvent,
} from '../../analytics';

const toolbarButtonWrapper = css`
  display: flex;
  justify-content: flex-end;
  flex-grow: 0;
  align-items: center;
  & > div {
    margin-right: 0;
  }
`;

const toolbarButtonWrapperFullWidth = css`
  ${toolbarButtonWrapper}
  flex-grow: 1;
`;

const AvatarGroupPluginWrapper = (props: {
  collabEdit?: CollabEditOptions;
  editorView: EditorView;
  eventDispatcher: EventDispatcher<any>;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
  takeFullWidth: boolean;
}) => {
  const { dispatchAnalyticsEvent } = props;
  const intl = useIntl();

  useEffect(() => {
    if (!dispatchAnalyticsEvent) {
      return;
    }

    dispatchAnalyticsEvent({
      action: ACTION.VIEWED,
      actionSubject: ACTION_SUBJECT.BUTTON,
      actionSubjectId: ACTION_SUBJECT_ID.AVATAR_GROUP_PLUGIN,
      eventType: EVENT_TYPE.UI,
    });
  }, [dispatchAnalyticsEvent]);

  return (
    <div
      aria-label={intl.formatMessage(avatarGroupMessages.editors)}
      data-testid={'avatar-group-in-plugin'}
      css={
        props.takeFullWidth
          ? toolbarButtonWrapperFullWidth
          : toolbarButtonWrapper
      }
    >
      <AvatarsWithPluginState
        editorView={props.editorView}
        eventDispatcher={props.eventDispatcher}
        inviteToEditComponent={
          props.collabEdit && props.collabEdit.inviteToEditComponent
        }
        inviteToEditHandler={
          props.collabEdit && props.collabEdit.inviteToEditHandler
        }
        isInviteToEditButtonSelected={
          props.collabEdit && props.collabEdit.isInviteToEditButtonSelected
        }
      />
    </div>
  );
};

export default AvatarGroupPluginWrapper;
