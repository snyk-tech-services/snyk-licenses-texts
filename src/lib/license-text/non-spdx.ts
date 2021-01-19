import 'source-map-support/register';
import * as debugLib from 'debug';
import * as fs from 'fs';
import * as path from 'path';

export async function fetchNonSpdxLicenseTextAndUrl(
  licenseId: string,
): Promise<{ licenseText: string; licenseUrl: string }> {
  const debug = debugLib('snyk-licenses:fetchNonSpdxLicenseText');
  const fileName = `licenses/${licenseId}.html`;
  try {
    const licenseText = await fs.readFileSync(
      path.resolve(__dirname, fileName),
      'utf-8',
    );
    const licenseUrl = nonSpdxLicenseUrls[licenseId];
    return { licenseText: `LICENSE TEXT\n${licenseText}`, licenseUrl };
  } catch (e) {
    debug(`Did not fetch license text successfully. Error: ${e}`);
    throw e;
  }
}

const nonSpdxLicenseUrls = {
  'EDL-1.0': 'https://www.eclipse.org/org/documents/edl-v10.html',
  HSQLDB: 'http://hsqldb.org/web/hsqlLicense.html',
  'PayPal-SDK': 'https://github.com/paypal/PayPal-Ruby-SDK/blob/master/LICENSE',
  'Microsoft-Lightswitch-Client-Javascript-Runtime':
    'https://go.microsoft.com/fwlink/?LinkID=286972',
  'Microsoft-EULA':
    'https://www.microsoft.com/web/webpi/eula/net_library_eula_ENU.htm',
  'Microsoft-.NET-Library':
    'https://dotnet.microsoft.com/en/dotnet_library_license.htm',

  Neodynamic: 'https://www.neodynamic.com/eula/',

  'bpmn.io': 'https://bpmn.io/license/',

  'Froala-Editor': 'https://froala.com/wysiwyg-editor/terms/',

  'Image-Components-SDK':
    'https://www.imagecomponents.net/Resources/ICComponentsLicense.txt',

  'AppOptics-Java-Agent':
    'https://docs.appoptics.com/kb/apm_tracing/java/license/',

  'Aspose-EULA': 'https://company.aspose.com/legal/eula',

  'ASPSecurityKit-Khosla-Tech': 'http://aspsecuritykit.net/end-user-agreement',

  'Chilkat-Software': 'https://www.chilkatsoft.com/license.asp',

  'H2-Database-1.0': 'http://h2database.com/html/license.html',

  'amCharts-Free':
    'https://github.com/amcharts/amcharts4/blob/master/dist/script/LICENSE',

  Highsoft: 'https://www.highcharts.com/license',

  'Oracle-Technology-Network':
    'https://www.oracle.com/downloads/licenses/distribution-license.html',

  Protobuf: 'https://github.com/protocolbuffers/protobuf/blob/master/LICENSE',

  'SpecFlow-EULA': 'https://specflow.org/plus/eula/',
};
