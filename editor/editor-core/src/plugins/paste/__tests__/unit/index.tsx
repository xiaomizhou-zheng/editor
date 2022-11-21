import React from 'react';
import { mount } from 'enzyme';
import { replaceRaf } from 'raf-stub';

import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';
import {
  Preset,
  LightEditorPlugin,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import {
  macroProvider,
  MockMacroProvider,
} from '@atlaskit/editor-test-helpers/mock-macro-provider';
import { CardProvider } from '@atlaskit/editor-common/provider-factory';

import {
  code_block,
  strong,
  em,
  doc,
  blockquote,
  p,
  h1,
  code,
  emoji,
  mention,
  media,
  mediaSingle,
  panel,
  extension,
  bodiedExtension,
  inlineExtension,
  a as link,
  ol,
  ul,
  li,
  taskList,
  taskItem,
  decisionList,
  decisionItem,
  table,
  tr,
  th,
  td,
  tdCursor,
  hardBreak,
  a,
  inlineCard,
  annotation,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  createFakeExtensionManifest,
  createFakeAutoConvertModule,
} from '@atlaskit/editor-test-helpers/extensions';

import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import {
  DefaultExtensionProvider,
  combineExtensionProviders,
} from '@atlaskit/editor-common/extensions';
import type { ExtensionProvider } from '@atlaskit/editor-common/extensions';
import { MediaSingle } from '@atlaskit/editor-common/ui';
import { CardOptions } from '@atlaskit/editor-common/card';
import { EmojiProvider } from '@atlaskit/emoji';
import { getEmojiResourceWithStandardAndAtlassianEmojis } from '@atlaskit/util-data-test/get-emoji-resource-standard-atlassian';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';

import { TextSelection, Transaction } from 'prosemirror-state';
import { uuid, AnnotationTypes } from '@atlaskit/adf-schema';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import macroPlugin, { setMacroProvider } from '../../../macro';
import { EditorView } from 'prosemirror-view';
import analyticsPlugin, { ACTION_SUBJECT_ID } from '../../../analytics';
import { PastePluginOptions } from '../../index';

import {
  GapCursorSelection,
  Side,
} from '../../../selection/gap-cursor-selection';

import { getDefaultMediaClientConfig } from '@atlaskit/media-test-helpers/fakeMediaClient';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
// @ts-ignore
import { __serializeForClipboard } from 'prosemirror-view';
import extensionPlugin from '../../../extension';
import panelPlugin from '../../../panel';
import tasksAndDecisionsPlugin from '../../../tasks-and-decisions';
import { tablesPlugin } from '@atlaskit/editor-plugin-table';
import emojiPlugin from '../../../emoji';
import mentionsPlugin from '../../../mentions';
import cardPlugin from '../../../card';
import pastePlugin from '../../index';
import mediaPlugin from '../../../media';
import { PluginConfig as TablePluginConfig } from '@atlaskit/editor-plugin-table/types';
import blockTypePlugin from '../../../block-type';
import hyperlinkPlugin from '../../../hyperlink';
import listPlugin from '../../../list';
import codeBlockPlugin from '../../../code-block';
import textFormattingPlugin from '../../../text-formatting';
import layoutPlugin from '../../../layout';
import { flushPromises } from '@atlaskit/editor-test-helpers/e2e-helpers';
import { setupProvider } from '../../../../__tests__/unit/plugins/card/_helpers';
import { InlineCommentAnnotationProvider } from '../../../annotation/types';
import annotationPlugin from '../../../annotation';
import {
  InlineCommentPluginState,
  InlineCommentMap,
} from '../../../annotation/pm-plugins/types';
import { inlineCommentPluginKey } from '../../../annotation/utils';
import { handlePasteLinkOnSelectedText } from '../../handlers';
import { Slice } from 'prosemirror-model';
import { measureRender as measureRenderMocked } from '@atlaskit/editor-common/utils';
import { createPasteMeasurePayload as createPasteMeasurePayloadMocked } from '../../pm-plugins/analytics';
import unsupportedContentPlugin from '../../../unsupported-content';

const TABLE_LOCAL_ID = 'test-table-local-id';

jest.mock('@atlaskit/editor-common/utils', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common/utils'),
  measureRender: jest.fn(
    (
      measureName: string,
      onMeasureComplete?: (measurement: {
        duration: number;
        startTime: number;
        distortedDuration: boolean;
      }) => void,
    ) => {
      onMeasureComplete &&
        onMeasureComplete({
          duration: 5000,
          startTime: 1,
          distortedDuration: false,
        });
    },
  ),
}));
jest.mock('../../pm-plugins/analytics', () => ({
  ...jest.requireActual<Object>('../../pm-plugins/analytics'),
  createPasteMeasurePayload: jest.fn(),
}));

replaceRaf();
const requestAnimationFrame = window.requestAnimationFrame as any;

