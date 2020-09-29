import { exec } from 'child_process';
import { sep } from 'path';
const main = './dist/index.js'.replace(/\//g, sep);

const ORG_ID = process.env.TEST_ORG_ID as string;

describe('`snyk-licenses-report generate <...>`', () => {
  it('Shows error when missing --orgPublicId', async (done) => {
    exec(
      `node ${main} generate`,
      { env: { SNYK_TOKEN: process.env.SNYK_TEST_TOKEN } },
      (err, stdout) => {
        expect(stdout).toBe('');
        expect(err.message.trim()).toMatchSnapshot();
        done();
      },
    );
  });

  it('generated the report successfully with default params', (done) => {
    exec(
      `node ${main} generate --orgPublicId=${ORG_ID}`,
      { env: { SNYK_TOKEN: process.env.SNYK_TEST_TOKEN } },
      (err, stdout) => {
        expect(stdout).toMatch('License report saved at');
        expect(err).toBeNull();
        done();
      },
    );
  }, 50000);
  it.todo('generated the report successfully with custom template');
  it.todo('generated the report successfully with custom template');

  it.todo('API is down');
  it.todo('Requested org has no licenses policy');
});
