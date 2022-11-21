import { GasPayload } from '@atlaskit/analytics-gas-types';
import { CardInnerAppearance } from '../view/Card/types';

// Types of analytics have been defined in the minimum event spec here:
// https://hello.atlassian.net/wiki/spaces/PData/pages/367398441/Minimum+Event+Spec+-+Smart+Links
export type AnalyticsAction =
  | 'resolved'
  | 'unresolved'
  | 'connectSucceeded'
  | 'connectFailed'
  | 'connected'
  | 'clicked'
  | 'closed'
  | 'renderFailed'
  | 'renderWithStatus'
  | 'renderSuccess'
  | 'inserted'
  | 'viewed'
  | 'dismissed'
  | 'created';

export type AnalyticsActionSubject =
  | 'smartLink'
  | 'smartLinkAction'
  | 'applicationAccount'
  | 'button'
  | 'consentModal'
  | 'hoverCard'
  | 'modal'
  | 'embedPreviewModal';

export type AnalyticsName = 'embedPreviewModal';

export type AnalyticsOrigin =
  | 'smartLinkCard'
  | 'smartLinkEmbed'
  | 'smartLinkInline'
  | 'smartLinkPreviewHoverCard';

export type AnalyticsPayload = GasPayload & {
  action?: AnalyticsAction;
  actionSubject: AnalyticsActionSubject;
  attributes: GasPayload['attributes'] & {
    display?: CardInnerAppearance;
  };
};

export type AnalyticsHandler = (event: AnalyticsPayload) => void;
