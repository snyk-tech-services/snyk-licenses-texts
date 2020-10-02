import 'source-map-support/register';
import * as debugLib from 'debug';
import * as snykApiSdk from 'snyk-api-ts-client';
import { getApiToken } from '../../get-api-token';
import { GetLicenseDataOptions } from '../../types';

const debug = debugLib('snyk-licenses:getDependenciesDataForOrg');

export async function getDependenciesDataForOrg(
  orgPublicId: string,
  options?: GetLicenseDataOptions,
): Promise<snykApiSdk.OrgTypes.DependenciesPostResponseType> {
  getApiToken();
  const snykApiClient = await new snykApiSdk.Org({ orgId: orgPublicId });
  const body: snykApiSdk.OrgTypes.DependenciesPostBodyType = {
    filters: options?.filters,
  };
  try {
    const dependenciesData = await getAllDependenciesData(
      snykApiClient,
      body,
    );
    return dependenciesData;
  } catch (e) {
    debug('❌ Failed to fetch dependencies' + e);
    throw e;
  }
}

async function getAllDependenciesData(
  snykApiClient,
  body,
  page = 1,
): Promise<snykApiSdk.OrgTypes.DependenciesPostResponseType> {
  const perPage = 200;
  const dependenciesData = await snykApiClient.dependencies.post(
    body,
    page,
    perPage,
  );
  const result = dependenciesData;
  if (result.results.length && result.results.length * page < result.total) {
    const nextPage = page + 1;
    const data = await getAllDependenciesData(
      snykApiClient,
      body,
      nextPage,
    );
    result.results = [...result.results, ...data.results];
  }

  return result;
}
