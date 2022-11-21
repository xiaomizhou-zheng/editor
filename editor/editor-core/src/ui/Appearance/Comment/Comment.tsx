/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/custom-theme-button';
import { borderRadius } from '@atlaskit/theme/constants';
import { N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Toolbar from '../../Toolbar';
import PluginSlot from '../../PluginSlot';
import WithPluginState from '../../WithPluginState';

import {
  EditorAppearanceComponentProps,
  EditorAppearance,
} from '../../../types';
import {
  pluginKey as maxContentSizePluginKey,
  MaxContentSizePluginState,
} from '../../../plugins/max-content-size';
import { stateKey as mediaPluginKey } from '../../../plugins/media/pm-plugins/plugin-key';
import { ClickAreaBlock } from '../../Addon';
import { tableCommentEditorStyles } from '@atlaskit/editor-plugin-table/ui/common-styles';
import WithFlash from '../../WithFlash';
import { WidthConsumer } from '@atlaskit/editor-common/ui';
import { akEditorMobileBreakoutPoint } from '@atlaskit/editor-shared-styles';
import WidthEmitter from '../../WidthEmitter';
import { GRID_GUTTER } from '../../../plugins/grid';
import classnames from 'classnames';
import { WrappedComponentProps, injectIntl } from 'react-intl-next';
import messages from '../../../messages';
import { MediaPluginState } from '../../../plugins/media/pm-plugins/types';

import {
  TableControlsPadding,
  MainToolbar,
  mainToolbarCustomComponentsSlotStyle,
} from './Toolbar';
import { createEditorContentStyle } from '../../ContentStyles';

export interface CommentEditorProps {
  isMaxContentSizeReached?: boolean;
  maxHeight?: number;
  minHeight?: number;
}
const CommentEditorMargin = 14;
const CommentEditorSmallerMargin = 8;

const commentEditorStyle = css`
  display: flex;
  flex-direction: column;

  .less-margin .ProseMirror {
    margin: 12px ${CommentEditorSmallerMargin}px ${CommentEditorSmallerMargin}px;
  }

  min-width: 272px;
  /* Border + Toolbar + Footer + (Paragraph + ((Paragraph + Margin) * (DefaultLines - 1)) */
  /* calc(2px + 40px + 24px + ( 20px + (32px * 2))) */

  height: auto;
  background-color: ${token('color.background.input', 'white')};
  border: 1px solid ${token('color.border', N40)};
  box-sizing: border-box;
  border-radius: ${borderRadius()}px;

  max-width: inherit;
  word-wrap: break-word;
`;

const ContentArea = createEditorContentStyle(css`
  flex-grow: 1;
  overflow-x: hidden;
  overflow-y: auto;
  line-height: 24px;

  /** Hack for Bitbucket to ensure entire editorView gets drop event; see ED-3294 **/
  /** Hack for table controls. Otherwise margin collapse and controls are misplaced. **/
  .ProseMirror {
    margin: 12px ${CommentEditorMargin}px ${CommentEditorMargin}px;
  }

  .gridParent {
    margin-left: ${CommentEditorMargin - GRID_GUTTER}px;
    margin-right: ${CommentEditorMargin - GRID_GUTTER}px;
    width: calc(100% + ${CommentEditorMargin - GRID_GUTTER}px);
  }

  padding: ${TableControlsPadding}px;

  ${tableCommentEditorStyles};
`);
ContentArea.displayName = 'ContentArea';

const secondaryToolbarStyle = css`
  box-sizing: border-box;
  justify-content: flex-end;
  align-items: center;
  display: flex;
  padding: 12px 1px;
`;

export interface EditorAppearanceComponentState {}

class Editor extends React.Component<
  EditorAppearanceComponentProps & WrappedComponentProps,
  EditorAppearanceComponentState
> {
  static displayName = 'CommentEditorAppearance';

  private appearance: EditorAppearance = 'comment';
  private containerElement: HTMLElement | null = null;

  // Wrapper container for toolbar and content area
  private wrapperElementRef = React.createRef<HTMLDivElement>();

  constructor(props: any) {
    super(props);
    if (props.innerRef) {
      this.wrapperElementRef = props.innerRef;
    }
  }

  private handleSave = () => {
    if (this.props.editorView && this.props.onSave) {
      this.props.onSave(this.props.editorView);
    }
  };

  private handleCancel = () => {
    if (this.props.editorView && this.props.onCancel) {
      this.props.onCancel(this.props.editorView);
    }
  };

  private renderChrome = ({
    maxContentSize,
    mediaState,
  }: {
    maxContentSize?: MaxContentSizePluginState;
    mediaState?: MediaPluginState;
  }) => {
    const {
      editorDOMElement,
      editorView,
      editorActions,
      eventDispatcher,
      providerFactory,
      contentComponents,
      customContentComponents,
      customPrimaryToolbarComponents,
      primaryToolbarComponents,
      customSecondaryToolbarComponents,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      maxHeight,
      minHeight = 150,
      onSave,
      onCancel,
      disabled,
      dispatchAnalyticsEvent,
      intl,
      useStickyToolbar,
    } = this.props;
    const maxContentSizeReached = Boolean(
      maxContentSize?.maxContentSizeReached,
    );
    const showSecondaryToolbar =
      !!onSave || !!onCancel || !!customSecondaryToolbarComponents;
    return (
      <WithFlash animate={maxContentSizeReached}>
        <div
          css={[
            commentEditorStyle,
            css`
              min-height: ${minHeight}px;
            `,
          ]}
          className="akEditor"
          ref={this.wrapperElementRef}
        >
          <MainToolbar useStickyToolbar={useStickyToolbar}>
            <Toolbar
              editorView={editorView!}
              editorActions={editorActions}
              eventDispatcher={eventDispatcher!}
              providerFactory={providerFactory!}
              appearance={this.appearance}
              items={primaryToolbarComponents}
              popupsMountPoint={popupsMountPoint}
              popupsBoundariesElement={popupsBoundariesElement}
              popupsScrollableElement={popupsScrollableElement}
              disabled={!!disabled}
              dispatchAnalyticsEvent={dispatchAnalyticsEvent}
              containerElement={this.containerElement}
            />
            <div css={mainToolbarCustomComponentsSlotStyle}>
              {customPrimaryToolbarComponents}
            </div>
          </MainToolbar>
          <ClickAreaBlock editorView={editorView} editorDisabled={disabled}>
            <WidthConsumer>
              {({ width }) => {
                return (
                  <ContentArea
                    ref={(ref) => (this.containerElement = ref)}
                    css={
                      maxHeight
                        ? css`
                            max-height: ${maxHeight}px;
                          `
                        : null
                    }
                    className={classnames('ak-editor-content-area', {
                      'less-margin': width < akEditorMobileBreakoutPoint,
                    })}
                  >
                    {customContentComponents}
                    <PluginSlot
                      editorView={editorView}
                      editorActions={editorActions}
                      eventDispatcher={eventDispatcher}
                      dispatchAnalyticsEvent={dispatchAnalyticsEvent}
                      providerFactory={providerFactory}
                      appearance={this.appearance}
                      items={contentComponents}
                      popupsMountPoint={popupsMountPoint}
                      popupsBoundariesElement={popupsBoundariesElement}
                      popupsScrollableElement={popupsScrollableElement}
                      containerElement={this.containerElement}
                      disabled={!!disabled}
                      wrapperElement={this.wrapperElementRef.current}
                    />
                    {editorDOMElement}
                  </ContentArea>
                );
              }}
            </WidthConsumer>
          </ClickAreaBlock>
          <WidthEmitter editorView={editorView!} />
        </div>
        {showSecondaryToolbar && (
          <div
            css={secondaryToolbarStyle}
            data-testid="ak-editor-secondary-toolbar"
          >
            <ButtonGroup>
              {!!onSave && (
                <Button
                  appearance="primary"
                  onClick={this.handleSave}
                  testId="comment-save-button"
                  isDisabled={
                    disabled || (mediaState && !mediaState.allUploadsFinished)
                  }
                >
                  {intl.formatMessage(messages.saveButton)}
                </Button>
              )}
              {!!onCancel && (
                <Button
                  appearance="subtle"
                  onClick={this.handleCancel}
                  isDisabled={disabled}
                >
                  {intl.formatMessage(messages.cancelButton)}
                </Button>
              )}
            </ButtonGroup>
            <span style={{ flexGrow: 1 }} />
            {customSecondaryToolbarComponents}
          </div>
        )}
      </WithFlash>
    );
  };

  render() {
    return (
      <WithPluginState
        plugins={{
          maxContentSize: maxContentSizePluginKey,
          mediaState: mediaPluginKey,
        }}
        render={this.renderChrome}
      />
    );
  }
}

export const CommentEditorWithIntl = injectIntl(Editor);
