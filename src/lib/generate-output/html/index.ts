import * as Handlebars from 'handlebars';
import * as path from 'path';
import * as fs from 'fs';
import * as debugLib from 'debug';

import { LicenseReportData } from '../../generate-org-license-report';

const debug = debugLib('snyk-licenses:generateHtmlReport');

export const enum SupportedViews {
  ORG_LICENSES = 'org-licenses',
  // TODO: support later
  // PROJECT_DEPENDENCIES = 'project-dependencies',
}

export async function generateHtmlReport(
  data: LicenseReportData,
  templateOverridePath: string,
  view: SupportedViews,
) {
  // TODO: add any helpers & data transformations that are useful here

  const hbsTemplate = selectTemplate(view, templateOverridePath);
  await registerPeerPartial(hbsTemplate, 'inline-css');
  const htmlTemplate = await compileTemplate(hbsTemplate);
  return htmlTemplate({hello: 1});
}

function selectTemplate(view, templateOverride): string {
  const DEFAULT_TEMPLATE = './templates/licenses-view.hbs';
  switch (view) {
    case SupportedViews.ORG_LICENSES:
      return templateOverride || DEFAULT_TEMPLATE;
    // TODO: support later
    // case SupportedViews.PROJECT_DEPENDENCIES:
    //   return  templateOverride || '../templates/project-dependencies-view.hbs';
    default:
      return DEFAULT_TEMPLATE;
  }
}

async function registerPeerPartial(
  templatePath: string,
  name: string,
): Promise<void> {
  const file = path.join(__dirname, templatePath);
  const template = await compileTemplate(file);
  Handlebars.registerPartial(name, template);
}

async function compileTemplate(
  fileName: string,
): Promise<HandlebarsTemplateDelegate> {
  return readFile(path.resolve(__dirname, fileName), 'utf8').then(Handlebars.compile);
}

function readFile(filePath: string, encoding: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}
