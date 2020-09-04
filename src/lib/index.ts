import 'source-map-support/register';
import * as fetch from 'node-fetch';
import * as debugLib from 'debug';
import * as cheerio from 'cheerio';

export async function fetchSpdxLicenseText(licenseId: string): Promise<string> {
  const debug = debugLib('fetchSpdxLicenseText')
  const licenseUrl = `https://spdx.org/licenses/${licenseId}.html`;
  try {
    const res = await fetch(`https://spdx.org/licenses/${licenseId}.html`);
    const rawHtml = await res.text();
    if (res.status !== 200) {
      throw new Error(rawHtml);
    }
    const $ = cheerio.load(rawHtml);
    const licenseText = $('body').text();
    return licenseText;
  } catch (e) {
    debug(`Did not fetch license text successfully. Error: ${e}`);
  }
  return `Did not fetch license text successfully. See the license text at: ${licenseUrl}`;
}
