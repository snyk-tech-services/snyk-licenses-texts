import * as debugLib from 'debug';
import * as pathLib from 'path';
import { getApiToken } from '../lib/get-api-token';
import {
  LicenseReportData,
  generateLicenseData,
} from '../lib/generate-org-license-report';
import { generateHtmlReport } from '../lib/generate-report';
import { getOrgData } from '../lib/get-org-data';
import { generateReportName } from '../lib/generate-report-name';
import { SupportedViews } from '../lib/types';
import { saveHtmlReport, savePdfReport } from '../lib/generate-output';
const debug = debugLib('snyk-licenses:generate');

const outputHandlers = {
  [OutputFormat.HTML]: saveHtmlReport,
  [OutputFormat.PDF]: savePdfReport,
};

const enum OutputFormat {
  HTML = 'html',
  PDF = 'pdf',
}

export const desc =
  'Generate org licenses & dependencies report in HTML format';
export const builder = {
  orgPublicId: {
    required: true,
    default: undefined,
    desc:
      'Public id of the organization in Snyk (available on organization settings)',
  },
  template: {
    default: undefined,
    desc: 'Path to custom Handelbars.js template file (*.hbs)',
  },
  outputFormat: {
    default: OutputFormat.HTML,
    desc: 'Report format',
    choices: [OutputFormat.HTML, OutputFormat.PDF],
  },
  view: {
    choices: [SupportedViews.ORG_LICENSES, SupportedViews.PROJECT_DEPENDENCIES],
    default: SupportedViews.ORG_LICENSES,
    desc:
      'How should the data be represented. Defaults to a license based view.',
  },
};
export const aliases = ['g'];

export async function handler(argv: {
  orgPublicId: string;
  outputFormat: OutputFormat;
  template: string;
  view: SupportedViews;
}) {
  try {
    const { orgPublicId, outputFormat, template, view } = argv;
    debug(
      'ℹ️  Options: ' +
        JSON.stringify({ orgPublicId, outputFormat, template, view }),
    );
    getApiToken();
    const licenseData: LicenseReportData = await generateLicenseData(
      orgPublicId,
    );
    const orgData = await getOrgData(orgPublicId);
    const reportData = await generateHtmlReport(
      orgPublicId,
      licenseData,
      orgData,
      template,
      view,
    );
    const generateReportFunc = outputHandlers[outputFormat];
    const reportFileName = `${generateReportName(
      orgData,
      view,
    )}.${outputFormat}`;
    await generateReportFunc(reportFileName, reportData);
    console.log(
      `${outputFormat.toUpperCase()} license report saved at: ${pathLib.resolve(__dirname, reportFileName)}`,
    );
  } catch (e) {
    console.error(e);
  }
}
