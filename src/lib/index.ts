import * as debugLib from 'debug';
import * as _ from 'lodash';

export * from './license-text';
export * from './get-api-token';
import { getLicenseDataForOrg, getDependenciesDataForOrg } from './api/org';
import { fetchSpdxLicenseTextAndUrl, fetchNonSpdxLicenseTextAndUrl } from './license-text';
import { LicenseReportDataEntry } from './types';

const debug = debugLib('generateOrgLicensesReport');

interface LicenseReportData {
  [licenseID: string]: LicenseReportDataEntry;
}

export async function generateOrgLicensesReport(
  orgPublicId: string,
  options,
): Promise<string> {
  try {
    const licenseData: LicenseReportData = await generateLicenseData(
      orgPublicId,
      options,
    );
    const report = licenseData;
    return report as any;
  } catch (e) {
    debug('Failed to generate report data', e);
    throw e;
  }
}

export async function generateLicenseData(
  orgPublicId: string,
  options,
): Promise<LicenseReportData> {
  try {
    const licenseData = await getLicenseDataForOrg(orgPublicId, options);
    const dependenciesDataRaw = await getDependenciesDataForOrg(
      orgPublicId,
      options,
    );
    const licenseReportData: LicenseReportData = {};
    const dependenciesData = _.groupBy(dependenciesDataRaw.results, 'id');
    // TODO: what if 0?
    debug(`Processing ${licenseData.total} licenses`);

    const dependenciesAll = [];
    for (const license of licenseData.results) {
      const dependencies = license.dependencies;
      if(!dependencies.length) {
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
      const licenseData = await getLicenseTextAndUrl(
        license.id,
      );
      licenseReportData[license.id] = {
        ...(license as any),
        licenseText: licenseData?.licenseText,
        licenseUrl: licenseData?.licenseUrl,
      };
    }
    return licenseReportData;
  } catch (e) {
    debug('Failed to generate report data', e);
    throw e;
  }
}

interface Dependency {
  id: string; // example: pako@1.0.11
  name: string;
  version: string;
  packageManager: string;
}
interface EnrichedDependency extends Dependency {}

function enrichDependencies(
  dependencies: Dependency[],
  dependenciesData,
): EnrichedDependency[] {
  const enrichDependencies = [];
  for (const dependency of dependencies) {
    const dep = dependenciesData[dependency.id];
    if (dep && dep[0]) {
      enrichDependencies.push({
        ...dependency,
        ...dep[0],
      });
    } else {
      debug('Dep information not found for ' + dependency.id);
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
    debug('Failed to get license data as SPDX, trying non-SPDX');
  }
  try {
    return await fetchNonSpdxLicenseTextAndUrl(id);
  } catch (e) {
    debug('Failed to get license data as non-SPDX');
  }

  return undefined;
}
