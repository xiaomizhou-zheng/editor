import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import { render, waitFor, cleanup } from '@testing-library/react';
import { waitUntil } from '@atlaskit/elements-test-helpers';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';

import { EmojiDescription, UfoEmojiTimings } from '../../../../types';
import Emoji from '../../../../components/common/Emoji';
import EmojiPlaceholder from '../../../../components/common/EmojiPlaceholder';
import ResourcedEmoji from '../../../../components/common/ResourcedEmoji';
import { EmojiProvider } from '../../../../api/EmojiResource';

import {
  evilburnsEmoji,
  grinEmoji,
  getEmojiResourcePromise,
  mediaEmoji,
} from '../../_test-data';

import { ufoExperiences } from '../../../../util/analytics';
import * as constants from '../../../../util/constants';
import * as samplingUfo from '../../../../util/analytics/samplingUfo';
import * as browserSupport from '../../../../util/browser-support';

const mockedBrowserSupport = browserSupport as {
  isIntersectionObserverSupported: boolean;
};

const findEmoji = (component: ReactWrapper) =>
  component.update() && component.find(Emoji);
const emojiVisible = (component: ReactWrapper) =>
  findEmoji(component).length === 1;
const emojiVisibleById = (component: ReactWrapper, id: string) =>
  emojiVisible(component) && findEmoji(component).prop('emoji').id === id;
const emojiPlaceHolderVisible = (component: ReactWrapper) =>
  component.update() && component.find(EmojiPlaceholder).length === 1;

jest.mock('../../../../util/constants', () => {
  const originalModule = jest.requireActual('../../../../util/constants');
  return {
    ...originalModule,
    SAMPLING_RATE_EMOJI_RENDERED_EXP: 1,
  };
});

const mockConstants = constants as {
  SAMPLING_RATE_EMOJI_RENDERED_EXP: number;
};

