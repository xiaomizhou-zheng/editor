import {
  addExperimentalHeaders,
  convertTeam,
  extractIdFromAri,
  idToAri,
} from '../../client/getTeamFromAGG';

const ARI_PREFIX = 'ari:cloud:identity::team';

const teamId = '1234-5678-abcd-89ef';

describe('extractIdFromAri', () => {
  it('should get id from ari correctly', () => {
    const ari = `${ARI_PREFIX}/${teamId}`;

    expect(extractIdFromAri(ari)).toEqual(teamId);
  });

  it('should get id if ari is just id', () => {
    expect(extractIdFromAri(teamId)).toEqual(teamId);
  });

  it('should get id from random ari', () => {
    expect(extractIdFromAri(`some:nonsense/${teamId}`)).toEqual(teamId);
  });
});

describe('idToAri', () => {
  it('should add ari prefix', () => {
    expect(idToAri(teamId)).toEqual(`${ARI_PREFIX}/${teamId}`);
  });
});

describe('convertTeam', () => {
  it('should convert team formats as expected', () => {
    expect(
      convertTeam({
        team: {
          largeAvatarImageUrl: 'https://example.com/picture',
          id: `${ARI_PREFIX}/${teamId}`,
          displayName: 'Cool team!',
          description: '',
          organizationId: 'abc',
          members: {
            nodes: [
              {
                member: {
                  accountId: '1',
                  name: 'Test user A',
                  picture: 'https://example.com/picture/1',
                },
              },
              {
                member: {
                  accountId: '2',
                  name: 'Test user B',
                  picture: 'https://example.com/picture/2',
                },
              },
              {
                member: {
                  accountId: '3',
                  name: 'Test user C',
                  picture: 'https://example.com/picture/3',
                },
              },
            ],
          },
        },
      }),
    ).toEqual({
      largeAvatarImageUrl: 'https://example.com/picture',
      id: teamId,
      displayName: 'Cool team!',
      description: '',
      organizationId: 'abc',
      members: [
        {
          id: '1',
          fullName: 'Test user A',
          avatarUrl: 'https://example.com/picture/1',
        },
        {
          id: '2',
          fullName: 'Test user B',
          avatarUrl: 'https://example.com/picture/2',
        },
        {
          id: '3',
          fullName: 'Test user C',
          avatarUrl: 'https://example.com/picture/3',
        },
      ],
    });
  });
});

describe('addExperimentalHeaders', () => {
  it('should add headers for experiment', () => {
    const headers = new Headers();
    headers.append('Test', '123');

    const result = addExperimentalHeaders(headers);

    expect(result.get('X-ExperimentalApi')).toEqual(
      'teams-beta, team-members-beta',
    );
  });

  it('should return the same headers instance', () => {
    const headers = new Headers();
    headers.append('Test', '123');

    const result = addExperimentalHeaders(headers);

    expect(result).toBe(headers);
  });

  it('should retain other headers', () => {
    const headers = new Headers();
    headers.append('Test', '123');

    const result = addExperimentalHeaders(headers);

    expect(result.get('Test')).toBe('123');
  });
});
