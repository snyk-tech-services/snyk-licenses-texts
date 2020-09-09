import { fetchSpdxLicenseTextAndUrl } from '../../src/lib/generate-org-license-report';

test('AFL-1.1 license is as expected', async () => {
  const licenseText = await fetchSpdxLicenseTextAndUrl('AFL-1.1');
  expect(licenseText).toMatchSnapshot();
});

test('Failed to fetch a license throws', async () => {
  expect(fetchSpdxLicenseTextAndUrl('AFL-1.')).rejects;
});
