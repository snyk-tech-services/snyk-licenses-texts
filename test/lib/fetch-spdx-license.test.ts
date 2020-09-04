import { fetchSpdxLicenseText } from '../../src/lib';
test('AFL-1.1 license is as expected', async () => {
  const licenseText = await fetchSpdxLicenseText('AFL-1.1');
  expect(licenseText).toMatchSnapshot();
});

test('Failed to fetch a license returns helper text instead', async () => {
  const licenseText = await fetchSpdxLicenseText('AFL-1.');
  console.log({licenseText})
  expect(licenseText).toMatchSnapshot();
});
