import { getDependenciesDataForOrg } from '../../src/lib/api/org';
import { enrichDependencies } from '../../src/lib/generate-org-license-report';

describe('enrichDependencies', () => {
  afterAll(async () => {});
  test('enrichDependencies returns the same number of deps as provided', async () => {
    const dependencies = [
      {
        id: 'abbrev@1.0.9',
        name: 'abbrev',
        version: '1.0.9',
        packageManager: 'npm',
      },
      {
        id: 'lodash@1.0.0',
        name: 'lodash',
        version: '1.0.0',
        packageManager: 'npm',
      },
    ];

    const depApiData = {
      'abbrev@1.0.9': [
        {
          id: 'abbrev@1.0.9',
          name: 'abbrev',
          version: '1.0.9',
          type: 'npm',
          issuesHigh: 0,
          issuesMedium: 0,
          issuesLow: 0,
          dependenciesWithIssues: [],
          licenses: [
            {
              id: 'snyk:lic:npm:abbrev:ISC',
              title: 'ISC license',
              license: 'ISC',
            },
          ],
          projects: [
            {
              id: 'abc',
              name: 'snyk-fixtures/mono-repo:package.json',
            },
          ],
          latestVersion: '1.1.1',
          latestVersionPublishedDate: '2017-09-28T02:47:13.220Z',
          firstPublishedDate: '2011-03-21T22:21:11.183Z',
          isDeprecated: false,
          copyright: ['Copyright (c) Isaac Z. Schlueter and Contributors'],
        },
      ],
    };
    const res = enrichDependencies(dependencies, depApiData);
    expect(res).toHaveLength(2);
    expect(res).toEqual([
      {
        copyright: ['Copyright (c) Isaac Z. Schlueter and Contributors'],
        dependenciesWithIssues: [],
        firstPublishedDate: '2011-03-21T22:21:11.183Z',
        id: 'abbrev@1.0.9',
        isDeprecated: false,
        issuesHigh: 0,
        issuesLow: 0,
        issuesMedium: 0,
        latestVersion: '1.1.1',
        latestVersionPublishedDate: '2017-09-28T02:47:13.220Z',
        licenses: [
          {
            id: 'snyk:lic:npm:abbrev:ISC',
            license: 'ISC',
            title: 'ISC license',
          },
        ],
        name: 'abbrev',
        packageManager: 'npm',
        projects: [{ id: 'abc', name: 'snyk-fixtures/mono-repo:package.json' }],
        type: 'npm',
        version: '1.0.9',
      },
      {
        id: 'lodash@1.0.0',
        name: 'lodash',
        version: '1.0.0',
        packageManager: 'npm',
      },
    ]);
  });
});
