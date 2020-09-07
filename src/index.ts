import { generateOrgLicensesReport, getApiToken } from './lib';

export async function main() {
  // check SNYK_TOKEN is set as the sdk uses it
  getApiToken();
  // check CLI properties passed in
  const orgPublicId = 'blah';
  const options = {};
  await generateOrgLicensesReport(orgPublicId, options);
}
