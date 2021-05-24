import { exec } from 'child_process';
import { sep } from 'path';
const main = './dist/index.js'.replace(/\//g, sep);
const ORG_ID = process.env.TEST_ORG_ID as string;
const PROJECT_ID = process.env.TEST_PROJECT_ID as string;

describe('`snyk-licenses-report json <...>`', () => {
  it('Shows error when missing --orgPublicId', async (done) => {
    exec(
      `node ${main} json`,
      {
        env: {
          PATH: process.env.PATH,
          SNYK_TOKEN: process.env.SNYK_TEST_TOKEN,
        },
      },
      (err, stdout) => {
        expect(stdout).toBe('');
        expect(err.message.trim()).toMatchSnapshot();
        done();
      },
    );
  }, 90000);
  it('Generated JSON data with correct --orgPublicId', async (done) => {
    exec(
      `node ${main} json --orgPublicId=${ORG_ID}`,
      {
        env: {
          PATH: process.env.PATH,
          SNYK_TOKEN: process.env.SNYK_TEST_TOKEN,
        },
      },
      async (err, stdout) => {
        expect(err).toBeNull();
        expect(stdout).not.toBeNull();
        done();
      },
    );
  }, 90000);
  it('Generated JSON data with correct --orgPublicId --project', async (done) => {
    exec(
      `node ${main} json --orgPublicId=${ORG_ID} --project=${PROJECT_ID}}`,
      {
        env: {
          PATH: process.env.PATH,
          SNYK_TOKEN: process.env.SNYK_TEST_TOKEN,
        },
      },
      async (err, stdout) => {
        expect(err).toBeNull();
        expect(stdout).not.toBeNull();
        done();
      },
    );
  }, 90000);
});
