import 'source-map-support/register';
import * as debugLib from 'debug';
import * as snykApiSdk from 'snyk-api-ts-client';
import { getApiToken } from '../../get-api-token';
import { GetLicenseDataOptions } from '../../types';
import { requestsManager } from 'snyk-request-manager';

const debug = debugLib('snyk-licenses:getDependenciesDataForOrg');

export async function getDependenciesDataForOrg(
  orgPublicId: string,
  options?: GetLicenseDataOptions,
): Promise<snykApiSdk.OrgTypes.DependenciesPostResponseType> {
  getApiToken();
  const requestManager = new requestsManager({
    userAgentPrefix: 'snyk-licenses-attribution',
  });
  const body: snykApiSdk.OrgTypes.DependenciesPostBodyType = {
    filters: options?.filters,
  };
  try {
    const dependenciesData = await getAllDependenciesData(
      requestManager,
      orgPublicId,
      body,
    );
    return dependenciesData;
  } catch (e) {
    debug('❌ Failed to fetch dependencies' + e);
    throw e;
  }
}

async function getAllDependenciesData(
  requestManager,
  orgPublicId,
  body,
  page = 1,
): Promise<snykApiSdk.OrgTypes.DependenciesPostResponseType> {
  const dependenciesData = {
    results: [],
    total: undefined,
  };
  const perPage = 20; // this is a max on that endpoint

  let currentPage = page;
  let hasMorePages = true;

  while (hasMorePages) {
    currentPage = currentPage + 1;
    debug(`Fetching dependencies data for page ${currentPage}`);
    const { hasNextPage, results, total } = await getDependenciesForPage(
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

async function getDependenciesForPage(
  requestManager,
  orgPublicId,
  body,
  page,
  perPage,
): Promise<DependenciesResponse> {
  const res = await requestManager.request({
    verb: 'post',
    url: `/org/${orgPublicId}/dependencies?sortBy=dependency&order=asc&page=${page}&perPage=${perPage}`,
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
