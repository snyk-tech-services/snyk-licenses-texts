import * as debugLib from 'debug';
import * as _ from 'lodash';
import * as snykApiSdk from 'snyk-api-ts-client';

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
    if (!licenseData.total) {
      debug(`ℹ️  Detected 0 licenses`);
      throw new Error(
        'No licenses returned from /licenses Snyk API. Please make sure the org has licenses configured and try again.',
      );
    }
    debug(`✅ Got license API data for Org:${orgPublicId}`);
    const dependenciesDataRaw = await getDependenciesDataForOrg(
      orgPublicId,
      options,
    );
    if (!dependenciesDataRaw.total || dependenciesDataRaw.total === 0) {
      debug(`ℹ️  API returned 0 dependencies`);
    } else {
      debug(
        `✅ Got ${dependenciesDataRaw.total} dependencies API data for Org: ${orgPublicId}`,
      );
    }
    let licenseReportData: LicenseReportData = {};
    const dependenciesData = _.groupBy(dependenciesDataRaw.results, 'id');

    if (!licenseData.total || licenseData.total === 0) {
      debug(`ℹ️  API returned 0 licenses`);
      return licenseReportData;
    }
    debug(`⏳ Processing ${licenseData.total} licenses`);
    licenseReportData = await mergeLicenceAndDepData(
      licenseData,
      dependenciesData,
    );
    debug(`✅ Done processing ${licenseData.total} licenses`);

    return licenseReportData;
  } catch (e) {
    debug('❌ Failed to generate report data', e);
    throw e;
  }
}

export function enrichDependencies(
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
      enrichDependencies.push({
        ...dependency,
      });
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

export async function mergeLicenceAndDepData(
  licenseData: snykApiSdk.OrgTypes.LicensesPostResponseType,
  dependenciesData,
): Promise<LicenseReportData> {
  const licenseReportData: LicenseReportData = {};

  const flatLicenses = separateMultiLicenses(licenseData.results);

  for (const license of flatLicenses) {
    const dependencies = license.dependencies;
    if (!dependencies.length) {
      continue;
    }
    const dependenciesEnriched = enrichDependencies(
      dependencies,
      dependenciesData,
    );
    if (dependenciesEnriched.length) {
      license.dependencies = dependenciesEnriched;
    }
    const licenseData = await getLicenseTextAndUrl(license.id);
    if (licenseReportData[license.id]) {
      licenseReportData[license.id].dependencies = [
        ...licenseReportData[license.id].dependencies,
        ...(license as any).dependencies,
      ];
      licenseReportData[license.id].severities.push(license.severity);
    } else {
      licenseReportData[license.id] = {
        ...(license as any),
        licenseText: licenseData?.licenseText,
        licenseUrl: licenseData?.licenseUrl,
        severities: [license.severity],
      };
    }
  }
  return licenseReportData;
}

function splitMultipleLicenses(license: string) {
  return license.split(/ OR | AND /);
}

function multipleLicenses(license: string) {
  return license.includes('OR') || license.includes('AND');
}

function separateMultiLicenses(licenseData: any[]): any[] {
  const processesLicenses = [];
  for (const license of licenseData) {
    if (multipleLicenses(license.id)) {
      const licenses = splitMultipleLicenses(license.id);
      debug('Splitting up a multi license', licenses);

      licenses.forEach((l) => {
        processesLicenses.push({
          ...license,
          id: l,
        });
      });
    } else {
      processesLicenses.push(license);
    }
  }

  return processesLicenses;
}
