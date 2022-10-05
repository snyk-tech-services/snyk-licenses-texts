![Snyk logo](https://snyk.io/style/asset/logo/snyk-print.svg)

***

[![Known Vulnerabilities](https://snyk.io/test/github/snyk-tech-services/snyk-licenses-texts/badge.svg)](https://snyk.io/test/github/snyk-tech-services/snyk-licenses-texts)
[![Inactively Maintained](https://img.shields.io/badge/Maintenance%20Level-Inactively%20Maintained-yellowgreen.svg)](https://gist.github.com/cheerfulstoic/d107229326a01ff0f333a1d3476e068d)


**This repository is in maintenance mode, no new features are being developed. Bug & security fixes will continue to be delivered. Open source contributions are welcome for small features & fixes (no breaking changes)**

Snyk helps you find, fix and monitor for known vulnerabilities in your dependencies, both on an ad hoc basis and as part of your CI (Build) system.

## Snyk snyk-licenses-texts
Snyk Licenses Text report that provides Organization level licenses used, copyrights & dependencies data (including license texts & their urls). Optionally the results can be filtered for a specific projects.

The tool is a wrapper around [Snyk APIs](https://snyk.docs.apiary.io/) so users must have API access (including Reporting, Licenses & Dependencies APIs)

# Installation
Download the latest binary from the [releases](https://github.com/snyk-tech-services/snyk-licenses-texts/releases) page
## Usage
Ensure `SNYK_TOKEN` is set and has access to the Organization you want to generate the report for.

### Basic CLI commands
- `help` - show help & all available commands and their options
- `json` - generate the raw JSON licenses & dependencies data for a Snyk Organization (can filter for a specific Snyk project)
- `generate` - generates an HTML report of licenses & dependencies data for a Snyk Organization (can filter for a specific Snyk project)

### Supported Options
```
Commands:
  snyk-licenses-text generate  Generate org licenses & dependencies report in HTML format
                                                                    [aliases: g]
  snyk-licenses-text json      Generate org licenses & dependencies data in JSON format
                                                                    [aliases: j]

```
Example usage:
- See help: `snyk-licenses-text --help`
- See help and available options for a specific command: `snyk-licenses-text --help generate`
- Get JSON output only:  `snyk-licenses-text json --orgPublicId=<ORG_PUBLIC_ID>`
- Default HTML report (Licenses per Org view):  `snyk-licenses-text generate --orgPublicId=<ORG_PUBLIC_ID>`
- Default HTML report (Licenses per Org view) filtered for a specific project:  `snyk-licenses-text generate --orgPublicId=<ORG_PUBLIC_ID> --project=<PROJECT_PUBLIC_ID>`
- See more information on what is happening behind the scenes: `DEBUG=snyk-license* snyk-licenses-text generate --orgPublicId=<ORG_PUBLIC_ID>`
- Custom Handlebars.js template provided:
  `snyk-licenses-text generate --orgPublicId=<ORG_PUBLIC_ID> --template="PATH/TO/TEMPLATE/template.hsb"`
  The data in the template is available is in the format:
  ```
  {
    licenses: LicenseReportData;
    orgPublicId: string;
    orgData: OrgData;
  }
  ```
  See the relevant TypeScript types in the repo for full information.

## Development setup
- `npm i`
- `npm run test` (requires `TEST_ORG_ID` & `SNYK_TEST_TOKEN` from 1 password)
- `DEBUG=snyk-license* node dist/index.js generate --orgPublicId=<ORG_PUBLIC_ID>`
