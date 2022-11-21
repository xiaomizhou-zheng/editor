import React, { FC } from 'react';

import LoadingEmojiComponent, {
  Props as LoadingProps,
  State as LoadingState,
} from '../common/LoadingEmojiComponent';
import { Props as ComponentProps } from './EmojiUploadComponent';
import { EmojiProvider } from '../../api/EmojiResource';
import {
  CreateUIAnalyticsEvent,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';

const emojiUploadModuleLoader = () =>
  import(
    /* webpackChunkName:"@atlaskit-internal_emojiUploadComponent" */ './EmojiUploadComponent'
  );

const emojiUploadLoader: () => Promise<FC<ComponentProps>> = () =>
  emojiUploadModuleLoader().then((module) => module.default);

export interface Props extends LoadingProps {
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
}

export class EmojiUploaderInternal extends LoadingEmojiComponent<
  Props,
  LoadingState
> {
  // state initialised with static component to prevent
  // rerender when the module has already been loaded
  static AsyncLoadedComponent?: FC<ComponentProps>;
  state = {
    asyncLoadedComponent: EmojiUploaderInternal.AsyncLoadedComponent,
  };

  constructor(props: Props) {
    super(props, {});
  }

  asyncLoadComponent() {
    emojiUploadLoader().then((component) => {
      EmojiUploaderInternal.AsyncLoadedComponent = component;
      this.setAsyncState(component);
    });
  }

  renderLoaded(
    loadedEmojiProvider: EmojiProvider,
    EmojiUploadComponent: FC<ComponentProps>,
  ) {
    const { emojiProvider, ...otherProps } = this.props;
    return (
      <EmojiUploadComponent
        emojiProvider={loadedEmojiProvider}
        {...otherProps}
      />
    );
  }
}

type EmojiUploader = EmojiUploaderInternal;
const EmojiUploader = withAnalyticsEvents()(EmojiUploaderInternal);

export default EmojiUploader;
