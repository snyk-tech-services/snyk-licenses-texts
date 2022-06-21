import * as snykApiSdk from 'snyk-api-ts-client';
import {
  enrichDependencies,
  mergeLicenceAndDepData,
} from '../../src/lib/generate-org-license-report';

describe('enrichDependencies', () => {
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
          issuesCritical: 0,
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
        issuesCritical: 0,
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

describe('mergeLicenceAndDepData', () => {
  test('mergeLicenceAndDepData returns the same number of licenses & deps as provided', async () => {
    const licenseData = {
      results: [
        {
          id: 'ISC',
          severity: '',
          instructions: '',
          dependencies: [
            {
              id: 'atob@2.1.1',
              name: 'atob',
              version: '2.1.1',
              packageManager: 'npm',
            },
            {
              id: 'optimist@0.6.1',
              name: 'optimist',
              version: '0.6.1',
              packageManager: 'npm',
            },
            {
              id: 'abbrev@1.0.9',
              name: 'abbrev',
              version: '1.0.9',
              packageManager: 'npm',
            },
            {
              id: 'wordwrap@0.0.2',
              name: 'wordwrap',
              version: '0.0.2',
              packageManager: 'npm',
            },
          ],
          projects: [
            {
              id: 'abc',
              name: 'snyk-fixtures/mono-repo:package.json',
            },
          ],
        },
      ],
    } as unknown as snykApiSdk.OrgTypes.LicensesPostResponseType;

    const depApiData = {
      'abbrev@1.0.9': [
        {
          id: 'abbrev@1.0.9',
          name: 'abbrev',
          version: '1.0.9',
          type: 'npm',
          issuesCritical: 0,
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
    const res = await mergeLicenceAndDepData(licenseData, depApiData);
    expect(Object.values(res)).toHaveLength(1);
    expect(res['ISC'].dependencies.length).toEqual(
      licenseData.results[0].dependencies.length,
    );
    expect(
      res['ISC'].dependencies.filter((dep) => dep.id === 'abbrev@1.0.9')[0]
        .copyright,
    ).toEqual(depApiData['abbrev@1.0.9'][0].copyright);
  });
  test('mergeLicenceAndDepData for a multi license returns extra licenses after separating multi licenses', async () => {
    const licenseData = {
      results: [
        {
          id: 'ISC OR MIT',
          severity: '',
          instructions: '',
          dependencies: [
            {
              id: 'atob@2.1.1',
              name: 'atob',
              version: '2.1.1',
              packageManager: 'npm',
            },
            {
              id: 'optimist@0.6.1',
              name: 'optimist',
              version: '0.6.1',
              packageManager: 'npm',
            },
            {
              id: 'abbrev@1.0.9',
              name: 'abbrev',
              version: '1.0.9',
              packageManager: 'npm',
            },
            {
              id: 'wordwrap@0.0.2',
              name: 'wordwrap',
              version: '0.0.2',
              packageManager: 'npm',
            },
          ],
          projects: [
            {
              id: 'abc',
              name: 'snyk-fixtures/mono-repo:package.json',
            },
          ],
        },
      ],
    } as unknown as snykApiSdk.OrgTypes.LicensesPostResponseType;

    const depApiData = {
      'abbrev@1.0.9': [
        {
          id: 'abbrev@1.0.9',
          name: 'abbrev',
          version: '1.0.9',
          type: 'npm',
          issuesCritical: 0,
          issuesHigh: 0,
          issuesMedium: 0,
          issuesLow: 0,
          dependenciesWithIssues: [],
          licenses: [
            {
              id: 'snyk:lic:npm:abbrev:ISC',
              title: 'ISC OR MIT license',
              license: 'ISC OR MIT',
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
    const res = await mergeLicenceAndDepData(licenseData, depApiData);
    expect(Object.values(res)).toHaveLength(2);
    expect(res['ISC'].dependencies.length).toEqual(
      licenseData.results[0].dependencies.length,
    );
    expect(res['MIT'].dependencies.length).toEqual(
      licenseData.results[0].dependencies.length,
    );
    expect(
      res['ISC'].dependencies.filter((dep) => dep.id === 'abbrev@1.0.9')[0]
        .copyright,
    ).toEqual(depApiData['abbrev@1.0.9'][0].copyright);
    expect(
      res['MIT'].dependencies.filter((dep) => dep.id === 'abbrev@1.0.9')[0]
        .copyright,
    ).toEqual(depApiData['abbrev@1.0.9'][0].copyright);
  });
});
