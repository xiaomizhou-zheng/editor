import { useEffect, useState } from 'react';
import { useSmartCardState as useSmartLinkState } from '../store';
import { useSmartCardActions as useSmartLinkActions } from '../actions';
import { useSmartLinkConfig } from '../config';
import { useSmartLinkAnalytics } from '../analytics';
import { AnalyticsHandler } from '../../utils/types';
import { useSmartLinkRenderers } from '../renderers';
import { useSmartLinkContext } from '@atlaskit/link-provider';

export function useSmartLink(
  id: string,
  url: string,
  dispatchAnalytics: AnalyticsHandler,
) {
  const state = useSmartLinkState(url);
  const { store } = useSmartLinkContext();
  const analytics = useSmartLinkAnalytics(url, dispatchAnalytics, id);
  const actions = useSmartLinkActions(id, url, analytics);
  const config = useSmartLinkConfig();
  const renderers = useSmartLinkRenderers();

  // NB: used to propagate errors from hooks to error boundaries.
  const [error, setError] = useState<Error | null>(null);
  // Register the current card.
  const register = () => {
    actions.register().catch((err) => setError(err));
  };
  // AFP-2511 TODO: Fix automatic suppressions below
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(register, [url, store]);

  // Provide the state and card actions to consumers.
  return {
    state,
    actions,
    config,
    analytics,
    renderers,
    error,
  };
}
