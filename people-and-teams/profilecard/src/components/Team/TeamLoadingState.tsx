import React, { useEffect } from 'react';

import Spinner from '@atlaskit/spinner';

import {
  CardContent,
  CardHeader,
  CardWrapper,
  LoadingWrapper,
} from '../../styled/TeamCard';
import { AnalyticsFunction } from '../../types';
import { profileCardRendered } from '../../util/analytics';

export default (props: { analytics: AnalyticsFunction }) => {
  const { analytics } = props;

  useEffect(() => {
    analytics((duration) =>
      profileCardRendered('team', 'spinner', { duration }),
    );
  }, [analytics]);

  return (
    <CardWrapper data-testid="team-profilecard">
      <CardHeader isLoading />
      <CardContent>
        <LoadingWrapper data-testid="team-profilecard-spinner">
          <Spinner />
        </LoadingWrapper>
      </CardContent>
    </CardWrapper>
  );
};
