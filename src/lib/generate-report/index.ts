import * as Handlebars from 'handlebars';
import * as path from 'path';
import * as fs from 'fs';
import * as debugLib from 'debug';
import * as _ from 'lodash';

import { LicenseReportData } from '../generate-org-license-report';
import { OrgData } from '../get-org-data';
import { SupportedViews, LicenseReportDataEntry } from '../types';

const debug = debugLib('snyk-licenses:generateHtmlReport');
const DEFAULT_TEMPLATE = './templates/licenses-view.hbs';

const transformDataFunc = {
  [SupportedViews.ORG_LICENSES]: transformDataForLicenseView,
  [SupportedViews.PROJECT_DEPENDENCIES]: transformDataForDependencyView,
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
  debug(`ℹ️ Compiling Handlebars.js template ${hbsTemplate}`);
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

interface ProjectsReportData {
  [projectId: string]: {
    projectName: string;
    projectIndex: number;
    projectId: string;
    licenses: {
      [licenseId: string]: LicenseReportDataEntry;
    };
  };
}

function transformDataForDependencyView(
  orgPublicId: string,
  data: LicenseReportData,
  orgData: OrgData,
): {
  projects: ProjectsReportData;
  orgPublicId: string;
  orgData: OrgData;
  totalProjects: number;
} {
  const projectData: ProjectsReportData = {};
  let totalProjects = 0;

  for (const licenseId of Object.keys(data)) {
    const licenseData = data[licenseId];

    for (const project of licenseData.projects) {
      if (!projectData[project.id]) {
        totalProjects += 1;
        projectData[project.id] = {
          projectIndex: totalProjects,
          projectId: project.id,
          projectName: project.name,
          licenses: {
            [licenseId]: licenseData,
          },
        };
      } else {
        projectData[project.id].licenses[licenseId] = licenseData;
      }
    }
  }

  return {
    projects: projectData,
    orgPublicId,
    orgData,
    totalProjects,
  };
}

function selectTemplate(view: SupportedViews, templateOverride?): string {
  switch (view) {
    case SupportedViews.ORG_LICENSES:
      return templateOverride || DEFAULT_TEMPLATE;
    case SupportedViews.PROJECT_DEPENDENCIES:
      return templateOverride || './templates/project-dependencies-view.hbs';
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
