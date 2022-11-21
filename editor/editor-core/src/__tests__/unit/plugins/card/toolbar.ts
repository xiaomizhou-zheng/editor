import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { createIntl } from 'react-intl-next';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';
import {
  doc,
  p,
  inlineCard,
  blockCard,
  embedCard,
  DocBuilder,
  expand,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { floatingToolbar } from '../../../../plugins/card/toolbar';
import { pluginKey } from '../../../../plugins/card/pm-plugins/main';

import commonMessages, {
  linkToolbarMessages,
  linkMessages,
} from '../../../../messages';

import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import OpenIcon from '@atlaskit/icon/glyph/shortcut';
import CogIcon from '@atlaskit/icon/glyph/editor/settings';
import UnlinkIcon from '@atlaskit/icon/glyph/editor/unlink';

import {
  FloatingToolbarButton,
  FloatingToolbarConfig,
} from '../../../../plugins/floating-toolbar/types';
import { Command } from '../../../../types';
import { getToolbarItems } from '../../../../plugins/floating-toolbar/__tests__/_helpers';
import * as CardUtils from '../../../../plugins/card/utils';
import * as featureFlags from '../../../../plugins/feature-flags-context';
import { EditorView } from 'prosemirror-view';

describe('card', () => {
  const createEditor = createEditorFactory();
  const providerFactory = new ProviderFactory();
  let createAnalyticsEvent = createAnalyticsEventMock();
  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      providerFactory,
      editorProps: {
        smartLinks: {
          allowBlockCards: true,
          allowEmbeds: true,
          allowResizing: true,
        },
        allowExpand: true,
        allowAnalyticsGASV3: true,
      },
      pluginKey,
      createAnalyticsEvent,
    });
  };

  describe('toolbar', () => {
    const intl = createIntl({
      locale: 'en',
    });

    const visitTitle = intl.formatMessage(linkMessages.openLink);
    const unlinkTitle = intl.formatMessage(linkToolbarMessages.unlink);
    const removeTitle = intl.formatMessage(commonMessages.remove);
    const openSettingsTitle = intl.formatMessage(
      linkToolbarMessages.settingsLink,
    );

    describe.each(['true', 'false', undefined])(
      'with settings button flag returning %s',
      (isLinkSettingsButtonEnabled) => {
        const featureFlagSpy = jest.spyOn(featureFlags, 'getFeatureFlags');

        const getSettingsButton = (
          toolbar: FloatingToolbarConfig,
          editorView: EditorView<any>,
        ) =>
          getToolbarItems(toolbar, editorView).find(
            (item) =>
              item.type === 'button' && item.title === openSettingsTitle,
          ) as FloatingToolbarButton<Command> | undefined;

        const verifySettingsButton = (
          settingsButton: FloatingToolbarButton<Command> | undefined,
          editorView: EditorView<any>,
        ) => {
          if (isLinkSettingsButtonEnabled === 'true') {
            expect(settingsButton).toBeDefined();
            expect(settingsButton).toMatchObject({
              icon: CogIcon,
            });
            settingsButton?.onClick(editorView.state, editorView.dispatch);
            expect(open).toBeCalledWith(
              'https://id.atlassian.com/manage-profile/link-preferences',
            );
          } else {
            expect(settingsButton).not.toBeDefined();
          }
        };

        beforeEach(() => {
          featureFlagSpy.mockReturnValue({
            floatingToolbarLinkSettingsButton: isLinkSettingsButtonEnabled,
          });
          global.open = jest.fn();
        });
        afterEach(() => {
          featureFlagSpy.mockReset();
          (global.open as jest.Mock).mockReset();
        });

        afterAll(() => {
          featureFlagSpy.mockRestore();
          (global.open as jest.Mock).mockRestore();
        });

        it('displays toolbar items in correct order for inlineCard', () => {
          const { editorView } = editor(
            doc(
              p(
                '{<node>}',
                inlineCard({
                  url: 'http://www.atlassian.com/',
                })(),
              ),
            ),
          );

          const toolbar = floatingToolbar({
            allowBlockCards: true,
            allowEmbeds: true,
            allowResizing: true,
          })(editorView.state, intl, providerFactory);
          const toolbarItems = getToolbarItems(toolbar!, editorView);
          expect(toolbar).toBeDefined();
          expect(toolbarItems).toHaveLength(
            isLinkSettingsButtonEnabled === 'true' ? 11 : 9,
          );
          expect(toolbarItems).toMatchSnapshot();

          const settingsButton = getSettingsButton(toolbar!, editorView);
          verifySettingsButton(settingsButton, editorView);
        });

        it('displays toolbar items in correct order for inlineCard on mobile', () => {
          const { editorView } = editor(
            doc(
              p(
                '{<node>}',
                inlineCard({
                  url: 'http://www.atlassian.com/',
                })(),
              ),
            ),
          );

          const toolbar = floatingToolbar(
            {
              allowBlockCards: true,
              allowEmbeds: true,
              allowResizing: true,
            },
            'mobile',
          )(editorView.state, intl, providerFactory);
          const toolbarItems = getToolbarItems(toolbar!, editorView);
          expect(toolbarItems[2].type).not.toBe('custom');
          expect(toolbar).toBeDefined();
          expect(toolbarItems).toHaveLength(
            isLinkSettingsButtonEnabled === 'true' ? 11 : 9,
          );
          expect(toolbarItems).toMatchSnapshot();

          const settingsButton = getSettingsButton(toolbar!, editorView);
          verifySettingsButton(settingsButton, editorView);
        });

        it('displays toolbar items in correct order for blockCard', () => {
          const { editorView } = editor(
            doc(
              '{<node>}',
              blockCard({
                url: 'http://www.atlassian.com/',
              })(),
            ),
          );

          const toolbar = floatingToolbar({
            allowBlockCards: true,
            allowEmbeds: true,
            allowResizing: true,
          })(editorView.state, intl, providerFactory);
          const toolbarItems = getToolbarItems(toolbar!, editorView);
          expect(toolbar).toBeDefined();
          expect(toolbarItems).toHaveLength(
            isLinkSettingsButtonEnabled === 'true' ? 9 : 7,
          );
          expect(toolbarItems).toMatchSnapshot();

          const settingsButton = getSettingsButton(toolbar!, editorView);
          verifySettingsButton(settingsButton, editorView);
        });

        it('displays toolbar items in correct order for embedCard', () => {
          const { editorView } = editor(
            doc(
              '{<node>}',
              embedCard({
                url: 'http://www.atlassian.com/',
                layout: 'center',
              })(),
            ),
          );

          const toolbar = floatingToolbar({
            allowBlockCards: true,
            allowEmbeds: true,
            allowResizing: true,
          })(editorView.state, intl, providerFactory);
          const toolbarItems = getToolbarItems(toolbar!, editorView);
          expect(toolbar).toBeDefined();
          expect(toolbarItems).toHaveLength(
            isLinkSettingsButtonEnabled === 'true' ? 16 : 14,
          );
          expect(toolbarItems).toMatchSnapshot();

          const settingsButton = getSettingsButton(toolbar!, editorView);
          verifySettingsButton(settingsButton, editorView);
        });

        it('displays toolbar items in correct order for embedCard inside an expand', () => {
          const { editorView } = editor(
            doc(
              '{<node>}',
              expand()(
                embedCard({
                  url: 'http://www.atlassian.com/',
                  layout: 'center',
                })(),
              ),
            ),
          );

          const toolbar = floatingToolbar({
            allowBlockCards: true,
            allowEmbeds: true,
            allowResizing: true,
          })(editorView.state, intl, providerFactory);
          const toolbarItems = getToolbarItems(toolbar!, editorView);
          expect(toolbar).toBeDefined();
          expect(toolbarItems).toMatchSnapshot();

          const settingsButton = getSettingsButton(toolbar!, editorView);
          verifySettingsButton(settingsButton, editorView);
        });
      },
    );

    it('has no toolbar items when url via url attr is invalid', () => {
      const { editorView } = editor(
        doc(
          p(
            '{<node>}',
            inlineCard({
              url: 'javascript:alert(document.domain)',
            })(),
          ),
        ),
      );

      const toolbar = floatingToolbar({})(
        editorView.state,
        intl,
        providerFactory,
      );
      expect(getToolbarItems(toolbar!, editorView).length).toEqual(0);
    });

    it('has no toolbar items when url via data attr is invalid', () => {
      const { editorView } = editor(
        doc(
          p(
            '{<node>}',
            inlineCard({
              url: 'javascript:alert(document.domain)',
            })(),
          ),
        ),
      );

      const toolbar = floatingToolbar({})(
        editorView.state,
        intl,
        providerFactory,
      );
      expect(getToolbarItems(toolbar!, editorView).length).toEqual(0);
    });

    it('metadata correctly resolves url and title from plugin state', () => {
      const { editorView } = editor(
        doc(
          p(
            '{<node>}',
            inlineCard({
              url: 'http://www.atlassian.com/',
            })(),
          ),
        ),
      );

      jest.spyOn(CardUtils, 'findCardInfo').mockImplementationOnce(() => {
        return {
          title: 'hey hey hey',
          pos: 1,
        };
      });

      const toolbar = floatingToolbar({
        allowBlockCards: true,
        allowEmbeds: true,
        allowResizing: true,
      })(editorView.state, intl, providerFactory);
      const toolbarItems = getToolbarItems(toolbar!, editorView);
      expect(toolbar).toBeDefined();
      expect(
        toolbarItems.filter((object) => object.hasOwnProperty('metadata')),
      ).toMatchSnapshot();
    });

    it('has an unlink button for inlineCard', () => {
      const { editorView } = editor(
        doc(
          p(
            '{<node>}',
            inlineCard({
              url: 'http://www.atlassian.com/',
            })(),
          ),
        ),
      );

      const toolbar = floatingToolbar({})(
        editorView.state,
        intl,
        providerFactory,
      );
      expect(toolbar).toBeDefined();

      const unlinkButton = getToolbarItems(toolbar!, editorView).find(
        (item) => item.type === 'button' && item.title === unlinkTitle,
      );

      expect(unlinkButton).toBeDefined();
      expect(unlinkButton).toMatchObject({
        icon: UnlinkIcon,
      });
    });

    it('has a remove button for blockCard', () => {
      const { editorView } = editor(
        doc(
          '{<node>}',
          blockCard({
            url: 'http://www.atlassian.com/',
          })(),
        ),
      );

      const toolbar = floatingToolbar({})(
        editorView.state,
        intl,
        providerFactory,
      );
      expect(toolbar).toBeDefined();

      const removeButton = getToolbarItems(toolbar!, editorView).find(
        (item) => item.type === 'button' && item.title === removeTitle,
      );

      expect(removeButton).toBeDefined();
      expect(removeButton).toMatchObject({
        appearance: 'danger',
        icon: RemoveIcon,
      });
    });

    it('has a remove button for embedCard', () => {
      const { editorView } = editor(
        doc(
          '{<node>}',
          embedCard({
            url: 'http://www.atlassian.com/',
            layout: 'center',
          })(),
        ),
      );

      const toolbar = floatingToolbar({})(
        editorView.state,
        intl,
        providerFactory,
      );
      expect(toolbar).toBeDefined();

      const removeButton = getToolbarItems(toolbar!, editorView).find(
        (item) => item.type === 'button' && item.title === removeTitle,
      );

      expect(removeButton).toBeDefined();
      expect(removeButton).toMatchObject({
        appearance: 'danger',
        icon: RemoveIcon,
      });
    });

    it('has a visit button', () => {
      const { editorView } = editor(
        doc(
          p(
            '{<node>}',
            inlineCard({
              url: 'http://www.atlassian.com/',
            })(),
          ),
        ),
      );

      const toolbar = floatingToolbar({})(
        editorView.state,
        intl,
        providerFactory,
      );
      expect(toolbar).toBeDefined();

      const visitButton = getToolbarItems(toolbar!, editorView).find(
        (item) => item.type === 'button' && item.title === visitTitle,
      );

      expect(visitButton).toBeDefined();
      expect(visitButton).toMatchObject({
        icon: OpenIcon,
      });
    });

    it('opens the url in a new window defined on an inline card', () => {
      // @ts-ignore
      global.open = jest.fn();

      const { editorView } = editor(
        doc(
          p(
            '{<node>}',
            inlineCard({
              url: 'http://www.atlassian.com/',
            })(),
          ),
        ),
      );

      const toolbar = floatingToolbar({})(
        editorView.state,
        intl,
        providerFactory,
      );

      const visitButton = getToolbarItems(toolbar!, editorView).find(
        (item) => item.type === 'button' && item.title === visitTitle,
      ) as FloatingToolbarButton<Command>;

      visitButton.onClick(editorView.state, editorView.dispatch);
      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'visited',
        actionSubject: 'smartLink',
        actionSubjectId: 'inlineCard',
        attributes: expect.objectContaining({
          inputMethod: 'toolbar',
        }),
        eventType: 'track',
      });
      expect(open).toBeCalledWith('http://www.atlassian.com/');
    });

    it('opens the url in a new window via data on an inline card', () => {
      // @ts-ignore
      global.open = jest.fn();

      const { editorView } = editor(
        doc(
          p(
            '{<node>}',
            inlineCard({
              data: {
                url: 'http://www.atlassian.com/',
              },
            })(),
          ),
        ),
      );

      const toolbar = floatingToolbar({})(
        editorView.state,
        intl,
        providerFactory,
      );
      const visitButton = getToolbarItems(toolbar!, editorView).find(
        (item) => item.type === 'button' && item.title === visitTitle,
      ) as FloatingToolbarButton<Command>;

      visitButton.onClick(editorView.state, editorView.dispatch);
      expect(open).toBeCalledWith('http://www.atlassian.com/');
    });

    it('deletes a block card', () => {
      const { editorView } = editor(
        doc(
          p('ab'),
          '{<node>}',
          blockCard({
            url: 'http://www.atlassian.com/',
          })(),
          p('cd'),
        ),
      );

      const toolbar = floatingToolbar({})(
        editorView.state,
        intl,
        providerFactory,
      );
      const removeButton = getToolbarItems(toolbar!, editorView).find(
        (item) => item.type === 'button' && item.title === removeTitle,
      ) as FloatingToolbarButton<Command>;

      removeButton.onClick(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p('ab'), p('cd')));
    });

    it('deletes an inline card', () => {
      const { editorView } = editor(
        doc(
          p(
            'ab',
            '{<node>}',
            inlineCard({
              data: {
                title: 'Welcome to Atlassian!',
                url: 'http://www.atlassian.com/',
              },
            })(),
            'cd',
          ),
        ),
      );

      const toolbar = floatingToolbar({})(
        editorView.state,
        intl,
        providerFactory,
      );
      const unlinkButton = getToolbarItems(toolbar!, editorView).find(
        (item) => item.type === 'button' && item.title === unlinkTitle,
      ) as FloatingToolbarButton<Command>;

      unlinkButton.onClick(editorView.state, editorView.dispatch);
      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'unlinked',
        actionSubject: 'smartLink',
        actionSubjectId: 'inlineCard',
        attributes: expect.objectContaining({
          inputMethod: 'toolbar',
        }),
        eventType: 'track',
      });
      expect(editorView.state.doc).toEqualDocument(
        doc(p('abWelcome to Atlassian!cd')),
      );
    });

    it('deletes an embed card', () => {
      const { editorView } = editor(
        doc(
          p('ab'),
          '{<node>}',
          embedCard({
            url: 'http://www.atlassian.com/',
            layout: 'center',
          })(),
          p('cd'),
        ),
      );

      const toolbar = floatingToolbar({})(
        editorView.state,
        intl,
        providerFactory,
      );
      const removeButton = getToolbarItems(toolbar!, editorView).find(
        (item) => item.type === 'button' && item.title === removeTitle,
      ) as FloatingToolbarButton<Command>;

      removeButton.onClick(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p('ab'), p('cd')));
    });
  });
});