describe('paste plugins', () => {
  const createEditor = createProsemirrorEditorFactory();
  let providerFactory: ProviderFactory;
  let createAnalyticsEvent: jest.MockInstance<UIAnalyticsEvent, any>;

  interface PluginsOptions {
    paste?: PastePluginOptions;
    table?: TablePluginConfig;
    extensionProvider?: ExtensionProvider;
  }

  const editor = (
    doc: DocBuilder,
    pluginsOptions?: PluginsOptions,
    attachTo?: HTMLElement,
  ) => {
    const contextIdentifierProvider = storyContextIdentifierProviderFactory();
    const emojiProvider = getEmojiResourceWithStandardAndAtlassianEmojis() as Promise<
      EmojiProvider
    >;
    const mediaProvider = Promise.resolve({
      viewMediaClientConfig: getDefaultMediaClientConfig(),
    });
    const inlineCommentProvider: InlineCommentAnnotationProvider = {
      getState: async (ids: string[]) => {
        return ids.map((id) => ({
          annotationType: AnnotationTypes.INLINE_COMMENT,
          id,
          state: { resolved: false },
        }));
      },
      createComponent: () => null,
      viewComponent: () => null,
    };
    providerFactory = ProviderFactory.create({
      contextIdentifierProvider,
      emojiProvider,
      mediaProvider,
      macroProvider: Promise.resolve(macroProvider),
      mentionProvider: Promise.resolve(mentionResourceProvider),
      annotationProviders: Promise.resolve({
        inlineComment: inlineCommentProvider,
      }),
    });

    if (pluginsOptions && pluginsOptions.extensionProvider) {
      providerFactory.setProvider(
        'extensionProvider',
        Promise.resolve(pluginsOptions.extensionProvider),
      );
    }

    createAnalyticsEvent = createAnalyticsEventMock();
    const pasteOptions: PastePluginOptions = (pluginsOptions &&
      pluginsOptions.paste) || {
      cardOptions: {},
      plainTextPasteLinkification: false,
    };
    const tableOptions = (pluginsOptions && pluginsOptions.table) || {};
    const wrapper = createEditor({
      doc,
      providerFactory,
      attachTo,
      preset: new Preset<LightEditorPlugin>()
        .add([pastePlugin, pasteOptions])
        .add([
          analyticsPlugin,
          {
            createAnalyticsEvent: createAnalyticsEvent as any,
            performanceTracking: {
              pasteTracking: {
                enabled: true,
              },
            },
          },
        ])
        .add(extensionPlugin)
        .add(blockTypePlugin)
        .add(hyperlinkPlugin)
        .add(textFormattingPlugin)
        .add(listPlugin)
        .add([codeBlockPlugin, { appearance: 'full-page' }])
        .add(panelPlugin)
        .add([tasksAndDecisionsPlugin])
        .add([
          tablesPlugin,
          {
            tableOptions: tableOptions ? tableOptions : {},
            breakoutEnabled: false,
            allowContextualMenu: true,
            fullWidthEnabled: false,
            wasFullWidthEnabled: false,
          },
        ])
        .add(emojiPlugin)
        .add(mentionsPlugin)
        .add([macroPlugin])
        .add([
          cardPlugin,
          pasteOptions.cardOptions
            ? { platform: 'web', ...pasteOptions.cardOptions }
            : { platform: 'web' },
        ])
        .add([
          mediaPlugin,
          {
            allowMediaSingle: true,
            allowMediaGroup: true,
            allowLazyLoading: true,
            allowBreakoutSnapPoints: true,
            allowAdvancedToolBarOptions: true,
            allowDropzoneDropLine: true,
            allowMediaSingleEditable: true,
            allowRemoteDimensionsFetch: true,
            // This is a wild one. I didnt quite understand what the code was doing
            // so a bit of guess for now.
            allowMarkingUploadsAsIncomplete: false,
            fullWidthEnabled: false,
            isCopyPasteEnabled: true,
          },
        ])
        .add(unsupportedContentPlugin)
        .add(layoutPlugin)
        .add([
          annotationPlugin,
          { inlineComment: { ...inlineCommentProvider } },
        ]),
    });

    createAnalyticsEvent.mockClear();

    return wrapper;
  };

  describe('handlePaste', () => {
    const mediaHtml = (fileMimeType: string) => `
      <div
      data-id="af9310df-fee5-459a-a968-99062ecbb756"
      data-node-type="media" data-type="file"
      data-collection="MediaServicesSample"
      title="Attachment"
      data-file-mime-type="${fileMimeType}"></div>`;

    describe('editor', () => {
      describe('paste mention', () => {
        const mentionsHtml =
          "<meta charset='utf-8'><p data-pm-slice='1 1 []'><span data-mention-id='2' data-access-level='' contenteditable='false'>@Verdie Carrales</span> test</p>";

        it('should remove mention text when property sanitizePrivateContent is enabled', () => {
          const { editorView } = editor(doc(p('this is {<>}')), {
            paste: {
              sanitizePrivateContent: true,
              plainTextPasteLinkification: false,
            },
          });
          dispatchPasteEvent(editorView, {
            html: mentionsHtml,
          });
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p(
                'this is ',
                mention({ id: '2', text: '', accessLevel: '' })(),
                ' test',
              ),
            ),
          );
        });

        it('should keep mention text when property sanitizePrivateContent is disabled', () => {
          const { editorView } = editor(doc(p('this is {<>}')), {
            paste: {
              sanitizePrivateContent: false,
              plainTextPasteLinkification: false,
            },
          });
          dispatchPasteEvent(editorView, {
            html: mentionsHtml,
          });
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p(
                'this is ',
                mention({
                  id: '2',
                  text: '@Verdie Carrales',
                  accessLevel: '',
                })(),
                ' test',
              ),
            ),
          );
        });
      });

      describe('when message is a media image node', () => {
        it('paste as mediaSingle', () => {
          const { editorView } = editor(doc(p('{<>}')));
          dispatchPasteEvent(editorView, {
            html: mediaHtml('image/jpeg'),
          });
          expect(editorView.state.doc).toEqualDocument(
            doc(
              mediaSingle({ layout: 'center' })(
                media({
                  id: 'af9310df-fee5-459a-a968-99062ecbb756',
                  type: 'file',
                  collection: 'MediaServicesSample',
                  __fileMimeType: 'image/jpeg',
                })(),
              ),
            ),
          );
        });
      });

      describe('when pasted inside table', () => {
        it('should set a GapCursor after it', () => {
          const { editorView } = editor(
            doc(table({ localId: TABLE_LOCAL_ID })(tr(td()(p('{<>}'))))),
          );

          dispatchPasteEvent(editorView, {
            html: `<meta charset='utf-8'><div data-node-type="mediaSingle" data-layout="center" data-width=""><div data-id="9b5c6412-6de0-42cb-837f-bc08c24b4383" data-node-type="media" data-type="file" data-collection="MediaServicesSample" data-width="490" data-height="288" title="Attachment" style="display: inline-block; border-radius: 3px; background: #EBECF0; box-shadow: 0 1px 1px rgba(9, 30, 66, 0.2), 0 0 1px 0 rgba(9, 30, 66, 0.24);" data-file-name="image-20190325-222039.png" data-file-size="29502" data-file-mime-type="image/png"></div></div>`,
          });

          expect(editorView.state.doc).toEqualDocument(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(
                  td()(
                    mediaSingle({ layout: 'center' })(
                      media({
                        id: '9b5c6412-6de0-42cb-837f-bc08c24b4383',
                        type: 'file',
                        collection: 'MediaServicesSample',
                        __fileMimeType: 'image/png',
                        __fileName: 'image-20190325-222039.png',
                        __fileSize: 29502,
                        height: 288,
                        width: 490,
                      })(),
                    ),
                  ),
                ),
              ),
            ),
          );

          const { selection, schema } = editorView.state;
          expect(selection instanceof GapCursorSelection).toBe(true);
          expect((selection as GapCursorSelection).side).toBe(Side.RIGHT);
          expect(selection.$from.nodeBefore!.type).toEqual(
            schema.nodes.mediaSingle,
          );
        });

        it('should transform images into mediaSingles', () => {
          const { editorView } = editor(
            doc(table({ localId: TABLE_LOCAL_ID })(tr(td()(p('{<>}'))))),
          );

          dispatchPasteEvent(editorView, {
            html: `"<meta charset='utf-8'><meta charset="utf-8"><img src="http://atlassian.com" width="624" height="416" style="margin-left: 0px; margin-top: 0px;" />"`,
          });

          expect(editorView.state.doc).toEqualDocument(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(
                  td()(
                    p('"'),
                    mediaSingle({ layout: 'center' })(
                      media({
                        __external: true,
                        alt: '',
                        url: 'http://atlassian.com',
                        type: 'external',
                      })(),
                    ),
                    p('"'),
                  ),
                ),
              ),
            ),
          );
        });
      });

      describe('when an external image is copied', () => {
        const externalMediaHtml = `
         <meta charset='utf-8'><img src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;w=1000&amp;q=80" alt="Image result for cat"/>
        `;

        it('should insert as external media single', () => {
          const { editorView } = editor(doc(p('{<>}')));
          dispatchPasteEvent(editorView, {
            html: externalMediaHtml,
          });

          expect(editorView.state.doc).toEqualDocument(
            doc(
              mediaSingle({ layout: 'center' })(
                media({
                  type: 'external',
                  __external: true,
                  alt: 'Image result for cat',
                  url:
                    'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
                })(),
              ),
            ),
          );
        });
      });
    });

    describe('plain text', () => {
      // we expect `\n` to be parsed into hardbreak nodes so that the non-paragraph newlines are eventually encoded
      // in resulting html - so that further copy/pastes of the pasted content in the editor produce the same content result
      it('should split plain text separated by newline characters into text nodes separated by hardbreak nodes', () => {
        const { editorView } = editor(doc(p('{<>}')));

        const plain = 'first line\nsecond line\nthird line';

        dispatchPasteEvent(editorView, { plain });

        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(
              'first line',
              hardBreak(),
              'second line',
              hardBreak(),
              'third line',
            ),
          ),
        );
      });
      it('should preserve leading and trailing whitespaces and tabs for each new line', () => {
        const { editorView } = editor(doc(p('{<>}')));
        const plain =
          '  text with 2 leading whitespaces\n  text with 2 leading and trailing whitespaces  \ntext with 2 trailing whitespaces  \n\n  text with leading tab and 2 trailing whitespaces  \n  text with leading and trailing tab  \r\ntext with 2 trailing whitespaces  ';

        dispatchPasteEvent(editorView, { plain });

        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(
              '  text with 2 leading whitespaces',
              hardBreak(),
              '  text with 2 leading and trailing whitespaces  ',
              hardBreak(),
              'text with 2 trailing whitespaces  ',
            ),
            p(
              '  text with leading tab and 2 trailing whitespaces  ',
              hardBreak(),
              '  text with leading and trailing tab  ',
              hardBreak(),
              'text with 2 trailing whitespaces  ',
            ),
          ),
        );
      });
    });

    describe('paste in markdown', () => {
      it('should parse markdown and create blockquote', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, { plain: '>**Hello**' });
        expect(editorView.state.doc).toEqualDocument(
          doc(blockquote(p(strong('Hello')))),
        );
      });

      it('should parse markdown and create blockquote with text', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, { plain: '>-Hello' });
        expect(editorView.state.doc).toEqualDocument(
          doc(blockquote(p('-Hello'))),
        );
      });

      // For now blockquotes are not allowed to conatin lists.
      it('should output plain text if blockquote contains list', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, { plain: '>- Hello' });
        expect(editorView.state.doc).toEqualDocument(doc(p('>- Hello')));
      });
    });

    describe('paste in blockquote', () => {
      it('should paste blockquote content as plain text', () => {
        const { editorView } = editor(
          doc(blockquote(p(strong('Paste here {<>}')))),
        );
        const blockquoteHtml = `<meta charset='utf-8'><p data-pm-slice="1 1 [&quot;blockquote&quot;,{}]">copy me</p>`;
        dispatchPasteEvent(editorView, { html: blockquoteHtml });
        expect(editorView.state.doc).toEqualDocument(
          doc(blockquote(p(strong('Paste here copy me')))),
        );
      });
      it('should paste blockquote marked content with marks', () => {
        const { editorView } = editor(
          doc(blockquote(p(strong('Paste here {<>}')))),
        );
        const blockquoteHtmlMarked = `<meta charset='utf-8'><p data-pm-slice="1 1 [&quot;blockquote&quot;,{}]"><span class="fabric-text-color-mark" style="--custom-text-color: #ff991f" data-text-custom-color="#ff991f">copy me</span></p>`;
        dispatchPasteEvent(editorView, { html: blockquoteHtmlMarked });
        expect(editorView.state.doc).toEqualDocument(
          doc(blockquote(p(strong('Paste here copy me')))),
        );
      });
    });

    describe('paste in hyperlink', () => {
      it('should add link mark to selected text if slice is a link and text is matching', () => {
        const href = 'https://www.atlassian.com';
        const { editorView } = editor(
          doc(p('This is the {<}selected text{>} here')),
        );
        expect(
          handlePasteLinkOnSelectedText(
            new Slice(
              doc(p(link({ href })(href)))(editorView.state.schema).content,
              1,
              1,
            ),
          )(editorView.state, editorView.dispatch),
        ).toBeTruthy();
        expect(editorView.state.doc).toEqualDocument(
          doc(p('This is the ', a({ href })('selected text'), ' here')),
        );
      });

      it('should not add link mark to selected text if slice is a link and text is different', () => {
        const href = 'https://www.atlassian.com';
        const { editorView } = editor(
          doc(p('This is the {<}selected text{>} here')),
        );
        expect(
          handlePasteLinkOnSelectedText(
            new Slice(
              doc(p(link({ href })('copied text')))(
                editorView.state.schema,
              ).content,
              1,
              1,
            ),
          )(editorView.state, editorView.dispatch),
        ).toBeFalsy();
        expect(editorView.state.doc).toEqualDocument(
          doc(p('This is the {<}selected text{>} here')),
        );
      });

      it('should be falsy if not adding a link', () => {
        const { editorView } = editor(
          doc(p('This is the {<}selected text{>} here')),
        );
        expect(
          handlePasteLinkOnSelectedText(
            new Slice(
              doc(p('hello world'))(editorView.state.schema).content,
              1,
              1,
            ),
          )(editorView.state, editorView.dispatch),
        ).toBeFalsy();
        expect(editorView.state.doc).toEqualDocument(
          doc(p('This is the selected text here')),
        );
      });

      it('should be falsy if theres no text selection', () => {
        const href = 'https://www.atlassian.com';
        const { editorView } = editor(
          doc(p('This is the {<>}selected text here')),
        );
        expect(
          handlePasteLinkOnSelectedText(
            new Slice(
              doc(p(link({ href })(href)))(editorView.state.schema).content,
              1,
              1,
            ),
          )(editorView.state, editorView.dispatch),
        ).toBeFalsy();
        expect(editorView.state.doc).toEqualDocument(
          doc(p('This is the selected text here')),
        );
      });

      it('should be falsy if you cannot add a link in that range', () => {
        const href = 'https://www.atlassian.com';
        const { editorView } = editor(
          doc(p('This is the {<}sele'), p('cted text{>} here')),
        );
        expect(
          handlePasteLinkOnSelectedText(
            new Slice(
              doc(p(link({ href })(href)))(editorView.state.schema).content,
              1,
              1,
            ),
          )(editorView.state, editorView.dispatch),
        ).toBeFalsy();
        expect(editorView.state.doc).toEqualDocument(
          doc(p('This is the sele'), p('cted text here')),
        );
      });

      it('should add link mark to selected text on paste', () => {
        const { editorView } = editor(
          doc(p('This is the {<}selected text{>} here')),
        );
        dispatchPasteEvent(editorView, { plain: 'https://www.atlassian.com' });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(
              'This is the ',
              a({ href: 'https://www.atlassian.com' })('selected text'),
              ' here',
            ),
          ),
        );
      });
    });

    describe('pasting mixed text and media', () => {
      const nestedMediaHTML = `<meta charset='utf-8'><p style="margin: 0.95em 0px 1.2em; padding: 0.2em; color: rgb(10, 10, 10); font-family: Palatino, &quot;Palatino Linotype&quot;, &quot;Palatino LT STD&quot;, &quot;Book Antiqua&quot;, Georgia, serif; font-size: 21px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;">, front-end web apps, mobile apps, robots, and many other needs of the JavaScript community.</p><p style="margin: 0.95em 0px 1.2em; padding: 0.2em; color: rgb(10, 10, 10); font-family: Palatino, &quot;Palatino Linotype&quot;, &quot;Palatino LT STD&quot;, &quot;Book Antiqua&quot;, Georgia, serif; font-size: 21px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><a href="https://res.cloudinary.com/practicaldev/image/fetch/s--dW53ZT_i--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/9w2isgu5pn9bi5k59eto.png" class="article-body-image-wrapper" style="color: var(--theme-anchor-color, #557de8); text-decoration: none; cursor: zoom-in;"><img src="https://res.cloudinary.com/practicaldev/image/fetch/s--dW53ZT_i--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/9w2isgu5pn9bi5k59eto.png" alt="npm website screenshot: &quot;build amazing things&quot;" loading="lazy" style="height: auto; position: relative; display: block; margin: auto; left: -6px; max-width: calc(100% + 12px);"></a></p><p style="margin: 0.95em 0px 1.2em; padding: 0.2em; color: rgb(10, 10, 10); font-family: Palatino, &quot;Palatino Linotype&quot;, &quot;Palatino LT STD&quot;, &quot;Book Antiqua&quot;, Georgia, serif; font-size: 21px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;">Interestingly, using npm package</p>`;
      const multipleNestedMediaHTML = `<meta charset='utf-8'><p style="margin: 0.95em 0px 1.2em; padding: 0.2em; color: rgb(10, 10, 10); font-family: Palatino, &quot;Palatino Linotype&quot;, &quot;Palatino LT STD&quot;, &quot;Book Antiqua&quot;, Georgia, serif; font-size: 21px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;">, front-end web apps, mobile apps, robots, and many other needs of the JavaScript community.</p><p style="margin: 0.95em 0px 1.2em; padding: 0.2em; color: rgb(10, 10, 10); font-family: Palatino, &quot;Palatino Linotype&quot;, &quot;Palatino LT STD&quot;, &quot;Book Antiqua&quot;, Georgia, serif; font-size: 21px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><a href="https://res.cloudinary.com/practicaldev/image/fetch/s--dW53ZT_i--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/9w2isgu5pn9bi5k59eto.png" class="article-body-image-wrapper" style="color: var(--theme-anchor-color, #557de8); text-decoration: none; cursor: zoom-in;"><img src="https://res.cloudinary.com/practicaldev/image/fetch/s--dW53ZT_i--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/9w2isgu5pn9bi5k59eto.png" alt="npm website screenshot: &quot;build amazing things&quot;" loading="lazy" style="height: auto; position: relative; display: block; margin: auto; left: -6px; max-width: calc(100% + 12px);"></a></p><p style="margin: 0.95em 0px 1.2em; padding: 0.2em; color: rgb(10, 10, 10); font-family: Palatino, &quot;Palatino Linotype&quot;, &quot;Palatino LT STD&quot;, &quot;Book Antiqua&quot;, Georgia, serif; font-size: 21px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><a href="https://res.cloudinary.com/practicaldev/image/fetch/s--dW53ZT_i--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/9w2isgu5pn9bi5k59eto.png" class="article-body-image-wrapper" style="color: var(--theme-anchor-color, #557de8); text-decoration: none; cursor: zoom-in;"><img src="https://res.cloudinary.com/practicaldev/image/fetch/s--dW53ZT_i--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/9w2isgu5pn9bi5k59eto.png" alt="npm website screenshot: &quot;build amazing things&quot;" loading="lazy" style="height: auto; position: relative; display: block; margin: auto; left: -6px; max-width: calc(100% + 12px);"></a></p><p style="margin: 0.95em 0px 1.2em; padding: 0.2em; color: rgb(10, 10, 10); font-family: Palatino, &quot;Palatino Linotype&quot;, &quot;Palatino LT STD&quot;, &quot;Book Antiqua&quot;, Georgia, serif; font-size: 21px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><a href="https://res.cloudinary.com/practicaldev/image/fetch/s--dW53ZT_i--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/9w2isgu5pn9bi5k59eto.png" class="article-body-image-wrapper" style="color: var(--theme-anchor-color, #557de8); text-decoration: none; cursor: zoom-in;"><img src="https://res.cloudinary.com/practicaldev/image/fetch/s--dW53ZT_i--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/9w2isgu5pn9bi5k59eto.png" alt="npm website screenshot: &quot;build amazing things&quot;" loading="lazy" style="height: auto; position: relative; display: block; margin: auto; left: -6px; max-width: calc(100% + 12px);"></a></p><p style="margin: 0.95em 0px 1.2em; padding: 0.2em; color: rgb(10, 10, 10); font-family: Palatino, &quot;Palatino Linotype&quot;, &quot;Palatino LT STD&quot;, &quot;Book Antiqua&quot;, Georgia, serif; font-size: 21px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;">Interestingly, using npm package</p>`;
      const mediaHTML = `<meta charset='utf-8'><div style="box-sizing: border-box; color: rgb(51, 51, 51); font-family: droid_sansregular; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial; padding-top: 20px; padding-bottom: 20px;"><p style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1rem; font-size: 18px; line-height: 34px;">ulum stress. These signaling pathways regulate a variety of cellular activities including proliferation, differentiation, survival, and death.</p></div><div style="box-sizing: border-box; color: rgb(51, 51, 51); font-family: droid_sansregular; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;"><img src="https://www.biorbyt.com/pub/media/wysiwyg/MAPK_signaling_pathway.jpg" alt="MAPK Signaling Pathway" style="box-sizing: border-box; border: 0px; height: 854px; max-width: 100%; width: 982px; background-size: cover;"></div><div style="box-sizing: border-box; color: rgb(51, 51, 51); font-family: droid_sansregular; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial; margin-bottom: 3rem;"> </div><div style="box-sizing: border-box; color: rgb(51, 51, 51); font-family: droid_sansregular; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;"><p style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1rem; font-size: 18px; line-height: 34px;">Six subfamilies of MAPKs have been extensively characterized in mammalian cells: ERK1/2, JNKs, ERK 3, p38s, ERK5 and ERK 7/8. Transmission of signals</p></div>`;
      const hiddenMediaHTML = `<meta charset='utf-8'><p class="ia ib at bv ic b id ie if ig ih ii ij ik il im in" data-selectable-paragraph="" style="box-sizing: inherit; margin: 2em 0px -0.46em; font-weight: 400; color: rgba(0, 0, 0, 0.84); font-style: normal; line-height: 1.58; letter-spacing: -0.004em; font-family: medium-content-serif-font, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif; font-size: 21px; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;">ening after learning my tech is about 35% useful? bourbon, of course! After a couple of silky smooth glasses with ice (sorry purists), I begin researching a solution.</p><figure class="io ip iq ir is dv jd iu iv paragraph-image" style="box-sizing: inherit; margin: 56px 24px 0px; clear: both; max-width: 544px; color: rgba(0, 0, 0, 0.8); font-family: medium-content-sans-serif-font, -apple-system, system-ui, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, Cantarell, &quot;Open Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;"><div class="iy n di iz" style="box-sizing: inherit; display: block; position: relative; margin: auto; background-color: rgba(0, 0, 0, 0.05);"><div class="je n" style="box-sizing: inherit; display: block; padding-bottom: 360px;"><div class="cv iw fd p q fc ab ay v ix" style="box-sizing: inherit; top: 0px; left: 0px; will-change: transform; width: 544px; overflow: hidden; opacity: 0; height: 360px; position: absolute; transition: opacity 100ms ease 400ms; transform: translateZ(0px);"><img alt="" src="https://miro.medium.com/max/60/1*Ul-CDqf6wi-Ee8FQgmBUhQ@2x.jpeg?q=20" class="fd p q fc ab jb jc" width="544" height="360" style="box-sizing: inherit; vertical-align: middle; top: 0px; left: 0px; width: 544px; height: 360px; position: absolute; filter: blur(20px); transform: scale(1.1);"></div><img alt="" class="ln lo fd p q fc ab" width="544" height="360" src="https://miro.medium.com/max/1088/1*Ul-CDqf6wi-Ee8FQgmBUhQ@2x.jpeg" style="box-sizing: inherit; vertical-align: middle; top: 0px; left: 0px; width: 544px; height: 360px; position: absolute; opacity: 1; transition: opacity 400ms ease 0ms;"></div></div></figure><p class="ia ib at bv ic b id ie if ig ih ii ij ik il im in" data-selectable-paragraph="" style="box-sizing: inherit; margin: 2em 0px -0.46em; font-weight: 400; color: rgba(0, 0, 0, 0.84); font-style: normal; line-height: 1.58; letter-spacing: -0.004em; font-family: medium-content-serif-font, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif; font-size: 21px; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;">So to downgrade the iOS devices (phone and tablet), I must connect them to the MacBook and restore via iTunes.</p>`;
      const wrappedMediaHTML = `<meta charset='utf-8'><meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-36f8577a-7fff-ef0c-fd08-949e2fc1b66b"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Hello this is some text</span></p><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><span style="border: none; display: inline-block; overflow: hidden; width: 604px; height: 398px"><img src="https://lh5.googleusercontent.com/dnPAozzy3eYppgqEafLiZl3zzWYCrrzfwKCZiQ8nyYGeB9us9npuOVj48tM1VotqVlGriXQG2x2iYnbOVxsE54vkFErZs3n-6yYlZA8nRpu3Bt2DWhEoa8pFOkiMJHHGYrYhfLkg" width="604" height="398" style="margin-left: 0px; margin-top: 0px;" /></span></span></p><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">And this is some more text</span></p></b><br class="Apple-interchange-newline">`;
      const presentationSpanWrappedImageHTML = `<meta charset='utf-8'><p data-renderer-start-pos="1" style="margin: 0px; padding: 0px; font-size: 14px; line-height: 1.714; font-weight: 400; letter-spacing: -0.005em; color: rgb(23, 43, 77); font-family: -apple-system, system-ui, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><strong data-renderer-mark="true">Milestones </strong>(<span data-emoji-id="1f49a" data-emoji-short-name=":green_heart:" data-emoji-text="💚"><span class="f14svvg8 emoji-common-node emoji-common-emoji-image" aria-label=":green_heart:" style="background-color: transparent; border-radius: 5px; display: inline-block; margin: -1px 0px; vertical-align: middle;"><span role="presentation"><img loading="lazy" src="https://pf-emoji-service--cdn.us-east-1.prod.public.atl-paas.net/standard/a51a7674-8d5d-4495-a2d2-a67c090f5c3b/32x32/1f49a.png" alt=":green_heart:" data-emoji-short-name=":green_heart:" data-emoji-id="1f49a" data-emoji-text="💚" class="emoji" width="20" height="20" style="margin: 0px; padding: 0px; border: 0px; display: block; visibility: visible;"></span></span></span> = On track,<span data-emoji-id="26a0" data-emoji-short-name=":warning:" data-emoji-text="⚠"><span class="f14svvg8 emoji-common-node emoji-common-emoji-image" aria-label=":warning:" style="background-color: transparent; border-radius: 5px; display: inline-block; margin: -1px 0px; vertical-align: middle;"><span role="presentation"><img loading="lazy" src="https://pf-emoji-service--cdn.us-east-1.prod.public.atl-paas.net/standard/a51a7674-8d5d-4495-a2d2-a67c090f5c3b/32x32/26a0.png" alt=":warning:" data-emoji-short-name=":warning:" data-emoji-id="26a0" data-emoji-text="⚠" class="emoji" width="20" height="20" style="margin: 0px; padding: 0px; border: 0px; display: block; visibility: visible;"></span></span></span> = At risk,<span data-emoji-id="1f534" data-emoji-short-name=":red_circle:" data-emoji-text="🔴"><span class="f14svvg8 emoji-common-node emoji-common-emoji-image" aria-label=":red_circle:" style="background-color: transparent; border-radius: 5px; display: inline-block; margin: -1px 0px; vertical-align: middle;"><span role="presentation"><img loading="lazy" src="https://pf-emoji-service--cdn.us-east-1.prod.public.atl-paas.net/standard/a51a7674-8d5d-4495-a2d2-a67c090f5c3b/32x32/1f534.png" alt=":red_circle:" data-emoji-short-name=":red_circle:" data-emoji-id="1f534" data-emoji-text="🔴" class="emoji" width="20" height="20" style="margin: 0px; padding: 0px; border: 0px; display: block; visibility: visible;"></span></span></span> = Off track,<span data-emoji-id="2705" data-emoji-short-name=":white_check_mark:" data-emoji-text="✅"><span class="f14svvg8 emoji-common-node emoji-common-emoji-image" aria-label=":white_check_mark:" style="background-color: transparent; border-radius: 5px; display: inline-block; margin: -1px 0px; vertical-align: middle;"><span role="presentation"><img loading="lazy" src="https://pf-emoji-service--cdn.us-east-1.prod.public.atl-paas.net/standard/a51a7674-8d5d-4495-a2d2-a67c090f5c3b/32x32/2705.png" alt=":white_check_mark:" data-emoji-short-name=":white_check_mark:" data-emoji-id="2705" data-emoji-text="✅" class="emoji" width="20" height="20" style="margin: 0px; padding: 0px; border: 0px; display: block; visibility: visible;"></span></span></span> = Completed)</p><ul class="ak-ul" data-indent-level="1" style="margin: 12px 0px 0px; padding: 0px 0px 0px 24px; box-sizing: border-box; list-style-type: disc; display: flow-root; color: rgb(23, 43, 77); font-family: -apple-system, system-ui, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><li><p data-renderer-start-pos="70" style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em;">​<span data-emoji-id="2705" data-emoji-short-name=":white_check_mark:" data-emoji-text="✅"><span class="f14svvg8 emoji-common-node emoji-common-emoji-image" aria-label=":white_check_mark:" style="background-color: transparent; border-radius: 5px; display: inline-block; margin: -1px 0px; vertical-align: middle;"><span role="presentation"><img loading="lazy" src="https://pf-emoji-service--cdn.us-east-1.prod.public.atl-paas.net/standard/a51a7674-8d5d-4495-a2d2-a67c090f5c3b/32x32/2705.png" alt=":white_check_mark:" data-emoji-short-name=":white_check_mark:" data-emoji-id="2705" data-emoji-text="✅" class="emoji" width="20" height="20" style="margin: 0px; padding: 0px; border: 0px; display: block; visibility: visible;"></span></span></span> Completed project definition </p></li><li style="margin-top: 4px;"><p data-renderer-start-pos="116" style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em;">​<span data-emoji-id="2705" data-emoji-short-name=":white_check_mark:" data-emoji-text="✅"><span class="f14svvg8 emoji-common-node emoji-common-emoji-image" aria-label=":white_check_mark:" style="background-color: transparent; border-radius: 5px; display: inline-block; margin: -1px 0px; vertical-align: middle;"><span role="presentation"><img loading="lazy" src="https://pf-emoji-service--cdn.us-east-1.prod.public.atl-paas.net/standard/a51a7674-8d5d-4495-a2d2-a67c090f5c3b/32x32/2705.png" alt=":white_check_mark:" data-emoji-short-name=":white_check_mark:" data-emoji-id="2705" data-emoji-text="✅" class="emoji" width="20" height="20" style="margin: 0px; padding: 0px; border: 0px; display: block; visibility: visible;"></span></span></span> Completed project</p></li></ul>`;
      const wrappedMediaInTableHTML = `<meta charset='utf-8'><meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-dc605362-7fff-99d0-604f-9d37acd6f416"><div dir="ltr" style="margin-left:0pt;" align="left"><table data-table-local-id=${TABLE_LOCAL_ID} style="border:none;border-collapse:collapse;width:468pt;table-layout:fixed"><colgroup><col /><col /><col /></colgroup><tr style="height:0pt"><td style="border-left:solid #000000 1pt;border-right:solid #000000 1pt;border-bottom:solid #000000 1pt;border-top:solid #000000 1pt;vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Funny</span></p><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><span style="border: none; display: inline-block; overflow: hidden; width: 194px; height: 108px"><img src="https://lh4.googleusercontent.com/9lblWb7GLsczlSZQXUmuyJ9MLe-D8i19B1ITI-fdjV7bDMHzKWL5STuYhFTnOGJxfNa5HrWCgbQ35fr_ZMcZGpKX83ZWcSSeNAhOMVur7M1Ww3UOkWR64BDy1r-4atSedbwGCwyK" width="194" height="108" style="margin-left: 0px; margin-top: 0px;" /></span></span></p><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Cat</span></p></td></tr><tr style="height:23pt"><td style="border-left:solid #000000 1pt;border-right:solid #000000 1pt;border-bottom:solid #000000 1pt;border-top:solid #000000 1pt;vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;"></td></tr></table></div></b>`;
      const mediaFromMicrosoftWord = `<meta charset='utf-8' xmlns:w="urn:schemas-microsoft-com:office:word"><meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-36f8577a-7fff-ef0c-fd08-949e2fc1b66b"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Hello this is some text</span></p><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><span style="border: none; display: inline-block; overflow: hidden; width: 604px; height: 398px"><img src="https://lh5.googleusercontent.com/dnPAozzy3eYppgqEafLiZl3zzWYCrrzfwKCZiQ8nyYGeB9us9npuOVj48tM1VotqVlGriXQG2x2iYnbOVxsE54vkFErZs3n-6yYlZA8nRpu3Bt2DWhEoa8pFOkiMJHHGYrYhfLkg" width="604" height="398" style="margin-left: 0px; margin-top: 0px;" /></span></span></p><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">And this is some more text</span></p></b><br class="Apple-interchange-newline">`;
      const wrappedMediaInTableCellsFromTinyMCE = `<meta charset="utf-8" /><th class="confluenceTh mceSelected">a</th><th class="confluenceTh mceSelected">b</th><th class="confluenceTh mceSelected">c</th><td class="confluenceTd mceSelected">d</td><td class="confluenceTd mceSelected"><div class="content-wrapper"><p><img class="confluence-embedded-image confluence-thumbnail" title="Product Management Craft &gt; APM presenter hit list &gt; some-photo.png" data-linked-resource-default-alias="some-photo.png" data-linked-resource-container-id="248651555" data-linked-resource-container-version="5" data-attachment-copy="" height="150" data-location="Product Management Craft &gt; APM presenter hit list &gt; some-photo.png" border="0" data-linked-resource-id="1393104613" src="https://hello.atlassian.net/wiki/download/thumbnails/248651555/some-photo.png?version=1&amp;modificationDate=1635802112476&amp;cacheVersion=1&amp;api=v2" data-linked-resource-version="1" data-linked-resource-type="attachment" data-unresolved-comment-count="0" data-linked-resource-content-type="image/png" data-media-type="file" data-media-id="821a8389-2305-4281-9523-f309723ef356" data-base-url="https://hello.atlassian.net/wiki" data-image-width="608" data-image-src="https://hello.atlassian.net/wiki/download/attachments/248651555/some-photo.png?version=1&amp;modificationDate=1635802112476&amp;cacheVersion=1&amp;api=v2" data-image-height="344" /></p></div></td><td class="confluenceTd mceSelected">f</td>`;
      // dev.to nested structure
      it('hoists nested media nodes in the clipboard html', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, {
          html: nestedMediaHTML,
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(
              ', front-end web apps, mobile apps, robots, and many other needs of the JavaScript community.',
            ),
            mediaSingle()(
              media({
                type: 'external',
                __external: true,
                alt: 'npm website screenshot: "build amazing things"',
                url: `https://res.cloudinary.com/practicaldev/image/fetch/s--dW53ZT_i--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/9w2isgu5pn9bi5k59eto.png`,
              })(),
            ),
            p('Interestingly, using npm package'),
          ),
        );
      });

      it('hoists multiple nested media nodes in the clipboard html', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, {
          html: multipleNestedMediaHTML,
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(
              ', front-end web apps, mobile apps, robots, and many other needs of the JavaScript community.',
            ),
            mediaSingle()(
              media({
                type: 'external',
                __external: true,
                alt: 'npm website screenshot: "build amazing things"',
                url: `https://res.cloudinary.com/practicaldev/image/fetch/s--dW53ZT_i--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/9w2isgu5pn9bi5k59eto.png`,
              })(),
            ),
            mediaSingle()(
              media({
                type: 'external',
                __external: true,
                alt: 'npm website screenshot: "build amazing things"',
                url: `https://res.cloudinary.com/practicaldev/image/fetch/s--dW53ZT_i--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/9w2isgu5pn9bi5k59eto.png`,
              })(),
            ),
            mediaSingle()(
              media({
                type: 'external',
                __external: true,
                alt: 'npm website screenshot: "build amazing things"',
                url: `https://res.cloudinary.com/practicaldev/image/fetch/s--dW53ZT_i--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/9w2isgu5pn9bi5k59eto.png`,
              })(),
            ),
            p('Interestingly, using npm package'),
          ),
        );
      });

      it('should insert external media in a media single', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, {
          html: mediaHTML,
        });

        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(
              'ulum stress. These signaling pathways regulate a variety of cellular activities including proliferation, differentiation, survival, and death.',
            ),
            mediaSingle()(
              media({
                type: 'external',
                __external: true,
                alt: 'MAPK Signaling Pathway',
                url: `https://www.biorbyt.com/pub/media/wysiwyg/MAPK_signaling_pathway.jpg`,
              })(),
            ),
            p(
              `Six subfamilies of MAPKs have been extensively characterized in mammalian cells: ERK1/2, JNKs, ERK 3, p38s, ERK5 and ERK 7/8. Transmission of signals`,
            ),
          ),
        );
      });

      // Medium.com use case
      it('should remove any media not visible in the DOM', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, {
          html: hiddenMediaHTML,
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(
              'ening after learning my tech is about 35% useful? bourbon, of course! After a couple of silky smooth glasses with ice (sorry purists), I begin researching a solution.',
            ),
            mediaSingle()(
              media({
                type: 'external',
                __external: true,
                alt: '',
                url: `https://miro.medium.com/max/1088/1*Ul-CDqf6wi-Ee8FQgmBUhQ@2x.jpeg`,
              })(),
            ),
            p(
              `So to downgrade the iOS devices (phone and tablet), I must connect them to the MacBook and restore via iTunes.`,
            ),
          ),
        );
      });

      // Google Docs use case
      it('should hoist media preserving order of media and text when wrapped in google docs container', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, {
          html: wrappedMediaHTML,
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('Hello this is some text'),
            mediaSingle()(
              media({
                type: 'external',
                __external: true,
                alt: '',
                url: `https://lh5.googleusercontent.com/dnPAozzy3eYppgqEafLiZl3zzWYCrrzfwKCZiQ8nyYGeB9us9npuOVj48tM1VotqVlGriXQG2x2iYnbOVxsE54vkFErZs3n-6yYlZA8nRpu3Bt2DWhEoa8pFOkiMJHHGYrYhfLkg`,
              })(),
            ),
            p('And this is some more text'),
          ),
        );
      });

      it('should ignore images coming from Microsoft Word', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, {
          html: mediaFromMicrosoftWord,
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('Hello this is some text'),
            p(),
            p('And this is some more text'),
          ),
        );
      });

      it('should hoist media preserving order of media and text inside a table when wrapped in google docs container', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, {
          html: wrappedMediaInTableHTML,
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(
                td()(
                  p('Funny'),
                  mediaSingle()(
                    media({
                      type: 'external',
                      __external: true,
                      alt: '',
                      url: `https://lh4.googleusercontent.com/9lblWb7GLsczlSZQXUmuyJ9MLe-D8i19B1ITI-fdjV7bDMHzKWL5STuYhFTnOGJxfNa5HrWCgbQ35fr_ZMcZGpKX83ZWcSSeNAhOMVur7M1Ww3UOkWR64BDy1r-4atSedbwGCwyK`,
                    })(),
                  ),
                  p('Cat'),
                ),
              ),
              tr(td()(p(''))),
            ),
          ),
        );
      });

      /*
        Addressing problem from https://product-fabric.atlassian.net/browse/MEX-924
      */

      it('should not hoist images that is a descendant of a span that has class of emoji-node', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, {
          html: presentationSpanWrappedImageHTML,
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(
              strong('Milestones '),
              '(',
              emoji({ shortName: ':green_heart:', id: '1f49a', text: '💚' })(),
              ' = On track,',
              emoji({ shortName: ':warning:', id: '26a0', text: '⚠' })(),
              ' = At risk,',
              emoji({ shortName: ':red_circle:', id: '1f534', text: '🔴' })(),
              ' = Off track,',
              emoji({
                shortName: ':white_check_mark:',
                id: '2705',
                text: '✅',
              })(),
              ' = Completed)',
            ),
            ul(
              li(
                p(
                  '​',
                  emoji({
                    shortName: ':white_check_mark:',
                    id: '2705',
                    text: '✅',
                  })(),
                  ' Completed project definition',
                ),
              ),
              li(
                p(
                  '​',
                  emoji({
                    shortName: ':white_check_mark:',
                    id: '2705',
                    text: '✅',
                  })(),
                  ' Completed project',
                ),
              ),
            ),
          ),
        );
      });

      // confluence TinyMCE tables with images use case
      it('should not hoist images that are direct descendants of table cells coming from confluence TinyMCE', () => {
        uuid.setStatic(TABLE_LOCAL_ID);
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, {
          html: wrappedMediaInTableCellsFromTinyMCE,
          types: ['x-tinymce/html'],
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(th()(p('a')), th()(p('b')), th()(p('c'))),
              tr(
                td()(p('d')),
                td()(
                  mediaSingle()(
                    media({
                      __external: true,
                      alt: '',
                      type: 'external',
                      url:
                        'https://hello.atlassian.net/wiki/download/thumbnails/248651555/some-photo.png?version=1&modificationDate=1635802112476&cacheVersion=1&api=v2',
                    })(),
                  ),
                ),
                td()(p('f')),
              ),
            ),
          ),
        );
        uuid.setStatic(false);
      });
    });

    describe('pasting media from the renderer', () => {
      it('should insert a media single markup as a media single node', () => {
        // Couldnt get media to load properly, we're inlining the media node.
        // We only really care about the media single markup here.
        const wrapper = mount(
          <MediaSingle
            layout="center"
            width={1333}
            height={1019}
            pctWidth={80}
            lineLength={680}
          >
            <div
              dangerouslySetInnerHTML={{
                __html:
                  '<div class="sc-eetwQk ddqWZS" data-context-id="414734770" data-type="file" data-node-type="media" data-width="1105" data-height="844" data-id="ade9cc46-35a9-49b1-b4ff-477670463481" data-collection="contentId-414734770"><div class="sc-gkfylT VGelR"><div class="sc-cgThhu bCBaed"><div class="sc-fPCuyW jeMDuK sc-frudsx gquFtT"><div class="wrapper"><div class="img-wrapper"><img class="sc-fIIFii bZNNp" draggable="false" style="transform: translate(-50%, -50%); height: 100%;" src="blob:https://hello.atlassian.net/9faf6f4c-994b-ca4e-b391-c00caa808b6f"></div></div></div></div></div></div>',
              }}
            />
          </MediaSingle>,
        );

        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, {
          html: `<html><head><meta http-equiv="content-type" content="text/html; charset=utf-8"></head><body>${wrapper.html()}</body></html>`,
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            mediaSingle({
              layout: 'center',
              width: 80,
            })(
              media({
                __contextId: '414734770',
                collection: 'contentId-414734770',
                height: 844,
                id: 'ade9cc46-35a9-49b1-b4ff-477670463481',
                type: 'file',
                width: 1105,
              })(),
            ),
          ),
        );
      });
    });

    describe('paste in code-block', () => {
      it('should not create paragraph when plain text is copied in code-block', () => {
        const { editorView } = editor(doc(code_block()('{<>}')));
        dispatchPasteEvent(editorView, { plain: 'plain text' });
        expect(editorView.state.doc).toEqualDocument(
          doc(code_block()('plain text')),
        );
      });

      it('should create paragraph when plain text is not copied in code-block', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, { plain: 'plain text' });
        expect(editorView.state.doc).toEqualDocument(doc(p('plain text')));
      });

      it('should scroll cursor into view after pasting in code-block', () => {
        const { editorView } = editor(doc(code_block()('{<>}')));
        const dispatchSpy = jest.spyOn(editorView, 'dispatch');
        dispatchPasteEvent(editorView, { plain: 'plain text' });

        const tr = dispatchSpy.mock.calls[0][0];
        expect(
          (tr as Transaction & { scrolledIntoView: boolean }).scrolledIntoView,
        ).toBe(true);
      });
    });

    describe('paste in panel', () => {
      it('should paste bullet list inside empty panel', () => {
        const listHtml = `<meta charset='utf-8'><p data-pm-slice="1 1 [&quot;bulletList&quot;,null,&quot;listItem&quot;,null]">hello</p>`;

        const { editorView } = editor(
          doc(panel({ panelType: 'info' })(p('{<>}'))),
        );
        dispatchPasteEvent(editorView, {
          html: listHtml,
        });
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(panel({ panelType: 'info' })(ul(li(p('hello{<>}'))))),
        );
      });
    });

    describe('paste into list', () => {
      it('should panel content paste inside the list instead of copying the panel itself', () => {
        const panelHtml = `<div class="ak-editor-panel" data-panel-type="info"><span class="ak-editor-panel__icon"><span class="Icon__IconWrapper-dyhwwi-0 bcqBjl" aria-label="Panel info"><svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><path d="M12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm0-8.5a1 1 0 0 0-1 1V15a1 1 0 0 0 2 0v-2.5a1 1 0 0 0-1-1zm0-1.125a1.375 1.375 0 1 0 0-2.75 1.375 1.375 0 0 0 0 2.75z" fill="currentColor" fill-rule="evenodd"></path></svg></span></span><div class="ak-editor-panel__content"><p>This is a test</p></div></div>`;

        const { editorView } = editor(
          doc(ul(li(p('1')), li(p('2 {<>}')), li(p('3')))),
        );
        dispatchPasteEvent(editorView, {
          html: panelHtml,
        });
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(ul(li(p('1')), li(p('2 This is a test{<>}')), li(p('3')))),
        );
      });

      it('should panel content (with link) paste inside the list instead of copying the panel itself', () => {
        const panelHtml = `<div class="ak-editor-panel" data-panel-type="info" style=""><div class="ak-editor-panel__icon" contenteditable="false"><span role="img" aria-label="Panel info" class="css-60ak9x-Icon" style="--icon-primary-color:currentColor; --icon-secondary-color:var(--ds-surface, #FFFFFF);"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="presentation"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C9.34784 22 6.8043 20.9464 4.92893 19.0711C3.05357 17.1957 2 14.6522 2 12C2 9.34784 3.05357 6.8043 4.92893 4.92893C6.8043 3.05357 9.34784 2 12 2C14.6522 2 17.1957 3.05357 19.0711 4.92893C20.9464 6.8043 22 9.34784 22 12C22 14.6522 20.9464 17.1957 19.0711 19.0711C17.1957 20.9464 14.6522 22 12 22V22ZM12 11.375C11.6685 11.375 11.3505 11.5067 11.1161 11.7411C10.8817 11.9755 10.75 12.2935 10.75 12.625V15.75C10.75 16.0815 10.8817 16.3995 11.1161 16.6339C11.3505 16.8683 11.6685 17 12 17C12.3315 17 12.6495 16.8683 12.8839 16.6339C13.1183 16.3995 13.25 16.0815 13.25 15.75V12.625C13.25 12.2935 13.1183 11.9755 12.8839 11.7411C12.6495 11.5067 12.3315 11.375 12 11.375ZM12 9.96875C12.4558 9.96875 12.893 9.78767 13.2153 9.46534C13.5377 9.14301 13.7188 8.70584 13.7188 8.25C13.7188 7.79416 13.5377 7.35699 13.2153 7.03466C12.893 6.71233 12.4558 6.53125 12 6.53125C11.5442 6.53125 11.107 6.71233 10.7847 7.03466C10.4623 7.35699 10.2812 7.79416 10.2812 8.25C10.2812 8.70584 10.4623 9.14301 10.7847 9.46534C11.107 9.78767 11.5442 9.96875 12 9.96875Z" fill="currentColor"></path></svg></span></div><div class="ak-editor-panel__content"><p>This is a test <a href="http://www.atlassian.com">http://www.atlassian.com</a> </p></div></div>`;

        const { editorView } = editor(
          doc(ul(li(p('1')), li(p('2 {<>}')), li(p('3')))),
        );
        dispatchPasteEvent(editorView, {
          html: panelHtml,
        });
        const href = 'http://www.atlassian.com';
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(
            ul(
              li(p('1')),
              li(p('2 This is a test ', link({ href })(href))),
              li(p('3')),
            ),
          ),
        );
      });
    });

    describe('paste inline text', () => {
      it('should preserve marks when pasting inline text into empty text selection', () => {
        const { editorView } = editor(doc(p(strong(em('this is {<>}')))));
        dispatchPasteEvent(editorView, {
          html:
            "<meta charset='utf-8'><p data-pm-slice='1 1 []'>strong em text</p>",
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(p(strong(em('this is strong em text{<>}')))),
        );
      });

      it('should preserve marks when pasting inline text into text selection', () => {
        const { editorView } = editor(
          doc(p(strong(em('this is strong em text')))),
        );
        editorView.dispatch(
          editorView.state.tr.setSelection(
            TextSelection.create(editorView.state.doc, 1, 8),
          ),
        );
        dispatchPasteEvent(editorView, {
          html:
            "<meta charset='utf-8'><p data-pm-slice='1 1 []'>this is another</p>",
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(p(strong(em('this is another strong em text')))),
        );
      });

      it('should preserve marks when pasting inline text into action/decision', () => {
        const { editorView } = editor(
          doc(
            decisionList({ localId: 'local-decision' })(
              decisionItem({ localId: 'local-decision' })(
                strong(em('this is a {<>}text')),
              ),
            ),
          ),
        );
        dispatchPasteEvent(editorView, {
          html:
            "<meta charset='utf-8'><p data-pm-slice='1 1 []'>strong em </p>",
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            decisionList({ localId: 'local-decision' })(
              decisionItem({ localId: 'local-decision' })(
                strong(em('this is a strong em {<>}text')),
              ),
            ),
          ),
        );
      });

      it('should preserve marks when pasting inline text into panel', () => {
        const { editorView } = editor(
          doc(panel()(p(strong(em('this is a {<>}text'))))),
        );
        dispatchPasteEvent(editorView, {
          html:
            "<meta charset='utf-8'><p data-pm-slice='1 1 []'>strong em </p>",
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(panel()(p(strong(em('this is a strong em {<>}text'))))),
        );
      });

      it('should preserve marks when pasting inline text into heading', () => {
        const { editorView } = editor(
          doc(h1(strong(em('this is a {<>}text')))),
        );
        dispatchPasteEvent(editorView, {
          html:
            "<meta charset='utf-8'><p data-pm-slice='1 1 []'>strong em </p>",
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(h1(strong(em('this is a strong em {<>}text')))),
        );
      });

      it('should preserve marks when pasting inline text into list', () => {
        const { editorView } = editor(
          doc(ol(li(p(strong(em('this is a {<>}text')))))),
        );
        dispatchPasteEvent(editorView, {
          html:
            "<meta charset='utf-8'><p data-pm-slice='1 1 []'>strong em </p>",
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(ol(li(p(strong(em('this is a strong em {<>}text')))))),
        );
      });

      it('should preserve marks + link when pasting URL', () => {
        const href = 'http://www.google.com';
        const { editorView } = editor(
          doc(panel()(p(strong(em('this is a {<>}text'))))),
        );
        dispatchPasteEvent(editorView, {
          html:
            "<meta charset='utf-8'><p data-pm-slice='1 1 []'><a href='http://www.google.com'>www.google.com</a></p>",
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            panel()(
              p(
                strong(em('this is a ')),
                link({ href })(strong(em('www.google.com'))),
                strong(em('text')),
              ),
            ),
          ),
        );
      });

      it('should preserve marks + link when pasting plain text', () => {
        const href = 'http://www.google.com';
        const { editorView } = editor(
          doc(p(link({ href })('www.google{<>}.com'))),
        );
        dispatchPasteEvent(editorView, {
          html: "<meta charset='utf-8'><p data-pm-slice='1 1 []'>doc</p>",
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(p(link({ href })('www.googledoc.com'))),
        );
      });

      it('should filter link mark when pasting URL into code mark', () => {
        const { editorView } = editor(
          doc(panel()(p(code('code line 1: {<>}')))),
        );
        dispatchPasteEvent(editorView, {
          html:
            "<meta charset='utf-8'><p data-pm-slice='1 1 []'><a href='http://www.google.com'>www.google.com</a></p>",
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(panel()(p(code('code line 1: www.google.com')))),
        );
      });

      describe('with annotations', () => {
        let commentsPluginStateMock: jest.SpyInstance;

        // mocks comments plugin state to indicate that we have this annotation on a page
        function mockCommentsStateWithAnnotations(
          annotations: InlineCommentMap,
        ) {
          const testInlineCommentState: InlineCommentPluginState = {
            annotations: annotations,
            selectedAnnotations: [],
            mouseData: { isSelecting: false },
            disallowOnWhitespace: false,
            isVisible: true,
          };
          return jest
            .spyOn(inlineCommentPluginKey, 'getState')
            .mockReturnValue(testInlineCommentState);
        }

        beforeEach(() => {
          commentsPluginStateMock = mockCommentsStateWithAnnotations({
            'annotation-id': false,
            'annotation-id-1': false,
            'annotation-id-2': false,
          });
        });

        afterEach(() => {
          commentsPluginStateMock.mockClear();
        });

        it('preserves annotation mark when pasting plain text into annotation', async () => {
          const { editorView } = editor(
            doc(
              p(
                annotation({
                  id: 'annotation-id',
                  annotationType: AnnotationTypes.INLINE_COMMENT,
                })('This is an {<>}annotation'),
              ),
            ),
          );
          // it is important to flush promises here because we have async code in annotations setup
          // which can affect subsequent tests
          await flushPromises();
          dispatchPasteEvent(editorView, {
            html:
              "<meta charset='utf-8'><p data-pm-slice='1 1 []'>modified </p>",
          });
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p(
                annotation({
                  id: 'annotation-id',
                  annotationType: AnnotationTypes.INLINE_COMMENT,
                })('This is an modified annotation'),
              ),
            ),
          );
        });

        it('keeps annotation mark when pasting text with annotation', async () => {
          const { editorView } = editor(doc(p('this is a {<>}text')));
          await flushPromises();
          dispatchPasteEvent(editorView, {
            html:
              "<meta charset='utf-8'><p data-pm-slice='1 1 []'><span data-mark-type='annotation' data-mark-annotation-type='inlineComment' data-id='annotation-id' >annotated </span></p>",
          });
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p(
                'this is a ',
                annotation({
                  id: 'annotation-id',
                  annotationType: AnnotationTypes.INLINE_COMMENT,
                })('annotated '),
                'text',
              ),
            ),
          );
        });

        it('strips off annotation mark when pasting text with annotation that does not exist i nthe document', async () => {
          const { editorView } = editor(doc(p('this is a {<>}text')));
          await flushPromises();
          dispatchPasteEvent(editorView, {
            html:
              "<meta charset='utf-8'><p data-pm-slice='1 1 []'><span data-mark-type='annotation' data-mark-annotation-type='inlineComment' data-id='nonexisting-annotation-id' >annotated </span></p>",
          });
          expect(editorView.state.doc).toEqualDocument(
            doc(p('this is a annotated text')),
          );
        });

        it('merges annotation marks when pasting text with annotation into another text with annotation', async () => {
          const { editorView } = editor(
            doc(
              p(
                annotation({
                  id: 'annotation-id-1',
                  annotationType: AnnotationTypes.INLINE_COMMENT,
                })('This is an {<>} outer annotation'),
              ),
            ),
          );
          // it is important to flush promises here because we have async code in annotations setup
          // which can affect subsequent tests
          await flushPromises();
          dispatchPasteEvent(editorView, {
            html:
              "<meta charset='utf-8'><p data-pm-slice='1 1 []'><span data-mark-type='annotation' data-mark-annotation-type='inlineComment' data-id='annotation-id-2' >inner annotation </span></p>",
          });
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p(
                annotation({
                  id: 'annotation-id-1',
                  annotationType: AnnotationTypes.INLINE_COMMENT,
                })('This is an '),
                annotation({
                  id: 'annotation-id-1',
                  annotationType: AnnotationTypes.INLINE_COMMENT,
                })(
                  annotation({
                    id: 'annotation-id-2',
                    annotationType: AnnotationTypes.INLINE_COMMENT,
                  })('inner annotation '),
                ),
                annotation({
                  id: 'annotation-id-1',
                  annotationType: AnnotationTypes.INLINE_COMMENT,
                })(' outer annotation'),
              ),
            ),
          );
        });
      });
    });

    describe('paste paragraphs', () => {
      it('should preserve marks when pasting paragraphs into empty text selection', () => {
        const { editorView } = editor(doc(p(strong(em('this is {<>}')))));
        dispatchPasteEvent(editorView, {
          html:
            "<meta charset='utf-8'><p data-pm-slice='1 1 []'>strong em text</p><p>this is another paragraph</p>",
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(strong(em('this is strong em text{<>}'))),
            p(strong(em('this is another paragraph'))),
          ),
        );
      });

      it('should preserve marks when pasting paragraphs into text selection', () => {
        const { editorView } = editor(
          doc(p(strong(em('this is strong em text')))),
        );
        editorView.dispatch(
          editorView.state.tr.setSelection(
            TextSelection.create(editorView.state.doc, 1, 8),
          ),
        );
        dispatchPasteEvent(editorView, {
          html:
            "<meta charset='utf-8'><p data-pm-slice='1 1 []'>this is another</p><p>hello</p>",
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(strong(em('this is another'))),
            p(strong(em('hello strong em text'))),
          ),
        );
      });

      it('should preserve marks when pasting paragraphs into action/decision', () => {
        const { editorView } = editor(
          doc(
            decisionList({ localId: 'local-decision' })(
              decisionItem({ localId: 'local-decision' })(
                strong(em('this is a {<>}text')),
              ),
            ),
          ),
        );
        dispatchPasteEvent(editorView, {
          html:
            "<meta charset='utf-8'><p data-pm-slice='1 1 []'>strong em </p><p>hello </p>",
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            decisionList({ localId: 'local-decision' })(
              decisionItem({ localId: 'local-decision' })(
                strong(em('this is a strong em {<>}')),
              ),
            ),
            p(strong(em('hello text'))),
          ),
        );
      });

      it('should preserve marks when pasting paragraphs into panel', () => {
        const { editorView } = editor(
          doc(panel()(p(strong(em('this is a {<>}text'))))),
        );
        dispatchPasteEvent(editorView, {
          html:
            "<meta charset='utf-8'><p data-pm-slice='1 1 []'>strong em </p><p>hello </p>",
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            panel()(
              p(strong(em('this is a strong em {<>}'))),
              p(strong(em('hello text'))),
            ),
          ),
        );
      });

      it('should preserve marks when pasting paragraphs into heading', () => {
        const { editorView } = editor(
          doc(h1(strong(em('this is a {<>}text')))),
        );
        dispatchPasteEvent(editorView, {
          html:
            "<meta charset='utf-8'><p data-pm-slice='1 1 []'>strong em </p><p>hello </p>",
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            h1(strong(em('this is a strong em {<>}'))),
            p(strong(em('hello text'))),
          ),
        );
      });

      it('should preserve marks when pasting paragraphs into list', () => {
        const { editorView } = editor(
          doc(ol(li(p(strong(em('this is a {<>}text')))))),
        );
        dispatchPasteEvent(editorView, {
          html:
            "<meta charset='utf-8'><p data-pm-slice='1 1 []'>strong em </p><p>hello </p>",
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            ol(
              li(
                p(strong(em('this is a strong em {<>}'))),
                p(strong(em('hello text'))),
              ),
            ),
          ),
        );
      });

      it('should scroll cursor into view after pasting', () => {
        const { editorView } = editor(doc(p('{<>}')));
        const dispatchSpy = jest.spyOn(editorView, 'dispatch');

        dispatchPasteEvent(editorView, {
          html: `<meta charset='utf-8'><p data-pm-slice="1 1 []">Some rich text to paste</p>`,
        });

        const tr = dispatchSpy.mock.calls[0][0];
        expect(
          (tr as Transaction & {
            scrolledIntoView: boolean;
          }).scrolledIntoView,
        ).toBe(true);
      });
    });

    describe('hyperlink as a plain text', () => {
      it('should linkify hyperlink if it contains "..."', () => {
        const { editorView } = editor(doc(p('{<>}')));
        const href = 'http://example.com/...blabla';
        dispatchPasteEvent(editorView, { plain: href });
        expect(editorView.state.doc).toEqualDocument(
          doc(p(link({ href })(href))),
        );
      });

      it('should linkify pasted hyperlink if it contains "---"', () => {
        const { editorView } = editor(doc(p('{<>}')));
        const href = 'http://example.com/---blabla';
        dispatchPasteEvent(editorView, { plain: href });
        expect(editorView.state.doc).toEqualDocument(
          doc(p(link({ href })(href))),
        );
      });

      it('should linkify pasted hyperlink if it contains "~~~"', () => {
        const { editorView } = editor(doc(p('{<>}')));
        const href = 'http://example.com/~~~blabla';
        dispatchPasteEvent(editorView, { plain: href });
        expect(editorView.state.doc).toEqualDocument(
          doc(p(link({ href })(href))),
        );
      });

      it('should linkify pasted hyperlink if it contains combination of "~~~", "---" and "..."', () => {
        const { editorView } = editor(doc(p('{<>}')));
        const href = 'http://example.com/~~~bla...bla---bla';
        dispatchPasteEvent(editorView, { plain: href });
        expect(editorView.state.doc).toEqualDocument(
          doc(p(link({ href })(href))),
        );
      });

      it('should parse Urls with nested parentheses', () => {
        const { editorView } = editor(doc(p('{<>}')));
        const href = 'http://example.com/?jql=(foo())bar';
        const text = `**Hello** ${href} _World_`;
        dispatchPasteEvent(editorView, { plain: text });
        expect(editorView.state.doc).toEqualDocument(
          doc(p(strong('Hello'), ' ', link({ href })(href), ' ', em('World'))),
        );
      });

      it('should not create code block for whitespace pre-wrap css', () => {
        const { editorView } = editor(doc(p('{<>}')));
        const href = 'http://example.com/__text__/something';
        const text = `text ${href} text`;
        dispatchPasteEvent(editorView, { plain: text });
        expect(editorView.state.doc).toEqualDocument(
          doc(p('text ', link({ href })(href), ' text')),
        );
      });

      it('should parse Urls with "**text**"', () => {
        const { editorView } = editor(doc(p('{<>}')));
        const href = 'http://example.com/**text**/something';
        const text = `text ${href} text`;
        dispatchPasteEvent(editorView, { plain: text });
        expect(editorView.state.doc).toEqualDocument(
          doc(p('text ', link({ href })(href), ' text')),
        );
      });

      it('should parse Urls with "~~text~~"', () => {
        const { editorView } = editor(doc(p('{<>}')));
        const href = 'http://example.com/~~text~~/something';
        const text = `text ${href} text`;
        dispatchPasteEvent(editorView, { plain: text });
        expect(editorView.state.doc).toEqualDocument(
          doc(p('text ', link({ href })(href), ' text')),
        );
      });

      it('should parse network paths correctly', () => {
        const { editorView } = editor(doc(p('{<>}')));
        const text = `Network:\\\\test\\test\\ Network:\/\/test\/test\/ Network:\\\\test\\test\\`;
        dispatchPasteEvent(editorView, { plain: text });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(
              'Network:\\\\test\\test\\ Network://test/test/ Network:\\\\test\\test\\',
            ),
          ),
        );
      });

      describe('if pasted markdown followed by hyperlink', () => {
        it('should parse markdown and create a hyperlink', () => {
          const { editorView } = editor(doc(p('{<>}')));
          const href = 'http://example.com/?...jql=(foo())bar';
          const text = `**Hello** ${href} _World_`;
          dispatchPasteEvent(editorView, { plain: text });
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p(strong('Hello'), ' ', link({ href })(href), ' ', em('World')),
            ),
          );
        });
      });
    });

    it('should create code-block for multiple lines of code copied', () => {
      const { editorView } = editor(doc(p('{<>}')));
      dispatchPasteEvent(editorView, {
        plain: 'code line 1\ncode line 2',
        html: '<pre>code line 1\ncode line 2</pre>',
      });
      expect(editorView.state.doc).toEqualDocument(
        doc(code_block()('code line 1\ncode line 2'), p('')),
      );
    });

    it('should create code-mark for single lines of code copied', () => {
      const { editorView } = editor(doc(p('{<>}')));
      dispatchPasteEvent(editorView, {
        plain: 'code line 1',
        html: '<pre>code line 1</pre>',
      });
      expect(editorView.state.doc).toEqualDocument(doc(p(code('code line 1'))));
    });

    it('should remove single preceding backtick', () => {
      const { editorView } = editor(doc(p('`{<>}')));
      dispatchPasteEvent(editorView, {
        plain: 'code line 1',
        html: '<pre>code line 1</pre>',
      });
      expect(editorView.state.doc).toEqualDocument(doc(p(code('code line 1'))));
    });

    it('should join adjacent code-blocks if pasted from BitBucket', () => {
      const { editorView } = editor(doc(p('{<>}')));
      dispatchPasteEvent(editorView, {
        plain: 'code line 1\ncode line 2\ncode line 3',
        html:
          '<pre data-qa="code-line">code line 1\ncode line 2</pre><pre data-qa="code-line">code line 3</pre>',
      });
      expect(editorView.state.doc).toEqualDocument(
        doc(code_block()('code line 1\ncode line 2\ncode line 3'), p('')),
      );
    });

    it('should not join adjacent code-blocks if not pasted from BitBucket', () => {
      const { editorView } = editor(doc(p('{<>}')));
      dispatchPasteEvent(editorView, {
        plain: 'code line 1\ncode line 2\ncode line 3',
        html:
          '<pre>code line 1</pre><pre>code line 2</pre><pre>code line 3</pre>',
      });
      expect(editorView.state.doc).toEqualDocument(
        doc(
          code_block()('code line 1'),
          code_block()('code line 2'),
          code_block()('code line 3'),
          p(''),
        ),
      );
    });

    it('should not create paragraph when code is copied inside existing code-block', () => {
      const { editorView } = editor(doc(code_block()('code\n{<>}\ncode')));
      dispatchPasteEvent(editorView, {
        plain: 'code line 1\ncode line 2',
        html: '<pre>code line 1\ncode line 2</pre>',
      });
      expect(editorView.state.doc).toEqualDocument(
        doc(code_block()('code\ncode line 1\ncode line 2\ncode')),
      );
    });

    it('should create paragraph when code block is pasted inside table at end in a table cell', () => {
      const { editorView } = editor(
        doc(table({ localId: TABLE_LOCAL_ID })(tr(tdCursor))),
      );
      dispatchPasteEvent(editorView, {
        plain: 'code line 1\ncode line 2',
        html: '<pre>code line 1\ncode line 2</pre>',
      });
      expect(editorView.state.doc).toEqualDocument(
        doc(
          table({ localId: TABLE_LOCAL_ID })(
            tr(td({})(code_block()('code line 1\ncode line 2'), p(''))),
          ),
        ),
      );
    });

    it('should move selection out of code mark if new code mark is created by pasting', () => {
      const { editorView } = editor(doc(p('{<>}')));
      dispatchPasteEvent(editorView, {
        plain: 'code single line',
        html: '<pre>code single line</pre>',
      });
      expect(editorView.state.storedMarks!.length).toEqual(0);
    });

    it('should not handle events with Files type', () => {
      const { editorView } = editor(doc(p('{<>}')));
      dispatchPasteEvent(editorView, {
        plain: 'my-awesome-mug.png',
        types: ['text/plain', 'Files'],
      });
      expect(editorView.state.doc).toEqualDocument(doc(p('')));
    });

    it('should work properly when pasting multiple link markdowns', () => {
      const { editorView } = editor(doc(p('{<>}')));
      dispatchPasteEvent(editorView, {
        plain:
          '[commit #1 title](https://bitbucket.org/SOME/REPO/commits/commit-id-1)\n' +
          '[commit #2 title](https://bitbucket.org/SOME/REPO/commits/commit-id-2)\n' +
          '[commit #3 title](https://bitbucket.org/SOME/REPO/commits/commit-id-3)\n' +
          '[commit #4 title](https://bitbucket.org/SOME/REPO/commits/commit-id-4)',
      });
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            link({
              href: 'https://bitbucket.org/SOME/REPO/commits/commit-id-1',
            })('commit #1 title'),
            hardBreak(),
            link({
              href: 'https://bitbucket.org/SOME/REPO/commits/commit-id-2',
            })('commit #2 title'),
            hardBreak(),
            link({
              href: 'https://bitbucket.org/SOME/REPO/commits/commit-id-3',
            })('commit #3 title'),
            hardBreak(),
            link({
              href: 'https://bitbucket.org/SOME/REPO/commits/commit-id-4',
            })('commit #4 title'),
          ),
        ),
      );
    });

    describe('actions and decisions', () => {
      beforeEach(() => {
        uuid.setStatic('local-decision');
      });

      afterEach(() => {
        uuid.setStatic(false);
      });

      it('pastes plain text into an action', () => {
        const { editorView, sel } = editor(doc(p('{<>}')));
        insertText(editorView, '[] ', sel);
        dispatchPasteEvent(editorView, { plain: 'plain text' });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            taskList({ localId: 'local-decision' })(
              taskItem({ localId: 'local-decision' })('plain text'),
            ),
          ),
        );
      });

      it('pastes plain text into a decision', () => {
        const { editorView, sel } = editor(doc(p('{<>}')));
        insertText(editorView, '<> ', sel);
        dispatchPasteEvent(editorView, { plain: 'plain text' });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            decisionList({ localId: 'local-decision' })(
              decisionItem({ localId: 'local-decision' })('plain text'),
            ),
          ),
        );
      });

      it('linkifies text pasted into a decision', () => {
        const { editorView, sel } = editor(doc(p('{<>}')));
        insertText(editorView, '<> ', sel);
        dispatchPasteEvent(editorView, { plain: 'google.com' });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            decisionList({ localId: 'local-decision' })(
              decisionItem({ localId: 'local-decision' })(
                a({ href: 'http://google.com' })('google.com'),
              ),
            ),
          ),
        );
      });
    });
  });

  describe('extensions api v2 - auto convert', () => {
    beforeEach(() => {
      uuid.setStatic('testId');
    });

    afterEach(() => {
      uuid.setStatic(false);
    });
    const providerWithAutoConvertHandler = new DefaultExtensionProvider(
      [
        createFakeExtensionManifest({
          title: 'Jira issue',
          type: 'confluence.macro',
          extensionKey: 'jira-issue',
        }),
      ],
      [
        (text: string) => {
          if (text.startsWith(`http://jira-issue-convert`)) {
            return {
              type: 'inlineExtension',
              attrs: {
                extensionType: 'confluence.macro',
                extensionKey: 'jira-issue',
                parameters: {
                  macroParams: {
                    url: text,
                  },
                },
              },
            };
          }
        },
      ],
    );

    const assanaMacroWithAutoConvert = createFakeAutoConvertModule(
      createFakeExtensionManifest({
        title: 'Assana issue',
        type: 'forge.macro',
        extensionKey: 'assana-issue',
      }),
      'url',
      ['foo'],
    );

    const providerWithManifestAutoConvertHandler = new DefaultExtensionProvider(
      [assanaMacroWithAutoConvert],
    );

    const createEditorWithExtensionProviders = async (document: any) => {
      const { editorView } = editor(document, {
        extensionProvider: combineExtensionProviders([
          providerWithAutoConvertHandler,
          providerWithManifestAutoConvertHandler,
        ]),
      });

      await flushPromises();

      return editorView;
    };

    it('should convert based on handlers passed directly to the provider', async () => {
      const editorView = await createEditorWithExtensionProviders(
        doc(p('{<>}')),
      );

      dispatchPasteEvent(editorView, {
        plain: 'http://jira-issue-convert?paramA=CFE',
      });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            inlineExtension({
              extensionType: 'confluence.macro',
              extensionKey: 'jira-issue',
              parameters: {
                macroParams: {
                  url: 'http://jira-issue-convert?paramA=CFE',
                },
              },
              localId: 'testId',
            })(),
          ),
        ),
      );
    });

    it('should convert based on handlers from the manifest', async () => {
      const editorView = await createEditorWithExtensionProviders(
        doc(p('{<>}')),
      );

      dispatchPasteEvent(editorView, {
        plain: 'http://assana-issue-foo?paramA=CFE',
      });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          extension({
            extensionType: 'forge.macro',
            extensionKey: 'assana-issue',
            parameters: {
              url: 'http://assana-issue-foo?paramA=CFE',
            },
            text: 'Assana issue',
            layout: 'default',
            localId: 'testId',
          })(),
        ),
      );
    });
  });

  describe('macroPlugin', () => {
    const providerWrapper = setupProvider({
      type: 'inlineCard',
      attrs: { url: 'https://jdog.jira-dev.com/browse/BENTO-3677' },
    });

    const attrs = {
      extensionType: 'com.atlassian.confluence.macro.core',
      extensionKey: 'dumbMacro',
      parameters: {
        macroParams: { paramA: { value: 'CFE' } },
        macroMetadata: {
          macroId: { value: 12345 },
          placeholder: [
            {
              data: { url: '' },
              type: 'icon',
            },
          ],
        },
      },
      localId: 'testId',
    };

    const extensionProps = (cardOptions: CardOptions = {}): PluginsOptions => {
      return {
        paste: {
          plainTextPasteLinkification: false,
          cardOptions: {
            provider: Promise.resolve(providerWrapper.provider),
            ...cardOptions,
          },
        },
      };
    };

    describe('should convert pasted content to link on selected text', () => {
      it('links text instead of pasting a macro', async () => {
        const macroProvider = Promise.resolve(new MockMacroProvider({}));
        const { editorView } = editor(
          doc(p('This is the {<}selected text{>} here')),
        );
        const href = 'http://www.dumbmacro.com?paramA=CFE';
        await setMacroProvider(macroProvider)(editorView);
        await flushPromises();

        dispatchPasteEvent(editorView, {
          plain: href,
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(p('This is the ', a({ href })('selected text'), ' here')),
        );
        expect(createAnalyticsEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            attributes: expect.objectContaining({
              hyperlinkPasteOnText: true,
            }),
          }),
        );
      });

      it('links text instead of pasting inline card', async () => {
        const macroProvider = Promise.resolve(new MockMacroProvider({}));
        const { editorView } = editor(
          doc(p('This is the {<}selected text{>} here')),
          extensionProps({ resolveBeforeMacros: ['jira'] }),
        );
        const href = 'https://jdog.jira-dev.com/browse/BENTO-3677';

        providerWrapper.addProvider(editorView);
        await setMacroProvider(macroProvider)(editorView);
        await flushPromises();

        await dispatchPasteEvent(editorView, {
          plain: href,
        });

        // let the card resolve
        await flushPromises();
        requestAnimationFrame.step();
        await providerWrapper.waitForRequests();

        expect(editorView.state.doc).toEqualDocument(
          doc(p('This is the ', a({ href })('selected text'), ' here')),
        );

        expect(createAnalyticsEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            attributes: expect.objectContaining({
              hyperlinkPasteOnText: true,
            }),
          }),
        );
      });
    });

    describe('should convert pasted content to inlineExtension (confluence macro)', () => {
      beforeEach(() => {
        uuid.setStatic('testId');
      });

      afterEach(() => {
        uuid.setStatic(false);
      });
      it('from plain text url', async () => {
        const macroProvider = Promise.resolve(new MockMacroProvider({}));
        const { editorView } = editor(doc(p('{<>}')));
        await setMacroProvider(macroProvider)(editorView);
        await flushPromises();

        dispatchPasteEvent(editorView, {
          plain: 'http://www.dumbmacro.com?paramA=CFE',
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(
              inlineExtension({
                ...attrs,
                localId: 'testId',
              })(),
            ),
          ),
        );
      });

      it('inserts inline card when FF for resolving links over extensions is enabled', async () => {
        const macroProvider = Promise.resolve(new MockMacroProvider({}));
        const { editorView, refs } = editor(
          doc(p('{docStart}Hello world{<>}')),
          extensionProps({ resolveBeforeMacros: ['jira'] }),
        );

        providerWrapper.addProvider(editorView);
        await setMacroProvider(macroProvider)(editorView);
        await flushPromises();

        dispatchPasteEvent(editorView, {
          plain: 'https://jdog.jira-dev.com/browse/BENTO-3677',
        });

        // move selection back to the beginning of the document,
        // synchronously, before link resolves, to cover scenario where
        // user clicks elsewhere and continues typing while link is resolving
        const resolvedPos = editorView.state.doc.resolve(refs.docStart);
        editorView.dispatch(
          editorView.state.tr.setSelection(
            new TextSelection(resolvedPos, resolvedPos),
          ),
        );

        // let the card resolve
        await flushPromises();
        requestAnimationFrame.step();
        await providerWrapper.waitForRequests();

        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(
              'Hello world',
              inlineCard({
                url: 'https://jdog.jira-dev.com/browse/BENTO-3677',
              })(),
              ' ',
            ),
          ),
        );
      });

      it('inserts inlineExtension when FF for resolving links over extensions is enabled and resolving the link fails', async () => {
        const macroProvider = Promise.resolve(new MockMacroProvider({}));
        const { editorView, refs } = editor(
          doc(p('{docStart}Hello world{<>}')),
          extensionProps({
            resolveBeforeMacros: ['jira'],
            provider: Promise.resolve(({
              resolve: () => Promise.reject('error'),
            } as unknown) as CardProvider),
          }),
        );

        providerWrapper.addProvider(editorView);
        await setMacroProvider(macroProvider)(editorView);
        await flushPromises();

        dispatchPasteEvent(editorView, {
          plain: 'https://jdog.jira-dev.com/browse/BENTO-3677',
        });

        // move selection back to the beginning of the document,
        // synchronously, before link resolves, to cover scenario where
        // user clicks elsewhere and continues typing while link is resolving
        const resolvedPos = editorView.state.doc.resolve(refs.docStart);
        editorView.dispatch(
          editorView.state.tr.setSelection(
            new TextSelection(resolvedPos, resolvedPos),
          ),
        );

        // let the card resolve
        await flushPromises();
        requestAnimationFrame.step();
        await providerWrapper.waitForRequests();

        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(
              'Hello world',
              inlineExtension({
                extensionType: 'com.atlassian.confluence.macro.core',
                extensionKey: 'jira',
                parameters: {
                  macroParams: {
                    paramA: {
                      value: 'https://jdog.jira-dev.com/browse/BENTO-3677',
                    },
                  },
                  macroMetadata: {
                    macroId: { value: 12345 },
                    placeholder: [
                      {
                        data: { url: '' },
                        type: 'icon',
                      },
                    ],
                  },
                },
                localId: 'testId',
              })(),
            ),
          ),
        );
      });

      it('inserts inlineExtension when FF for resolving links over extensions is disabled', async () => {
        const macroProvider = Promise.resolve(new MockMacroProvider({}));
        const { editorView } = editor(doc(p('{<>}')), extensionProps());

        await setMacroProvider(macroProvider)(editorView);
        await flushPromises();

        dispatchPasteEvent(editorView, {
          plain: 'https://jdog.jira-dev.com/browse/BENTO-3677',
        });

        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(
              inlineExtension({
                extensionType: 'com.atlassian.confluence.macro.core',
                extensionKey: 'jira',
                parameters: {
                  macroParams: {
                    paramA: {
                      value: 'https://jdog.jira-dev.com/browse/BENTO-3677',
                    },
                  },
                  macroMetadata: {
                    macroId: { value: 12345 },
                    placeholder: [
                      {
                        data: { url: '' },
                        type: 'icon',
                      },
                    ],
                  },
                },
                localId: 'testId',
              })(),
            ),
          ),
        );
      });

      it('from url in pasted html', async () => {
        const macroProvider = Promise.resolve(new MockMacroProvider({}));
        const { editorView } = editor(doc(p('{<>}')));
        await setMacroProvider(macroProvider)(editorView);
        await flushPromises();

        dispatchPasteEvent(editorView, {
          plain: 'http://www.dumbmacro.com?paramA=CFE',
          html: `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
          <html>
          <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta http-equiv="Content-Style-Type" content="text/css">
          <title></title>
          <meta name="Generator" content="Cocoa HTML Writer">
          <meta name="CocoaVersion" content="1561.6">
          <style type="text/css">
          p.p1 {margin: 0.0px 0.0px 0.0px 0.0px; font: 26.0px 'Helvetica Neue'; color: #000000}
          </style>
          </head>
          <body>
          <p class="p1">http://www.dumbmacro.com?paramA=CFE</p>
          </body>
          </html>
          `,
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(
              inlineExtension({
                ...attrs,
                localId: 'testId',
              })(),
            ),
          ),
        );
      });
    });
  });

  describe('paste bodiedExtension inside another bodiedExtension', () => {
    it('should remove bodiedExtension from the pasted content, paste only content', () => {
      const attrs = {
        extensionType: 'com.atlassian.confluence.macro.core',
        extensionKey: 'expand',
        localId: 'testId',
      };
      const { editorView } = editor(doc(bodiedExtension(attrs)(p('{<>}'))));
      dispatchPasteEvent(editorView, {
        html: `<meta charset='utf-8'><p data-pm-context="[]">text</p><div data-node-type="bodied-extension" data-extension-type="com.atlassian.confluence.macro.core" data-extension-key="expand" data-parameters="{&quot;macroMetadata&quot;:{&quot;macroId&quot;:{&quot;value&quot;:1521116439714},&quot;schemaVersion&quot;:{&quot;value&quot;:&quot;2&quot;},&quot;placeholder&quot;:[{&quot;data&quot;:{&quot;url&quot;:&quot;//pug.jira-dev.com/wiki/plugins/servlet/confluence/placeholder/macro?definition=e2V4cGFuZH0&amp;locale=en_GB&amp;version=2&quot;},&quot;type&quot;:&quot;image&quot;}]}}"><p>content</p></div>`,
      });
      expect(editorView.state.doc).toEqualDocument(
        doc(bodiedExtension(attrs)(p('text'), p('content'))),
      );
    });
  });

  describe('paste part of bodied extension as test', () => {
    it('should remove bodiedExtension from the pasted content, paste only text', () => {
      const attrs = {
        extensionType: 'com.atlassian.confluence.macro.core',
        extensionKey: 'expand',
        localId: 'testId',
      };
      const { editorView } = editor(
        doc(bodiedExtension(attrs)(p('Hello')), p('{<>}')),
      );

      dispatchPasteEvent(editorView, {
        html: `<meta charset='utf-8'><p data-pm-slice=1 1 [&quot;bodiedExtension&quot;,null]>llo</p>`,
      });

      expect(editorView.state.doc).toEqualDocument(
        doc(bodiedExtension(attrs)(p('Hello')), p('llo')),
      );
    });
  });

  describe('panel copy-paste', () => {
    it('should paste a panel when it is copied from editor / renderer', () => {
      const html = `
        <meta charset='utf-8'>
          <p>hello</p>
          <div class="ak-editor-panel" data-panel-type="info"><span class="ak-editor-panel__icon"><span class="Icon__IconWrapper-dyhwwi-0 bcqBjl" aria-label="Panel info"><svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><path d="M12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm0-8.5a1 1 0 0 0-1 1V15a1 1 0 0 0 2 0v-2.5a1 1 0 0 0-1-1zm0-1.125a1.375 1.375 0 1 0 0-2.75 1.375 1.375 0 0 0 0 2.75z" fill="currentColor" fill-rule="evenodd"></path></svg></span></span><div class="ak-editor-panel__content"><p>Inside panel</p></div></div>
          <p>world</p>
      `;

      const { editorView } = editor(doc(p('{<>}')));
      dispatchPasteEvent(editorView, { html });
      expect(editorView.state.doc).toEqualDocument(
        doc(p('hello'), panel()(p('Inside panel')), p('world')),
      );
    });
  });

  describe('table copy-paste', () => {
    beforeEach(() => {
      uuid.setStatic(TABLE_LOCAL_ID);
    });

    afterEach(() => {
      uuid.setStatic(false);
    });

    it('should handle bad copy-paste from table cell with hard break', () => {
      const { editorView } = editor(
        doc(table({ localId: TABLE_LOCAL_ID })(tr(td()(p('{<>}'))))),
      );

      dispatchPasteEvent(editorView, {
        html: `<meta charset='utf-8'><table data-number-column="true" style="margin: 24px 0px 0px; border-collapse: collapse; width: 678.889px; border: 1px solid rgb(193, 199, 208); table-layout: fixed; font-size: 14px; color: rgb(23, 43, 77); font-family: -apple-system, system-ui, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;"><tbody style="border-bottom: none; box-sizing: border-box;"><tr style="box-sizing: border-box;"><td rowspan="1" colspan="1" style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; box-sizing: border-box; min-width: 48px; font-weight: normal; vertical-align: top; background-clip: padding-box;"><p style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;">TEST WITH HARDBREAK<br style="box-sizing: border-box;"></p></td><td rowspan="1" colspan="1" style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; box-sizing: border-box; min-width: 48px; font-weight: normal; vertical-align: top; background-clip: padding-box;"></tr></tbody></table><br class="Apple-interchange-newline">`,
      });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table({ localId: TABLE_LOCAL_ID })(
            tr(td()(p('TEST WITH HARDBREAK')), td()(p(''))),
          ),
        ),
      );
    });

    describe('when pasting cells from a third-party table', () => {
      it('should wrap text following a list and hard break in a paragraph node', () => {
        const { editorView } = editor(doc(table({})(tr(td()(p('{<>}'))))));

        // The HTML contains <td>1. Some<br/>Text</td>
        dispatchPasteEvent(editorView, {
          html: `<meta charset='utf-8'><google-sheets-html-origin><style type="text/css"><!--td {border: 1px solid #ccc;}br {mso-data-placement:same-cell;}--></style><table xmlns="http://www.w3.org/1999/xhtml" cellspacing="0" cellpadding="0" dir="ltr" border="1" style="table-layout:fixed;font-size:10pt;font-family:Arial;width:0px;border-collapse:collapse;border:none"><colgroup><col width="100"/></colgroup><tbody><tr style="height:21px;"><td style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;" data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;1. Lorem\nIpsum&quot;}">1. Lorem<br/>Ipsum</td></tr><tr style="height:21px;"><td style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;"></td></tr></tbody></table>`,
        });

        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(td()(ol(li(p('Lorem'))), p('Ipsum'))),
              tr(td()(p())),
            ),
          ),
        );
      });

      describe('pasted from confluence tinyMCE editor', () => {
        beforeEach(() => {
          uuid.setStatic(TABLE_LOCAL_ID);
        });
        afterEach(() => {
          uuid.setStatic(false);
        });

        const onlyTableHeadersAndCellsFromTinyMCEConfluence = `<meta charset="utf-8" /><th class="confluenceTh mceSelected">a</th><th class="confluenceTh mceSelected">b</th><th class="confluenceTh mceSelected">c</th><td class="confluenceTd mceSelected">d</td><td class="confluenceTd mceSelected">e</td><td class="confluenceTd mceSelected">f</td><td class="confluenceTd mceSelected">g</td><td class="confluenceTd mceSelected">h</td><td class="confluenceTd mceSelected">i</td>`;
        const onlyTableHeadersAndCellsWithIncompleteRowFromTinyMCEConfluence = `<meta charset="utf-8" /><th class="confluenceTh mceSelected">a</th><th class="confluenceTh mceSelected">b</th><th class="confluenceTh mceSelected">c</th><td class="confluenceTd mceSelected">d</td><td class="confluenceTd mceSelected">e</td><td class="confluenceTd mceSelected">f</td> <td class="confluenceTd mceSelected">g</td>`;
        const onlyTableHeadersAndCellsFromTinyMCENonConfluence = onlyTableHeadersAndCellsFromTinyMCEConfluence.replace(
          /confluenceTh|confluenceTd|confluenceTable/g,
          '',
        );
        const onlyTableHeadersCellsDoubleHeaderRowFromTinyMCEConfluence = `<meta charset="utf-8" /><th class="confluenceTh">ha</th><th class="confluenceTh">ha</th><th class="confluenceTh">ha</th><th class="confluenceTh" colspan="1" width="">hb</th><th class="confluenceTh" colspan="1" width="">hb</th><th class="confluenceTh" colspan="1" width="">hb</th><td class="confluenceTd">a</td><td class="confluenceTd">a</td><td class="confluenceTd">a</td><td class="confluenceTd">b</td><td class="confluenceTd">b</td><td class="confluenceTd">b</td>`;
        const onlyTableCellsFromTinyMCEConfluence = `<meta charset="utf-8" /><td class="confluenceTd mceSelected">a</td><td class="confluenceTd mceSelected">a</td><td class="confluenceTd mceSelected" colspan="1" width="">a</td><td class="confluenceTd mceSelected">b</td><td class="confluenceTd mceSelected">b</td><td class="confluenceTd mceSelected" colspan="1" width="">b</td><td class="confluenceTd mceSelected">c</td><td class="confluenceTd mceSelected">c</td><td class="confluenceTd mceSelected" colspan="1" width="">c</td>`;
        const onlyTableHeadersAfterCellsFromTinyMCEConfluence = `<meta charset="utf-8" /><td class="confluenceTd mceSelected">a</td><th class="confluenceTd mceSelected">b</th><td class="confluenceTd mceSelected">c</td>`;
        const onlyTableHeadersAndCellsAndRowFromTinyMCEConfluence = `<meta charset="utf-8" /><tr><td>extra row</td></tr><th class="confluenceTh mceSelected">a</th><th class="confluenceTh mceSelected">b</th><td class="confluenceTd mceSelected">c</td><td class="confluenceTd mceSelected">d</td>`;
        const onlyTableHeadersAndCellsWithNestedInsertedMediaFromTinyMCEConfluence = `<meta charset='utf-8'><th class="confluenceTh mceSelected">a</th><th class="confluenceTh mceSelected">b</th><th class="confluenceTh mceSelected">c</th><td class="confluenceTd mceSelected">d</td><td class="confluenceTd mceSelected"><div class="content-wrapper"><p><img class="confluence-embedded-image confluence-thumbnail" title="Product Management Craft &gt; APM presenter hit list &gt; some-photo.png" data-linked-resource-default-alias="some-photo.png" data-linked-resource-container-id="248651555" data-linked-resource-container-version="5" data-attachment-copy="" height="150" data-location="Product Management Craft &gt; APM presenter hit list &gt; some-photo.png" border="0" data-linked-resource-id="1393104613" src="https://hello.atlassian.net/wiki/download/thumbnails/248651555/some-photo.png?version=1&amp;modificationDate=1635802112476&amp;cacheVersion=1&amp;api=v2" data-linked-resource-version="1" data-linked-resource-type="attachment" data-unresolved-comment-count="0" data-linked-resource-content-type="image/png" data-media-type="file" data-media-id="821a8389-2305-4281-9523-f309723ef356" data-base-url="https://hello.atlassian.net/wiki" data-image-width="608" data-image-src="https://hello.atlassian.net/wiki/download/attachments/248651555/some-photo.png?version=1&amp;modificationDate=1635802112476&amp;cacheVersion=1&amp;api=v2" data-image-height="344" /></p></div></td><td class="confluenceTd mceSelected">f</td><td class="confluenceTd mceSelected" colspan="1" width="">g</td><td class="confluenceTd mceSelected" colspan="1" width="">h</td><td class="confluenceTd mceSelected" colspan="1" width="">i</td>`;
        const onlyTableHeadersAndCellsWithNestedCopiedMediaFromTinyMCEConfluence = `<meta charset='utf-8'><td class="confluenceTd mceSelected">a</td><td class="confluenceTd mceSelected" colspan="1" width="">a</td><td class="confluenceTd mceSelected">b</td><td class="confluenceTd mceSelected" colspan="1" width="">b</td><td class="confluenceTd mceSelected"><img class="confluence-embedded-image confluence-thumbnail" title="Product Management Craft &gt; APM presenter hit list &gt; some-photo.png" data-linked-resource-default-alias="some-photo.png" data-linked-resource-container-id="248651555" data-linked-resource-container-version="5" data-attachment-copy="" height="150" data-location="Product Management Craft &gt; APM presenter hit list &gt; some-photo.png" border="0" data-linked-resource-id="1393104613" src="https://hello.atlassian.net/wiki/download/thumbnails/248651555/some-photo.png?version=1&amp;modificationDate=1635802112476&amp;cacheVersion=1&amp;api=v2" data-linked-resource-version="1" data-linked-resource-type="attachment" data-unresolved-comment-count="0" data-linked-resource-content-type="image/png" data-media-type="file" data-media-id="821a8389-2305-4281-9523-f309723ef356" data-base-url="https://hello.atlassian.net/wiki" data-image-width="608" data-image-src="https://hello.atlassian.net/wiki/download/attachments/248651555/some-photo.png?version=1&amp;modificationDate=1635802112476&amp;cacheVersion=1&amp;api=v2" data-image-height="344" /></td><td class="confluenceTd mceSelected" colspan="1" width="">c</td><td class="confluenceTd mceSelected">d</td><td class="confluenceTd mceSelected" colspan="1" width="">d</td><td class="confluenceTd mceSelected" colspan="1" width="">e</td><td class="confluenceTd mceSelected" colspan="1" width=""><img class="confluence-embedded-image confluence-thumbnail" title="Product Management Craft &gt; APM presenter hit list &gt; some-photo.png" data-linked-resource-default-alias="some-photo.png" data-linked-resource-container-id="248651555" data-linked-resource-container-version="5" data-attachment-copy="" height="150" data-location="Product Management Craft &gt; APM presenter hit list &gt; some-photo.png" border="0" data-linked-resource-id="1393104613" src="https://hello.atlassian.net/wiki/download/thumbnails/248651555/some-photo.png?version=1&amp;modificationDate=1635802112476&amp;cacheVersion=1&amp;api=v2" data-linked-resource-version="1" data-linked-resource-type="attachment" data-unresolved-comment-count="0" data-linked-resource-content-type="image/png" data-media-type="file" data-media-id="821a8389-2305-4281-9523-f309723ef356" data-base-url="https://hello.atlassian.net/wiki" data-image-width="608" data-image-src="https://hello.atlassian.net/wiki/download/attachments/248651555/some-photo.png?version=1&amp;modificationDate=1635802112476&amp;cacheVersion=1&amp;api=v2" data-image-height="344" /></td><td class="confluenceTd mceSelected" colspan="1" width="">f</td><td class="confluenceTd mceSelected" colspan="1" width="">f</td>`;
        const onlyTableHeadersAndMergedCellsFromTinyMCEConfluence = `<meta charset="utf-8" /><th class="confluenceTh mceSelected"><br /></th><th class="confluenceTh mceSelected"><br /></th><td class="confluenceTd mceSelected" colspan="2"><br /></td>`;
        const completeTableAndElementsAboveFromTinyMCEConfluence = `<meta charset="utf-8" /><p class="auto-cursor-target">outside above</p><table class="confluenceTable"><colgroup><col /><col /></colgroup><tbody><tr><th class="confluenceTh">a</th><th class="confluenceTh">b</th></tr><tr><td class="confluenceTd">c</td><td class="confluenceTd">d</td></tr></tbody></table>`;
        const completeTableAndElementsBelowFromTinyMCEConfluence = `<meta charset="utf-8" /><table class="confluenceTable"><tbody><tr><th class="confluenceTh">a</th><th class="confluenceTh">b</th></tr><tr><td class="confluenceTd">c</td><td class="confluenceTd">d</td></tr></tbody></table><p class="auto-cursor-target">outside below</p>`;
        const completeTableAndElementsAboveAndBelowFromTinyMCEConfluence = `<meta charset="utf-8" /><p class="auto-cursor-target">outside above</p><table class="confluenceTable"><colgroup><col /><col /></colgroup><tbody><tr><th class="confluenceTh">a</th><th class="confluenceTh">b</th></tr><tr><td class="confluenceTd">c</td><td class="confluenceTd">d</td></tr></tbody></table><p class="auto-cursor-target">outside below</p>`;

        it('should try to reconstruct table rows when only top-level <th> and <td> elements copied from confluence tinyMCE editor', () => {
          const { editorView } = editor(doc(p('{<>}')));

          dispatchPasteEvent(editorView, {
            html: onlyTableHeadersAndCellsFromTinyMCEConfluence,
            types: ['x-tinymce/html'],
          });

          expect(editorView.state.doc).toEqualDocument(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(th()(p('a')), th()(p('b')), th()(p('c'))),
                tr(td()(p('d')), td()(p('e')), td()(p('f'))),
                tr(td()(p('g')), td()(p('h')), td()(p('i'))),
              ),
            ),
          );
        });

        it('should NOT try to reconstruct table rows when <th> exists after <td> (complex table configuration) when copied from confluence tinyMCE editor', () => {
          const { editorView } = editor(doc(p('{<>}')));

          dispatchPasteEvent(editorView, {
            html: onlyTableHeadersAfterCellsFromTinyMCEConfluence,
            types: ['x-tinymce/html'],
          });

          expect(editorView.state.doc).toEqualDocument(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(td()(p('a')), th()(p('b')), td()(p('c'))),
              ),
            ),
          );
        });

        it('should allow other editor paste logic to fill out uneven table rows when <th>, <td> and <tr> elements are copied from confluence tinyMCE editor', () => {
          const { editorView } = editor(doc(p('{<>}')));

          dispatchPasteEvent(editorView, {
            html: onlyTableHeadersAndCellsAndRowFromTinyMCEConfluence,
            types: ['x-tinymce/html'],
          });

          expect(editorView.state.doc).toEqualDocument(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(td()(p()), td()(p()), td()(p()), td()(p('extra row'))),
                tr(th()(p('a')), th()(p('b')), td()(p('c')), td()(p('d'))),
              ),
            ),
          );
        });

        it('should try to reconstruct table rows when only top-level <th> and <td> elements (with nested media added by insertion e.g. images) copied from confluence tinyMCE editor', () => {
          const { editorView } = editor(doc(p('{<>}')));

          dispatchPasteEvent(editorView, {
            html: onlyTableHeadersAndCellsWithNestedInsertedMediaFromTinyMCEConfluence,
            types: ['x-tinymce/html'],
          });

          expect(editorView.state.doc).toEqualDocument(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(th()(p('a')), th()(p('b')), th()(p('c'))),
                tr(
                  td()(p('d')),
                  td()(
                    mediaSingle()(
                      media({
                        __external: true,
                        alt: '',
                        type: 'external',
                        url:
                          'https://hello.atlassian.net/wiki/download/thumbnails/248651555/some-photo.png?version=1&modificationDate=1635802112476&cacheVersion=1&api=v2',
                      })(),
                    ),
                  ),
                  td()(p('f')),
                ),
                tr(td()(p('g')), td()(p('h')), td()(p('i'))),
              ),
            ),
          );
        });

        it('should try to reconstruct table rows when only top-level <th> and <td> elements (with nested media added by copying from media on-page e.g. images) copied from confluence tinyMCE editor', () => {
          const { editorView } = editor(doc(p('{<>}')));

          dispatchPasteEvent(editorView, {
            html: onlyTableHeadersAndCellsWithNestedCopiedMediaFromTinyMCEConfluence,
            types: ['x-tinymce/html'],
          });

          expect(editorView.state.doc).toEqualDocument(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(td()(p('a'))),
                tr(td()(p('a'))),
                tr(td()(p('b'))),
                tr(td()(p('b'))),
                tr(
                  td()(
                    mediaSingle()(
                      media({
                        __external: true,
                        alt: '',
                        type: 'external',
                        url:
                          'https://hello.atlassian.net/wiki/download/thumbnails/248651555/some-photo.png?version=1&modificationDate=1635802112476&cacheVersion=1&api=v2',
                      })(),
                    ),
                  ),
                ),
                tr(td()(p('c'))),
                tr(td()(p('d'))),
                tr(td()(p('d'))),
                tr(td()(p('e'))),
                tr(
                  td()(
                    mediaSingle()(
                      media({
                        __external: true,
                        alt: '',
                        type: 'external',
                        url:
                          'https://hello.atlassian.net/wiki/download/thumbnails/248651555/some-photo.png?version=1&modificationDate=1635802112476&cacheVersion=1&api=v2',
                      })(),
                    ),
                  ),
                ),
                tr(td()(p('f'))),
                tr(td()(p('f'))),
              ),
            ),
          );
        });

        it('should try to fill out incomplete table rows when reconstructing table rows, when only top-level <th> and <td> elements copied from confluence tinyMCE editor', () => {
          const { editorView } = editor(doc(p('{<>}')));

          dispatchPasteEvent(editorView, {
            html: onlyTableHeadersAndCellsWithIncompleteRowFromTinyMCEConfluence,
            types: ['x-tinymce/html'],
          });

          expect(editorView.state.doc).toEqualDocument(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(th()(p('a')), th()(p('b')), th()(p('c'))),
                tr(td()(p('d')), td()(p('e')), td()(p('f'))),
                tr(td()(p('g')), td()(p()), td()(p())),
              ),
            ),
          );
        });

        it('should construct longest possible <th> row when reconstructing table rows when only top-level <th> and <td> cells copied from confluence tinyMCE editor', () => {
          const { editorView } = editor(doc(p('{<>}')));

          dispatchPasteEvent(editorView, {
            html: onlyTableHeadersCellsDoubleHeaderRowFromTinyMCEConfluence,
            types: ['x-tinymce/html'],
          });

          expect(editorView.state.doc).toEqualDocument(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(
                  th()(p('ha')),
                  th()(p('ha')),
                  th()(p('ha')),
                  th()(p('hb')),
                  th()(p('hb')),
                  th()(p('hb')),
                ),
                tr(
                  td()(p('a')),
                  td()(p('a')),
                  td()(p('a')),
                  td()(p('b')),
                  td()(p('b')),
                  td()(p('b')),
                ),
              ),
            ),
          );
        });

        it('should construct a single row table (previous default behaviour) when top-level <th> and <td> cells copied from non-confluence tinyMCE editor', () => {
          const { editorView } = editor(doc(p('{<>}')));

          dispatchPasteEvent(editorView, {
            html: onlyTableHeadersAndCellsFromTinyMCENonConfluence,
            types: ['x-tinymce/html'],
          });

          expect(editorView.state.doc).toEqualDocument(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(
                  th()(p('a')),
                  th()(p('b')),
                  th()(p('c')),
                  td()(p('d')),
                  td()(p('e')),
                  td()(p('f')),
                  td()(p('g')),
                  td()(p('h')),
                  td()(p('i')),
                ),
              ),
            ),
          );
        });

        it('should construct a single row table (previous default behaviour) when top-level <th> and merged <td> cells copied from confluence tinyMCE editor', () => {
          const { editorView } = editor(doc(p('{<>}')));

          dispatchPasteEvent(editorView, {
            html: onlyTableHeadersAndMergedCellsFromTinyMCEConfluence,
            types: ['x-tinymce/html'],
          });

          expect(editorView.state.doc).toEqualDocument(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(th()(p()), th()(p()), td({ colspan: 2 })(p())),
              ),
            ),
          );
        });

        it('should construct a single column table when only top-level <td> cells copied from confluence tinyMCE editor', () => {
          const { editorView } = editor(doc(p('{<>}')));

          dispatchPasteEvent(editorView, {
            html: onlyTableCellsFromTinyMCEConfluence,
            types: ['x-tinymce/html'],
          });

          expect(editorView.state.doc).toEqualDocument(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(td()(p('a'))),
                tr(td()(p('a'))),
                tr(td()(p('a'))),
                tr(td()(p('b'))),
                tr(td()(p('b'))),
                tr(td()(p('b'))),
                tr(td()(p('c'))),
                tr(td()(p('c'))),
                tr(td()(p('c'))),
              ),
            ),
          );
        });

        it('should construct a complete table (previous default behaviour) when <table> with elements above (e.g. paragraphs) copied from confluence tinyMCE editor', () => {
          const { editorView } = editor(doc(p('{<>}')));

          dispatchPasteEvent(editorView, {
            html: completeTableAndElementsAboveFromTinyMCEConfluence,
            types: ['x-tinymce/html'],
          });

          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('outside above'),
              table({ localId: TABLE_LOCAL_ID })(
                tr(th()(p('a')), th()(p('b'))),
                tr(td()(p('c')), td()(p('d'))),
              ),
            ),
          );
        });

        it('should construct a complete table (previous default behaviour) when <table> with elements below (e.g. paragraphs) copied from confluence tinyMCE editor', () => {
          const { editorView } = editor(doc(p('{<>}')));

          dispatchPasteEvent(editorView, {
            html: completeTableAndElementsBelowFromTinyMCEConfluence,
            types: ['x-tinymce/html'],
          });

          expect(editorView.state.doc).toEqualDocument(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(th()(p('a')), th()(p('b'))),
                tr(td()(p('c')), td()(p('d'))),
              ),
              p('outside below'),
            ),
          );
        });

        it('should construct a complete table (previous default behaviour) when <table> with elements above and below (e.g. paragraphs) copied from confluence tinyMCE editor', () => {
          const { editorView } = editor(doc(p('{<>}')));

          dispatchPasteEvent(editorView, {
            html: completeTableAndElementsAboveAndBelowFromTinyMCEConfluence,
            types: ['x-tinymce/html'],
          });

          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('outside above'),
              table({ localId: TABLE_LOCAL_ID })(
                tr(th()(p('a')), th()(p('b'))),
                tr(td()(p('c')), td()(p('d'))),
              ),
              p('outside below'),
            ),
          );
        });
      });
    });

    describe('when pasted list where openStart > openEnd', () => {
      beforeEach(() => {
        uuid.setStatic(TABLE_LOCAL_ID);
      });

      afterEach(() => {
        uuid.setStatic(false);
      });

      it('should flatten the list and dont split the table', () => {
        const { editorView } = editor(doc(table({})(tr(td()(p('{<>}'))))));
        const html = `<meta charset='utf-8'><ul class="ak-ul" data-pm-slice="5 3 []"><li><ul class="ak-ul"><li><p>2</p></li></ul></li><li><p>3</p></li></ul>`;

        dispatchPasteEvent(editorView, { html });

        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(td()(ul(li(p('2')), li(p('3'))))),
            ),
          ),
        );
      });
    });

    it('should handle numbered table copied inside editor', () => {
      const { editorView } = editor(doc(p('{<>}')));

      const html = `<meta charset='utf-8'><table data-table-local-id=${TABLE_LOCAL_ID} data-number-column="true" data-layout="default" data-autosize="false" data-pm-slice="1 1 []"><tbody><tr><th><p>One</p></th><th><p>Two</p></th></tr><tr><td><p>Three</p></td><td><p>Four</p></td></tr><tr><td><p>Five</p></td><td><p>Six</p></td></tr></tbody></table>`;

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table({ isNumberColumnEnabled: true, localId: TABLE_LOCAL_ID })(
            tr(th()(p('One')), th()(p('Two'))),
            tr(td()(p('Three')), td()(p('Four'))),
            tr(td()(p('Five')), td()(p('Six'))),
          ),
        ),
      );
    });

    it('should handle numbered table copied from renderer', () => {
      const { editorView } = editor(doc(p('{<>}')));

      const html = `<meta charset='utf-8'><div class="pm-table-container " data-layout="default" style="margin: 0px auto 16px; padding: 0px; position: relative; box-sizing: border-box; transition: all 0.1s linear 0s; clear: both; color: rgb(23, 43, 77); font-family: -apple-system, system-ui, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial; width: inherit;"><div class="pm-table-wrapper" style="margin: 0px; padding: 0px; overflow-x: auto;"><table data-table-local-id=${TABLE_LOCAL_ID} data-number-column="true" style="margin: 24px 0px 0px; border-collapse: collapse; width: 654px; border: 1px solid rgb(193, 199, 208); table-layout: fixed; font-size: 14px;"><colgroup style="box-sizing: border-box;"><col style="box-sizing: border-box; width: 42px;"><col style="box-sizing: border-box;"><col style="box-sizing: border-box;"></colgroup><tbody style="border-bottom: none; box-sizing: border-box;"><tr style="box-sizing: border-box;"><td class="ak-renderer-table-number-column" style="border-width: 1px 1px 0px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 10px; text-align: center; box-sizing: border-box; min-width: 48px; height: 3em; vertical-align: top; background-clip: padding-box; background-color: rgb(244, 245, 247); width: 42px; color: rgb(107, 119, 140); font-size: 14px;"></td><th rowspan="1" colspan="1" style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 10px; text-align: left; vertical-align: top; box-sizing: border-box; min-width: 48px; height: 3em; background-clip: padding-box; background-color: rgb(244, 245, 247);"><p style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;">One</p></th><th rowspan="1" colspan="1" style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 10px; text-align: left; vertical-align: top; box-sizing: border-box; min-width: 48px; height: 3em; background-clip: padding-box; background-color: rgb(244, 245, 247);"><p style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;">Two</p></th></tr><tr style="box-sizing: border-box;"><td class="ak-renderer-table-number-column" style="border-width: 1px 1px 0px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 10px; text-align: center; box-sizing: border-box; min-width: 48px; height: 3em; vertical-align: top; background-clip: padding-box; background-color: rgb(244, 245, 247); width: 42px; color: rgb(107, 119, 140); font-size: 14px;">1</td><td rowspan="1" colspan="1" style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 10px; text-align: left; box-sizing: border-box; min-width: 48px; height: 3em; vertical-align: top; background-clip: padding-box;"><p style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;">Three</p></td><td rowspan="1" colspan="1" style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 10px; text-align: left; box-sizing: border-box; min-width: 48px; height: 3em; vertical-align: top; background-clip: padding-box;"><p style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;">Four</p></td></tr><tr style="box-sizing: border-box;"><td class="ak-renderer-table-number-column" style="border-width: 1px 1px 0px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 10px; text-align: center; box-sizing: border-box; min-width: 48px; height: 3em; vertical-align: top; background-clip: padding-box; background-color: rgb(244, 245, 247); width: 42px; color: rgb(107, 119, 140); font-size: 14px;">2</td><td rowspan="1" colspan="1" style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 10px; text-align: left; box-sizing: border-box; min-width: 48px; height: 3em; vertical-align: top; background-clip: padding-box;"><p style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;">Five</p></td><td rowspan="1" colspan="1" style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 10px; text-align: left; box-sizing: border-box; min-width: 48px; height: 3em; vertical-align: top; background-clip: padding-box;"><p style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;">Six</p></td></tr></tbody></table></div></div>`;

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table({ isNumberColumnEnabled: true, localId: TABLE_LOCAL_ID })(
            tr(th()(p('One')), th()(p('Two'))),
            tr(td()(p('Three')), td()(p('Four'))),
            tr(td()(p('Five')), td()(p('Six'))),
          ),
        ),
      );
    });

    it('should paste table with cells that don`t have paragraphs', () => {
      const { editorView } = editor(doc(p('{<>}')));

      const html = `<meta charset='utf-8'><meta name="generator" content="Sheets"/><style type="text/css"><!--td {border: 1px solid #ccc;}br {mso-data-placement:same-cell;}--></style><table data-table-local-id=${TABLE_LOCAL_ID} xmlns="http://www.w3.org/1999/xhtml" cellspacing="0" cellpadding="0" dir="ltr" border="1" style="table-layout:fixed;font-size:10pt;font-family:arial,sans,sans-serif;width:0px;border-collapse:collapse;border:none"><colgroup><col width="100"/><col width="86"/></colgroup><tbody><tr style="height:21px;"><td style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;"></td><td style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;text-align:right;" data-sheets-value="{&quot;1&quot;:3,&quot;3&quot;:2}">2</td></tr><tr style="height:21px;"><td style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;text-align:right;" data-sheets-value="{&quot;1&quot;:3,&quot;3&quot;:3}">3</td><td style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;text-align:right;" data-sheets-value="{&quot;1&quot;:3,&quot;3&quot;:4}">4</td></tr></tbody></table>`;

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table({ localId: TABLE_LOCAL_ID })(
            tr(td()(p('')), td()(p('2'))),
            tr(td()(p('3')), td()(p('4'))),
          ),
        ),
      );
    });

    describe('cell with background color', () => {
      const html = `<meta charset='utf-8'><table data-table-local-id=${TABLE_LOCAL_ID} data-number-column="false" data-layout="default" data-autosize="false" data-pm-slice="1 1 []"><tbody><tr><th class="pm-table-header-content-wrap"><p></p></th></tr><tr><td style="background-color: #ffebe6;" class="pm-table-cell-content-wrap"><p></p></td></tr></tbody></table>`;

      it('should keep cell background on paste when allow background color is enabled', () => {
        const { editorView } = editor(doc(p('{<>}')), {
          table: {
            advanced: true,
          },
        });

        dispatchPasteEvent(editorView, { html });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(th()(p(''))),
              tr(
                td({
                  background: '#ffebe6',
                })(p('')),
              ),
            ),
          ),
        );
      });

      it('should remove cell background on paste when allow background color is disabled', () => {
        const { editorView } = editor(doc(p('{<>}')), {
          table: {
            advanced: true,
            allowBackgroundColor: false,
          },
        });

        dispatchPasteEvent(editorView, { html });

        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(th()(p(''))),
              tr(td()(p(''))),
            ),
          ),
        );
      });
    });

    describe('cell with colWidth', () => {
      const cellWithColWidthHtml = `<meta charset='utf-8'><table data-table-local-id=${TABLE_LOCAL_ID} data-pm-slice="1 1 []"><tbody><tr><td data-colwidth="96" style="" class="pm-table-cell-content-wrap"><div class="pm-table-cell-nodeview-wrapper"><div class="pm-table-cell-nodeview-content-dom"><p></p></div></div></td><td data-colwidth="122" style="" class="pm-table-cell-content-wrap"><div class="pm-table-cell-nodeview-wrapper"><div class="pm-table-cell-nodeview-content-dom"><p></p></div></div></td></tr></tbody></table>`;

      it('should keep colwidth attribute when allow column resizing is enabled', () => {
        const { editorView } = editor(doc(p('{<>}')), {
          table: {
            allowColumnResizing: true,
          },
        });

        dispatchPasteEvent(editorView, { html: cellWithColWidthHtml });

        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(td({ colwidth: [96] })(p('')), td({ colwidth: [122] })(p(''))),
            ),
          ),
        );
      });

      it('should remove colwidth attribute when allow column resizing is disabled', () => {
        const { editorView } = editor(doc(p('{<>}')), {
          table: {
            allowColumnResizing: false,
          },
        });

        dispatchPasteEvent(editorView, { html: cellWithColWidthHtml });

        expect(editorView.state.doc).toEqualDocument(
          doc(table({ localId: TABLE_LOCAL_ID })(tr(td()(p('')), td()(p(''))))),
        );
      });
    });
  });

  describe('code-block copy-paste', () => {
    it('should persist selected language from clipboard', () => {
      const content = doc(
        '{<}',
        code_block({ language: 'javascript' })(
          'Shiver me timbers quarterdeck.',
        ),
        p('{>}'),
      );
      const { editorView } = editor(content);

      // Copy code block
      const { dom, text } = __serializeForClipboard(
        editorView,
        editorView.state.selection.content(),
      );

      // Paste code block
      dispatchPasteEvent(editorView, { html: dom.innerHTML, plain: text });
      expect(editorView.state.doc).toEqualDocument(content);
    });
  });

  describe('emoji copy-paste', () => {
    it('should handle emoji as sprite copied from renderer', () => {
      const { editorView } = editor(doc(p('{<>}')));

      const html = `<meta charset='utf-8'><span data-emoji-id="1f44d" data-emoji-short-name=":thumbsup:" data-emoji-text="👍" style="color: rgb(23, 43, 77); font-family: -apple-system, system-ui, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: -0.07px; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;"><span class="f1yhv2qy emoji-common-node" aria-label=":thumbsup:" style="display: inline-block; margin: -1px 0px;"><span><span class="emoji-common-emoji-sprite" style="background: url(&quot;https://pf-emoji-service--cdn.us-east-1.staging.public.atl-paas.net/standard/a51a7674-8d5d-4495-a2d2-a67c090f5c3b/64x64/spritesheets/people.png&quot;) 69.4444% 8.57143% / 3700% 3600% no-repeat transparent; display: inline-block; height: 20px; vertical-align: middle; width: 20px;"> </span></span></span></span><span style="color: rgb(23, 43, 77); font-family: -apple-system, system-ui, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: -0.07px; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;"></span>`;

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(p(emoji({ id: '1f44d', shortName: ':thumbsup:', text: '👍' })())),
      );
    });
    it('should handle emoji as image copied from renderer', () => {
      const { editorView } = editor(doc(p('{<>}')));

      const html = `<meta charset='utf-8'><span data-emoji-id="atlassian-yellow_star" data-emoji-short-name=":yellow_star:" data-emoji-text=":yellow_star:" style="color: rgb(23, 43, 77); font-family: -apple-system, system-ui, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: -0.07px; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;"><span class="f14svvg8 emoji-common-node" aria-label=":yellow_star:" style="background-color: transparent; border-radius: 5px; display: inline-block; margin: -1px 0px; vertical-align: middle;"><span><img src="https://pf-emoji-service--cdn.ap-southeast-2.dev.public.atl-paas.net/atlassian/yellow_star_64.png" alt=":yellow_star:" data-emoji-short-name=":yellow_star:" class="emoji" width="20" height="20" style="margin: 0px; padding: 0px; border: 0px; display: block; visibility: visible;"></span></span></span><span style="color: rgb(23, 43, 77); font-family: -apple-system, system-ui, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: -0.07px; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;"></span>`;

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            emoji({
              id: 'atlassian-yellow_star',
              shortName: ':yellow_star:',
              text: ':yellow_star:',
            })(),
          ),
        ),
      );
    });
  });

  describe('paste link copied from iphone "share" button', () => {
    /**
     * We need to define an attachTo here, as of PM-View 1.14.10 when a paste event
     * contains no html and no text data hes added a 'kludge' which requires the editor
     * to have a parent element to aid in the pasting non traditional data.
     */
    let attachTo = document.createElement('div');

    beforeAll(() => {
      jest.useFakeTimers();
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('should paste link', () => {
      const { editorView } = editor(doc(p('{<>}')), undefined, attachTo);
      const uriList = 'https://google.com.au';
      dispatchPasteEvent(editorView, { 'uri-list': uriList });

      jest.runAllTimers();

      expect(editorView.state.doc).toEqualDocument(
        doc(p(link({ href: uriList })(uriList))),
      );
    });

    it('should paste link inline', () => {
      const { editorView } = editor(doc(p('hello {<>}')), undefined, attachTo);
      const uriList = 'https://google.com.au';
      dispatchPasteEvent(editorView, { 'uri-list': uriList });

      jest.runAllTimers();

      expect(editorView.state.doc).toEqualDocument(
        doc(p('hello ', link({ href: uriList })(uriList))),
      );
    });

    it('should paste link inside action', () => {
      const { editorView } = editor(
        doc(
          taskList({ localId: 'task-list-id' })(
            taskItem({ localId: 'task-item-id' })('{<>}'),
          ),
        ),
        undefined,
        attachTo,
      );
      const uriList = 'https://google.com.au';
      dispatchPasteEvent(editorView, {
        html: `<meta charset="utf-8"><p data-pm-slice="1 1 []"><a href="${uriList}">${uriList}</a></p>`,
      });

      jest.runAllTimers();

      expect(editorView.state.doc).toEqualDocument(
        doc(
          taskList({ localId: 'task-list-id' })(
            taskItem({ localId: 'task-item-id' })(
              link({ href: uriList })(uriList),
            ),
          ),
        ),
      );
    });
  });

  describe('splitting paragraphs', () => {
    it('should split simple text-based paragraphs into real paragraphs', () => {
      const { editorView } = editor(doc(p('{<>}')));

      const plain = 'text 1\n\ntext 2\r\n\r\ntext 3';

      dispatchPasteEvent(editorView, { plain });

      expect(editorView.state.doc).toEqualDocument(
        doc(p('text 1'), p('text 2'), p('text 3')),
      );
    });

    it('should split multi-line text-based paragraphs into real paragraphs', () => {
      const { editorView } = editor(doc(p('{<>}')));

      const plain =
        'text 1\nsecond line\nthird line\n\nsecond paragraph\nit good\r\nlast line';

      dispatchPasteEvent(editorView, { plain });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('text 1', hardBreak(), 'second line', hardBreak(), 'third line'),
          p(
            'second paragraph',
            hardBreak(),
            'it good',
            hardBreak(),
            'last line',
          ),
        ),
      );
    });
  });

  describe('converting text to list', () => {
    it('works for a simple list', () => {
      const { editorView } = editor(doc(p('{<>}')));
      const html = '<span>* line 1<br />* line 2<br />* line 3';

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(ul(li(p('line 1')), li(p('line 2')), li(p('line 3')))),
      );
    });

    it('maintains empty list items', () => {
      const { editorView } = editor(doc(p('{<>}')));
      const html = '<span>* line 1<br />* <br />* line 3<br />* line 4';

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(ul(li(p('line 1')), li(p()), li(p('line 3')), li(p('line 4')))),
      );
    });

    it('converts hyphen bullets', () => {
      const { editorView } = editor(doc(p('{<>}')));
      const html = '<span>- line 1<br />- line 2<br />- line 3';

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(ul(li(p('line 1')), li(p('line 2')), li(p('line 3')))),
      );
    });

    it('converts unicode bullets', () => {
      const { editorView } = editor(doc(p('{<>}')));
      const html = '<span>• line 1<br />• line 2<br />• line 3';

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(ul(li(p('line 1')), li(p('line 2')), li(p('line 3')))),
      );
    });

    it('converts mixed bulleted list', () => {
      const { editorView } = editor(doc(p('{<>}')));
      const html = '<span>• line 1<br />- line 2<br />* line 3';

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(ul(li(p('line 1')), li(p('line 2')), li(p('line 3')))),
      );
    });

    it('converts numbered list', () => {
      const { editorView } = editor(doc(p('{<>}')));
      const html = '<span>1. line 1<br />2. line 2<br />3. line 3</span>';

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(ol(li(p('line 1')), li(p('line 2')), li(p('line 3')))),
      );
    });

    it('doesnt convert `-` into a list when at start of an existing list item', () => {
      const { editorView } = editor(doc(p('{<>}')));
      const html = '<p>A</p><ul><li><p>-</p></li><li><p>C</p></li></ul>';

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(p('A'), ul(li(p('-')), li(p('C')))),
      );
    });

    it('doesnt convert `*` into a list when at start of an existing list item', () => {
      const { editorView } = editor(doc(p('{<>}')));
      const html = '<p>A</p><ul><li><p>*</p></li><li><p>C</p></li></ul>';

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(p('A'), ul(li(p('*')), li(p('C')))),
      );
    });

    it('only converts numbered list when followed by spaces', () => {
      const { editorView } = editor(doc(p('{<>}')));
      const html = '<span>1.line 1<br />2.line 2<br />3.line 3</span>';

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(p('1.line 1', hardBreak(), '2.line 2', hardBreak(), '3.line 3')),
      );
    });

    it('only converts bullet list when followed by spaces', () => {
      const { editorView } = editor(doc(p('{<>}')));
      const html = '<span>-13<br />-14<br />-15<br>- 16</span>';

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(p('-13', hardBreak(), '-14', hardBreak(), '-15'), ul(li(p('16')))),
      );
    });

    it('converts markdown-style numbered list (one without ordering)', () => {
      const { editorView } = editor(doc(p('{<>}')));
      const html = '<span>1. line 1<br />1. line 2<br />1. line 3</span>';

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(ol(li(p('line 1')), li(p('line 2')), li(p('line 3')))),
      );
    });

    it('converts mixed numbered and bulleted list', () => {
      const { editorView } = editor(doc(p('{<>}')));
      const html = '<span>- line 1<br />1. line 2<br />* line 3</span>';

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(ul(li(p('line 1'))), ol(li(p('line 2'))), ul(li(p('line 3')))),
      );
    });

    it('converts a list with trailing text', () => {
      const { editorView } = editor(doc(p('{<>}')));

      const html =
        '<span>* line 1<br />* line 2<br />* line 3<br /><br />outside the list<br />line 2';

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          ul(li(p('line 1')), li(p('line 2')), li(p('line 3'))),
          p('outside the list', hardBreak(), 'line 2'),
        ),
      );
    });
  });

  describe('analytics V3', () => {
    const paragraphDoc = doc(p('Five{<>}'));
    const orderedListDoc = doc(ol(li(p('Five{<>}'))));
    const bulletListDoc = doc(ul(li(p('Five{<>}'))));
    const headingDoc = doc(h1('Five{<>}'));
    const panelDoc = doc(panel()(p('Five{<>}')));
    const blockQuoteDoc = doc(blockquote(p('Five{<>}')));
    const tableCellDoc = doc(
      table({ isNumberColumnEnabled: true })(
        tr(th()(p('One')), th()(p('Two'))),
        tr(td()(p('Th{<>}ree')), td()(p('Four'))),
        tr(td()(p('Five')), td()(p('Six'))),
      ),
    );

    describe('paste', () => {
      describe('layoutSection', () => {
        beforeEach(() => {
          (measureRenderMocked as jest.Mock).mockClear();
        });

        it('should create analytics event for pasting a layoutSection', () => {
          const { editorView } = editor(doc(p()));
          const html = `
          <meta charset='utf-8'><div data-layout-section="true" data-pm-slice="0 0 []"><div data-layout-column="true" style="flex-basis: 50%" data-column-width="50"><div data-layout-content="true"><p>foo</p></div></div><div data-layout-column="true" style="flex-basis: 50%" data-column-width="50"><div data-layout-content="true"></div></div></div>
          `;
          const linkDomain: string[] = [];

          dispatchPasteEvent(editorView, { html, plain: '' });
          expect(createAnalyticsEvent).toHaveBeenCalledWith({
            action: 'pasted',
            actionSubject: 'document',
            actionSubjectId: ACTION_SUBJECT_ID.PASTE_PARAGRAPH,
            eventType: 'track',
            attributes: expect.objectContaining({
              content: 'layoutSection',
              inputMethod: 'keyboard',
              source: 'fabric-editor',
              type: 'richText',
            }),
            ...(linkDomain && linkDomain.length > 0
              ? { nonPrivacySafeAttributes: { linkDomain } }
              : {}),
          });
          expect(measureRenderMocked).toHaveBeenCalledTimes(1);
          const expectedContent = [
            'text',
            'paragraph',
            'layoutColumn',
            'layoutSection',
          ];
          expect(createPasteMeasurePayloadMocked).toHaveBeenLastCalledWith({
            view: expect.anything(),
            duration: 5000,
            content: expectedContent,
            distortedDuration: false,
          });
        });
      });
    });

    /**
     * Table with this format
     * | description | document | actionSubjectId
     */
    describe.each([
      ['paragraph', paragraphDoc, ACTION_SUBJECT_ID.PASTE_PARAGRAPH],
      ['ordered list', orderedListDoc, ACTION_SUBJECT_ID.PASTE_ORDERED_LIST],
      ['bullet list', bulletListDoc, ACTION_SUBJECT_ID.PASTE_BULLET_LIST],
      ['heading', headingDoc, ACTION_SUBJECT_ID.PASTE_HEADING],
      ['panel', panelDoc, ACTION_SUBJECT_ID.PASTE_PANEL],
      ['blockquote', blockQuoteDoc, ACTION_SUBJECT_ID.PASTE_BLOCKQUOTE],
      ['table cell', tableCellDoc, ACTION_SUBJECT_ID.PASTE_TABLE_CELL],
    ])('paste inside %s', (description, doc, actionSubjectId) => {
      let editorView: EditorView;

      beforeEach(() => {
        ({ editorView } = editor(doc));
      });

      /**
       * Table with the given format
       * | description | contentType | html paste event | plain paste event | link domain (if any) |
       */
      const testCases: [string, string, string, string, string[]][] = [
        [
          'a paragraph',
          'text',
          "<meta charset='utf-8'><p data-pm-slice='1 1 []'>hello world</p>",
          'www.google.com',
          [],
        ],
        [
          'an url',
          'url',
          "<meta charset='utf-8'><p data-pm-slice='1 1 []'><a href='http://www.google.com'>www.google.com</a></p>",
          'www.google.com',
          ['google.com'],
        ],
        [
          'only an url',
          'url',
          "<meta charset='utf-8'><a href='http://www.google.com'>www.google.com</a>",
          'www.google.com',
          ['google.com'],
        ],
        [
          'a mixed event',
          'mixed',
          "<meta charset='utf-8'><ul><li>Hello World</li></ul><p>Hello World</p>",
          'Hello World',
          [],
        ],
        [
          'a mixed event with a link',
          'mixed',
          "<meta charset='utf-8'><ul><li><a href='http://atlassian.com/foo'>Hello World</a></li></ul><p>Hello World</p>",
          'Hello World',
          ['atlassian.com'],
        ],
        [
          'a mixed event with multiple links',
          'mixed',
          "<meta charset='utf-8'><ul><li><a href='http://atlassian.com:443?foo'>Hello World</a></li><li><a href='http://foo.bar.net/bar/baz'>Hello World</a></li></ul><p>Hello World</p>",
          'Hello World',
          ['atlassian.com', 'foo.bar.net'],
        ],
        [
          'a bullet list',
          'bulletList',
          "<meta charset='utf-8'><ul><li>Hello World</li></ul>",
          'Hello World',
          [],
        ],
        [
          'an ordered list',
          'orderedList',
          "<meta charset='utf-8'><ol><li>Hello World</li></ol>",
          'Hello World',
          [],
        ],
        [
          'a heading',
          'heading',
          "<meta charset='utf-8'><h1>Hello World</h1>",
          '',
          [],
        ],
        [
          'a blockquote',
          'blockquote',
          "<meta charset='utf-8'><blockquote><p>Hello World</p></blockquote>",
          'Hello World',
          [],
        ],
        [
          'a code',
          'codeBlock',
          '<pre>code line 1\ncode line 2</pre>',
          'code line 1\ncode line 2',
          [],
        ],
        [
          'a table',
          'table',
          `<meta charset='utf-8'><table><tbody><tr><td><p>foo</p></td></tr></tbody></table>`,
          'foo',
          [],
        ],
        [
          'a decision list',
          'decisionList',
          `<meta charset='utf-8'><ol data-node-type="decisionList" data-decision-list-local-id="2b1a545e-a76d-4b9a-b0a8-c5996e51e32f" style="list-style: none; padding-left: 0"><li data-decision-local-id="f9ad0cf0-42e6-4c62-8076-7981b3fab3f7" data-decision-state="DECIDED">foo</li></ol>`,
          'foo',
          [],
        ],
        [
          'a task item',
          'taskItem',
          `<meta charset='utf-8'><div data-node-type="actionList" data-task-list-local-id="c0060bd1-ee91-47e7-b55e-4f45bd2e0b0b" style="list-style: none; padding-left: 0"><div data-task-local-id="1803f18d-1fad-4998-81e4-644ed22f3929" data-task-state="TODO"> foo</div></div>`,
          'foo',
          [],
        ],
      ];

      test.each(testCases)(
        'should create analytics event for paste %s',
        (_, content, html, plain = '', linkDomain = []) => {
          dispatchPasteEvent(editorView, { html, plain });

          if (description.includes('blockquote') && content === 'blockquote') {
            //To change the assertion data when pasting blockquote inside blockquote as it should be pasted as text
            content = 'text';
          }

          expect(createAnalyticsEvent).toHaveBeenCalledWith(
            expect.objectContaining({
              action: 'pasted',
              actionSubject: 'document',
              actionSubjectId,
              eventType: 'track',
              attributes: expect.objectContaining({
                content,
                inputMethod: 'keyboard',
                source: 'uncategorized',
                type: 'richText',
                hyperlinkPasteOnText: false,
              }),
              ...(linkDomain && linkDomain.length > 0
                ? {
                    nonPrivacySafeAttributes: {
                      linkDomain: expect.arrayContaining(linkDomain),
                    },
                  }
                : {}),
            }),
          );
        },
      );
    });

    /**
     * Table with this format
     * | description | document | actionSubjectId
     */
    describe.each([
      ['paragraph', paragraphDoc, ACTION_SUBJECT_ID.PASTE_PARAGRAPH],
      ['ordered list', orderedListDoc, ACTION_SUBJECT_ID.PASTE_ORDERED_LIST],
      ['bullet list', bulletListDoc, ACTION_SUBJECT_ID.PASTE_BULLET_LIST],
      ['heading', headingDoc, ACTION_SUBJECT_ID.PASTE_HEADING],
      ['table cell', tableCellDoc, ACTION_SUBJECT_ID.PASTE_TABLE_CELL],
    ])('paste inside %s', (_, doc, actionSubjectId) => {
      const testCase: [string, string, string, string, string[]] = [
        'a media single',
        'mediaSingle',
        `<meta charset='utf-8'><div data-node-type="mediaSingle" data-layout="center" data-width=""><div data-id="9b5c6412-6de0-42cb-837f-bc08c24b4383" data-node-type="media" data-type="file" data-collection="MediaServicesSample" data-width="490" data-height="288" title="Attachment" style="display: inline-block; border-radius: 3px; background: #EBECF0; box-shadow: 0 1px 1px rgba(9, 30, 66, 0.2), 0 0 1px 0 rgba(9, 30, 66, 0.24);" data-file-name="image-20190325-222039.png" data-file-size="29502" data-file-mime-type="image/png"></div></div>`,
        '',
        [],
      ];
      let editorView: EditorView;

      beforeEach(() => {
        ({ editorView } = editor(doc));
      });

      /**
       * Table with the given format
       * | description | contentType | html paste event | plain paste event | link domain (if any) |
       */
      test('should create analytics event for paste a media single', () => {
        const [, content, html, plain = '', linkDomain = []] = testCase;
        dispatchPasteEvent(editorView, { html, plain });

        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: 'pasted',
          actionSubject: 'document',
          actionSubjectId,
          eventType: 'track',
          attributes: expect.objectContaining({
            content,
            inputMethod: 'keyboard',
            source: 'uncategorized',
            type: 'richText',
            hyperlinkPasteOnText: false,
          }),
          ...(linkDomain && linkDomain.length > 0
            ? { nonPrivacySafeAttributes: { linkDomain } }
            : {}),
        });
      });
    });

    /**
     * Table with this format
     * | description | document | actionSubjectId
     */
    describe.skip.each([
      ['panel', panelDoc, ACTION_SUBJECT_ID.PASTE_PANEL],
      ['blockquote', blockQuoteDoc, ACTION_SUBJECT_ID.PASTE_BLOCKQUOTE],
    ])('paste inside %s', (_, doc, actionSubjectId) => {
      const testCase: [string, string, string, string, string[]] = [
        'a media single',
        'mediaSingle',
        `<meta charset='utf-8'><div data-node-type="mediaSingle" data-layout="center" data-width=""><div data-id="9b5c6412-6de0-42cb-837f-bc08c24b4383" data-node-type="media" data-type="file" data-collection="MediaServicesSample" data-width="490" data-height="288" title="Attachment" style="display: inline-block; border-radius: 3px; background: #EBECF0; box-shadow: 0 1px 1px rgba(9, 30, 66, 0.2), 0 0 1px 0 rgba(9, 30, 66, 0.24);" data-file-name="image-20190325-222039.png" data-file-size="29502" data-file-mime-type="image/png"></div></div>`,
        '',
        [],
      ];
      let editorView: EditorView;

      beforeEach(() => {
        ({ editorView } = editor(doc));
      });

      /**
       * Table with the given format
       * | description | contentType | html paste event | plain paste event | link domain (if any) |
       */
      test('should create analytics event for paste a media single', () => {
        const [, content, html, plain = '', linkDomain = []] = testCase;
        dispatchPasteEvent(editorView, { html, plain });

        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: 'pasted',
          actionSubject: 'document',
          actionSubjectId,
          eventType: 'track',
          attributes: expect.objectContaining({
            content,
            inputMethod: 'keyboard',
            source: 'uncategorized',
            type: 'richText',
            hyperlinkPasteOnText: false,
          }),
          ...(linkDomain && linkDomain.length > 0
            ? { nonPrivacySafeAttributes: { linkDomain } }
            : {}),
        });
      });
    });
  });
});
