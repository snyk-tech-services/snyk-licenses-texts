import 'source-map-support/register';
import * as debugLib from 'debug';
import * as snykApiSdk from 'snyk-api-ts-client';
import { getApiToken } from '../../get-api-token';
import { SortBy, Order } from './types';

const debug = debugLib('getLicenseDataForOrg');

interface GetLicenseDataOptions {
  sortBy: SortBy;
  order: Order;
  filters?: snykApiSdk.OrgTypes.LicensesPostBodyType;
}

export async function getLicenseDataForOrg(
  orgPublicId: string,
  options?: GetLicenseDataOptions,
): Promise<snykApiSdk.OrgTypes.LicensesPostResponseType> {
  getApiToken();
  const snykApiClient = await new snykApiSdk.Org({ orgId: orgPublicId });
  const sortBy = options?.sortBy;
  const order = options?.order;
  const body: snykApiSdk.OrgTypes.LicensesPostBodyType = {
    ...options?.filters,
  };
  try {
    const licenseData = await snykApiClient.licenses.post(body, sortBy, order);
    return licenseData;
  } catch (e) {
    debug('Failed to fetch licenses' + e);
    throw e;
  }
}
