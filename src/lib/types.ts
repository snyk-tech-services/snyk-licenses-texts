export interface Dependency {
  id: string; // example: pako@1.0.11
  name: string;
  version: string;
  packageManager: string;
}
//TODO: finish the type
export interface EnrichedDependency extends Dependency {}

export interface LicenseReportDataEntry {
  // TODO: what if it is a dual license?
  /**
   * The text of the license in HTML format
   */
  licenseText: string;
  /**
   * The url of the license
   */
  licenseUrl: string;

  /**
   * License ID
   */
  id: string;
  /**
   * Snyk license severity setup on the org license policy
   */
  severity?: 'none' | 'high' | 'medium' | 'low';
  /**
   * Snyk license instruction setup on the org license policy
   */
  instructions?: string;
  /**
   * Dependencies from this org using this license
   */
  dependencies: DependencyData[];
  /**
   * Snyk projects from this org with dependencies using this license
   */
  projects: {
    id: string;
    name: string;
  }[];
}

export interface DependencyData {
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
