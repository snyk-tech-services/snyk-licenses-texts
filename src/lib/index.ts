import * as debugLib from 'debug';
import * as _ from 'lodash';
import * as snykApiSdk from 'snyk-api-ts-client';

export * from './license-text';
export * from './get-api-token';
import { getLicenseDataForOrg, getDependenciesDataForOrg } from './api/org';
import { fetchSpdxLicenseText, fetchNonSpdxLicenseText } from './license-text';

const debug = debugLib('generateOrgLicensesReport');
interface LicenseReportDataEntry {
  // TODO: what if it is a dual license?
  licenseText: string; // HTML of the license
  licenseUrl: string;
  legalInstructions?: string;
  id: string;
  severity?: 'none' | 'high' | 'medium' | 'low';
  instructions?: string;
  dependencies: DependencyData[];
  projects: {
    id: string;
    name: string;
  }[];
}

interface DependencyData {
  /**
   * The identifier of the package
   */
  id: string;
  /**
   * The name of the package
   */
  name: string;
  /**
   * The version of the package
   */
  version: string;
  /**
   * The latest version available for the specified package
   */
  latestVersion?: string;
  /**
   * The timestamp for when the latest version of the specified package was published.
   */
  latestVersionPublishedDate?: string;
  /**
   * The timestamp for when the specified package was first published.
   */
  firstPublishedDate?: string;
  /**
   * True if the latest version of the package is marked as deprecated; False otherwise.
   */
  isDeprecated?: boolean;
  /**
   * The numbers for those versions that are marked as deprecated
   */
  deprecatedVersions?: string[];
  /**
   * The identifiers of dependencies with issues that are depended upon as a result of this dependency
   */
  dependenciesWithIssues?: string[];
  /**
   * The package type of the dependency
   */
  type: string;
  /**
   * The number of high severity issues in this dependency
   */
  issuesHigh?: number;
  /**
   * The number of medium severity issues in this dependency
   */
  issuesMedium?: number;
  /**
   * The number of low severity issues in this dependency
   */
  issuesLow?: number;
  /**
   * The licenses of the dependency
   */
  licenses: {
    /**
     * The identifier of the license
     */
    id: string;
    /**
     * The title of the license
     */
    title: string;
    /**
     * The type of the license
     */
    license: string;
  }[];
  /**
   * The projects which depend on the dependency
   */
  projects: {
    /**
     * The identifier of the project
     */
    id: string;
    /**
     * The name of the project
     */
    name: string;
  }[];
  /**
   * The copyright notices for the package
   */
  copyright?: string[];
}
[];
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

    for (const license of licenseData.results) {
      const dependencies = license.dependencies;
      const dependenciesEnriched = enrichDependencies(
        dependencies,
        dependenciesData,
      );
      license.dependencies = dependenciesEnriched;
      const { licenseText, licenseUrl } = await enrichLicenseWithTextAndUrl(
        license.id,
      );
      licenseReportData[license.id] = {
        ...(license as any),
        licenseText,
        licenseUrl,
      };
    }
    console.log(licenseReportData);
    return licenseReportData;
  } catch (e) {
    debug('Failed to generate report data', e);
    throw e;
  }
}

interface Dependency {
  id: string; //pako@1.0.11',
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
      enrichDependencies.push(dep[0]);
    } else {
      debug('Dep information not found for ' + dependency.id);
    }
  }

  return enrichDependencies;
}

async function enrichLicenseWithTextAndUrl(
  id: string,
): Promise<{ licenseText: string; licenseUrl: string }> {
  const spdxLicenseText = await fetchSpdxLicenseText(id);
  let licenseUrl;
  if (spdxLicenseText) {
    licenseUrl = 'TODO';
    return { licenseText: spdxLicenseText, licenseUrl };
  }
  const nonSpdxLicenseText = await fetchNonSpdxLicenseText(id);
  return { licenseText: nonSpdxLicenseText, licenseUrl: 'TODO' };
}
