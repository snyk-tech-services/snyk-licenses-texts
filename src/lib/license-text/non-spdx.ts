import 'source-map-support/register';
import * as fetch from 'node-fetch';
import * as debugLib from 'debug';
import * as fs from 'fs';
import * as path from 'path';

import { generateErrorLicenseText } from './error-license-text';

export async function fetchNonSpdxLicenseText(
  licenseId: string,
): Promise<string> {
  const debug = debugLib('fetchNonSpdxLicenseText');
  const licenseUrl = `licenses/${licenseId}.html`;
  try {
    const licenseText = await fs.readFileSync(
      path.resolve(__dirname, licenseUrl),
      'utf-8',
    );
    return licenseText;
  } catch (e) {
    debug(`Did not fetch license text successfully. Error: ${e}`);
  }
  return generateErrorLicenseText();
}
