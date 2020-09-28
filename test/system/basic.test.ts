import { exec } from 'child_process';
import { sep } from 'path';
const main = './dist/index.js'.replace(/\//g, sep);

describe('`snyk-licenses-report help <...>`', () => {
  it('Shows help text as expected', async (done) => {
    return exec(`node ${main} help`, (err, stdout) => {
      if (err) {
        throw err;
      }
      expect(err).toBeNull();
      expect(stdout.trim()).toMatchSnapshot();
      done();
    });
  });
});
