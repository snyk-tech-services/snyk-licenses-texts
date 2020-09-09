import { fetchNonSpdxLicenseTextAndUrl } from '../../src/lib';

test('ASPSecurityKit-Khosla-Tech license fetched locally as expected', async () => {
  const licenseText = await fetchNonSpdxLicenseTextAndUrl('ASPSecurityKit-Khosla-Tech');
  expect(licenseText).toMatchSnapshot();
});

test('Failed to fetch a license to throw', async () => {
  expect(fetchNonSpdxLicenseTextAndUrl('AFL-1.')).rejects;
});
