import { getLicenseDataForOrg } from '../../src/lib/org-license-data';

describe('Get org licenses', () => {
  const OLD_ENV = process.env;
  process.env.SNYK_TOKEN = process.env.SNYK_TEST_TOKEN;
  const ORG_ID = process.env.TEST_ORG_ID as string;

  afterAll(async () => {
    process.env = { ...OLD_ENV };
  });
  test('SNYK_TOKEN is set', async () => {
    expect(process.env.SNYK_TOKEN).not.toBeNull();
  });
  test('License results are returned from API', async () => {
    const licenseRes = await getLicenseDataForOrg(ORG_ID);
    expect(licenseRes.results.length > 0).toBeTruthy();
  });
})

