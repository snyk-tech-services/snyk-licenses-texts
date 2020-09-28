import {
  generateHtmlReport,
} from '../../src/lib/generate-output';
import { generateLicenseData } from '../../src/lib/generate-org-license-report';
describe('Generate HTML report', () => {
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
  test('License HTML Report is generated as expected', async () => {
    const licenseRes = await generateLicenseData(ORG_ID, {});
    const htmlData = await generateHtmlReport(licenseRes);
    expect(htmlData).toMatchSnapshot();
  }, 50000);

  test.todo('Test for when API fails aka bad org id provided');
});
