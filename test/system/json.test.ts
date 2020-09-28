import { exec } from 'child_process';
import { sep } from 'path';
const main = './dist/index.js'.replace(/\//g, sep);
const ORG_ID = process.env.TEST_ORG_ID as string;
describe('`snyk-licenses-report json <...>`', () => {
  it('Shows error when missing --orgPublicId', async (done) => {
    exec(`node ${main} json`, (err, stdout) => {
      expect(stdout).toBe("");
      expect(err.message.trim()).toMatchSnapshot();
      done();
    });
  });
  it('Generated JSON data with correct --orgPublicId', async (done) => {
    exec(`DEBUG=snyk-license* node ${main} json --orgPublicId=${ORG_ID}`, (err, stdout) => {
      expect(err).toBeNull();
      console.log({err, stdout, ORG_ID})
      expect(stdout.trim()).toMatch("BSD-2-Clause");
      done();
    });
  }, 30000);
});
