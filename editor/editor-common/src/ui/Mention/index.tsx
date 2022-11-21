import React, { PureComponent } from 'react';

import {
  ProviderFactory,
  Providers,
  WithProviders,
} from '../../provider-factory';
import { ProfilecardProvider } from '../../provider-factory/profile-card-provider';
import { MentionEventHandlers } from '../EventHandlers';

import MentionWithProviders from './mention-with-providers';

export interface MentionProps {
  id: string;
  providers?: ProviderFactory;
  eventHandlers?: MentionEventHandlers;
  text: string;
  accessLevel?: string;
}

export interface MentionState {
  profilecardProvider: ProfilecardProvider | null;
}

export default class Mention extends PureComponent<MentionProps, {}> {
  private providerFactory: ProviderFactory;

  constructor(props: MentionProps) {
    super(props);
    this.providerFactory = props.providers || new ProviderFactory();
  }

  componentWillUnmount() {
    if (!this.props.providers) {
      // new ProviderFactory is created if no `providers` has been set
      // in this case when component is unmounted it's safe to destroy this providerFactory
      this.providerFactory.destroy();
    }
  }

  private renderWithProvider = (providers: Providers) => {
    const { accessLevel, eventHandlers, id, text } = this.props;

    const { mentionProvider, profilecardProvider } = providers;

    return (
      <MentionWithProviders
        id={id}
        text={text}
        accessLevel={accessLevel}
        eventHandlers={eventHandlers}
        mentionProvider={mentionProvider}
        profilecardProvider={profilecardProvider}
      />
    );
  };

  render() {
    return (
      <WithProviders
        providers={['mentionProvider', 'profilecardProvider']}
        providerFactory={this.providerFactory}
        renderNode={this.renderWithProvider}
      />
    );
  }
}
