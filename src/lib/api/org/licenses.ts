import 'source-map-support/register';
import * as debugLib from 'debug';
import * as snykApiSdk from 'snyk-api-ts-client';
import { getApiToken } from '../../get-api-token';
import { GetLicenseDataOptions } from '../../types';

const debug = debugLib('snyk-licenses:getLicenseDataForOrg');

export async function getLicenseDataForOrg(
  orgPublicId: string,
  options?: GetLicenseDataOptions,
): Promise<snykApiSdk.OrgTypes.LicensesPostResponseType> {
  getApiToken();
  const snykApiClient = await new snykApiSdk.Org({ orgId: orgPublicId });
  const body: snykApiSdk.OrgTypes.LicensesPostBodyType = {
    filters: options?.filters,
  };
  try {
    const licenseData = await getAllLicensesData(snykApiClient, body);
    return licenseData;
  } catch (e) {
    debug('❌ Failed to fetch licenses' + e);
    throw e;
  }
}

async function getAllLicensesData(
  snykApiClient,
  body,
  page = 1,
): Promise<snykApiSdk.OrgTypes.LicensesPostResponseType> {
  const perPage = 200;
  const licensesData = await snykApiClient.licenses.post(
    body,
    page,
    perPage,
  );
  const result = licensesData;
  if (result.results.length && result.results.length * page < result.total) {
    const nextPage = page + 1;
    const data = await getAllLicensesData(
      snykApiClient,
      body,
      nextPage,
    );
    result.results.push(data.results);
  }

  return result;
}
