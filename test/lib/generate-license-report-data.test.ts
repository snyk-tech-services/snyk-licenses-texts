import { generateLicenseData } from '../../src/lib/generate-org-license-report';

describe('Get org licenses', () => {
  const OLD_ENV = process.env;
  process.env.SNYK_TOKEN = process.env.SNYK_TEST_TOKEN;
  const ORG_ID = process.env.TEST_ORG_ID as string;

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
    expect(licenseRes['Unlicense'].licenseUrl).toBe('https://spdx.org/licenses/Unlicense.html');
    expect(licenseRes['Unlicense'].licenseUrl).toBe('https://spdx.org/licenses/Unlicense.html');
    expect(licenseRes['Unlicense'].dependencies[0].copyright).not.toBeNull();
    expect(licenseRes['Unlicense'].dependencies[0].issuesMedium).not.toBeNull();
    expect(licenseRes['Unlicense'].dependencies[0].latestVersion).not.toBeNull();
  }, 50000);
});
