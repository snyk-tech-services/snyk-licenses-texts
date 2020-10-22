import * as debugLib from 'debug';

import { getApiToken } from '../lib/get-api-token';
import { generateLicenseData } from '../lib/generate-org-license-report';
import { SupportedViews } from '../lib/types';
import * as _ from 'lodash';

const debug = debugLib('snyk-licenses:json');

export const command = 'json';
export const desc = 'Generate org licenses & dependencies data in JSON format';
export const builder = {
  orgPublicId: {
    required: true,
    default: undefined,
  },
  project: {
    default: [],
    desc:
      'Project ID to filter the results by. E.g. --project=uuid --project=uuid2',
  },
};
export const aliases = ['j'];

export async function handler(argv: {
  orgPublicId: string;
  view: SupportedViews;
  project?: string | string[];
}) {
  try {
    const { orgPublicId, view, project } = argv;
    debug(
      'ℹ️  Options: ' +
        JSON.stringify({ orgPublicId, view, project: _.castArray(project) }),
    );
    getApiToken();
    const options = {
      filters: {
        projects: _.castArray(project),
      },
    };
    const data = await generateLicenseData(orgPublicId, options);
    console.log(JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }
}
