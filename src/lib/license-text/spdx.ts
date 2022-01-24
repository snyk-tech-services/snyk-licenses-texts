import 'source-map-support/register';
import * as nodeFetch from 'node-fetch';
import * as debugLib from 'debug';
import * as cheerio from 'cheerio';

const fetch = nodeFetch.default;

export async function fetchSpdxLicenseTextAndUrl(
  licenseId: string,
): Promise<{ licenseText: string; licenseUrl: string }> {
  if (licenseId === 'Public-Domain') {
    // The SPDX name for Public Domain license is Unlicense.
    licenseId = 'Unlicense';
  }
  const debug = debugLib('snyk-licenses:fetchSpdxLicenseText');
  const licenseUrl = `https://spdx.org/licenses/${licenseId}.html`;
  try {
    const res = await fetch(licenseUrl);
    const rawHtml = await res.text();
    if (res.status !== 200) {
      throw new Error(rawHtml);
    }
    const $ = cheerio.load(rawHtml);
    const licenseText = $('[property="spdx:licenseText"]')
      .text()
      .replace(/\n\s*\n/g, '\n');
    const licenseTextHeader = $('[property="spdx:standardLicenseHeader"]')
      .text()
      .replace(/\n\s*\n/g, '\n');
    return {
      licenseText: `LICENSE TEXT\n${licenseText}${
        licenseTextHeader
          ? `\nSTANDARD LICENSE HEADER\n ${licenseTextHeader}`
          : undefined
      }`,
      licenseUrl,
    };
  } catch (e) {
    debug(`Did not fetch license text successfully. Error: ${e}`);
    throw e;
  }
}
