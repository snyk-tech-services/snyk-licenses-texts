import * as Handlebars from 'handlebars';
import * as path from 'path';
import * as fs from 'fs';
import * as debugLib from 'debug';

import { LicenseReportData } from '../generate-org-license-report';
import { OrgData } from '../get-org-data';
import { generateReportName } from '../generate-report-name';
import { SupportedViews } from '../types';

const debug = debugLib('snyk-licenses:generateHtmlReport');
const DEFAULT_TEMPLATE = './templates/licenses-view.hbs';

const transformDataFunc = {
  [SupportedViews.ORG_LICENSES]: transformDataForLicenseView,
  // TODO: support later
  // [SupportedViews.PROJECT_DEPENDENCIES]: transformDataForDependencyView,
};

export async function generateHtmlReport(
  orgPublicId: string,
  data: LicenseReportData,
  orgData: OrgData,
  templateOverridePath: string | undefined = undefined,
  view: SupportedViews = SupportedViews.ORG_LICENSES,
): Promise<string> {
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
  const transformedData = transformDataFunc[view](orgPublicId, data, orgData);
  return htmlTemplate(transformedData);
}

function transformDataForLicenseView(
  orgPublicId: string,
  data: LicenseReportData,
  orgData: OrgData,
): {
  licenses: LicenseReportData;
  orgPublicId: string;
  orgData: OrgData;
} {
  return { licenses: data, orgPublicId, orgData };
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
