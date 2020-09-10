import 'source-map-support/register';
import * as debugLib from 'debug';
import * as snykApiSdk from 'snyk-api-ts-client';
import { getApiToken } from '../../get-api-token';
import { SortBy, Order } from './types';

const debug = debugLib('snyk-licenses:getDependenciesDataForOrg');

interface GetDependenciesDataOptions {
  sortBy: SortBy;
  order: Order;
  filters?: snykApiSdk.OrgTypes.DependenciesPostBodyType;
}

export async function getDependenciesDataForOrg(
  orgPublicId: string,
  options?: GetDependenciesDataOptions,
): Promise<snykApiSdk.OrgTypes.DependenciesPostResponseType> {
  getApiToken();
  const snykApiClient = await new snykApiSdk.Org({ orgId: orgPublicId });
  const sortBy = options?.sortBy;
  const order = options?.order;
  const body: snykApiSdk.OrgTypes.DependenciesPostBodyType = {
    ...options?.filters,
  };
  try {
    const dependenciesData = await getAllDependenciesData(
      snykApiClient,
      body,
      sortBy,
      order,
    );
    return dependenciesData;
  } catch (e) {
    debug('Failed to fetch dependencies' + e);
    throw e;
  }
}

async function getAllDependenciesData(
  snykApiClient,
  body,
  sortBy,
  order,
  page = 1,
): Promise<snykApiSdk.OrgTypes.DependenciesPostResponseType> {
  const perPage = 200;
  const dependenciesData = await snykApiClient.dependencies.post(
    body,
    sortBy,
    order,
    page,
    perPage,
  );
  const result = dependenciesData;
  if (result.results.length && result.results.length * page < result.total) {
    const nextPage = page + 1;
    const data = await getAllDependenciesData(
      snykApiClient,
      body,
      sortBy,
      order,
      nextPage,
    );
    result.results = [...result.results, ...data.results];
  }

  return result;
}
