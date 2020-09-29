![Snyk logo](https://snyk.io/style/asset/logo/snyk-print.svg)

***

[![Known Vulnerabilities](https://snyk.io/test/github/snyk-tech-services/snyk-licenses-texts/badge.svg)](https://snyk.io/test/github/snyk-tech-services/snyk-licenses-texts)

Snyk helps you find, fix and monitor for known vulnerabilities in your dependencies, both on an ad hoc basis and as part of your CI (Build) system.

## Snyk snyk-licenses-texts
Snyk Licenses Report that provides Organization level licenses used, copyrights & dependencies data (including license texts & their urls).

## Usage
Ensure `SNYK_TOKEN` is set and has access to the Organization you want to generate the report for.

### Basic CLI commands
- `help` - show help & all available commands and their options
- `json` - generate the raw JSON licenses & dependencies data
- `generate` - generates an HTML report of licenses & dependencies data

Example usage:
`snyk-licenses-report help`
`snyk-licenses-report json --orgPublicId=<ORG_PUBLIC_ID>`
`snyk-licenses-report generate --orgPublicId=<ORG_PUBLIC_ID>`


## Development setup
- `npm i`
- `npm run test`
- `DEBUG=snyk-license* node dist/index.js generate --orgPublicId=<ORG_PUBLIC_ID>`
