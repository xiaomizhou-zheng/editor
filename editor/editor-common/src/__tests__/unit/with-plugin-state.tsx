import React from 'react';

import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import { PluginKey } from 'prosemirror-state';

import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

import {
  createDispatch,
  Dispatch,
  EventDispatcher,
} from '../../event-dispatcher';
import { SafePlugin } from '../../safe-plugin';
import { EditorPlugin } from '../../types/editor-plugin';
import * as collab from '../../utils/collab';
import {
  EditorActionsPrivateAccess,
  WithPluginState,
} from '../../with-plugin-state';

type EditorContextProps = {
  editorActions: EditorActionsPrivateAccess;
};
const EditorContext = React.createContext({});
class EditorContextProvider extends React.Component<EditorContextProps, {}> {
  static childContextTypes = {
    editorActions: PropTypes.object,
  };

  private editorActions: EditorActionsPrivateAccess;
  constructor(props: EditorContextProps) {
    super(props);
    this.editorActions = props.editorActions;
  }

  getChildContext() {
    return {
      editorActions: this.editorActions,
    };
  }

  render() {
    return (
      <EditorContext.Provider
        value={{ editorActions: this.props.editorActions }}
      >
        {this.props.children}
      </EditorContext.Provider>
    );
  }
}

describe('with-plugin-state', () => {
  const createEditor = createEditorFactory();

  const pluginKey = new PluginKey('plugin');
  const pluginKey2 = new PluginKey('plugin2');

  const setTimeoutPromise = (cb: Function, delay: number) =>
    new Promise((resolve) => window.setTimeout(() => resolve(cb()), delay));
  const createPlugin = (state: any, key: PluginKey): EditorPlugin => {
    return {
      name: 'withPluginState',

      pmPlugins() {
        return [
          {
            name: '',
            plugin: () =>
              new SafePlugin({
                key,
                state: {
                  init() {
                    return state;
                  },
                  apply() {
                    return state;
                  },
                },
              }),
          },
        ];
      },
    };
  };

  const createAnalyticsPlugin = (state: any): EditorPlugin => {
    return {
      name: 'analytics',
      pmPlugins() {
        return [
          {
            name: 'analyticsPlugin',
            plugin: () =>
              new SafePlugin({
                key: {
                  key: 'analyticsPlugin$',
                } as any,
                state: {
                  init() {
                    return state;
                  },
                  apply() {
                    return state;
                  },
                },
              }),
          },
        ];
      },
    };
  };

  let eventDispatcher: EventDispatcher;
  let dispatch: Dispatch;

  beforeEach(() => {
    performance.mark = jest.fn();
    performance.measure = jest.fn();
    performance.clearMeasures = jest.fn();
    performance.clearMarks = jest.fn();
    performance.getEntriesByName = jest.fn(() => []);
    performance.getEntriesByType = jest.fn(() => []);

    eventDispatcher = new EventDispatcher();
    dispatch = createDispatch(eventDispatcher);
  });

  describe('WithPluginState', () => {
    it('should call render with current plugin state', () => {
      const pluginState = {};
      const plugin = createPlugin(pluginState, pluginKey);
      const { editorView } = createEditor({
        doc: doc(p()),
        editorPlugins: [plugin],
      });
      const wrapper = mount(
        <WithPluginState
          editorView={editorView}
          eventDispatcher={eventDispatcher}
          plugins={{ currentPluginState: pluginKey }}
          render={({ currentPluginState }) => {
            expect(currentPluginState).toEqual(pluginState);
            return null;
          }}
        />,
      );
      wrapper.unmount();
      editorView.destroy();
    });

    it('should call render once after changes in several plugins', async () => {
      const pluginState = {};
      const plugin = createPlugin(pluginState, pluginKey);
      const plugin2 = createPlugin(pluginState, pluginKey2);
      const { editorView } = createEditor({
        doc: doc(p()),
        editorPlugins: [plugin, plugin2],
      });

      const renderMock = jest.fn().mockReturnValue(null);

      const wrapper = mount(
        <WithPluginState
          editorView={editorView}
          eventDispatcher={eventDispatcher}
          plugins={{ pluginState: pluginKey, plugin2State: pluginKey2 }}
          render={renderMock}
        />,
      );

      await Promise.all([
        setTimeoutPromise(() => dispatch(pluginKey, {}), 0),
        setTimeoutPromise(() => dispatch(pluginKey2, {}), 8),
        setTimeoutPromise(() => dispatch(pluginKey, {}), 5),
        setTimeoutPromise(() => dispatch(pluginKey, {}), 0),
        setTimeoutPromise(() => dispatch(pluginKey2, {}), 8),
        setTimeoutPromise(() => dispatch(pluginKey, {}), 5),
      ]);

      expect(renderMock.mock.calls.length).toBeLessThanOrEqual(6);
      wrapper.unmount();
      editorView.destroy();
    });
  });

  it('should clean all listeners after unmount', () => {
    const pluginState = {};
    const plugin = createPlugin(pluginState, pluginKey);
    const plugin2 = createPlugin(pluginState, pluginKey2);
    const { editorView } = createEditor({
      doc: doc(p()),
      editorPlugins: [plugin, plugin2],
    });
    const wrapper = mount(
      <WithPluginState
        editorView={editorView}
        eventDispatcher={eventDispatcher}
        plugins={{ pluginState: pluginKey, plugin2State: pluginKey2 }}
        render={() => null}
      />,
    );
    const wpsInstance = (wrapper.find(WithPluginState) as any)
      .first()
      .instance();

    wrapper.unmount();
    editorView.destroy();
    expect(wpsInstance.listeners).toEqual([]);
  });

  it('should support old plugins with subscribe/unsubscribe methods', () => {
    const pluginState = {
      cb(_param?: any) {},

      update() {
        this.cb({ a: 1 });
      },

      subscribe(cb: (param?: any) => {}) {
        this.cb = cb;
      },
      unsubscribe: jest.fn(),
    };
    const plugin = createPlugin(pluginState, pluginKey);
    const { editorView } = createEditor({
      editorPlugins: [plugin],
    });

    const renderMock = jest.fn(() => null);
    const wrapper = mount(
      <WithPluginState
        editorView={editorView}
        eventDispatcher={eventDispatcher}
        plugins={{ pluginState: pluginKey }}
        render={renderMock}
      />,
    );

    return setTimeoutPromise(() => pluginState.update(), 10)
      .then(() => setTimeoutPromise(() => {}, 50))
      .then(() => {
        wrapper.unmount();
        editorView.destroy();
        expect(renderMock).toHaveBeenLastCalledWith({ pluginState: { a: 1 } });
      });
  });

  it('should unsubscribe after unmount for old plugins with subscribe/unsubscribe methods', () => {
    const unsubscribeMock = jest.fn();
    const pluginState = {
      subscribe: () => {},
      unsubscribe: unsubscribeMock,
    };
    const plugin = createPlugin(pluginState, pluginKey);
    const { editorView } = createEditor({
      doc: doc(p()),
      editorPlugins: [plugin],
    });

    const render = jest.fn(() => null);
    const wrapper = mount(
      <WithPluginState
        editorView={editorView}
        eventDispatcher={eventDispatcher}
        plugins={{ pluginState: pluginKey }}
        render={render}
      />,
    );

    wrapper.unmount();
    editorView.destroy();
    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
  });

  it('should support getting EditorView and EventDispatcher from the context', () => {
    const pluginState = {};
    const plugin = createPlugin(pluginState, pluginKey);
    const { editorView } = createEditor({
      doc: doc(p()),
      editorPlugins: [plugin],
    });
    const editorActions: EditorActionsPrivateAccess = {
      _privateGetEditorView() {
        return editorView;
      },
      _privateGetEventDispatcher() {
        return eventDispatcher;
      },
      _privateSubscribe() {},
      _privateUnsubscribe() {},
    };

    const wrapper = mount(
      <EditorContextProvider editorActions={editorActions}>
        <WithPluginState
          plugins={{ currentPluginState: pluginKey }}
          render={(props) => {
            const { currentPluginState } = props;
            expect(currentPluginState).toEqual(pluginState);
            return null;
          }}
        />
      </EditorContextProvider>,
    );
    wrapper.unmount();
    editorView.destroy();
  });

  it('should not call performance.mark when disabled', () => {
    const plugin = createPlugin({}, pluginKey);
    const key = (pluginKey as any).key;
    const mark = performance.mark as jest.Mock;

    const analyticsPlugin = createAnalyticsPlugin({
      performanceTracking: {
        uiTracking: {
          enabled: false,
          samplingRate: 1,
          slowThreshold: 0,
        },
      },
    });

    const { editorView } = createEditor({
      doc: doc(p()),
      editorPlugins: [plugin, analyticsPlugin],
      editorProps: {
        allowAnalyticsGASV3: true,
      },
    });

    const renderMock = jest.fn().mockReturnValue(null);

    const wrapper = mount(
      <WithPluginState
        editorView={editorView}
        eventDispatcher={eventDispatcher}
        plugins={{ pluginState: pluginKey }}
        render={renderMock}
      />,
    );
    dispatch(pluginKey, { cheese: '🧀' });

    return setTimeoutPromise(() => {}, 0).then(() => {
      expect(mark.mock.calls.map((item) => item[0])).not.toEqual(
        expect.arrayContaining([
          `🦉${key}::WithPluginState::start`,
          `🦉${key}::WithPluginState::end`,
        ]),
      );

      wrapper.unmount();
      editorView.destroy();
    });
  });

  it('should call performance.mark twice with appropriate arguments', () => {
    const plugin = createPlugin({}, pluginKey);
    const key = (pluginKey as any).key;
    const mark = performance.mark as jest.Mock;

    const analyticsPlugin = createAnalyticsPlugin({
      performanceTracking: {
        uiTracking: {
          enabled: true,
          samplingRate: 1,
          slowThreshold: 0,
        },
      },
    });

    const { editorView } = createEditor({
      doc: doc(p()),
      editorPlugins: [plugin, analyticsPlugin],
      editorProps: {
        allowAnalyticsGASV3: true,
      },
    });

    const renderMock = jest.fn().mockReturnValue(null);

    const wrapper = mount(
      <WithPluginState
        editorView={editorView}
        eventDispatcher={eventDispatcher}
        plugins={{ pluginState: pluginKey }}
        render={renderMock}
      />,
    );
    dispatch(pluginKey, { cheese: '🧀' });

    return setTimeoutPromise(() => {}, 0).then(() => {
      expect(mark.mock.calls.map((item) => item[0])).toEqual(
        expect.arrayContaining([
          `🦉${key}::WithPluginState::start`,
          `🦉${key}::WithPluginState::end`,
        ]),
      );

      wrapper.unmount();
      editorView.destroy();
    });
  });

  it('should dispatch analytics event with participants count', () => {
    const getParticipantsCountSpy = jest
      .spyOn(collab, 'getParticipantsCount')
      .mockReturnValue(2);

    const plugin = createPlugin({}, pluginKey);
    const key = (pluginKey as any).key;
    const mark = performance.mark as jest.Mock;

    const analyticsPlugin = createAnalyticsPlugin({
      performanceTracking: {
        uiTracking: {
          enabled: true,
          samplingRate: 1,
          slowThreshold: 0,
        },
      },
    });

    const { editorView } = createEditor({
      doc: doc(p()),
      editorPlugins: [plugin, analyticsPlugin],
      editorProps: {
        allowAnalyticsGASV3: true,
      },
    });

    const renderMock = jest.fn().mockReturnValue(null);

    const wrapper = mount(
      <WithPluginState
        editorView={editorView}
        eventDispatcher={eventDispatcher}
        plugins={{ pluginState: pluginKey }}
        render={renderMock}
      />,
    );
    dispatch(pluginKey, { cheese: '🧀' });

    return setTimeoutPromise(() => {}, 0).then(() => {
      expect(mark.mock.calls.map((item) => item[0])).toEqual(
        expect.arrayContaining([
          `🦉${key}::WithPluginState::start`,
          `🦉${key}::WithPluginState::end`,
        ]),
      );

      expect(getParticipantsCountSpy).toBeCalledTimes(1);
      expect(getParticipantsCountSpy).toHaveReturnedWith(2);

      wrapper.unmount();
      editorView.destroy();
    });
  });
});
