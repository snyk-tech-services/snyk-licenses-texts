import * as Handlebars from 'handlebars';
import * as pathLib from 'path';
import * as fs from 'fs';
import * as debugLib from 'debug';
import { writeContentsToFile } from '../../write-contents-to-file';

const debug = debugLib('snyk-licenses:saveHtmlReport');

export async function saveHtmlReport(
  fileName: string,
  data: string,
): Promise<{ fileName: string }> {
  if (!data) {
    throw new Error('No report data to save!');
  }
  const outputFile = pathLib.resolve(process.cwd(), fileName);
  debug(`⏳  Saving generated report to ${outputFile}`);
  writeContentsToFile(data, outputFile);
  debug(`✅ Saved HTML report to ${outputFile}`);
  return { fileName: outputFile };
}
