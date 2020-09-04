import { fetchNonSpdxLicenseText } from '../../src/lib';

test('ASPSecurityKit-Khosla-Tech license fetched locally as expected', async () => {
  const licenseText = await fetchNonSpdxLicenseText('ASPSecurityKit-Khosla-Tech');
  console.log(licenseText)
  expect(licenseText).toMatchSnapshot();
});

test('Failed to fetch a license returns helper text instead', async () => {
  const licenseText = await fetchNonSpdxLicenseText('AFL-1');
  expect(licenseText).toMatchSnapshot();
});
