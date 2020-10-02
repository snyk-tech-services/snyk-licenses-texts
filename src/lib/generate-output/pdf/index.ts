import * as puppeteer from 'puppeteer';
import * as debugLib from 'debug';

const debug = debugLib('snyk-licenses:generatePdfReport');

export async function savePdfReport(
  fileName: string,
  data: string,
): Promise<void> {
  if (!data) {
    throw new Error('No report data to save!');
  }
  debug(`⏳ Saving PDF to ${fileName}`);
  // start browser in headless mode
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // We set the page content as the generated html by handlebars
  await page.setContent(data);
  await page.pdf({ path: fileName, format: 'A4' });
  await browser.close();
  debug(`✅ Saved PDF report to ${fileName}`);
}
