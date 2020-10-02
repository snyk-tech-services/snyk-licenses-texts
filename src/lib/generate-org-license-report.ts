import * as debugLib from 'debug';
import * as _ from 'lodash';

export * from './license-text';
export * from './get-api-token';
import { getLicenseDataForOrg, getDependenciesDataForOrg } from './api/org';
import {
  fetchSpdxLicenseTextAndUrl,
  fetchNonSpdxLicenseTextAndUrl,
} from './license-text';
import {
  LicenseReportDataEntry,
  EnrichedDependency,
  Dependency,
  DependencyData,
} from './types';

const debug = debugLib('snyk-licenses:generateOrgLicensesReport');

export interface LicenseReportData {
  [licenseID: string]: LicenseReportDataEntry;
}

export async function generateLicenseData(
  orgPublicId: string,
  options?: {
    filters?: {
      projects: string[];
    };
  },
): Promise<LicenseReportData> {
  debug(`ℹ️  Generating license data for Org:${orgPublicId}`);

  try {
    const licenseData = await getLicenseDataForOrg(orgPublicId, options);
    debug(`✅ Got license API data for Org:${orgPublicId}`);
    const dependenciesDataRaw = await getDependenciesDataForOrg(
      orgPublicId,
      options,
    );
    debug(`✅ Got dependencies API data for Org:${orgPublicId}`);
    const licenseReportData: LicenseReportData = {};
    const dependenciesData = _.groupBy(dependenciesDataRaw.results, 'id');

    if (!licenseData.total) {
      debug(`ℹ️ Detected 0 licenses`);
      return licenseReportData;
    }
    debug(`⏳ Processing ${licenseData.total} licenses`);

    const dependenciesAll = [];

    for (const license of licenseData.results) {
      const dependencies = license.dependencies;
      if (!dependencies.length) {
        continue;
      }
      dependenciesAll.push(...dependencies);
      const dependenciesEnriched = enrichDependencies(
        dependencies,
        dependenciesData,
      );
      if (dependenciesEnriched.length) {
        license.dependencies = dependenciesEnriched;
      }
      const licenseData = await getLicenseTextAndUrl(license.id);
      licenseReportData[license.id] = {
        ...(license as any),
        licenseText: licenseData?.licenseText,
        licenseUrl: licenseData?.licenseUrl,
      };
    }
    debug(`✅ Done processing ${licenseData.total} licenses`);

    return licenseReportData;
  } catch (e) {
    debug('❌ Failed to generate report data', e);
    throw e;
  }
}

function enrichDependencies(
  dependencies: Dependency[],
  dependenciesData,
): EnrichedDependency[] {
  const enrichDependencies: EnrichedDependency[] = [];

  for (const dependency of dependencies) {
    const dep: DependencyData[] = dependenciesData[dependency.id];
    if (dep && dep[0]) {
      enrichDependencies.push({
        ...dependency,
        ...dep[0],
      });
    } else {
      debug('Dep information not available from /dependencies API response for ' + dependency.id);
    }
  }

  return enrichDependencies;
}

async function getLicenseTextAndUrl(
  id: string,
): Promise<{ licenseText: string; licenseUrl: string } | undefined> {
  try {
    return await fetchSpdxLicenseTextAndUrl(id);
  } catch (e) {
    debug(`❌ Failed to get license data for as SPDX, trying non-SPDX: ${id}`);
  }
  try {
    return await fetchNonSpdxLicenseTextAndUrl(id);
  } catch (e) {
    debug(`❌ Failed to get license data as non-SPDX: ${id}`);
  }

  return undefined;
}
