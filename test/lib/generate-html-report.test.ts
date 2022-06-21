import * as path from 'path';
import { generateHtmlReport } from '../../src/lib/generate-report';
import { loadJson } from '../load-json';
import { LicenseReportData } from '../../src/lib/generate-org-license-report';
import { SupportedViews } from '../../src/lib/types';

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
    const licenseRes = loadJson(
      __dirname + '/fixtures/example-license-data.json',
    ) as unknown as LicenseReportData;
    const orgData = {
      name: 'org',
      id: 'avd-scv',
      slug: 'org',
      url: 'https://snyk.io/org/org',
      group: {
        name: 'group',
        id: 'group-1',
      },
    };
    const date = new Date('2022-02-22').toLocaleDateString();
    const htmlData = await generateHtmlReport(
      ORG_ID,
      licenseRes,
      orgData,
      undefined,
      undefined,
      date,
    );
    expect(htmlData).toMatchSnapshot();
  }, 150000);

  test('License HTML Report is generated as expected with project based view', async () => {
    const licenseRes = loadJson(
      __dirname + '/fixtures/example-license-data.json',
    ) as unknown as LicenseReportData;
    const orgData = {
      name: 'org',
      id: 'avd-scv',
      slug: 'org',
      url: 'https://snyk.io/org/org',
      group: {
        name: 'group',
        id: 'group-1',
      },
    };
    const date = new Date('2022-02-22').toLocaleDateString();
    const htmlData = await generateHtmlReport(
      ORG_ID,
      licenseRes,
      orgData,
      undefined,
      SupportedViews.PROJECT_DEPENDENCIES,
      date,
    );
    expect(htmlData).toMatchSnapshot();
  }, 150000);

  test('License HTML Report is generated as expected with a custom hbs template', async () => {
    const licenseRes = loadJson(
      __dirname + '/fixtures/example-license-data.json',
    ) as unknown as LicenseReportData;
    const orgData = {
      name: 'org',
      id: 'avd-scv',
      slug: 'org',
      url: 'https://snyk.io/org/org',
      group: {
        name: 'group',
        id: 'group-1',
      },
    };
    const date = new Date('2022-02-22').toLocaleDateString();
    const htmlData = await generateHtmlReport(
      ORG_ID,
      licenseRes,
      orgData,
      path.resolve(__dirname + '/fixtures/custom-view.hbs'),
      undefined,
      date,
    );
    expect(htmlData).toMatchSnapshot();
  }, 150000);
  test('License HTML Report is generated as expected with excludeSnykFields enabled', async () => {
    const licenseRes = loadJson(
      __dirname + '/fixtures/example-license-data.json',
    ) as unknown as LicenseReportData;
    const orgData = {
      name: 'org',
      id: 'avd-scv',
      slug: 'org',
      url: 'https://snyk.io/org/org',
      group: {
        name: 'group',
        id: 'group-1',
      },
    };
    const date = new Date('2022-02-22').toLocaleDateString();
    const htmlData = await generateHtmlReport(
      ORG_ID,
      licenseRes,
      orgData,
      undefined,
      undefined,
      date,
      {
        excludeSnykFields: true,
      },
    );
    expect(htmlData).toMatchSnapshot();
  }, 150000);
  test.todo('Test for when API fails aka bad org id provided');
});
