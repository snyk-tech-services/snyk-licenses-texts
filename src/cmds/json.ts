import * as debugLib from 'debug';

import { getApiToken } from '../lib/get-api-token';
import { generateLicenseData } from '../lib/generate-org-license-report';
import { SupportedViews } from '../lib/generate-output';

const debug = debugLib('snyk-licenses:json');

export const command = 'json';
export const desc = 'Generate org licenses & dependencies data in JSON format';
export const builder = {
  orgPublicId: {
    required: true,
    default: undefined,
  },
  view: {
    // TODO: add also dependency based view when ready
    default: SupportedViews.ORG_LICENSES,
    desc:
      'How should the data be represented. Defaults to a license based view.',
  },
};
export const aliases = ['j'];

export async function handler(argv: {
  orgPublicId: string;
  view: SupportedViews;
}) {
  try {
    const { orgPublicId, view } = argv;
    debug('ℹ️  Options: ' + JSON.stringify({ orgPublicId, view }));
    // check SNYK_TOKEN is set as the sdk uses it
    getApiToken();
    // TODO: define and pass options to help filter the response
    // based on filters available in API
    const data = await generateLicenseData(orgPublicId, {});
    console.log(JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }
}