describe('<ResourcedEmoji />', () => {
  beforeAll(() => {
    mockedBrowserSupport.isIntersectionObserverSupported = true;
  });

  beforeEach(() => {
    mockConstants.SAMPLING_RATE_EMOJI_RENDERED_EXP = 1;
    samplingUfo.clearSampled();
    jest.clearAllMocks();
  });
  afterEach(cleanup);

  it('should render a fallback element if emoji cannot be found', async () => {
    const fallback = <h1>wow cool</h1>;
    const component = await render(
      <ResourcedEmoji
        emojiProvider={getEmojiResourcePromise()}
        emojiId={{ shortName: 'does-not-exist', id: 'does-not-exist' }}
        customFallback={fallback}
      />,
    );

    await waitFor(async () => {
      const result = await component.findByText('wow cool');
      expect(result).toBeInTheDocument();
    });
  });

  it('should render a fallback string if emoji cannot be found', async () => {
    const component = await render(
      <ResourcedEmoji
        emojiProvider={getEmojiResourcePromise()}
        emojiId={{ shortName: 'does-not-exist', id: 'does-not-exist' }}
        customFallback="wow cool"
      />,
    );

    await waitFor(async () => {
      const result = await component.findByText('wow cool');
      expect(result).toBeInTheDocument();
    });
  });

  it('should render emoji', () => {
    const component = mount(
      <ResourcedEmoji
        emojiProvider={getEmojiResourcePromise()}
        emojiId={{ shortName: 'shouldnotbeused', id: grinEmoji.id }}
      />,
    );

    return waitUntil(() => emojiVisible(component)).then(() => {
      expect(findEmoji(component).prop('emoji').id).toEqual(grinEmoji.id);
    });
  });

  it('should render emoji with correct data attributes', () => {
    const component = mount(
      <ResourcedEmoji
        emojiProvider={getEmojiResourcePromise()}
        emojiId={{ shortName: 'shouldnotbeused', id: grinEmoji.id }}
      />,
    );

    return waitUntil(() => emojiVisible(component)).then(() => {
      expect(
        component
          .find('span[data-emoji-id]')
          .getDOMNode()
          .attributes.getNamedItem('data-emoji-id')!.value,
      ).toEqual(grinEmoji.id);
      expect(
        component
          .find('span[data-emoji-id]')
          .getDOMNode()
          .attributes.getNamedItem('data-emoji-short-name')!.value,
      ).toEqual('shouldnotbeused');
      expect(
        component
          .find('span[data-emoji-id]')
          .getDOMNode()
          .attributes.getNamedItem('data-emoji-text')!.value,
      ).toEqual('shouldnotbeused');
    });
  });

  it('should not wrap with a tooltip if there is no showTooltip prop', async () => {
    const result = await render(
      <ResourcedEmoji
        emojiProvider={getEmojiResourcePromise()}
        emojiId={grinEmoji}
      />,
    );

    mockAllIsIntersecting(true);

    const component = await result.findByTestId(
      `sprite-emoji-${grinEmoji.shortName}`,
    );
    expect(component).toHaveAttribute('title', '');
  });

  it('should wrap with tooltip if showTooltip is set to true', async () => {
    const result = await render(
      <ResourcedEmoji
        emojiProvider={getEmojiResourcePromise()}
        emojiId={grinEmoji}
        showTooltip={true}
      />,
    );
    mockAllIsIntersecting(true);
    const component = await result.findByTestId(
      `sprite-emoji-${grinEmoji.shortName}`,
    );
    expect(component).toHaveAttribute('title', ':grin:');
  });

  it('should fallback to shortName if no id', () => {
    const component = mount(
      <ResourcedEmoji
        emojiProvider={getEmojiResourcePromise()}
        emojiId={{ shortName: grinEmoji.shortName }}
      />,
    );

    return waitUntil(() => emojiVisible(component)).then(() => {
      expect(findEmoji(component).prop('emoji').id).toEqual(grinEmoji.id);
    });
  });

  it('should update emoji on shortName change', () => {
    const component = mount(
      <ResourcedEmoji
        emojiProvider={getEmojiResourcePromise()}
        emojiId={{ shortName: grinEmoji.shortName }}
      />,
    );

    return waitUntil(() => emojiVisible(component)).then(() => {
      expect(findEmoji(component).prop('emoji').id).toEqual(grinEmoji.id);
      component.setProps({
        emojiId: { shortName: evilburnsEmoji.shortName },
      });

      return waitUntil(() =>
        emojiVisibleById(component, evilburnsEmoji.id),
      ).then(() => {
        expect(findEmoji(component).prop('emoji').id).toEqual(
          evilburnsEmoji.id,
        );
      });
    });
  });

  it('unknown emoji', () => {
    let resolver: (value?: any | PromiseLike<any>) => void;
    const config = {
      promiseBuilder: (result: EmojiDescription) => {
        return new Promise((resolve) => {
          resolver = resolve;
        });
      },
    };
    const component = mount(
      <ResourcedEmoji
        emojiProvider={
          getEmojiResourcePromise(config) as Promise<EmojiProvider>
        }
        emojiId={{ shortName: 'doesnotexist', id: 'doesnotexist' }}
      />,
    );

    return waitUntil(() => !!resolver).then(() => {
      resolver();
      return waitUntil(() => emojiPlaceHolderVisible(component)).then(() => {
        expect(true).toEqual(true);
      });
    });
  });

  it('placeholder while loading emoji', () => {
    let resolver: (value?: any | PromiseLike<any>) => void;
    let resolverResult: EmojiDescription;
    const config = {
      promiseBuilder: (result: EmojiDescription) => {
        resolverResult = result;
        return new Promise((resolve) => {
          resolver = resolve;
        });
      },
    };
    const component = mount(
      <ResourcedEmoji
        emojiProvider={
          getEmojiResourcePromise(config) as Promise<EmojiProvider>
        }
        emojiId={{ shortName: grinEmoji.shortName, id: grinEmoji.id }}
      />,
    );

    return waitUntil(() => !!resolver).then(() => {
      return waitUntil(() => emojiPlaceHolderVisible(component)).then(() => {
        resolver(resolverResult);
        return waitUntil(() => emojiVisible(component)).then(() => {
          expect(findEmoji(component).prop('emoji').id).toEqual(grinEmoji.id);
        });
      });
    });
  });

  it('placeholder should be wrapped with a tooltip if showTooltip is set to true', () => {
    // @ts-ignore Unused var never read, should this be deleted?
    let resolver;
    // @ts-ignore Unused var never read, should this be deleted?
    let resolverResult;
    const config = {
      promiseBuilder: (result: EmojiDescription) => {
        resolverResult = result;
        return new Promise((resolve) => {
          resolver = resolve;
        });
      },
    };
    const component = mount(
      <ResourcedEmoji
        emojiProvider={
          getEmojiResourcePromise(config) as Promise<EmojiProvider>
        }
        emojiId={{ shortName: 'doesnotexist', id: 'doesnotexist' }}
        showTooltip={true}
      />,
    );

    return waitUntil(() => emojiPlaceHolderVisible(component)).then(() => {
      const placeholder = component.find(EmojiPlaceholder);
      expect(placeholder.childAt(0).prop('title')).toBeDefined();
    });
  });

  it('should mark success for UFO experience of rendered emoji event when emoji is loaded when in view at start', () => {
    const experience = ufoExperiences['emoji-rendered'].getInstance(
      mediaEmoji.id || mediaEmoji.shortName,
    );
    const startSpy = jest.spyOn(experience, 'start');
    const successSpy = jest.spyOn(experience, 'success');
    const component = mount(
      <ResourcedEmoji
        emojiProvider={getEmojiResourcePromise() as Promise<EmojiProvider>}
        emojiId={{ shortName: mediaEmoji.id, id: mediaEmoji.id }}
      />,
    );

    return waitUntil(() => emojiVisible(component)).then(() => {
      // mimic image loaded first when it's in viewport at start
      mockAllIsIntersecting(false);
      findEmoji(component).find('img').simulate('load');
      // detected emoji is in viewport
      mockAllIsIntersecting(true);
      expect(startSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(
        experience.metrics.marks.some(
          (mark) => mark.name === UfoEmojiTimings.ONLOAD_END,
        ),
      ).toBeTruthy();
    });
  });

  it('should mark success for UFO experience of rendered emoji event when emoji is loaded after in viewport', async () => {
    const timeBeforeInView = 500;
    mockAllIsIntersecting(false);
    const experience = ufoExperiences['emoji-rendered'].getInstance(
      mediaEmoji.id || mediaEmoji.shortName,
    );
    const startSpy = jest.spyOn(experience, 'start');
    const successSpy = jest.spyOn(experience, 'success');
    const component = mount(
      <ResourcedEmoji
        emojiProvider={getEmojiResourcePromise() as Promise<EmojiProvider>}
        emojiId={{ shortName: mediaEmoji.id, id: mediaEmoji.id }}
      />,
    );

    await waitUntil(() => emojiVisible(component));
    // mimic user waited some time and then scroll to get emoji in viewport
    await new Promise((r) => setTimeout(r, timeBeforeInView));
    mockAllIsIntersecting(true);
    // emoji in view port and load image
    findEmoji(component).find('img').simulate('load');
    const onLoadEndTime = experience.metrics.marks.find(
      (mark) => mark.name === UfoEmojiTimings.ONLOAD_END,
    );
    const onLoadStartTime = experience.metrics.marks.find(
      (mark) => mark.name === UfoEmojiTimings.ONLOAD_START,
    );
    expect(startSpy).toHaveBeenCalledTimes(1);
    expect(successSpy).toHaveBeenCalledTimes(1);
    expect(onLoadEndTime).toBeDefined();
    expect(onLoadStartTime).toBeDefined();
    expect(onLoadEndTime!.time - onLoadStartTime!.time).toBeLessThan(
      timeBeforeInView,
    );
    expect(
      experience.metrics.marks.find(
        (mark) => mark.name === UfoEmojiTimings.ONLOAD_END,
      ),
    ).toBeTruthy();
  });

  it('should mark failure for UFO experience of rendered emoji event when emoji is on error', () => {
    const experience = ufoExperiences['emoji-rendered'].getInstance(
      mediaEmoji.id || mediaEmoji.shortName,
    );
    const startSpy = jest.spyOn(experience, 'start');
    const failSpy = jest.spyOn(experience, 'failure');
    const component = mount(
      <ResourcedEmoji
        emojiProvider={getEmojiResourcePromise() as Promise<EmojiProvider>}
        emojiId={{ shortName: mediaEmoji.id, id: mediaEmoji.id }}
      />,
    );

    return waitUntil(() => emojiVisible(component)).then(() => {
      mockAllIsIntersecting(true);
      findEmoji(component).find('img').simulate('error');
      expect(startSpy).toHaveBeenCalledTimes(1);
      expect(failSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('should fail UFO experience of rendered emoji event when emoji have rendering issues', () => {
    const experience = ufoExperiences['emoji-rendered'].getInstance(
      mediaEmoji.id || mediaEmoji.shortName,
    );
    const startSpy = jest.spyOn(experience, 'start');
    const failureSpy = jest.spyOn(experience, 'failure');

    const component = mount(
      <ResourcedEmoji
        emojiProvider={getEmojiResourcePromise() as Promise<EmojiProvider>}
        emojiId={{ shortName: mediaEmoji.id, id: mediaEmoji.id }}
      />,
    );

    return waitUntil(() => emojiVisible(component)).then(() => {
      component.find(Emoji).simulateError(new Error('test error'));
      expect(startSpy).toHaveBeenCalledTimes(1);
      expect(failureSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('should abort UFO experience of rendered emoji event when emoji is unmounted', () => {
    const experience = ufoExperiences['emoji-rendered'].getInstance(
      mediaEmoji.id || mediaEmoji.shortName,
    );
    const startSpy = jest.spyOn(experience, 'start');
    const abortSpy = jest.spyOn(experience, 'abort');
    const component = mount(
      <ResourcedEmoji
        emojiProvider={getEmojiResourcePromise() as Promise<EmojiProvider>}
        emojiId={{ shortName: mediaEmoji.id, id: mediaEmoji.id }}
      />,
    );

    component.unmount();

    expect(startSpy).toHaveBeenCalledTimes(1);
    expect(abortSpy).toHaveBeenCalledTimes(1);
  });
});
