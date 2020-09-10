import 'source-map-support/register';
import * as fetch from 'node-fetch';
import * as debugLib from 'debug';
import * as cheerio from 'cheerio';

export async function fetchSpdxLicenseTextAndUrl(
  licenseId: string,
): Promise<{ licenseText: string; licenseUrl: string }> {
  const debug = debugLib('snyk-licenses:fetchSpdxLicenseText');
  const licenseUrl = `https://spdx.org/licenses/${licenseId}.html`;
  try {
    const res = await fetch(licenseUrl);
    const rawHtml = await res.text();
    if (res.status !== 200) {
      throw new Error(rawHtml);
    }
    const $ = cheerio.load(rawHtml);
    const licenseText = $('body').text();
    return { licenseText, licenseUrl };
  } catch (e) {
    debug(`Did not fetch license text successfully. Error: ${e}`);
    throw e;
  }
}
