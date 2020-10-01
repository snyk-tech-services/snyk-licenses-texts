import 'source-map-support/register';
import * as debugLib from 'debug';
import * as snykApiSdk from 'snyk-api-ts-client';
import { getApiToken } from './get-api-token';
import { string } from 'yargs';
import _ = require('lodash');

const debug = debugLib('snyk-licenses:getLicenseDataForOrg');

export interface OrgData {
  name: string;
  id: string;
  slug: string;
  url: string;
  group: {
    name: string;
    id: string;
  };
}

export async function getOrgData(orgPublicId: string): Promise<OrgData> {
  getApiToken();

  try {
    const snykApiClient = await new snykApiSdk.Orgs();
    const allOrgs: OrgData[] = _.get(await snykApiClient.get(), 'orgs', []);
    const orgData = allOrgs.filter(org => org.id === orgPublicId)[0];
    return orgData;
  } catch (e) {
    debug('❌ Failed to get org data for org ID:' + orgPublicId);
    throw e;
  }
}
