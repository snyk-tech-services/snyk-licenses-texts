import { getLicenseDataForOrg } from './api/org';
import * as debugLib from 'debug';

export * from './license-text';
export * from './get-api-token';

const debug = debugLib('generateOrgLicensesReport');

interface LicenseReportDataEntry {
  licenseId: string;
  licenseUrl: string;
  // TODO: what if it is a dual license?
  licenseText: string; // HTML of the license
  copyrightNotices: string[]; // all copyright per dep@version? notices from all dependencies under that license
  legalInstructions?: string;
  severity: 'none' | 'low' | 'medium' | 'high';
}

export async function generateOrgLicensesReport(
  orgPublicId: string,
  options,
): Promise<string> {
  try {
    const licenseData = await getLicenseDataForOrg(orgPublicId, options);
    // const reportData: LicenseReportDataEntry = {} as any;
    const report = licenseData;
    return report as any;
  } catch (e) {
    debug('Failed to generate report data', e);
    throw e;
  }
}
