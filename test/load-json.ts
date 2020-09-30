import { readFileSync } from 'fs';

export function loadJson(filename: string): JSON {
  return JSON.parse(readFileSync(filename, 'utf-8'));
}
