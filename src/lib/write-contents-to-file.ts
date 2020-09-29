import { gte } from 'semver';
import * as pathLib from 'path';
import * as debugLib from 'debug';
import { existsSync, mkdirSync, createWriteStream } from 'fs';
export const MIN_VERSION_FOR_MKDIR_RECURSIVE = '10.12.0';

const debug = debugLib('snyk-licenses:writeContentsToFile');

function writeContentsToFileSwallowingErrors(
  outputFile: string,
  contents: string,
) {
  try {
    const ws = createWriteStream(outputFile, { flags: 'w' });
    ws.on('error', (err) => {
      console.error(err);
    });
    ws.write(contents);
    ws.end('\n');
  } catch (err) {
    console.error(err);
  }
}

export function writeContentsToFile(contents: string, outputFile: string) {
  if (!outputFile) {
    return;
  }

  if (outputFile.constructor.name !== String.name) {
    console.error('--json-output-file should be a filename path');
    return;
  }

  // create the directory if it doesn't exist
  const dirPath = pathLib.dirname(outputFile);
  const createDirSuccess = createDirectory(dirPath);
  if (createDirSuccess) {
    writeContentsToFileSwallowingErrors(outputFile, contents);
  }
}

function createDirectory(newDirectoryFullPath: string): boolean {
  // if the path already exists, true
  // if we successfully create the directory, return true
  // if we can't successfully create the directory, either because node < 10 and recursive or some other failure, catch the error and return false

  if (existsSync(newDirectoryFullPath)) {
    return true;
  }

  const nodeVersion = process.version;

  try {
    if (gte(nodeVersion, MIN_VERSION_FOR_MKDIR_RECURSIVE)) {
      // nodeVersion is >= 10.12.0 - required for mkdirsync recursive
      const options: any = { recursive: true }; // TODO: remove this after we drop support for node v8
      mkdirSync(newDirectoryFullPath, options);
      return true;
    } else {
      // nodeVersion is < 10.12.0
      mkdirSync(newDirectoryFullPath);
      return true;
    }
  } catch (err) {
    debug(`Could not create directory ${newDirectoryFullPath}: ${err}`);
    return false;
  }
}
