import 'source-map-support/register';
import * as debugLib from 'debug';
import * as snykApiSdk from 'snyk-api-ts-client';
import { getApiToken } from '../../get-api-token';
import { requestsManager } from 'snyk-request-manager';
import { GetLicenseDataOptions } from '../../types';

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
    const licenseData = await getAllLicensesData(requestManager, body, orgPublicId);
    return licenseData;
  } catch (e) {
    debug('❌ Failed to fetch licenses' + e);
    throw e;
  }
}

async function getAllLicensesData(
  requestManager,
  orgPublicId,
  body,
  page = 0,
): Promise<snykApiSdk.OrgTypes.LicensesPostResponseType> {
  const dependenciesData = {
    results: [],
  };
  const perPage = 20; // this is a max on that endpoint

  let currentPage = page;
  let hasMorePages = true;

  while (hasMorePages) {
    currentPage = currentPage + 1;
    debug(`Fetching dependencies data for page ${currentPage}`);
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
    hasMorePages = hasNextPage;
  }

  return dependenciesData;
}

interface DependenciesResponse
  extends snykApiSdk.OrgTypes.DependenciesPostResponseType {
  hasNextPage: boolean;
}

async function getLicensesForPage(
  requestManager,
  orgPublicId,
  body,
  page,
  perPage,
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
