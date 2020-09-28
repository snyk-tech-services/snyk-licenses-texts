import { exec } from 'child_process';
import { sep } from 'path';
const main = './dist/index.js'.replace(/\//g, sep);

const ORG_ID = process.env.TEST_ORG_ID as string;

describe('`snyk-licenses-report generate <...>`', () => {
  it('Shows error when missing --orgPublicId', async (done) => {
    exec(`node ${main} generate`, (err, stdout) => {
      expect(stdout).toBe("");
      expect(err.message.trim()).toMatchSnapshot();
      done();
    });
  });

  it.todo("generated the report successfully with default params");
  it.todo("generated the report successfully with custom template")
  it.todo("generated the report successfully with custom template")

  it.todo("API is down");
  it.todo("Requested org has no licenses policy");
});
