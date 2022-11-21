/** @jsx jsx */
import React, { Fragment, useContext, useLayoutEffect, useRef } from 'react';
import { jsx } from '@emotion/react';
import { PureComponent } from 'react';
import { Schema, Node as PMNode } from 'prosemirror-model';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import { reduce } from '@atlaskit/adf-utils/traverse';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import {
  UnsupportedBlock,
  BaseTheme,
  WidthProvider,
  WithCreateAnalyticsEvent,
  IntlErrorBoundary,
} from '@atlaskit/editor-common/ui';

import {
  getAnalyticsAppearance,
  getAnalyticsEventSeverity,
  getResponseEndTime,
  startMeasure,
  stopMeasure,
  shouldForceTracking,
  measureTTI,
  browser,
} from '@atlaskit/editor-common/utils';

import { normalizeFeatureFlags } from '@atlaskit/editor-common/normalize-feature-flags';
import { akEditorFullPageDefaultFontSize } from '@atlaskit/editor-shared-styles';
import { FabricChannel } from '@atlaskit/analytics-listeners';
import { FabricEditorAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import uuid from 'uuid/v4';
import { ReactSerializer, renderDocument, RendererContext } from '../../';
import { rendererStyles } from './style';
import { TruncatedWrapper } from './truncated-wrapper';
import { RendererAppearance } from './types';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../../analytics/enums';
import { AnalyticsEventPayload, PLATFORM, MODE } from '../../analytics/events';
import AnalyticsContext from '../../analytics/analyticsContext';
import { Provider as SmartCardStorageProvider } from '../SmartCardStorage';
import { ReactSerializerInit } from '../../react';
import { BreakoutSSRInlineScript } from './breakout-ssr';
import {
  RendererActionsContext,
  RendererContext as ActionsContext,
} from '../RendererActionsContext';
import { ActiveHeaderIdProvider } from '../active-header-id-provider';
import { NormalizedObjectFeatureFlags, RendererProps } from '../renderer-props';
import { AnnotationsWrapper } from '../annotations';
import {
  getActiveHeadingId,
  isNestedHeaderLinksEnabled,
} from '../../react/utils/links';
import { findInTree } from '../../utils';
import { isInteractiveElement } from './click-to-edit';
import { RendererContextProvider } from '../../renderer-context';
import memoizeOne from 'memoize-one';
import { ErrorBoundary } from './ErrorBoundary';
import {
  FireAnalyticsCallback,
  RenderTracking,
} from '../../react/utils/performance/RenderTracking';

export const NORMAL_SEVERITY_THRESHOLD = 2000;
export const DEGRADED_SEVERITY_THRESHOLD = 3000;
export interface Extension<T> {
  extensionKey: string;
  parameters?: T;
  content?: any; // This would be the original Atlassian Document Format
}
const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

export type { RendererProps as Props };

export class Renderer extends PureComponent<RendererProps> {
  private providerFactory: ProviderFactory;
  private serializer: ReactSerializer;
  private rafID?: number;
  private editorRef: React.RefObject<HTMLDivElement>;
  private mouseDownSelection?: string;
  private id?: string;

  constructor(props: RendererProps) {
    super(props);
    this.providerFactory = props.dataProviders || new ProviderFactory();
    this.serializer = new ReactSerializer(this.deriveSerializerProps(props));
    this.editorRef = props.innerRef || React.createRef();
    this.id = uuid();
    startMeasure(`Renderer Render Time: ${this.id}`);

    const featureFlags = this.featureFlags(this.props.featureFlags)
      .featureFlags;

    if (featureFlags?.rendererTtiTracking) {
      measureTTI((tti, ttiFromInvocation, canceled) => {
        this.fireAnalyticsEvent({
          action: ACTION.RENDERER_TTI,
          actionSubject: ACTION_SUBJECT.RENDERER,
          attributes: { tti, ttiFromInvocation, canceled },
          eventType: EVENT_TYPE.OPERATIONAL,
        });
      });
    }
  }

  private anchorLinkAnalytics() {
    const hash =
      window.location.hash && decodeURIComponent(window.location.hash.slice(1));
    const { disableHeadingIDs } = this.props;

    if (
      !disableHeadingIDs &&
      hash &&
      this.editorRef &&
      this.editorRef.current instanceof HTMLElement
    ) {
      const anchorLinkElement = document.getElementById(hash);
      // We are not use this.editorRef.querySelector here, instead we have this.editorRef.contains
      // because querySelector might fail if there are special characters in hash, and CSS.escape is still experimental.
      if (
        anchorLinkElement &&
        this.editorRef.current.contains(anchorLinkElement)
      ) {
        this.fireAnalyticsEvent({
          action: ACTION.VIEWED,
          actionSubject: ACTION_SUBJECT.ANCHOR_LINK,
          attributes: { platform: PLATFORM.WEB, mode: MODE.RENDERER },
          eventType: EVENT_TYPE.UI,
        });
      }
    }
  }

  componentDidMount() {
    this.fireAnalyticsEvent({
      action: ACTION.STARTED,
      actionSubject: ACTION_SUBJECT.RENDERER,
      attributes: { platform: PLATFORM.WEB },
      eventType: EVENT_TYPE.UI,
    });

    this.rafID = requestAnimationFrame(() => {
      stopMeasure(`Renderer Render Time: ${this.id}`, (duration) => {
        const { analyticsEventSeverityTracking } = this.props;
        const forceSeverityTracking =
          typeof analyticsEventSeverityTracking === 'undefined' &&
          shouldForceTracking();

        const severity =
          !!forceSeverityTracking || analyticsEventSeverityTracking?.enabled
            ? getAnalyticsEventSeverity(
                duration,
                analyticsEventSeverityTracking?.severityNormalThreshold ??
                  NORMAL_SEVERITY_THRESHOLD,
                analyticsEventSeverityTracking?.severityDegradedThreshold ??
                  DEGRADED_SEVERITY_THRESHOLD,
              )
            : undefined;

        this.fireAnalyticsEvent({
          action: ACTION.RENDERED,
          actionSubject: ACTION_SUBJECT.RENDERER,
          attributes: {
            platform: PLATFORM.WEB,
            duration,
            ttfb: getResponseEndTime(),
            nodes: reduce<Record<string, number>>(
              this.props.document,
              (acc, node) => {
                acc[node.type] = (acc[node.type] || 0) + 1;
                return acc;
              },
              {},
            ),
            severity,
          },
          eventType: EVENT_TYPE.OPERATIONAL,
        });
      });
      this.anchorLinkAnalytics();
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps: RendererProps) {
    const nextMedia = nextProps.media || {};
    const media = this.props.media || {};

    if (
      nextProps.portal !== this.props.portal ||
      nextProps.appearance !== this.props.appearance ||
      nextProps.stickyHeaders !== this.props.stickyHeaders ||
      nextProps.disableActions !== this.props.disableActions ||
      nextProps.allowCustomPanels !== this.props.allowCustomPanels ||
      nextProps.allowHeadingAnchorLinks !==
        this.props.allowHeadingAnchorLinks ||
      nextMedia.allowLinking !== media.allowLinking
    ) {
      this.serializer = new ReactSerializer(
        this.deriveSerializerProps(nextProps),
      );
    }
  }

  private deriveSerializerProps(props: RendererProps): ReactSerializerInit {
    // if just passed a boolean, change shape into object to simplify type
    const stickyHeaders = props.stickyHeaders
      ? props.stickyHeaders === true
        ? {}
        : props.stickyHeaders
      : undefined;

    const { annotationProvider } = props;
    const allowAnnotationsDraftMode = Boolean(
      annotationProvider &&
        annotationProvider.inlineComment &&
        annotationProvider.inlineComment.allowDraftMode,
    );

    const { featureFlags } = this.featureFlags(props.featureFlags);

    return {
      providers: this.providerFactory,
      eventHandlers: props.eventHandlers,
      extensionHandlers: props.extensionHandlers,
      portal: props.portal,
      objectContext: {
        adDoc: props.document,
        schema: props.schema,
        ...props.rendererContext,
      } as RendererContext,
      appearance: props.appearance,
      disableHeadingIDs: props.disableHeadingIDs,
      disableActions: props.disableActions,
      allowHeadingAnchorLinks: props.allowHeadingAnchorLinks,
      allowColumnSorting: props.allowColumnSorting,
      fireAnalyticsEvent: this.fireAnalyticsEvent,
      shouldOpenMediaViewer: props.shouldOpenMediaViewer,
      allowAltTextOnImages: props.allowAltTextOnImages,
      stickyHeaders,
      allowMediaLinking: props.media && props.media.allowLinking,
      surroundTextNodesWithTextWrapper: allowAnnotationsDraftMode,
      media: props.media,
      smartLinks: props.smartLinks,
      allowCopyToClipboard: props.allowCopyToClipboard,
      allowCustomPanels: props.allowCustomPanels,
      allowAnnotations: props.allowAnnotations,
      allowSelectAllTrap: props.allowSelectAllTrap,
      allowPlaceholderText: props.allowPlaceholderText,
      nodeComponents: props.nodeComponents,
      // does not currently support SSR, should not be enabled in environments where Renderer is SSR-ed
      allowWindowedCodeBlock: featureFlags?.allowWindowedCodeBlock,
    };
  }

  private featureFlags = memoizeOne(
    (featureFlags: RendererProps['featureFlags']) => {
      const normalizedFeatureFlags = normalizeFeatureFlags<
        NormalizedObjectFeatureFlags
      >(featureFlags, {
        objectFlagKeys: ['rendererRenderTracking'],
      });
      return {
        featureFlags: normalizedFeatureFlags,
      };
    },
  );

  private fireAnalyticsEvent: FireAnalyticsCallback = (event) => {
    const { createAnalyticsEvent } = this.props;

    if (createAnalyticsEvent) {
      const channel = FabricChannel.editor;
      createAnalyticsEvent(event).fire(channel);
    }
  };

  private getSchema = memoizeOne(
    (schema?: Schema, adfStage?: 'final' | 'stage0') => {
      if (schema) {
        return schema;
      }

      return getSchemaBasedOnStage(adfStage);
    },
  );

  private onMouseDownEditView = () => {
    // When the user is deselecting text on the screen by clicking, if they are clicking outside
    // the current selection, by the time the onclick handler is called the window.getSelection()
    // value will already be cleared.
    // The mousedown callback is called before the selection is cleared.
    const windowSelection = window.getSelection();
    this.mouseDownSelection =
      windowSelection !== null ? windowSelection.toString() : undefined;
  };

  private handleMouseTripleClickInTables = (event: MouseEvent) => {
    if (browser.ios || browser.android) {
      return;
    }
    const badBrowser = browser.chrome || browser.safari;
    const tripleClick = event.detail >= 3;
    if (!(badBrowser && tripleClick)) {
      return;
    }
    const selection = window.getSelection();
    if (!selection) {
      return;
    }
    const { type, anchorNode, focusNode } = selection;
    const rangeSelection = Boolean(type === 'Range' && anchorNode && focusNode);
    if (!rangeSelection) {
      return;
    }
    const target = event.target as HTMLElement;
    const tableCell = target.closest('td,th');
    const clickedInCell = Boolean(tableCell);
    if (!clickedInCell) {
      return;
    }
    const anchorInCell = tableCell!.contains(anchorNode);
    const focusInCell = tableCell!.contains(focusNode);
    const selectionStartsOrEndsOutsideClickedCell = !(
      anchorInCell && focusInCell
    );
    if (!selectionStartsOrEndsOutsideClickedCell) {
      return;
    }
    // If selection starts or ends in a different cell than the clicked cell,
    // we select the node inside the clicked cell (or if both are in a different
    // cell, we select the cell's contents instead). We want to select the nearest
    // parent block, so that a whole line of text/content is selected (rather than
    // selecting a span that would select one specific chunk of text).
    const elementToSelect: Element | null | undefined = anchorInCell
      ? anchorNode!.parentElement?.closest('div,p')
      : focusInCell
      ? focusNode!.parentElement?.closest('div,p')
      : tableCell;
    if (elementToSelect) {
      selection.selectAllChildren(elementToSelect);
    }
  };

  render() {
    const {
      document: adfDocument,
      onComplete,
      onError,
      appearance,
      adfStage,
      truncated,
      maxHeight,
      fadeOutHeight,
      enableSsrInlineScripts,
      allowHeadingAnchorLinks,
      allowPlaceholderText,
      allowColumnSorting,
      allowCopyToClipboard,
      allowCustomPanels,
    } = this.props;

    const allowNestedHeaderLinks = isNestedHeaderLinksEnabled(
      allowHeadingAnchorLinks,
    );
    /**
     * Handle clicks inside renderer. If the click isn't on media, in the media picker, or on a
     * link, call the onUnhandledClick eventHandler (which in Jira for example, may switch the
     * renderer out for the editor).
     * @param event Click event anywhere inside renderer
     */
    const handleWrapperOnClick = (event: React.MouseEvent) => {
      const targetElement = event.target as HTMLElement;

      // ED-14862: When a user triple clicks to select a line of content inside a
      // a table cell, but the browser incorrectly moves the selection start or end into
      // a different table cell, we manually set the selection back to within the original
      // table cell the user intended to target
      this.handleMouseTripleClickInTables((event as unknown) as MouseEvent);

      if (!this.props.eventHandlers?.onUnhandledClick) {
        return;
      }
      if (!(targetElement instanceof window.Element)) {
        return;
      }

      const rendererWrapper = event.currentTarget as HTMLElement;

      // Check if the click was on an interactive element
      const isInteractiveElementInTree = findInTree(
        targetElement,
        rendererWrapper,
        isInteractiveElement,
      );
      if (isInteractiveElementInTree) {
        return;
      }

      // Ensure that selecting text in the renderer doesn't trigger onUnhandledClick
      // This logic originated in jira-frontend:
      // src/packages/issue/issue-view/src/views/field/rich-text/rich-text-inline-edit-view.js

      // The selection is required to be checked in `onMouseDown` and here. If not here, a new
      // selection isn't reported; if not in `onMouseDown`, a click outside the selection will
      // return an empty selection, which will erroneously fire onUnhandledClick.
      const windowSelection = window.getSelection();
      const selection: string | undefined =
        windowSelection !== null ? windowSelection.toString() : undefined;
      const hasSelection = selection && selection.length !== 0;

      const hasSelectionMouseDown =
        this.mouseDownSelection && this.mouseDownSelection.length !== 0;
      const allowEditBasedOnSelection = !hasSelection && !hasSelectionMouseDown;

      if (allowEditBasedOnSelection) {
        this.props.eventHandlers.onUnhandledClick(event);
      }
    };

    try {
      const schema = this.getSchema(this.props.schema, this.props.adfStage);

      const { result, stat, pmDoc } = renderDocument(
        adfDocument,
        this.serializer,
        schema,
        adfStage,
        this.props.useSpecBasedValidator,
        this.id,
        this.fireAnalyticsEvent,
        this.props.unsupportedContentLevelsTracking,
        this.props.appearance,
      );

      if (onComplete) {
        onComplete(stat);
      }

      const rendererOutput = (
        <RendererContextProvider
          value={this.featureFlags(this.props.featureFlags)}
        >
          <ActiveHeaderIdProvider
            value={getActiveHeadingId(allowHeadingAnchorLinks)}
          >
            <AnalyticsContext.Provider
              value={{
                fireAnalyticsEvent: (event: AnalyticsEventPayload) =>
                  this.fireAnalyticsEvent(event),
              }}
            >
              <SmartCardStorageProvider>
                <RendererWrapper
                  appearance={appearance}
                  allowNestedHeaderLinks={allowNestedHeaderLinks}
                  allowColumnSorting={allowColumnSorting}
                  allowCopyToClipboard={allowCopyToClipboard}
                  allowCustomPanels={allowCustomPanels}
                  allowPlaceholderText={allowPlaceholderText}
                  innerRef={this.editorRef}
                  onClick={handleWrapperOnClick}
                  onMouseDown={this.onMouseDownEditView}
                >
                  {enableSsrInlineScripts ? <BreakoutSSRInlineScript /> : null}
                  <RendererActionsInternalUpdater
                    doc={pmDoc}
                    schema={schema}
                    onAnalyticsEvent={this.fireAnalyticsEvent}
                  >
                    {result}
                  </RendererActionsInternalUpdater>
                </RendererWrapper>
              </SmartCardStorageProvider>
            </AnalyticsContext.Provider>
          </ActiveHeaderIdProvider>
        </RendererContextProvider>
      );

      let rendererResult = truncated ? (
        <TruncatedWrapper height={maxHeight} fadeHeight={fadeOutHeight}>
          {rendererOutput}
        </TruncatedWrapper>
      ) : (
        rendererOutput
      );

      const rendererRenderTracking = this.featureFlags(this.props.featureFlags)
        ?.featureFlags?.rendererRenderTracking?.[ACTION_SUBJECT.RENDERER];

      const reRenderTracking = rendererRenderTracking?.enabled && (
        <RenderTracking
          componentProps={this.props}
          action={ACTION.RE_RENDERED}
          actionSubject={ACTION_SUBJECT.RENDERER}
          handleAnalyticsEvent={this.fireAnalyticsEvent}
          useShallow={rendererRenderTracking.useShallow}
        />
      );

      return (
        <Fragment>
          {reRenderTracking}
          {rendererResult}
        </Fragment>
      );
    } catch (e) {
      if (onError) {
        onError(e);
      }
      return (
        <RendererWrapper
          appearance={appearance}
          allowCopyToClipboard={allowCopyToClipboard}
          allowPlaceholderText={allowPlaceholderText}
          allowColumnSorting={allowColumnSorting}
          allowNestedHeaderLinks={allowNestedHeaderLinks}
          onClick={handleWrapperOnClick}
        >
          <UnsupportedBlock />
        </RendererWrapper>
      );
    }
  }

  componentWillUnmount() {
    const { dataProviders } = this.props;

    if (this.rafID) {
      window.cancelAnimationFrame(this.rafID);
    }

    // if this is the ProviderFactory which was created in constructor
    // it's safe to destroy it on Renderer unmount
    if (!dataProviders) {
      this.providerFactory.destroy();
    }
  }
}

const RendererWithAnalytics = React.memo((props: RendererProps) => (
  <FabricEditorAnalyticsContext
    data={{
      appearance: getAnalyticsAppearance(props.appearance),
      packageName,
      packageVersion,
      componentName: 'renderer',
      editorSessionId: uuid(),
    }}
  >
    <WithCreateAnalyticsEvent
      render={(createAnalyticsEvent) => {
        // `IntlErrorBoundary` only captures Internationalisation errors, leaving others for `ErrorBoundary`.
        return (
          <ErrorBoundary
            component={ACTION_SUBJECT.RENDERER}
            rethrowError
            fallbackComponent={null}
            createAnalyticsEvent={createAnalyticsEvent}
          >
            <IntlErrorBoundary>
              <Renderer
                {...props}
                createAnalyticsEvent={createAnalyticsEvent}
              />
            </IntlErrorBoundary>
          </ErrorBoundary>
        );
      }}
    />
  </FabricEditorAnalyticsContext>
));

type RendererWrapperProps = {
  appearance: RendererAppearance;
  innerRef?: React.RefObject<HTMLDivElement>;
  allowColumnSorting?: boolean;
  allowCopyToClipboard?: boolean;
  allowPlaceholderText?: boolean;
  allowCustomPanels?: boolean;
  allowNestedHeaderLinks: boolean;
  onClick?: (event: React.MouseEvent) => void;
  onMouseDown?: (event: React.MouseEvent) => void;
} & { children?: React.ReactNode };

const RendererWrapper = React.memo((props: RendererWrapperProps) => {
  const {
    allowColumnSorting,
    allowNestedHeaderLinks,
    innerRef,
    appearance,
    children,
    onClick,
    onMouseDown,
  } = props;

  return (
    <WidthProvider className="ak-renderer-wrapper">
      <BaseTheme
        baseFontSize={
          appearance && appearance !== 'comment'
            ? akEditorFullPageDefaultFontSize
            : undefined
        }
      >
        <div
          ref={innerRef}
          onClick={onClick}
          onMouseDown={onMouseDown}
          css={rendererStyles({
            appearance,
            allowNestedHeaderLinks,
            allowColumnSorting: !!allowColumnSorting,
          })}
        >
          {children}
        </div>
      </BaseTheme>
    </WidthProvider>
  );
});

function RendererActionsInternalUpdater({
  children,
  doc,
  schema,
  onAnalyticsEvent,
}: {
  doc?: PMNode;
  schema: Schema;
  children: JSX.Element | null;
  onAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
}) {
  const actions = useContext(ActionsContext);
  const rendererRef = useRef(null);
  useLayoutEffect(() => {
    if (doc) {
      actions._privateRegisterRenderer(
        rendererRef,
        doc,
        schema,
        onAnalyticsEvent,
      );
    } else {
      actions._privateUnregisterRenderer();
    }

    return () => actions._privateUnregisterRenderer();
  }, [actions, schema, doc, onAnalyticsEvent]);

  return children;
}

const RendererWithAnnotationSelection = (props: RendererProps) => {
  const { allowAnnotations, document: adfDocument } = props;
  const localRef = React.useRef<HTMLDivElement>(null);
  const innerRef = props.innerRef || localRef;

  if (!allowAnnotations) {
    return <RendererWithAnalytics innerRef={innerRef} {...props} />;
  }

  return (
    <RendererActionsContext>
      <AnnotationsWrapper
        rendererRef={innerRef}
        adfDocument={adfDocument}
        annotationProvider={props.annotationProvider}
      >
        <RendererWithAnalytics innerRef={innerRef} {...props} />
      </AnnotationsWrapper>
    </RendererActionsContext>
  );
};

export default RendererWithAnnotationSelection;
