import 'source-map-support/register';
import * as debugLib from 'debug';
import * as snykApiSdk from 'snyk-api-ts-client';
import { getApiToken } from '../../get-api-token';
import { SortBy, Order } from './types';

const debug = debugLib('snyk-licenses:getLicenseDataForOrg');

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
    const licenseData = await getAllLicensesData(snykApiClient, body, sortBy, order);
    return licenseData;
  } catch (e) {
    debug('Failed to fetch licenses' + e);
    throw e;
  }
}

async function getAllLicensesData(
  snykApiClient,
  body,
  sortBy,
  order,
  page = 1,
): Promise<snykApiSdk.OrgTypes.LicensesPostResponseType> {
  const perPage = 200;
  const licensesData = await snykApiClient.licenses.post(
    body,
    sortBy,
    order,
    page,
    perPage,
  );
  const result = licensesData;
  if (result.results.length && result.results.length * page < result.total) {
    const nextPage = page + 1;
    const data = await getAllLicensesData(
      snykApiClient,
      body,
      sortBy,
      order,
      nextPage,
    );
    result.results.push(data.results);
  }

  return result;
}
