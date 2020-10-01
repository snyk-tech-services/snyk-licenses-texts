import * as Handlebars from 'handlebars';
import * as path from 'path';
import * as fs from 'fs';
import * as debugLib from 'debug';

import { LicenseReportData } from '../../generate-org-license-report';

const debug = debugLib('snyk-licenses:generateHtmlReport');
const DEFAULT_TEMPLATE = './templates/licenses-view.hbs';

export const enum SupportedViews {
  ORG_LICENSES = 'org-licenses',
  // TODO: support later
  // PROJECT_DEPENDENCIES = 'project-dependencies',
}

const transformDataFunc = {
  [SupportedViews.ORG_LICENSES]: transformDataForLicenseView,
  // TODO: support later
  // [SupportedViews.PROJECT_DEPENDENCIES]: transformDataForDependencyView,
};

export async function generateHtmlReport(
  orgPublicId: string,
  data: LicenseReportData,
  templateOverridePath: string | undefined = undefined,
  view: SupportedViews = SupportedViews.ORG_LICENSES,
) {
  // TODO: add any helpers & data transformations that are useful here
  debug('ℹ️  Generating HTML report');
  const hbsTemplate = selectTemplate(view, templateOverridePath);
  debug(
    `✅ Using template ${
      hbsTemplate === DEFAULT_TEMPLATE ? 'default template' : hbsTemplate
    }`,
  );
  debug(`✅ Registered Handlebars.js partials`);
  const htmlTemplate = await compileTemplate(hbsTemplate);
  debug(`✅ Compiled template ${hbsTemplate}`);

  const transformedData = transformDataFunc[view](orgPublicId, data);

  return htmlTemplate(transformedData);
}

function transformDataForLicenseView(
  orgPublicId: string,
  data: LicenseReportData,
): {
  licenses: LicenseReportData;
  orgPublicId: string;
} {
  return { licenses: data, orgPublicId };
}

// TODO: support later
// function transformDataForDependencyView(data: LicenseReportData) {
//   return data;
// }

function selectTemplate(view: SupportedViews, templateOverride?): string {
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
  debug(`ℹ️  Registering peer partial template ${file}`);

  const template = await compileTemplate(file);
  debug(`✅ Compiled template ${file}`);

  Handlebars.registerPartial(name, template);
}

async function compileTemplate(
  fileName: string,
): Promise<HandlebarsTemplateDelegate> {
  return readFile(path.resolve(__dirname, fileName), 'utf8').then(
    Handlebars.compile,
  );
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
