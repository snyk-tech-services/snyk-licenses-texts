describe('snyk-licenses-report json', () => {
  const OLD_ENV = process.env;
  process.env.SNYK_TOKEN = process.env.SNYK_TEST_TOKEN;
  const ORG_ID = process.env.TEST_ORG_ID as string;

  afterAll(async () => {
    process.env = { ...OLD_ENV };
  });
  test('SNYK_TOKEN & ORG_ID are set', async () => {
    expect(process.env.SNYK_TOKEN).not.toBeNull();
    expect(process.env.ORG_ID).not.toBeNull();
  });
  test.todo('Test running CLI with json command, for happy path');
  test.todo('Test running CLI with json command, for when API fails aka bad org id provided');
});
