import { generateLicenseData } from '../../src/lib/generate-org-license-report';

describe('Get org licenses', () => {
  const OLD_ENV = process.env;
  process.env.SNYK_TOKEN = process.env.SNYK_TEST_TOKEN;
  const ORG_ID = process.env.TEST_ORG_ID as string;
  const PROJECT_ID = process.env.TEST_PROJECT_ID as string;

  afterAll(async () => {
    process.env = { ...OLD_ENV };
  });
  test('SNYK_TOKEN & ORG_ID are set', async () => {
    expect(process.env.SNYK_TOKEN).not.toBeNull();
    expect(process.env.ORG_ID).not.toBeNull();
  });

  test('License data is generated as expected', async () => {
    const licenseRes = await generateLicenseData(ORG_ID, {});
    expect(Object.keys(licenseRes).length >= 11).toBeTruthy();
    expect(licenseRes['Unknown'].licenseUrl).toBeUndefined();
    expect(licenseRes['Unknown'].licenseText).toBeUndefined();
    expect(licenseRes['Unlicense'].licenseText).not.toBeNull();
    expect(licenseRes['Unlicense'].licenseUrl).toBe(
      'https://spdx.org/licenses/Unlicense.html',
    );
    expect(licenseRes['Unlicense'].licenseUrl).toBe(
      'https://spdx.org/licenses/Unlicense.html',
    );
    expect(licenseRes['Unlicense'].dependencies[0].copyright).not.toBeNull();
    expect(licenseRes['Unlicense'].dependencies[0].issuesMedium).not.toBeNull();
    expect(
      licenseRes['Unlicense'].dependencies[0].latestVersion,
    ).not.toBeNull();

    expect(licenseRes['Zlib'].projects.length).toEqual(2);
    expect(licenseRes['ISC'].projects.length).toEqual(3);
    expect(licenseRes['ISC'].dependencies[0].copyright).toEqual(
      ['Copyright (c) Isaac Z. Schlueter and Contributors'],
    );
  }, 70000);

  test('License data is generated as expected', async () => {
    const licenseRes = await generateLicenseData(ORG_ID, {
      filters: {
        projects: [PROJECT_ID],
      },
    });
    expect(Object.keys(licenseRes).length >= 11).toBeTruthy();
    expect(licenseRes['Unknown']).toBeUndefined();
    expect(licenseRes['Unlicense'].licenseText).not.toBeNull();
    expect(licenseRes['Unlicense'].licenseUrl).toBe(
      'https://spdx.org/licenses/Unlicense.html',
    );
    expect(licenseRes['Unlicense'].licenseUrl).toBe(
      'https://spdx.org/licenses/Unlicense.html',
    );
    expect(licenseRes['Unlicense'].dependencies[0].copyright).not.toBeNull();
    expect(licenseRes['Unlicense'].dependencies[0].issuesMedium).not.toBeNull();
    expect(
      licenseRes['Unlicense'].dependencies[0].latestVersion,
    ).not.toBeNull();

    expect(licenseRes['Zlib']).toBeUndefined();
    expect(licenseRes['ISC'].projects.length).toEqual(1);
    expect(licenseRes['ISC'].dependencies[0].copyright).toEqual([
      'Copyright (c) Isaac Z. Schlueter and Contributors',
    ]);
  }, 70000);

  test.todo('Test for when API fails aka bad org id provided');
});
