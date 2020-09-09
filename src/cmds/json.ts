import { getApiToken } from '../lib/get-api-token';
import { generateOrgLicensesReport } from '../lib/generate-org-license-report';

export const command = 'json';
export const desc = 'Generate org licenses & dependencies data in JSON format';
export const builder = {
  orgPublicId: {
    required: true,
    default: undefined,
  },
};
export const aliases = ['j'];

export async function handler(argv: { orgPublicId: string }) {
  try {
    // check SNYK_TOKEN is set as the sdk uses it
    getApiToken();
    // TODO: define and pass options to help filter the response
    // based on filters available in API
    const data = await generateOrgLicensesReport(argv.orgPublicId, {});
    console.log(JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }
}
