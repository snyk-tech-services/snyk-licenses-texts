import 'source-map-support/register';
import * as debugLib from 'debug';
import * as snykApiSdk from 'snyk-api-ts-client';
import { getApiToken } from '../../get-api-token';
import { requestsManager } from 'snyk-request-manager';
import { GetLicenseDataOptions } from '../../types';
import { number } from 'yargs';

const debug = debugLib('snyk-licenses:getLicenseDataForOrg');

export async function getLicenseDataForOrg(
  orgPublicId: string,
  options?: GetLicenseDataOptions,
): Promise<snykApiSdk.OrgTypes.LicensesPostResponseType> {
  getApiToken();
  getApiToken();
  const requestManager = new requestsManager({
    userAgentPrefix: 'snyk-licenses-attribution',
  });
  const body: snykApiSdk.OrgTypes.LicensesPostBodyType = {
    filters: options?.filters,
  };
  try {
    const licenseData = await getAllLicensesData(
      requestManager,
      orgPublicId,
      body,
    );
    return licenseData;
  } catch (e) {
    debug('❌ Failed to fetch licenses' + e);
    throw e;
  }
}

async function getAllLicensesData(
  requestManager: requestsManager,
  orgPublicId: string,
  body: snykApiSdk.OrgTypes.LicensesPostBodyType,
  page = 1,
): Promise<snykApiSdk.OrgTypes.LicensesPostResponseType> {
  const dependenciesData = {
    results: [],
    total: undefined,
  };
  const perPage = 100;

  let currentPage = page;
  let hasMorePages = true;

  while (hasMorePages) {
    currentPage = currentPage + 1;
    debug(`Fetching licenses data for page ${currentPage}`);
    const { hasNextPage, results, total } = await getLicensesForPage(
      requestManager,
      orgPublicId,
      body,
      currentPage,
      perPage,
    );
    debug(
      `Received ${perPage} items, overall ${results.length *
        currentPage}/${total} received so far`,
    );
    dependenciesData.results.push(...results);
    dependenciesData.total = total;
    hasMorePages = hasNextPage;
  }

  return dependenciesData;
}

interface DependenciesResponse
  extends snykApiSdk.OrgTypes.DependenciesPostResponseType {
  hasNextPage: boolean;
}

async function getLicensesForPage(
  requestManager: requestsManager,
  orgPublicId: string,
  body: snykApiSdk.OrgTypes.LicensesPostBodyType,
  page: number,
  perPage: number,
): Promise<DependenciesResponse> {
  const res = await requestManager.request({
    verb: 'post',
    url: `/org/${orgPublicId}/licenses?sortBy=dependency&order=asc&page=${page}&perPage=${perPage}`,
    body: JSON.stringify(body),
  });
  const result = res.data;
  let hasNextPage = false;

  if (
    result?.results &&
    result?.results?.length > 0 &&
    result?.results?.length * page < result.total
  ) {
    hasNextPage = true;
  }

  return { ...result, hasNextPage };
}
