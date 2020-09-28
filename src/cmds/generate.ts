import * as debugLib from 'debug';
import { getApiToken } from '../lib/get-api-token';
import { LicenseReportData, generateLicenseData } from '../lib/generate-org-license-report';
import { generateHtmlReport, generatePdfReport, SupportedViews } from '../lib/generate-output';
const debug = debugLib('snyk-licenses:generate');

const outputHandlers = {
  [OutputFormat.HTML]: generateHtmlReport,
  // [OutputFormat.PDF]: generatePdfReport
};
const enum OutputFormat {
  HTML = 'html',
  // TODO: support later
  // PDF = 'pdf',
}

export const desc =
  'Generate org licenses & dependencies report in HTML format';
export const builder = {
  orgPublicId: {
    required: true,
    default: undefined,
    desc: 'Public id of the organization in Snyk (available on organization settings)'
  },
  template: {
    default: undefined,
    desc: 'Path to custom Handelbars.js template file (*.hbs)'
  },
  outputFormat: {
    default: OutputFormat.HTML,
    desc: 'Report format',
    // TODO: add also PDF when ready
    options: [OutputFormat.HTML]
  },
  view: {
    // TODO: add also dependency based view when ready
    default: SupportedViews.ORG_LICENSES,
    desc: 'How should the data be represented. Defaults to a license based view.',
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
    const generateReportFunc = outputHandlers[outputFormat];
    return await generateReportFunc(licenseData, template, view);
  } catch (e) {
    console.error(e);
  }
}
