import React from 'react';
import {
  useAnalyticsEvents,
  UIAnalyticsEvent,
  AnalyticsContext,
} from '@atlaskit/analytics-next';
import * as colors from '@atlaskit/theme/colors';
import Button from '@atlaskit/button/custom-theme-button';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import { token } from '@atlaskit/tokens';
import { injectIntl, WrappedComponentProps } from 'react-intl-next';

import NotFoundImage from '../../../assets/NotFoundImage';
import { messages } from '../../../messages';

import {
  SearchResultEmptyMessageImage,
  SearchResultEmptyMessageText,
} from './styled';

export interface Props {
  searchExternalUrl?: string;
  onSearchExternalUrlClick?(
    event?: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent?: UIAnalyticsEvent,
  ): void;
}

export const SearchResultsEmpty: React.FC<Props & WrappedComponentProps> = ({
  searchExternalUrl,
  onSearchExternalUrlClick,
  intl: { formatMessage },
}) => {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  const handleExternalUrlClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    if (onSearchExternalUrlClick) {
      const analyticsEvent: UIAnalyticsEvent = createAnalyticsEvent({
        action: 'clicked',
      });
      onSearchExternalUrlClick(event, analyticsEvent);
    }
  };
  return (
    <>
      <SearchResultEmptyMessageImage>
        <NotFoundImage />
      </SearchResultEmptyMessageImage>

      <SearchResultEmptyMessageText>
        <strong>
          {formatMessage(messages.help_search_results_no_results)}
        </strong>
      </SearchResultEmptyMessageText>
      {searchExternalUrl && (
        <SearchResultEmptyMessageText>
          <p>
            {formatMessage(messages.help_search_results_no_results_line_two)}
            <br />
            <AnalyticsContext
              data={{
                componentName: 'searchExternalUrl',
              }}
            >
              <Button
                appearance="link"
                iconAfter={
                  <ShortcutIcon
                    size="small"
                    label=""
                    primaryColor={token('color.icon.subtle', colors.N90)}
                    secondaryColor={token('color.icon.subtle', colors.N90)}
                  />
                }
                spacing="compact"
                href={searchExternalUrl}
                target="_blank"
                onClick={handleExternalUrlClick}
              >
                {formatMessage(messages.help_search_results_external_site_link)}
              </Button>
            </AnalyticsContext>
          </p>
        </SearchResultEmptyMessageText>
      )}
    </>
  );
};

export default injectIntl(SearchResultsEmpty);
