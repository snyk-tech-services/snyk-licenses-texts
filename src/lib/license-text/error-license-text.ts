export function generateErrorLicenseText(licenseUrl?: string): string {
  let msg = 'Did not fetch license text successfully.';
  if (licenseUrl) {
    msg += ` See the license text at: ${licenseUrl}`;
  }
  return msg;
}
