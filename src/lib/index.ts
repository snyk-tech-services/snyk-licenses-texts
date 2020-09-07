import { getLicenseDataForOrg } from './org-license-data';

export * as orgLicenseData from './org-license-data';
export * from './license-text';
export * from './get-api-token';

export async function generateOrgLicensesReport(
  orgPublicId: string,
  options,
): Promise<string> {
  try {
    const licenseData = await getLicenseDataForOrg(orgPublicId, options);
    const report = licenseData;
    return report as any;
  } catch (e) {
    console.log('**** ERROR:', e);
  }
  // TODO: handle?
}
