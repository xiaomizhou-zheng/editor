import { OptionData } from '@atlaskit/user-picker';

import { transformUsers } from './users-transformer';
import { config } from '../config';
import { ConfluenceAttributes, RecommendationRequest } from '../types';
import { IntlShape } from 'react-intl-next';

const getUserRecommendations = (
  request: RecommendationRequest,
  intl: IntlShape,
): Promise<OptionData[]> => {
  const url = config.getRecommendationServiceUrl(request.baseUrl || '');
  return fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      context: request.context,
      includeUsers: request.includeUsers,
      includeGroups: request.includeGroups,
      includeTeams: request.includeTeams,
      maxNumberOfResults: request.maxNumberOfResults,
      performSearchQueryOnly: false,
      searchQuery: {
        cpusQueryHighlights: {
          query: '',
          field: '',
        },
        ...((request.context?.productAttributes as ConfluenceAttributes)
          ?.isEntitledConfluenceExternalCollaborator && {
          productAccessPermissionIds: ['write', 'external-collaborator-write'],
        }),
        customQuery: '',
        customerDirectoryId: '',
        filter: request.searchQueryFilter || '',
        minimumAccessLevel: 'APPLICATION',
        queryString: request.query,
        restrictTo: {
          userIds: [],
          groupIds: [],
        },
        searchUserbase: false,
      },
    }),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      return Promise.reject({
        message: `error calling smart service, statusCode=${response.status}, statusText=${response.statusText}`,
      });
    })
    .then((response) => transformUsers(response, intl));
};

export default getUserRecommendations;
